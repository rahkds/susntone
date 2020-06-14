var express = require('express');
var app = express();
var bodyParser = require('body-parser');

require('./App/Config/config');
require('./App/Config/connection');



app.use(bodyParser.json({
	limit: '50mb'
}));


global.UPLAOD_DIR = __dirname + '/uploads/';

app.use(express.static(__dirname + '/public'));
app.use(express.static(global.UPLAOD_DIR));



var mainRoute = require('./App/Routes/route.js');



app.use('/sunstone/', mainRoute);


app.get('/ping', function(req, res) {
	return res.send('pong');
});

app.listen(8081, function(req, res) {
	console.log('listening on port' + 8081);
});