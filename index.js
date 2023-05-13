const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
// const port = 8000;
const db = require('./config/mongoose');
const customMware = require('./config/middleware')
const env = require('./config/environment')
const path = require('path')


const session = require('express-session')
const passport = require('passport')
const passportLocal = require('./config/passport-local-strategy')
const passportJwt = require('./config/passport-jwt-strategy')
const passportGoogle = require('./config/passport-google-oath2-strategy')
const MongoStore = require('connect-mongo');
const sassMiddleware = require('node-sass-middleware')
const flash = require('connect-flash');


if(env.name=='development'){
    app.use(sassMiddleware({
    src: path.join(__dirname, env.asset_path, 'scss'),
    dest: path.join(__dirname, env.asset_path, 'css'),
    debug: true,
    outputStyle: 'extended',
    prefix: '/css'
}))}

// app.use(express.json())
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static(env.asset_path));

//set up the view engine
app.set('view engine', 'ejs');
app.set('views', './views');

//
app.use(session({
    name: 'codeial',
    secret: env.session_cookie_key,
    saveUninitialized: false,
    resave: false,
    cookie:{
        maxAge: (60000*60*10)
    },
    //here we are using mongo store to store the session cookie so that after restarting server we still have cookie saved
    store: MongoStore.create(
        {
            mongoUrl : `mongodb+srv://vishalm76:${env.db_pass}@majorproject.e7pto.mongodb.net/${env.db}`
            // autoRemove: 'disabled'
        },
        function(err){
            console.log(err || 'connect MongoDB setup ALL OK')
        }
    )
}))

app.use(passport.initialize())
app.use(passport.session())
app.use(passport.setAuthenticatedUser)
app.use(flash());
app.use(customMware.setFlash);

// make the uploads part visible to the browser
app.use('/uploads', express.static(__dirname + '/uploads'));

// if the address is like (http://localhost:8000/), then it will route the website to routes folder.
app.use('/', require('./routes')); 

let port  = process.env.PORT

if(!port){port=8000}

var server = app.listen(port, function(err){
    if(err){
        console.log("Error running the server-> ", err);
    }
    console.log("Server is running on port-> ", port);
})
// socket.io for chatting engine
require('./controllers/sockets').chatSockets(server)
console.log("Chat server is listening on port 8000")
