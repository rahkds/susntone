var mysql = require('mysql');

function createMasterPool() {
	var masterPool = mysql.createPool({
		connectionLimit: MYSQL_CONFIG.POOL_COUNT,
		host: MYSQL_CONFIG.HOST,
		user: MYSQL_CONFIG.USERNAME,
		password: MYSQL_CONFIG.PASSWORD,
		database: MYSQL_CONFIG.DATABASE,
		port: MYSQL_CONFIG.PORT,
	});
	global.masterPool = masterPool;
	masterPool.on('enqueue', () => {
		console.log('master connection enqueue');
	});
	masterPool.on('dequeue', () => {
		console.log('master connection dequeue');
	});
}

function createSlavePool() {
	var slavePool = mysql.createPool({
		connectionLimit: MYSQL_CONFIG.POOL_COUNT,
		host: MYSQL_CONFIG.SLAVE_HOST,
		user: MYSQL_CONFIG.SLAVE_USERNAME,
		password: MYSQL_CONFIG.SLAVE_PASSWORD,
		database: MYSQL_CONFIG.DATABASE,
		port: MYSQL_CONFIG.PORT,
	});
	global.slavePool = slavePool;
	slavePool.on('enqueue', () => {
		console.log('slave connection enqueue');
	});
	slavePool.on('dequeue', () => {
		console.log('slave connection dequeue');
	});
}

createMasterPool();
createSlavePool();


global.masterExecute = function(statement, parameter) {
	return new Promise(function(resolve, reject) {
		masterPool.query(statement, parameter, function(err, rows) {
			console.log(this.sql);
			if (err) {
				console.error(err);
				return reject(err);
			}
			return resolve(rows);
		});
	});
}

global.slaveExecute = function(statement, parameter) {
	return new Promise(function(resolve, reject) {
		slavePool.query(statement, parameter, function(err, rows) {
			console.log(this.sql);
			if (err) {
				console.error(err);
				return reject(err);
			}
			return resolve(rows);
		});
	});
}