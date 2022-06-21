const passport = require('passport')
const googleStrategy = require('passport-google-oauth').OAuth2Strategy
const crypto = require('crypto')
const User = require('../models/sign_up')
const env = require('./environment')

passport.use(new googleStrategy({
    clientID: env.google_clientID,
    clientSecret: env.google_clientSecret,
    callbackURL: env.google_callbackURL
    },
    function(accessToken, refreshToken, profile, done){
        
        console.log(profile.photos[0].value);

        User.findOne({email: profile.emails[0].value}).exec(function(err, user){
            if(err){
                console.log('Google Strategy Error--> ', err);
                return;
            }
            if(user){ 
                return done(null, user);
            }else{
                User.create({
                    email: profile.emails[0].value,
                    name: profile.displayName,
                    password: crypto.randomBytes(20).toString('hex')
                }, function(err, user){
                    if(err){
                        console.log('Creating User--> Google Strategy Error--> ', err);
                        return;
                    }
                    return done(null, user);
                })
            }
        })
    }
));

module.exports = passport;