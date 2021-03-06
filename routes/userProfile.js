const express = require('express');
const router = express.Router();
const userProfileController = require('../controllers/user_profile_controller');

router.post('/updatedetails', userProfileController.getUserData)
router.post('/loadPosts', userProfileController.getPosts)
router.post('/loadFriends', userProfileController.getFriends)

module.exports = router