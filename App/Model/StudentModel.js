var StudentModel = {};
var commonHelper = require('./../Helpers/CommonHelper');
var fs = require('fs');


StudentModel.studentList = async () => {
	return new Promise(async function(resolve, reject) {
		try {
			let selectSql = `
			SELECT
			st.*,
				GROUP_CONCAT(DISTINCT ss.subject_id) subjects
			FROM students st
			LEFT JOIN student_subjects ss ON ss.student_id = st.id
			GROUP BY st.id
			ORDER BY st.id DESC;
			`;
			let students = await slaveExecute(selectSql, []);
			students.forEach(function(val, ind) {
				students[ind]['subjects'] = val['subjects'] ? val['subjects'].split(",").map(Number) : []
			});
			return resolve(students);
		} catch (err) {
			console.error(err);
			return reject(err);
		}
	});
}


StudentModel.createStudent = async (reqData) => {
	return new Promise(async function(resolve, reject) {
		try {

			let insertObj = {
				name: reqData['name'],
				user_name: reqData['user_name'],
				email: reqData['email'] || null,
				address: reqData['address'] || null,
			};

			if (reqData['profile_file']) {
				let bdata = reqData['profile_file'].match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
				let fileName = "profile_" + Date.now() + ".png";
				if (bdata.length == 3) {
					fs.writeFile(UPLAOD_DIR + fileName, bdata[2], 'base64', function(err) {
						console.log(err);
					});
				}
				insertObj['profile_img'] = fileName;
			}

			let studentId = await commonHelper.insertOne(insertObj, 'students');
			if (Array.isArray(reqData['subjects']) && reqData['subjects'].length) {
				let insertManyArr = [];
				reqData['subjects'].forEach(function(val) {
					if (val) {
						insertManyArr.push({
							student_id: studentId,
							subject_id: val,
						});
					}
				});
				if (insertManyArr.length) {
					await commonHelper.insertMany(insertManyArr, 'student_subjects')
				}
			}
			resolve("success");
		} catch (err) {
			console.error(err);
			return reject(err);
		}
	});
}

StudentModel.updateStudent = async (reqData) => {
	return new Promise(async function(resolve, reject) {
		try {



			let updateObj = {
				name: reqData['name'],
				user_name: reqData['user_name'],
				email: reqData['email'] || null,
				address: reqData['address'] || null,
			};
			if (reqData['profile_file']) {
				let bdata = reqData['profile_file'].match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
				let fileName = "profile_" + Date.now() + ".png";
				if (bdata.length == 3) {
					fs.writeFile(UPLAOD_DIR + fileName, bdata[2], 'base64', function(err) {
						console.log(err);
					});
				}
				updateObj['profile_img'] = fileName;
			}

			await commonHelper.updateTable(updateObj, 'students', reqData.id, 'id');
			let insertManyArr = [];
			if (Array.isArray(reqData['subjects']) && reqData['subjects'].length) {
				reqData['subjects'].forEach(function(val) {
					if (val) {
						insertManyArr.push({
							student_id: reqData['id'],
							subject_id: val,
						});
					}
				});
			}
			await commonHelper.deleteInDb('student_subjects', reqData.id, 'student_id');
			if (insertManyArr.length) {
				await commonHelper.insertMany(insertManyArr, 'student_subjects')
			}
			resolve("success");
		} catch (err) {
			console.error(err);
			return reject(err);
		}
	});
}


module.exports = StudentModel;