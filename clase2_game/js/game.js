var canvas = document.getElementById('canvas');
canvas.width = 800;
canvas.height = 500;
var ctx = canvas.getContext('2d');

//keyboard
var keys = [];
window.addEventListener('keydown',function (e){
	keys[e.keyCode] = true;
},false);
window.addEventListener('keyup',function (e){
	keys[e.keyCode] = false;
},false)

//Request animation frame normalize
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();

//Obj declaration
function Cube(id)
{
	this.id = id;
	this.speed = 100;
	this.color = "#000000";
}
Cube.prototype =
{
	update: function(data)
	{
		if(data === undefined) return;
		if(data.x !== undefined) this.x = data.x;
		if(data.y !== undefined) this.y = data.y;
		if(data.edge !== undefined) this.edge = data.edge;
		if(data.id !== undefined) this.id = data.id;
		if(data.color !== undefined) this.color = data.color;
	},
	logic: function(dt)
	{
		if(this.id === socket.id)
		{
			var oldX = this.x;
			var oldY = this.y;
			if(keys[40]) this.y += this.speed*dt;
      if(keys[39]) this.x += this.speed*dt;
      if(keys[37]) this.x -= this.speed*dt;
      if(keys[38]) this.y -= this.speed*dt;
      if(oldX !== this.x || oldY !== this.y)
      {
      	socket.emit('update',this);
      }
		}
	},
	render: function(ctx)
	{
		ctx.fillStyle = this.color;
		ctx.fillRect(this.x,this.y,this.edge,this.edge);
	}
}

function logic(dt)
{
	for(var id in cubes) cubes[id].logic(dt);
}
function render(ctx)
{
	for(var id in cubes) cubes[id].render(ctx);
}

//GameLoop & deltatime
var oldTime = +new Date();
var newTime,delta;

function gameloop()
{
	newTime = +new Date();
	delta = (newTime - oldTime)/1000;
	oldTime = newTime;
	requestAnimFrame(gameloop);
	logic(delta);
	ctx.clearRect(0,0,800,600);
	render(ctx);
}
requestAnimFrame(gameloop);





