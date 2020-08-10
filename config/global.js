var NODE_ENV = process.env.NODE_ENV || 'dev';
var GLOBALCONFIG = {
	nodeApi : "", // nodeJs 代理转发的域名
	cdnHost : "", // cdn
	bucket  : ""  // oss bucket
}		
switch (NODE_ENV) {
		case 'test': // 开发
      GLOBALCONFIG.nodeApi = "http://127.0.0.1:3002"
			GLOBALCONFIG.cdnHost = 'http://attach.youngbeast.ziwork.com'
			GLOBALCONFIG.bucket  = 'youngbeast-uploads-test'
      break;
    case 'dev': // 测试
      GLOBALCONFIG.nodeApi = "https://node.youngbeast.ziwork.com"
			GLOBALCONFIG.cdnHost = 'http://attach.youngbeast.ziwork.com'
			GLOBALCONFIG.bucket  = 'youngbeast-uploads-test'
      break;
    case 'pro': // 正式
    	GLOBALCONFIG.nodeApi = "https://node.youngbeast.cn"
    	GLOBALCONFIG.cdnHost = 'https://attach.youngbeast.cn'
    	GLOBALCONFIG.bucket  = 'youngbeast-uploads-pro'
      break
}

module.exports = GLOBALCONFIG;