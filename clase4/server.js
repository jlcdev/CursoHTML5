var port = 4242;
var logLevel = 1;

var io = require('socket.io').listen(port);
io.set('log level',logLevel);

var map = {};


/*
function generateMap(min_x,min_y,max_x,max_y)
{
	var cell;
	for(var i = min_x; i < max_x; ++x)
	{
		for(var j = min_y; j < max_y; ++j)
		{
			cell = new Cell();
			if(map[i+'x'+j] === undefined) map[i+'x'+j] = cell;
		}
	}
}

generateMap(0,0,10,10); //Create minimal map
getMapMax();

function getMapMax()
{
	var max,num,s;
	for(var i in map)
	{
		s = i.split('x');
		num = parseInt(s[0]);
		if(max !== undefined)
		{
			if(num > max) max = num;
		}
		else
		{
			max = num;
		}
	}
	if(max !== undefined) return max;
	return 0;
}
*/
io.sockets.on('connection',function (client){

	console.log('new client connected!');

	client.on('getMap',function (){
		//Send actual map to client.
		client.emit('map',map);
	});

	client.on('');

	client.on('disconnect',function (){
		//
	});

});