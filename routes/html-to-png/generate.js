const express = require('express');
const router = express.Router();
const puppeteer = require('puppeteer-core');
const {
	'iPhone 6': deviceModel
} = require('puppeteer-core/DeviceDescriptors');
const request = require('request-promise-native');
const qs = require('qs')
var fs = require('fs');

var multiparty = require("multiparty");
const BaseURL = process.env.NODE_ENV === 'dev' ? 'https://node.youngbeast.ziwork.com' : process.env.NODE_ENV === 'pro' ? 'https://node.youngbeast.cn' : 'http://127.0.0.1:3000'
const RenderConfing = {
	'youngBeast_act': {
		url: 'frontEnd/s-youngBeast-act',
		isDevice: true
	}
}

router.post('/youngBeast_act', (req, res, next) => {
	var form = new multiparty.Form({
		uploadDir: './public/images/cropper'
	});
	form.parse(req, async function (err, fields, files) {
		console.log(fields, files, ' fields2')
		if (err) {} else {
			req.query = {
				type: 'youngBeast_act',
				img: files.img[0].path,
				name: fields.name[0],
				introduce: fields.introduce[0],
				desc1: fields.desc1[0],
				desc2: fields.desc2[0],
				desc3: fields.desc3[0],
				desc4: fields.desc4[0]
			}
			await middle(req, res, next)
			fs.unlinkSync(files.img[0].path)
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
		uri: process.env.NODE_ENV === 'pro' ? "http://192.168.3.151:3100/json/version" : "http://127.0.0.1:3100/json/version",
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
	// await page.close();
	// await browser.disconnect()
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