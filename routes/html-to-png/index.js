const express = require('express');
const router = express.Router();
const Generate = require('./generate')
const Render = require('./render')
router.use('/', Generate)
router.use('/', Render)


module.exports = router;