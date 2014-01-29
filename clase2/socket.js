//Configuration
var port = 4242;
var logLevel = 1;

//Modules
var io = require('socket.io').listen(port);
io.set("log level",logLevel);

//Listen to socket
io.sockets.on('connection', function (client)
{
	client.on('newuser', function (username)
	{
		client.broadcast.emit('newMessage', {username:"Sistema", message: username + " has connected to the server!"});
		client.set('username',username);
	});
	client.on('newMessage', function (data)
	{
		io.sockets.emit('newMessage',data);
	})
	client.on('disconnect',function ()
	{
		client.get('username',function (err,username) {
			client.broadcast.emit('newMessage', {username:"Sistema", message: username + " has disconnected from the server!"});
		});
	});
});
console.log("Socket listen in port: "+port);