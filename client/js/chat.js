console.log("chat.js initiated");

var chatWindow = document.getElementById("chatWindow");
var chatTextBox = document.getElementById("chatMsg");

chatWindow.width = window.innerWidth - 20;
chatWindow.height = window.innerHeight * .6;


function writeChat(chat){
	let chatMsg = document.createTextNode(chat.user + " : " + chat.msg);
	let breakLine = document.createElement("BR");
	chatWindow.appendChild(chatMsg);
	chatWindow.appendChild(breakLine);
}

function sendChat(){
	if (chatTextBox.value != ""){
		sockSendChat(chatTextBox.value, Player.playerName);
	}
	chatTextBox.value = "";
}