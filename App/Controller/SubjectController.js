var SubjectController = {};
var ResponseHelper = require('./../Helpers/ResponseHelper');
var commonHelper = require('./../Helpers/CommonHelper');
var SubjectModel = require('./../Model/SubjectModel');


SubjectController.subjectList = async (req, res) => {
	try {
		let students = await SubjectModel.subjectList();
		return ResponseHelper.sendSuccessResponse(req, res, ["Successfull"], students);
	} catch (err) {
		console.error(err);
		return ResponseHelper.sendErrResponse(req, res, ["Backend Error"]);
	}
}


SubjectController.createSubject = async (req, res) => {
	try {
		if (!req.body.name) {
			return ResponseHelper.sendErrResponse(req, res, ["required field empty."]);
		}

		let validateSql = `SELECT id FROM subjects where name = ?;`;
		let validateRes = await slaveExecute(validateSql, [req.body.name]);
		if (validateRes.length) {
			return ResponseHelper.sendErrResponse(req, res, ["name already exists. please provide other name."]);
		}
		await SubjectModel.createSubject(req.body);
		return ResponseHelper.sendSuccessResponse(req, res, ["Subject Successfully created"], []);
	} catch (err) {
		console.error(err);
		return ResponseHelper.sendErrResponse(req, res, ['Server Error']);
	}
}


SubjectController.updateSubject = async (req, res) => {
	try {
		if (!req.body.name || !req.body.id) {
			return ResponseHelper.sendErrResponse(req, res, ["required field empty."]);
		}
		let validateSql = `SELECT id FROM subjects where id <> ? AND name = ?;`;
		let validateRes = await slaveExecute(validateSql, [req.body.id, req.body.name]);
		if (validateRes.length) {
			return ResponseHelper.sendErrResponse(req, res, ["name already exists. please provide other name."]);
		}
		await SubjectModel.updateSubject(req.body);
		return ResponseHelper.sendSuccessResponse(req, res, ["Subject Successfullu updated"], []);
	} catch (err) {
		console.error(err);
		return ResponseHelper.sendErrResponse(req, res, ["Server Error"]);
	}
}

SubjectController.deleteSubject = async (req, res) => {
	try {
		if (!req.params.subject_id) {
			return ResponseHelper.sendErrResponse(req, res, ["required field empty."]);
		}
		let validateSql = `SELECT id FROM student_subjects WHERE subject_id = ? LIMIT 1;`;
		let validateRes = await slaveExecute(validateSql, [req.params.subject_id]);
		if (validateRes.length == 0) {
			validateSql = `SELECT id FROM faculty_subjects WHERE subject_id = ? LIMIT 1;`;
			validateRes = await slaveExecute(validateSql, [req.params.subject_id]);
		}
		if (validateRes.length) {
			return ResponseHelper.sendErrResponse(req, res, ["Cannot delete this subject, assigned to any student/subject."]);
		}
		let deleteSql = `DELETE FROM subjects WHERE id = ?;`;
		await masterExecute(deleteSql, [req.params.subject_id]);
		return ResponseHelper.sendSuccessResponse(req, res, ["Successfull"], []);
	} catch (err) {
		console.error(err);
		return ResponseHelper.sendErrResponse(req, res, [err]);
	}
}

module.exports = SubjectController;