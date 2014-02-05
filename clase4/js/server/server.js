//Load required modules
var Pos = require('./sPos');
var Cell = require('./sCell');
var Map = require('./sMap');
var Player = require('./sPlayer');

//Configure server
var port = 4242;
var logLevel = 1;
var io = require('socket.io').listen(port);

//Create map
var map = new Map();

io.sockets.on('connection',function (client)
{
	++map.playerCount;//count new player
	for(var cell in map.cells)//send players in server
	{
		if(cell.player !== undefined)
		{
			client.emit('addPlayer',cell.player);
		}
	}

	client.on('newPlayer',function()
	{
		console.log('new Player launched');
		var player = map.newPlayer(client.id);
		client.emit('setPlayer',player);
		client.broadcast.emit('addPlayer',player);
	});

	client.on('move',function (data)
	{
		console.log('Client move');
		if(data === undefined) return;
		if(data.direction === undefined) return;
		//var newTime = +new Date();
		var cell = map.getCellPlayer(client.id);
		if(cell === undefined) return;
		switch(data.direction)
		{
			case 'up':
				var upCell = map.getCellAt(new Pos(cell.pos.x,cell.pos.y-1));
				if(upCell.player === undefined)
				{
					var player = cell.player;
					player.pos = upCell.pos;
					upCell.player = player;
					map.deleteCell(cell);
					io.sockets.emit('playerUpdate',player);
				}
				break;
			case 'left':
				var leftCell = map.getCellAt(new Pos(cell.pos.x-1,cell.pos.y));
				if(leftCell.player === undefined)
				{
					var player = cell.player;
					player.pos = leftCell.pos;
					leftCell.player = player;
					map.deleteCell(cell);
					io.sockets.emit('playerUpdate',player);
				}
				break;
			case 'right':
				var rightCell = map.getCellAt(new Pos(cell.pos.x+1,cell.pos.y));
				if(rightCell.player === undefined)
				{
					var player = cell.player;
					player.pos = rightCell.pos;
					rightCell.player = player;
					map.deleteCell(cell);
					io.sockets.emit('playerUpdate',player);
				}
				break;
			case 'down':
				var downCell = map.getCellAt(new Pos(cell.pos.x,cell.pos.y+1));
				if(downCell.player === undefined)
				{
					var player = cell.player;
					player.pos = downCell.pos;
					downCell.player = player;
					map.deleteCell(cell);
					io.sockets.emit('playerUpdate',player);
				}
				break;
		}
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