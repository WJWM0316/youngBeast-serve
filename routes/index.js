var express = require('express');
var router = express.Router();
var htmlToPng = require('./html-to-png/index')

router.use('/', htmlToPng)
module.exports = router;


