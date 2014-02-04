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

io.sockets.on('connection',function (client){
	++map.playerCount;//count new player
	client.on('newPlayer',function(){
		client.emit('setPlayer',map.newPlayer(client.id));
	});
	client.on('disconnect',function (){
		--map.playerCount;
		var cell = map.getCellPlayer(client.id);
		if(cell !== undefined)
		{
			delete cell.player;
		}
	});
});




console.log('Server: Listen clients in port: '+port);
/*
var port = 4242;
var logLevel = 1;
var mapInitialSize = 250;

var io = require('socket.io').listen(port);
io.set('log level',logLevel);
console.log('Server launched - init configurations');


var map = new Map();
map.init();
console.log(map.cells);
var players = new Players();
io.sockets.on('connection',function (client)
{
	console.log('new client connected!');
	++players.count;
	client.on('getPlayer',function (){
		console.log('Server: generation new player');
		var x = Math.floor(Math.random()*map.size_x);
		var y = Math.floor(Math.random()*map.size_y);
		var colorrgb = '#'+Math.floor(Math.random()*16777215).toString(16);
		console.log('Server: send new player to client');
		client.emit('setPlayer',{id:client.id,pos:new Pos(x,y),color:colorrgb});
	});
	client.on('disconnect',function (){
		//Event when client disconnect
		--players.count;
		//io.sockets.emit('exit',data);
	});

});
console.log('Server listen on port: '+port);
*/