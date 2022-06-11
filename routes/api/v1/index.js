const express = require('express');
const router = express.Router();


// address is http://localhost:8000/api/v1/  , here it will see what is after /v1/, then will choose from here and proceed to that js file
router.use('/posts', require('./posts'))
router.use('/users', require('./user'))

module.exports = router;