camera.changeStatus();

var dir = "http://localhost:4242";
var server = io.connect(dir);

var map = {};
var id;

server.on('connect',function(){
	console.log('Connected to server!');
	server.emit('getPosition');
	server.emit('getMap');
});

server.on('setMap',function (mapServer){
	map = mapServer;
});

server.on('setPosition',function (){
	
});


//Object declaration
/*
function createCube()
{
	var cube = objPrototype();
	cube.x = Math.random()*canvas.width;
	cube.y = Math.random()*canvas.height;
	cube.v = Math.random()*(2000+1000)+1000;
	cube.size = Math.random()*100;
	cube.logic = function(dt)
	{
		/*
		var desp = this.v*dt;
		if(keys[83]) this.y += desp; //DOWN arrow
		if(keys[68]) this.x += desp; //RIGHT arrow
		if(keys[65]) this.x -= desp; //LEFT arrow
		if(keys[87]) this.y -= desp; //UP arrow
		*//*
	};
	cube.render = function(ctx)
	{
		ctx.fillRect(this.x,this.y,this.size,this.size);
	};
	return cube;
}

for(var i = 0; i < 100; ++i)
{
	var cube = createCube();
	gameObjects[cube._id] = cube;
}
*/


map.max_x = 14;
map.max_y = 14;

var cube = objPrototype();
cube.color = 'red';
cube.tam = 20;

function Cell(){};

function generateMap(min_x,min_y,max_x,max_y)
{
	var cell;
	for(var i = min_x; i < max_x; ++i)
	{
		for(var j = min_y; j < max_y; ++j)
		{
			cell = new Cell();
			if(map[i+'x'+j] === undefined) map[i+'x'+j] = cell;
		}
	}
}

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

generateMap(0,0,15,15);
/*
function printMap()
{
	var num,s;
	ctxBuffer.fillStyle = 'white';
	for(var i in map)
	{
		s = i.split('x');
		num_x = parseInt(s[0]);
		num_y = parseInt(s[1]);
		if(i.playerid)
		{
			ctxBuffer.save();
			ctxBuffer.fillStyle = 'blue';
			console.log('player!');
			ctxBuffer.fillRect(num_x*cube.tam,num_y*cube.map,cube.map,cube.map);
			ctxBuffer.restore();
		}
		else
		{
			ctxBuffer.fillRect(num_x*cube.tam,num_y*cube.map,cube.map,cube.map);
		}
	}
}*/

var mapObj = objPrototype();
mapObj.render = function (ctx)
{
	var num,s;
	ctx.fillStyle = 'white';
	for(var i in map)
	{
		s = i.split('x');
		num_x = parseInt(s[0]);
		num_y = parseInt(s[1]);
		console.log(num_x*cube.tam+' : '+num_y*cube.tam);
		if(i.playerid)
		{
			ctx.fillStyle = 'blue';
			ctx.fillRect(num_x*cube.tam,num_y*cube.map,cube.map,cube.map);
		}
		else
		{
			ctx.fillRect(num_x*cube.tam,num_y*cube.map,cube.map,cube.map);
		}
	}
};
gameObjects[mapObj._id] = mapObj;



























