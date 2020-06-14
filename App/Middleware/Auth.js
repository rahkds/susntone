var ResponseHelper = require('./../Helpers/ResponseHelper');
var URL = require('url');
var Auth = {};


Auth.checkAuth = function(req, res, next) {
	let token = req.body.token ? req.body.token : req.query.token;
	if (!token) {
		token = req.params.token ? req.params.token : null
	}
	if (!token && (req.headers['token'] || req.headers.token)) {
		token = req.headers['token'] ? req.headers['token'] : req.headers.token
	}

	console.log("##########", req.originalUrl);

	let parsedUrl = URL.parse(req.originalUrl);
	if (parsedUrl['pathname'] == '/test1/admin/user/login') {
		return next();
	}
	if (!token) {
		return ResponseHelper.sendErrResponse(req, res, ["Invalid Request"]);
	}

	redisClient.get('session.' + token, function(err, reply) {
		if (err || !reply) {
			return ResponseHelper.sendErrResponse(req, res, ["Invalid Request"]);
		}
		let userObj;
		try {
			userObj = JSON.parse(reply);
		} catch (e) {
			return ResponseHelper.sendErrResponse(req, res, ["Invalid Request"]);
		}
		req.user = userObj;
		return next();
	});
}

module.exports = Auth;