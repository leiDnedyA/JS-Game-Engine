console.log("sock.js initiated");

var socket = io();


socket.on('playerVars',function(data){
	Player.id = data.id;
});

socket.on('chatToClient',function(data){
	writeChat(data);
});

function createPlayer(x, y, name){
	socket.emit("createPlayer",{
		x: x,
		y: y,
		name: name
	});
}

function updatePlayerPos(x,y){
	socket.emit('playerMove',{x: x, y: y});
}

function sockSendChat(msg, user){
	socket.emit('chatToServer', {msg: msg, user: user});
}

//sets position of test object
socket.on('newPositions',function(data){
	if (Game.isStarted){
		//console.log(data);
		for (var i = 0; i < data.length; i++) {
			if(gameObjectExistsId(data[i].id)){

				Game.gameObjects[gameObjectLookUp(data[i].id)].position[0] = data[i].x;
				Game.gameObjects[gameObjectLookUp(data[i].id)].position[1] = data[i].y;
			}else{
				Game.gameObjects.push(new GameObject(data[i].name,"#00FF00", [data[i].x, data[i].y], [40, 40], true,data[i].id));
				//console.log("Game Object Added: " + data[i].id);
			}
		}
	}
});
