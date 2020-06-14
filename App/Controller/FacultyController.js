var FacultyController = {};
var ResponseHelper = require('./../Helpers/ResponseHelper');
//var commonHelper = require('./../Helpers/CommonHelper');
var FacultyModel = require('./../Model/FacultyModel');


FacultyController.facultyList = async (req, res) => {
	try {
		let faculties = await FacultyModel.facultyList();
		return ResponseHelper.sendSuccessResponse(req, res, ["Successfull"], faculties);
	} catch (err) {
		console.error(err);
		return ResponseHelper.sendErrResponse(req, res, ["Server Error"]);
	}
}

FacultyController.createFaculty = async (req, res) => {
	try {
		if (!req.body.name || !req.body.user_name) {
			return ResponseHelper.sendErrResponse(req, res, ["required field empty."]);
		}

		let validateSql = `SELECT id FROM faculties where user_name = ?;`;
		let validateRes = await slaveExecute(validateSql, [req.body.user_name]);
		if (validateRes.length) {
			return ResponseHelper.sendErrResponse(req, res, ["Username already exists. please provide other username."]);
		}
		await FacultyModel.createFaculty(req.body);
		return ResponseHelper.sendSuccessResponse(req, res, ["Faculty Successfullu created"], []);
	} catch (err) {
		console.error(err);
		return ResponseHelper.sendErrResponse(req, res, ['Server Error']);
	}
}


FacultyController.updateFaculty = async (req, res) => {
	try {
		if (!req.body.name || !req.body.user_name || !req.body.id) {
			return ResponseHelper.sendErrResponse(req, res, ["required field empty."]);
		}
		let validateSql = `SELECT id FROM faculties where id <> ? AND user_name = ?;`;
		let validateRes = await slaveExecute(validateSql, [req.body.id, req.body.user_name]);
		if (validateRes.length) {
			return ResponseHelper.sendErrResponse(req, res, ["Username already exists. please provide other username."]);
		}
		await FacultyModel.updateFaculty(req.body);
		return ResponseHelper.sendSuccessResponse(req, res, ["Faculty Successfullu updated"], []);
	} catch (err) {
		console.error(err);
		return ResponseHelper.sendErrResponse(req, res, ["Server Error"]);
	}
}

FacultyController.deleteFaculty = async (req, res) => {
	try {
		if (!req.params.faculty_id) {
			return ResponseHelper.sendErrResponse(req, res, ["required field empty."]);
		}
		let deleteSql = `DELETE FROM faculties WHERE id = ?;`;
		await masterExecute(deleteSql, [req.params.faculty_id]);
		return ResponseHelper.sendSuccessResponse(req, res, ["Successfull"], []);
	} catch (err) {
		console.error(err);
		return ResponseHelper.sendErrResponse(req, res, [err]);
	}
}


module.exports = FacultyController;