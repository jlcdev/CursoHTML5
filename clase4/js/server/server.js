//Load required modules
var Pos = require('./sPos');
var Cell = require('./sCell');
var Map = require('./sMap');
var Player = require('./sPlayer');

//Configure server

var port = 4242;
var logLevel = 1;
var io = require('socket.io').listen(port);
io.set('log level',logLevel);
//Create map
var map = new Map();

var light_time = 10000;
var light = 0;
var positive = false;
var timmer;
function lightEvent()
{
	clearInterval(timmer);
	if(light <= 0 || light >= 1) positive = !positive;
	if(positive) light += 0.1;
	else light -= 0.1;
	light = Math.round(light*10)/10;
	io.sockets.emit('worldLight',light);
	timmer = setTimeout(lightEvent,light_time);
}

timmer = setTimeout(lightEvent,light_time);

io.sockets.on('connection',function (client)
{
	++map.playerCount;//count new player
	if(map.playerCount > 0)
	for(var key in map.cells)//send players in server
	{
		if(map.cells[key].player !== undefined)
		{
			client.emit('addPlayer',map.cells[key].player);
		}
	}

	client.on('newPlayer',function()
	{
		var player = map.newPlayer(client.id);
		client.emit('setPlayer',player);
		client.broadcast.emit('addPlayer',player);
	});

	client.on('move',function (data)
	{
		if(data === undefined) return;
		if(data.direction === undefined) return;
		//var newTime = +new Date();
		var cell = map.getCellPlayer(client.id);
		if(cell === undefined) return;
		switch(data.direction)
		{
			case 'up':
				var upCell = map.getCellAt(new Pos(cell.player.pos.x,cell.player.pos.y-1));
				if(upCell.player === undefined)
				{
					upCell.player = new Player(cell.player.pos.x,cell.player.pos.y-1,cell.player.id,cell.player.color);
					upCell.player.life = cell.player.life;
					io.sockets.emit('playerUpdate',upCell.player);
					map.deleteCell(new Pos(cell.player.pos.x,cell.player.pos.y));
				}
				break;
			case 'left':
				var leftCell = map.getCellAt(new Pos(cell.player.pos.x-1,cell.player.pos.y));
				if(leftCell.player === undefined)
				{
					leftCell.player = new Player(cell.player.pos.x-1,cell.player.pos.y,cell.player.id,cell.player.color);
					leftCell.player.life = cell.player.life;
					io.sockets.emit('playerUpdate',leftCell.player);
					map.deleteCell(new Pos(cell.player.pos.x,cell.player.pos.y));
				}
				break;
			case 'right':
				var rightCell = map.getCellAt(new Pos(cell.player.pos.x+1,cell.player.pos.y));
				if(rightCell.player === undefined)
				{
					rightCell.player = new Player(cell.player.pos.x+1,cell.player.pos.y,cell.player.id,cell.player.color);
					rightCell.player.life = cell.player.life;
					io.sockets.emit('playerUpdate',rightCell.player);
					map.deleteCell(new Pos(cell.player.pos.x,cell.player.pos.y));
				}
				break;
			case 'down':
				var downCell = map.getCellAt(new Pos(cell.player.pos.x,cell.player.pos.y+1));
				if(downCell.player === undefined)
				{
					downCell.player = new Player(cell.player.pos.x,cell.player.pos.y+1,cell.player.id,cell.player.color);
					downCell.player.life = cell.player.life;
					io.sockets.emit('playerUpdate',downCell.player);
					map.deleteCell(new Pos(cell.player.pos.x,cell.player.pos.y));
				}
				break;
		}
	});

	client.on('attack',function (){
		var cell = map.getCellPlayer(client.id);
		if(cell === undefined) return;
		var aroundPositions = map.getAroundPositions(cell.player.pos);
		//console.log(aroundPositions);
		var size = Object.keys(aroundPositions).length;
		for(var i = 0; i < size; ++i)
		{
			if(aroundPositions[i] in map.cells)
			{
				var enemy = map.cells[aroundPositions[i]];
				enemy.player.life -= 10;
				if(enemy.player.life < 0) enemy.player.life = 0;
				io.sockets.emit('playerUpdate',enemy.player);
			}
		}
		/*
		for(var position in aroundPositions)
		{
			if(position in map.cells)
			{
				console.log('enemy detected');
				var enemy = map.cells[position];
				enemy.player.life -= 10;
				io.sockets.emit('playerUpdate',enemy.player);
			}
		}
		*/	
	});


	client.on('disconnect',function ()
	{
		console.log('user disconnect');
		--map.playerCount;
		var cell = map.getCellPlayer(client.id);
		if(cell !== undefined)
		{
			delete cell.player;
		}
		io.sockets.emit('exit',client.id);
	});
});

console.log('Server: Listen clients in port: '+port);