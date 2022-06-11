const req = require('express/lib/request');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const user = require('../controllers/user_controller');
const User = require('../models/sign_up');

//authentication using passport
passport.use(new LocalStrategy(
    { usernameField: 'email',
      passReqToCallback: true
    },
    function (req, email, password, done) {
        // find a user and establish an identity
        User.findOne({ email: email }, function (err, user) {
            if (err) {
                req.flash('error', err);
                return done(err);
            }
            if (!user || user.password != password) {
                req.flash('success', 'Invalid Username or Password!');
                return done(null, false);
            }
            return done(null, user);
        })
    })
)

passport.serializeUser(function (user, done) {
    // stores user.id in encrypted format to cookie
    done(null, user.id);
})
passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        if (err) {
            console.log("Error-->", err);
            return done(err);
        }
        return done(null, user);
    });
})

// check if the user is authenticated

passport.checkAuthentication = function(req, res, next){
    // if the user is signed in
    if(req.isAuthenticated()){
        return next();
    }
    // if the user is not signed in
    return res.redirect('/signin')
}

passport.setAuthenticatedUser = function(req,res, next){
    // if(req.isAuthenticated()){
        //req.user contains the current signed in user from the session cookie and we 
        //are just sending it to the locals for the views
    res.locals.user = req.user;
    // }
    next();
}

module.exports = passport;