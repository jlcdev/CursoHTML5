var dir = "http://localhost:4242";
var socket = io.connect(dir);

var cubes = {};

socket.on('connect', function (){
	socket.id = socket.socket.sessionid;
	console.log("Connected to server!");
});

socket.on('update',function (c){
	console.log(c);
	var cube = cubes[c.id];
	if(cube === undefined)
	{
		cube = new Cube();
		cubes[c.id] = cube;
	}
	cube.update(c);
});

socket.on('exit',function (id){
	delete cubes[id];
	console.log('cube '+id+' disconnected');
});