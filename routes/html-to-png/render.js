const express = require('express');
const router = express.Router();
const httpRequest = require('../../config/httpRequest.js')

router.get('/s-youngBeast-act', async(req, res, next) => {
  req.query.img = req.query.img.replace('public', '..')
  res.render('html-to-png/s-youngBeast-activict', req.query)
})

module.exports = router;