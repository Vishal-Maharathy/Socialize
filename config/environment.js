const fs = require('fs')
const path = require('path')

const development = {
    name: 'development',
    asset_path : 'assets',
    session_cookie_key: 'daddysboiii',
    db:'socialize_development',
    db_pass:'socialize_production',
    smtp: {
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: 'supmind76@gmail.com',
            pass: 'ogjfatesglkrzdci'
        }
    },
    google_clientID: '304321416322-2pesh4k4o7asgfdnf3srhs5o086tj19g.apps.googleusercontent.com',
    google_clientSecret: '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',
    google_callbackURL: 'https://socialize-u707.onrender.com/auth/google/callback',
    jwtSecretKey: 'daddysboiii',
}

const production = {
    name: 'production',
    asset_path : 'assets',
    session_cookie_key: 'daddysboiii',
    db:'socialize_development',
    db_pass:'socialize_production',    
    smtp: {
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: 'supmind76@gmail.com',
            pass: 'ogjfatesglkrzdci'
        }
    },
    google_clientID: '304321416322-2pesh4k4o7asgfdnf3srhs5o086tj19g.apps.googleusercontent.com',
    google_clientSecret: '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',
    google_callbackURL: 'https://socialize-u707.onrender.com/auth/google/callback',
    jwtSecretKey: 'daddysboiii'
}

module.exports = eval(process.env.NODE_ENV) == undefined?development:production 
