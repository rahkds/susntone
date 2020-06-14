var FacultyModel = {};
var commonHelper = require('./../Helpers/CommonHelper');
var fs = require('fs');



FacultyModel.facultyList = async () => {
	return new Promise(async function(resolve, reject) {
		try {
			let selectSql = `
			SELECT
			ft.*,
			GROUP_CONCAT(DISTINCT fs.subject_id) subjects
			FROM faculties ft
			LEFT JOIN faculty_subjects fs ON fs.faculty_id = ft.id
			GROUP BY ft.id
			ORDER BY ft.id DESC;
			`;
			let faculties = await slaveExecute(selectSql, []);
			faculties.forEach(function(val, ind) {
				faculties[ind]['subjects'] = val['subjects'] ? val['subjects'].split(",").map(Number) : []
			});
			return resolve(faculties);
		} catch (err) {
			console.error(err);
			return reject(err);
		}
	});
}


FacultyModel.createFaculty = async (reqData) => {
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
			let facultyId = await commonHelper.insertOne(insertObj, 'faculties');
			if (Array.isArray(reqData['subjects']) && reqData['subjects'].length) {
				let insertManyArr = [];
				reqData['subjects'].forEach(function(val) {
					if (val) {
						insertManyArr.push({
							faculty_id: facultyId,
							subject_id: val,
						});
					}
				});
				if (insertManyArr.length) {
					await commonHelper.insertMany(insertManyArr, 'faculty_subjects')
				}
			}
			resolve("success");
		} catch (err) {
			console.error(err);
			return reject(err);
		}
	});
}

FacultyModel.updateFaculty = async (reqData) => {
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
			await commonHelper.updateTable(updateObj, 'faculties', reqData.id, 'id');
			let insertManyArr = [];
			if (Array.isArray(reqData['subjects']) && reqData['subjects'].length) {
				reqData['subjects'].forEach(function(val) {
					if (val) {
						insertManyArr.push({
							faculty_id: reqData['id'],
							subject_id: val,
						});
					}
				});
			}
			await commonHelper.deleteInDb('faculty_subjects', reqData.id, 'faculty_id');
			if (insertManyArr.length) {
				await commonHelper.insertMany(insertManyArr, 'faculty_subjects')
			}
			resolve("success");
		} catch (err) {
			console.error(err);
			return reject(err);
		}
	});
}


module.exports = FacultyModel;