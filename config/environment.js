const fs = require('fs')
const path = require('path')

const development = {
    name: 'development',
    asset_path : 'assets',
    session_cookie_key: 'daddysboiii',
    db:'socialize_development',
    db_pass:'LMAODEDLOLREKt1.',
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
    google_callbackURL: 'http://34.211.120.190:8000/auth/google/callback',
    jwtSecretKey: 'daddysboiii',
}

const production = {
    name: 'production',
    asset_path : 'assets',
    session_cookie_key: 'daddysboiii',
    db:'socialize_development',
    db_pass:'LMAODEDLOLREKt1.',    
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