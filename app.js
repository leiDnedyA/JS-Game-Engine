var express = require('express');
var app = express();
var serv = require('http').Server(app);

//sets up server
app.get('/',function(req,res){
	res.sendFile(__dirname + '/client');
});
app.use('/client',express.static(__dirname + '/client'));

serv.listen(2000);
console.log('server started.');

var SOCKET_LIST = {};
var PLAYER_LIST = {};

class Player{
	constructor(id,name,x,y){
		this.x = x;
		this.y = y;
		this.id = id;
		this.name = name;
	}
}

//sets up socket
var io = require('socket.io')(serv,{});
io.sockets.on('connection',function(socket){
	socket.id = Math.random();
	socket.x = 0;
	socket.y = 0;
	SOCKET_LIST[socket.id] = socket;
	var player = new Player(socket.id, 'name', 0, 0);
	socket.emit("playerVars", {
		id: socket.id,
		x: socket.x,
		y: socket.y
	});
	

	socket.emit('serverMsg',{
		msg: 'hello'
	});

	socket.on('createPlayer',function(data){
		player.name = data.name;
		PLAYER_LIST[socket.id] = player;
		player.x = data.x;
		player.y = data.y;
		console.log(player.name + " has joined the server");
	});

	//input from player
	socket.on('playerMove',function(data){
		player.x = data.x;
		player.y = data.y;
	});

	socket.on('updateName',function(data){
		player.name = data.name;
	});

	socket.on('chatToServer',function(data){
		let j = 0;
		for(i in SOCKET_LIST){
			SOCKET_LIST[i].emit('chatToClient',{msg: data.msg, user: data.user});
			if (j == 0){console.log(data.user + " : " + data.msg);}
			j++;
		}
	});

	socket.on('disconnect',function(){
		console.log(player.name + " has left the server");
		delete SOCKET_LIST[socket.id];
		delete PLAYER_LIST[socket.id];
	});

	



});

setInterval(function(){
	var pack = [];
	for(var i in PLAYER_LIST){
		var player = PLAYER_LIST[i];

		pack.push({
			x:player.x,
			y:player.y,
			id:player.id,
			name:player.name
		});

	}
	for(var i in SOCKET_LIST){
		var socket = SOCKET_LIST[i];
		socket.emit('newPositions',pack);
	}
}, 1000/25)