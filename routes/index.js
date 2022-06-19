//router is used to clean the main index.js file so that app.get and other code along with their functions i not filled 
//in index.js itself. This router file will be used to handle the url to their respective functions. 
//for eg, at the homepage ('/'), we will pass the function home_controller.home which is created in home_controller.js
// in controllers folder. This will remove code from main index.js file and will be written here and in controller folder.

const express = require('express');
const router = express.Router();
const passport = require('passport');

const homeController = require('../controllers/home_controller');
const userController = require('../controllers/user_controller');
const passResetController = require('../controllers/password_reset_controller');
const likeController = require('../controllers/like_controller')
const notifController = require('../controllers/notification_controller')
const chatController = require('../controllers/chat_controller')

router.get('/', homeController.home);
router.get('/users/profile/:id', passport.checkAuthentication, userController.user);//here middleware is being used, only if the user is signed in, he/she will be able to access to the profile pahge else will be redirected to sign in page.
router.post('/users/update/:id', passport.checkAuthentication, userController.update);
router.get('/signup', userController.signup);
router.get('/signin', userController.signin);
router.post('/create', userController.create);

//below ones are for handling notification
router.get('/notifications/sendRequest/:id', notifController.sendRequest)
router.get('/notifications/:id', notifController.loadNotif);
router.get('/notifications/requests/acceptnreject', notifController.acceptRequest);
router.get('/notifications/requests/pendingReqClear', notifController.pendingReqClear);
router.get('/notifications/requests/LikeNotifClear', notifController.likeNotifClear);


// below are routes for resetting a password if user forgets.
router.get('/forgotpassword', userController.forgotpassword);
router.post('/resetpassword', userController.passwordreset);
router.get('/resetpassword/:token',  passResetController.resetPassword);
router.get('/setPass/:token', passResetController.setPass);
router.post('/newpassword/:token', passResetController.updatePass);

// for liking the posts and commentsa
router.post('/likes/toggle', likeController.toggleLike);
router.post('/likes/popupToggle', likeController.popUpToggle);

// this is for sign in using google. works as /users/auth/google
router.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email']}));
router.get('/auth/google/callback', passport.authenticate('google', {failureRedirect: '/signin'}), userController.createSession);

// router.post('/succsign', userController.createSession); // replaced by new controller using passport.js
// router.get('/signed_in', userController.profile);

// this is for searching users for the SearchBox
router.post('/searchEngine', homeController.searchUsers)

// router for handling chattbox
router.get('/chatLoad', chatController.loadChatEngine)

//FOR DIFFERENT ROUTES
router.use('/posts', require('./posts'))
router.use('/comments', require('./comments'))
router.use('/profilepage', require('./userProfile'))

// if the address is like http://localhost:8000/api, then the website will get directed to the api folder..
router.use('/api', require('./api'))

//here in this route, we are adding a middleware which will first authenticate it,
//if is successful then userController is called else it will do failureRedirect
router.post('/succsign', passport.authenticate(
    'local',
    {failureRedirect: '/signin'},
), userController.createSession);

router.get('/signout', userController.destroySession);

module.exports = router;