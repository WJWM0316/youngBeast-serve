const express = require('express');
const router = express.Router();
const puppeteer = require('puppeteer-core');
const {
	'iPhone 6': deviceModel
} = require('puppeteer-core/DeviceDescriptors');
const request = require('request-promise-native');
const qs = require('qs')
const fs = require('fs');
const config = require('../../config/global.js')
const multiparty = require("multiparty");
const BaseURL = config.nodeApi
const RenderConfing = {
	'youngBeast_act': {
		url: 'frontEnd/s-youngBeast-act',
		isDevice: true
	}
}

router.post('/youngBeast_act', (req, res, next) => {
	var form = new multiparty.Form({autoFiles: true});
	form.parse(req, async function (err, fields, files) {
		if (err) {
			res.send('参数错误， ' + err)
		} else {
			let data = {
				type: 'youngBeast_act',
				img: fields.img[0],
				name: fields.name[0],
				introduce: fields.introduce[0],
				desc1: fields.desc1[0],
				desc2: fields.desc2[0],
				desc3: fields.desc3[0],
				desc4: fields.desc4[0]
			}
			req.query = {
				type: 'youngBeast_act'
			}
			router.get('/youngBeast_act_data', (req0, res0, next0) => {
				res0.json({
					httpStatus: 200,
					data: data
				})
				next0()
			})
			await middle(req, res, next)
		}
	});
})

const middle = async (req, res, next) => {
	if (!req.query.token) req.query.token = req.headers['authorization'] ? req.headers['authorization'] : req.headers['authorization-app']
	const {
		type
	} = req.query
	const config = RenderConfing[type]
	console.log(type, config)
	if (!(type && config)) {
		return res.json({
			httpStatus: 400,
			msg: '参数错误'
		})
	}
	let version = await request({
		uri: "http://127.0.0.1:3100/json/version",
		json: true
	});
	let browser = await puppeteer.connect({
		ignoreHTTPSErrors: true,
		browserWSEndpoint: version.webSocketDebuggerUrl
	});
	const page = await browser.newPage();
	// 是否使用设备模拟器
	if (config.isDevice) {
		await page.emulate(deviceModel);
	} else {
		await page.setViewport({
			width: 750,
			height: 1180
		});
	}
	await page.goto(`${BaseURL}/${config.url}?${qs.stringify(req.query)}`);
	let results = await page.screenshot({
		type: 'png',
		encoding: 'base64',
		fullPage: true
	});
	await page.close();
	await browser.disconnect()
	// res.render('index', {
	//     title:'study book',
	//     jpeg:`data:image/png;base64,${results}` ,
	//     description:'照片墙'
	// })
	res.json({
		httpStatus: 200,
		data: {
			url: `data:image/png;base64,${results}`
		}
	})
}

// 关闭浏览器内所有标签页
router.put('/browser/close', async (req, res, next) => {
	let version = await request({
		uri: "http://127.0.0.1:3100/json/version",
		json: true
	});
	let browser = await puppeteer.connect({
		ignoreHTTPSErrors: true,
		browserWSEndpoint: version.webSocketDebuggerUrl
	});
	const pages = await browser.pages()
	for (let i = 0; i < pages.length; i++) {
		await pages[i].close()
	}
	res.json({
		httpStatus: 200
	})
})

module.exports = router;