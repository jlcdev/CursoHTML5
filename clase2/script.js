window.addEventListener("keydown",function(e){
	if(e.keyCode === 13) sendMessage();
},false);

var port = promt("Enter port") || 4242;
var dir = "http://localhost:"+port;
var socket = io.connect(dir);
socket.on('connect',function(){
	console.log("Connected to server.");
});
