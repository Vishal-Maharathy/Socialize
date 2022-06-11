const express = require('express')
const router = express.Router()
const passport = require('passport')

// http://localhost:8000/ap/v1/posts/
const postApi = require('../../../controllers/api/v1/posts_api');
router.get('/', postApi.index);
router.delete('/:id', passport.authenticate('jwt', {session: false}), postApi.destroy)
module.exports = router;
