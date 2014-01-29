//Configuration
var port = 4242;
var logLeve = 1;

//Modules
var io = require('socket.io').listen(port);
io.set("log level", logLevel);

//Listen for sockets
io.sockets.on('connection',function (client){
	
});
console.log("Server listen into "+port+" port");