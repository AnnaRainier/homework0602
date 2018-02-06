var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');


app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {
	res.sendFile(__dirname + '/index.html')
});

var users = [];

io.on('connection', function (socket) {
	console.log('user connected');
	socket.on('setUserName', function (data) {
		if(users.indexOf(data) > -1) {
			socket.emit('userExists', '<p class="bg-primary"> Пользователь' +
						'<b>' + data + '</b>' +
						'уже существует, выбери другое имя! </p>');
		} else {
			users.push(data);
			socket.emit('userSet', {username: data});
		}
});

	socket.on('message', function (data) {
		io.sockets.emit('newMessage', data);
	});

	socket.on('wrongContent', function (data) {
		console.log('forbidden content input attempt');
	});

	socket.on('warning', function (data) {
		console.log('empty message');
	})
});



var port = 3000;

http.listen(port, function () {
	console.log('On localhost: ' + port);
});
