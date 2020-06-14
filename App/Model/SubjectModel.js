var SubjectModel = {};
var commonHelper = require('./../Helpers/CommonHelper');


SubjectModel.subjectList = async () => {
	return new Promise(async function(resolve, reject) {
		try {
			let selectSql = `SELECT * FROM subjects ORDER BY 1 DESC;`;
			let subjects = await slaveExecute(selectSql, []);
			return resolve(subjects);
		} catch (err) {
			console.error(err);
			return reject(err);
		}
	});
}


SubjectModel.createSubject = async (reqData) => {
	return new Promise(async function(resolve, reject) {
		try {
			let insertObj = {
				name: reqData['name'],
				desc: reqData['desc'] || null,
			};
			await commonHelper.insertOne(insertObj, 'subjects');
			return resolve("success");
		} catch (err) {
			console.error(err);
			return reject(err);
		}
	});
}

SubjectModel.updateSubject = async (reqData) => {
	return new Promise(async function(resolve, reject) {
		try {
			let updateObj = {
				name: reqData['name'],
				desc: reqData['desc'] || null,
			};
			await commonHelper.updateTable(updateObj, 'subjects', reqData.id, 'id');
			return resolve("success");
		} catch (err) {
			console.error(err);
			return reject(err);
		}
	});
}


module.exports = SubjectModel;