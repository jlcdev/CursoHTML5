var port = 4242;
var logLevel = 1;

var io = require('socket.io').listen(port);


//Obj declarations
function Tablero()
{
	this.field = [];
	this.players = 0;
	this.active = Math.floor((Math.random()*2) + 1); // 1 or 2
	this.turn = 0;
}
Tablero.prototype =
{
	update: function(data)
	{
		if(data === undefined) return;
		if(data.field !== undefined) this.field = data.field;
		if(data.active !== undefined) this.active = data.field;
	}
}





io.sockets.on('connection',function (client){


	client.on('move',function (data){

	});

	client.on('end',function (){

	});

	client.on('disconnect',function (){});

});