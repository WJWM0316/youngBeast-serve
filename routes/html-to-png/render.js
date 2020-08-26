const express = require('express');
const router = express.Router();
const httpRequest = require('../../config/httpRequest.js')

router.get('/s-youngBeast-act', async(req, res, next) => {
  let {data} = await httpRequest({hostType: 'nodeApi', method: 'get', url: '/frontEnd/youngBeast_act_data', req, res, next})
  res.render('html-to-png/s-youngBeast-activict', data)
})

module.exports = router;