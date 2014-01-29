//Global config
var port = 4242;
var logLevel = 1;

var io = require('socket.io').listen(port);
io.set('log level',logLevel);

function Cube (id)
{
	this.id = id;
	this.x = Math.random()*800;
	this.y = Math.random()*500;
	this.edge = Math.random()*50;
  this.color = '#'+Math.floor(Math.random()*16777215).toString(16);
}
Cube.prototype.update = function (data)
{
	if (data === undefined) return;
	if (data.x !== undefined) this.x = data.x;
	if (data.y !== undefined) this.y = data.y;
}

var cubes = {};

io.sockets.on('connection',function (client){
  console.log('new client connected!!');
	//Send all cubes to new connection
	for(var id in cubes) client.emit('update',cubes[id]);

	//Create new cube for new connection
	var cube = new Cube(client.id);
	cubes[client.id] = cube;
	io.sockets.emit('update',cube);

	client.on('update',function (c){
		var cube = cubes[client.id];
		if(cube !== undefined)
		{
			cube.update(c);
			client.broadcast.emit('update',cube);
		}
	});
	client.on('disconnect',function (){
		console.log(client.id + " disconnected!");
		delete cubes[client.id];
		io.sockets.emit('exit',client.id);
	});
});

console.log('Server listen on port: '+port);