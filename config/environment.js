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
    google_callbackURL: 'http://localhost:8000/auth/google/callback',
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
    google_clientID: '304321416322-ddodi9p4ch74fj7p4ais41a2lau59u76.apps.googleusercontent.com',
    google_clientSecret: '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',
    google_callbackURL: 'http://localhost:8000/auth/google/callback',
    jwtSecretKey: 'daddysboiii'
}

module.exports = eval(process.env.NODE_ENV) == undefined?development:production 