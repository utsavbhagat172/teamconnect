process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var config = require('./config/config');
var mongoose = require('mongoose');

var vhost = require('vhost');
var fs = require('fs');
var path = require('path');


var app = express();

var http = require('http').Server(app);

var io = require('socket.io')(http);


mongoose.connect(config.database, function(err){
	if(err){
		console.log(err);
	}
	else {
		console.log('Happily Connected')
	}
});


app.use(bodyParser.urlencoded({ extended:true }));
app.use(bodyParser.json());
app.use(morgan('dev'));


//app.use('/bower_components', express.static(__dirname + '/bower_components'));

var virtualHosts = JSON.parse(fs.readFileSync('vhosts.json', 'utf8'));
virtualHosts.forEach(function(virtualHost) {
	var virtualHostApp = express();
	virtualHostApp.use(express.static(path.join(__dirname, virtualHost.path)));
	var api = require('./app/routes/api')(virtualHostApp, express, io);
	virtualHostApp.use('/api', api);
	virtualHostApp.get('*', function(req, res){
		res.sendFile(__dirname + virtualHost.path +'/views/index.html');
	});
	app.use(vhost(virtualHost.domain, virtualHostApp));
});



io.on('connection', function(socket){
    socket.on('set_nickname_', function (name) {
        sockets[name] = socket;
    });
    socket.on('send_message_', function (message, to) {
        sockets[to].emit(message);
    });
});

http.listen(config.port, function(err){
	if(err) {
		console.log(err);
	} else {
		console.log('Server is running on port 8080');
	}
});