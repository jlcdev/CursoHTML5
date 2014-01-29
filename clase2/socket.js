//Configuration
var port = 4242;
var logLevel = 1;

//Modules
var io = require('socket.io').listen(port);
io.set("log level",logLevel);
//Listen to socket
io.sockets.on('connection',function(socket){
	console.log("new Socket connected.");
});
console.log("Socket listen in port: "+port);