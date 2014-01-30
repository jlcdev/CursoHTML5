var io = require('socket.io').listen(4242);
io.set("log level",1);

var players = {};

function Player(id,name)
{
	this.id = id;
	this.name = name;
	this.score = 0;
}

var active = false;
var actual_color = 'white';
function sendTrollColor()
{
	var color = '#'+Math.floor(Math.random()*16777215).toString(16);
	active = true;
	actual_color = color;
	io.sockets.emit('color',actual_color);
	console.log("new color canvas send");
}

//setTimeout(sendTrollColor(),20000000);
var playerCount = 0;
var initial = false;
io.sockets.on('connection',function (client){

	console.log('New user connected!');
	++playerCount;

	io.sockets.emit('color',actual_color);

	if(playerCount === 2 && initial === false)
	{
		console.log("2 players !!!");
		setTimeout(sendTrollColor(),Math.random()*15000);
		initial = true;
	}

	client.on('newuser',function (user){
		console.log('Function newuser launched with'+user);
		var player = new Player(client.id,user);
		//player.score = 0;
		players[client.id] = player;
		io.sockets.emit('update',player);
		for(var p in players)
		{
			if(p !== client.id)
			{
				io.sockets.emit('update',players[p]);
			}
		}
	});

	client.on('hachazo',function (player){
		if(active)
		{
			console.log('Hachazo!');
			io.sockets.emit('color','white');
			active = false;
			player.score += 50;
			io.sockets.emit(player);
			setTimeout(sendTrollColor,Math.random()*15000);
			io.sockets.emit('update',player);
		}
	});

	client.on('disconnect',function (){
		--playerCount;
		console.log('user disconnected!');
		client.broadcast.emit('exit',client.id);
	});
});
console.log('Socket listen in port: 4242');