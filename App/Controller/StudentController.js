var StudentController = {};
var ResponseHelper = require('./../Helpers/ResponseHelper');
var commonHelper = require('./../Helpers/CommonHelper');
var StudentModel = require('./../Model/StudentModel');


StudentController.studentList = async (req, res) => {
	try {
		let students = await StudentModel.studentList();
		return ResponseHelper.sendSuccessResponse(req, res, ["Successfull"], students);
	} catch (err) {
		console.error(err);
		return ResponseHelper.sendErrResponse(req, res, ["Server Error"]);
	}
}

StudentController.createStudent = async (req, res) => {
	try {
		if (!req.body.name || !req.body.user_name) {
			return ResponseHelper.sendErrResponse(req, res, ["required field empty."]);
		}

		let validateSql = `SELECT id FROM students where user_name = ?;`;
		let validateRes = await slaveExecute(validateSql, [req.body.user_name]);
		if (validateRes.length) {
			return ResponseHelper.sendErrResponse(req, res, ["Username already exists. please provide other username."]);
		}
		await StudentModel.createStudent(req.body);
		return ResponseHelper.sendSuccessResponse(req, res, ["Student Successfullu created"], []);
	} catch (err) {
		console.error(err);
		return ResponseHelper.sendErrResponse(req, res, ['Server Error']);
	}
}


StudentController.updateStudent = async (req, res) => {
	try {
		if (!req.body.name || !req.body.user_name || !req.body.id) {
			return ResponseHelper.sendErrResponse(req, res, ["required field empty."]);
		}
		let validateSql = `SELECT id FROM students where id <> ? AND user_name = ?;`;
		let validateRes = await slaveExecute(validateSql, [req.body.id, req.body.user_name]);
		if (validateRes.length) {
			return ResponseHelper.sendErrResponse(req, res, ["Username already exists. please provide other username."]);
		}
		await StudentModel.updateStudent(req.body);
		return ResponseHelper.sendSuccessResponse(req, res, ["Student Successfullu created"], []);
	} catch (err) {
		console.error(err);
		return ResponseHelper.sendErrResponse(req, res, ["Server Error"]);
	}
}

StudentController.deleteStudent = async (req, res) => {
	try {
		if (!req.params.student_id) {
			return ResponseHelper.sendErrResponse(req, res, ["required field empty."]);
		}
		let deleteSql = `DELETE FROM students WHERE id = ?;`;
		await masterExecute(deleteSql, [req.params.student_id]);
		return ResponseHelper.sendSuccessResponse(req, res, ["Successfull"], []);
	} catch (err) {
		console.error(err);
		return ResponseHelper.sendErrResponse(req, res, [err]);
	}
}


module.exports = StudentController;