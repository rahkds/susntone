var CommonHelper = {};

CommonHelper.insertOne = async function(insertObj, tablename) {
	return new Promise(async function(resolve, reject) {
		try {
			if (Object.keys(insertObj).length == 0 || !tablename) {
				return reject("no keys");
			}
			let valueArr = [];
			let columnArr = [];
			let symbolArr = [];
			for (let key in insertObj) {
				columnArr.push(key);
				valueArr.push(insertObj[key]);
				symbolArr.push('?');
			}
			let insertSql = `INSERT INTO ${tablename} `;
			insertSql += ' (`' + columnArr.join("`, `") + '`) VALUES (' + symbolArr.join(", ") + ')';
			//console.log(insertSql);
			let result = await masterExecute(insertSql, valueArr);
			return resolve(result.insertId || 0);
		} catch (err) {
			console.error(err);
			return reject(err);
		}
	});
}


CommonHelper.insertMany = function(data, tableName) {
	return new Promise(async function(resolve, reject) {
		try {
			data = Array.isArray(data) ? data : [data];
			let columnValue = new Set();
			let valueArray = [];
			let symboleValue = [];
			let query = `INSERT INTO ${tableName} `;
			for (let row of data) {
				columnValue = Object.keys(row);
				symboleValue.push('(?)');
				valueArray.push(Object.values(row));
			}
			query += `(${columnValue.join(",")}) VALUES ${symboleValue.join(",")}`
			let result = await masterExecute(query, valueArray);
			resolve((result.insertId || 0));
		} catch (e) {
			reject(e);
		}
	});
}

CommonHelper.updateTable = function(updateObject, tableName, id, whereColumnName = 'id') {
	return new Promise(async function(resolve, reject) {
		try {
			let query = `UPDATE ${tableName} SET `;
			let valueArray = [];
			let columnValue = [];
			for (var key in updateObject) {
				if (updateObject.hasOwnProperty(key)) {
					columnValue.push('`' + key + '` = ? ');
					valueArray.push(updateObject[key]);
				}
			}
			query += columnValue.join(", ") + ` where ${whereColumnName} = ? `;
			valueArray.push(id);
			let result = await masterExecute(query, valueArray);
			resolve(result.changedRows || 0);
		} catch (e) {
			reject(e);
		}
	});
}

CommonHelper.deleteInDb = function(tableName, whereColumnValue, whereColumnName = 'id') {
	return new Promise(async (resolve, reject) => {
		try {
			let query = `DELETE FROM ${tableName} `;
			query += `WHERE ${whereColumnName} = ? `;
			let result = await masterExecute(query, [whereColumnValue]);
			resolve(result['affectedRows'] || 0);
		} catch (err) {
			reject(err);
		}
	});
}

module.exports = CommonHelper;