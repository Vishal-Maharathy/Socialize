const express = require('express');
const router = express.Router();

//address is--> http://localhost:8000/api/v1
router.use('/v1', require('./v1'));

module.exports = router;