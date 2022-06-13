const express = require('express');
const router = express.Router();
const userProfileController = require('../controllers/user_profile_controller');

router.post('/updatedetails', userProfileController.getUserData)

module.exports = router