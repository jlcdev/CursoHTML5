var canvas = document.getElementById('canvas');
canvas.width = 600;
canvas.height = 600;
var ctx = canvas.getContext('2d');

var dir = "http://localhost:4242";
var server = io.connect(dir);

window.requestAnimFrame = (function(){
	return  window.requestAnimationFrame || 
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		function(callback)
		{
			window.setTimeout(callback, 1000 / 60);
		};
})();

//Keyboard
var keys = [];
window.addEventListener("keydown",function(e){
	keys[e.keyCode] = true;
},false);
window.addEventListener("keyup",function(e){
	keys[e.keyCode] = false;
},false);

//Get mouse coords & check click event
var mouse_x,mouse_y;

function getMousePos(canvas,evt)
{
	var rect = canvas.getBoundingClientRect();
	return {
		x: evt.clientX - rect.left,
		y: evt.clientY - rect.top
	};
}

canvas.addEventListener('mousemove',function (evt)
{
	var mouse = getMousePos(canvas,evt);
	mouse_x = mouse.x;
	mouse_y = mouse.y;
}, false);
canvas.addEventListener('click',function (evt){
	action();
},false);

function action()
{
	//MOVE ACTION
	console.log(mouse_x+ " : "+mouse_y);
}

var crossIMG = new Image();
crossIMG.src = "./img/cross.png";
var circleIMG = new Image();
circleIMG.src = "./img/circle.png";

function Cross()
{
	this.img = new Image();
	this.img.src = "img/cross.png";
}



function logic(dt)
{

}
function render(ctx)
{
	for(var i = 0; i < 9; ++i)
	{

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
	logic(dt);
	render(ctx);
}
mainLoop();