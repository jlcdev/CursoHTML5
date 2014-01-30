var canvas = document.getElementById('canvas');
canvas.width = 800;
canvas.height = 500;
var ctx = canvas.getContext('2d');
var user = prompt('Introduce un nombre de usuario.') || 'Looser';

//Request animation frame normalize
window.requestAnimFrame = (function(){
	return  window.requestAnimationFrame || 
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		function(callback)
		{
			window.setTimeout(callback, 1000 / 60);
		};
})();

var keys = [];
window.addEventListener('keydown',function (e){
	keys[e.keyCode] = true;
},false);
window.addEventListener('keyup',function (e){
	keys[e.keyCode] = false;
},false);


function Player(id,name)
{
	this.id = id;
	this.name = name;
	this.score = 0;
}
Player.prototype =
{
	update: function(data)
	{
		if(data === undefined) return;
		if(data.id !== undefined) this.id = data.id;
		if(data.name !== undefined) this.name = data.name;
		if(data.score !== undefined) this.score = data.score;
	},
	logic: function (dt)
	{
		if(keys[32])
		{
			server.emit('hachazo',this);
		}
	}
}

function printer(ctx)
{
	var y = 20;
	for(var p in players)
	{
		console.log(players[p]);
		var text = players[p].name+": "+players[p].score+" points";
		ctx.fillStyle = "blue";
		ctx.font = "bold 16px Arial";
		ctx.fillText(text,15,y);
		y += 25;
	}
}

function setCanvasColor(ctx)
{
	ctx.fillStyle = canvas_color;
	ctx.fillRect(0,0,canvas.width,canvas.height);
}

function logic(dt)
{
	for(var p in players)
	{
		players[p].logic(dt);
	}
}
//GameLoop
var oldDate = +new Date();
var newDate,dt;
function mainLoop()
{
	requestAnimFrame(mainLoop);
	newDate = +new Date();
	dt = (newDate - oldDate)/10;
	oldDate = newDate;
	ctx.clearRect(0,0,canvas.width,canvas.height);
	//Code iteration
	setCanvasColor(ctx);
	logic(dt);
	printer(ctx);
}
mainLoop();