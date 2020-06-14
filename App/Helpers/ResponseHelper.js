var ResponseHelper = {};

ResponseHelper.sendSuccessResponse = function(req, res, message, data) {
	let responseObj = {
		code: 200,
		message: message || ["Successfull"],
		data: data
	}
	res.send(responseObj);
}

ResponseHelper.sendErrResponse = function(req, res, message, data) {
	let responseObj = {
		code: 400,
		message: message || ["Something went wrong."],
	}
	res.status(500).send(responseObj);
}

module.exports = ResponseHelper;