const passport = require('passport')
const JWTStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const User = require('../models/sign_up');
const env = require('./environment')

const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: env.jwtSecretKey
}


// when the user log in to ther page, it creates a JWT which will expire in 60 seconds(set up in the users_api.js)
// then when we are going to delete a post, we are first authenticating [passport.authenticate('jwt', {session: false})]
// below is the function which will act as a middleware, checking if the user exists in the token.
// Now is the token is expired we will get message "Unaothorized".
passport.use(new JWTStrategy(opts, function(jwtPayLoad, done){

    User.findById(jwtPayLoad._id, function(err, user){
        if(err){
            console.log(err); return;
        }
        if(user){
            return done(null, user);
        }
        else{
            return done(null, false);
        }
    })
}))

module.exports = passport;