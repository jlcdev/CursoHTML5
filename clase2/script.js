
var port = prompt("Enter port") || 4242;
var user = prompt("Enter Username") || "Loser";
var input = document.getElementById('inputArea');
var dir = "http://localhost:"+port;
var board = document.getElementById("board");

function newMessage(data)
{
	if(data !== undefined)
	{
		var user = data.username;
		var msg = data.message;
		var div = document.createElement('div');
		div.className += "message";
		var message = '<p><b>'+user+' </b>'+msg+'</p>';
		div.innerHTML = message;
		board.appendChild(div);
	}
}

//Create socket
var socket = io.connect(dir);
socket.on('connect',function(){
	newMessage({username:'Sistema',message:'Connected to chat!'});
	socket.emit('newuser',user);
});
//If recieve new message, add this to board
socket.on('newMessage',function(data){
	newMessage(data);
});


var ENTER_KEY_CODE = 13;
document.addEventListener('keydown', function (e) {
	if (e.keyCode == ENTER_KEY_CODE && !e.shiftKey) sendMsg();
});

function sendMsg()
{
	//SEND MESSAGE TO SOCKET
	var message = input.value.trim();
	input.value = '';
	if(message == "") return;
	//if msg send to socket
	var data = {username:user,message:message};
	socket.emit('newMessage', data);
}