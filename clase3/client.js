var dir = "http://localhost:4242";
var server = io.connect(dir);

var players = {};
var canvas_color = "white";

server.on('connect',function (){
	console.log("Enviando nuevo user");
	server.emit('newuser', user);
});

server.on('update',function (data){
	if(data === undefined) return;
	var player = players[data.id];
	if(player === undefined)
	{
		player = new Player(data.id,data.name);
	}
	player.update(data);
	players[data.id] = player;
});

server.on('color',function (color){
	console.log('Ha entrado un color: '+color);
	if(color === undefined) return;
	canvas_color = color;
});

server.on('exit',function (id){
	console.log("Player with id: "+id+" disconnected!");
	delete players[id];
});