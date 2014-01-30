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
	control = false;
},false);

var control = false;

function Player(id,name)
{
	this.id = id;
	this.name = name;
	this.score = 0;
	//this.color = '#000000'; // override by server
}
Player.prototype =
{
	update: function(data)
	{
		if(data === undefined) return;
		if(data.id !== undefined) this.id = data.id;
		if(data.name !== undefined) this.name = data.name;
		if(data.score !== undefined) this.score = data.score;
		//if(data.color !== undefined) this.color = data.color;
	},
	logic: function (dt)
	{
		if(keys[32] && !control)
		{
			server.emit('hachazo',this);
			control = !control;
		}
	}
}

function printer(ctx)
{
	//Create box for player zone.
	var y = 40;
	var tam = Object.keys(players).length;
	var size = 20+(tam*25);
	ctx.fillStyle = "#FBF8EF";
	ctx.fillRect(10,15,150,size);
	ctx.fillStyle = "black";
	ctx.font = "bold 16px Arial";
	for(var p in players)
	{
		console.log(players[p]);
		var text = players[p].name+": "+players[p].score+" points";
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
	for(var p in players) players[p].logic(dt);
}
function render(ctx)
{
	ctx.clearRect(0,0,canvas.width,canvas.height);
	setCanvasColor(ctx);
	logic(dt);
	printer(ctx);
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
	render(ctx);
}
mainLoop();

window.onresize = function(e)
{
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	render(ctx);
}