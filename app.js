var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var router = require('./routes/index')



var app = express();
var NODE_ENV = process.env.NODE_ENV;
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));


const bodyParser = require('body-parser');
app.use(bodyParser.json());//数据JSON类型
app.use(bodyParser.urlencoded({ extended: false }));//解析post请求数据

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 自定义跨域中间件
var allowCors = function(req, res, next) {
	if (NODE_ENV === 'pro') {
		if(req.headers.origin	=== "https://h5.youngbeast.cn") {
			//设置允许跨域的域名，*代表允许任意域名跨域
			res.header("Access-Control-Allow-Origin", req.headers.origin);
		}
	} else {
		res.header("Access-Control-Allow-Origin", "*");
	}
	res.header("Access-Control-Allow-Credentials", true);
	res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept, X-Requested-With, Authorization, Wechat-Version, Admin-Version, Authorization-Admin, Authorization-Wechat, Authorization-Official");
	res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
	res.header("X-Powered-By", 'Express');
	next()
};

app.use('/frontEnd', router)


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
	next()
});

module.exports = app;
