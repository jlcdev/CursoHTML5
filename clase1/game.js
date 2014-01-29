//Add remove function to array
Array.prototype.remove = function(e)
{
	var index = this.indexOf(e);
	if(index > -1) this.splice(index,1);
}
//Global elements
var canvas = document.getElementById("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var ctx = canvas.getContext("2d");
window.requestAnimFrame = (function(){
	return  window.requestAnimationFrame || 
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		function(callback)
		{
			window.setTimeout(callback, 1000 / 60);
		};
})();
var wallet = 0;
var gameObjects = []; //All entities here
var delGameObjects = []; //Entities for remove

//Keyboard
var keys = [];
window.addEventListener("keydown",function(e){
	keys[e.keyCode] = true;
},false);
window.addEventListener("keyup",function(e){
	keys[e.keyCode] = false;
},false);

//Objects declarations
function Coin(x,y)
{
	this.tam = 50;
	this.x = x || Math.random()*(canvas.width-this.tam);
	this.y = y || Math.random()*(canvas.height-this.tam);
	this.r = 10;
	this.img = new Image();
	this.img.src = "coin.png";
}
Coin.prototype = 
{
	logic: function(dt){},
	render: function(ctx)
	{
		ctx.drawImage(this.img, this.x,this.y,this.tam,this.tam);
	}
}
function Player(x,y,vx,vy)
{
	this.tam = 150;
	this.x = x || Math.random()*(canvas.width-this.tam);
	this.y = y || Math.random()*(canvas.height-this.tam);
	this.vx = vx || 10;
	this.vy = vy || 10;
	this.r = 50;
	this.img = new Image();
	this.img.src = "mario.png";
}
Player.prototype =
{
	logic: function(dt)
	{
		if(keys[40]) this.y += this.vy*dt;
		if(keys[39]) this.x += this.vx*dt;
		if(keys[37]) this.x -= this.vx*dt;
		if(keys[38]) this.y -= this.vy*dt;
		this.collision(); //check collisions with coins
	},
	render: function(ctx)
	{
		ctx.drawImage(this.img,this.x,this.y,this.tam,this.tam);
	},
	collision: function()
	{
		for(var i = gameObjects.length-3; i >= 0; --i) //Last obj is player & text
		{
			var obj = gameObjects[i];
			if (Math.sqrt((this.x-obj.x)*(this.x-obj.x )+(this.y-obj.y)*(this.y-obj.y))<(this.r+obj.r)) 
			{
				gameObjects.remove(obj);
				++wallet;
			}
		}
	}
}
function Text(msg,x,y)
{
	this.msg = msg || "";
	this.x = x || 10;
	this.y = y || 50;
}
Text.prototype =
{
	logic: function(dt)
	{
		this.msg = "Wallet: "+wallet;
	},
	render: function(ctx)
	{
		ctx.font = "normal 36px Arial";
		ctx.fillStyle = "black";
		ctx.fillText(this.msg,this.x,this.y);
	}
}

//Add gameObjects
for(var i = 0; i < 20; ++i) gameObjects.push(new Coin());
gameObjects.push(new Player());
gameObjects.push(new Text("Wallet: "+wallet));

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
	for(var i = 0; i < gameObjects.length; ++i)
	{
		var obj = gameObjects[i];
		if(obj.logic) obj.logic(dt);
		if(obj.render) obj.render(ctx);
	}
}
mainLoop();