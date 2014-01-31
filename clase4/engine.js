//Front canvas
var canvas = document.getElementById('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var ctx = canvas.getContext('2d');

//Back canvas
var buffer = document.createElement('canvas');
buffer.width = canvas.width;
buffer.height = canvas.height;
var ctxBuffer = buffer.getContext('2d');

//GameObject Class
function gameObject(obj)
{
	for(var prop in obj) this[prop] = obj[prop];
}

function genId()
{
	var date = +new Date();
	return '#'+date+Math.floor(Math.random()*date);
}

function objPrototype()
{
	var id = genId();
	if(gameObjects[id] === undefined)
	{
		return new gameObject({'_id':id});
	}
	else
	{
		return newGameObject();
	}
}

//Game entities
var gameObjects = {};
//Keyboard control
var keys = [];
//Mouse coords
var mouse_x,mouse_y;

//Bind events
//Keyboard events
window.addEventListener('keydown',function (e){
	keys[e.keyCode] = true;
},false);
window.addEventListener('keyup',function (e){
	keys[e.keyCode] = false;
},false);

//Bind onresize
window.addEventListener('resize',resizeControl);

//Bind mousemove
window.addEventListener('mousemove',function (e){
	var rect = canvas.getBoundingClientRect();
	mouse_x = (e.clientX - rect.left);
	mouse_y = (e.clientY - rect.top);
},false);

//Mainloop support 
function canvasUpdate()
{
	ctx.clearRect(0,0,canvas.width,canvas.height); //clean front canvas
	ctx.drawImage(buffer,0,0); //copy buffer into front canvas
}

function resizeControl()
{
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	buffer.width = window.innerWidth;
	buffer.height = window.innerHeight;
	render(ctxBuffer);
	canvasUpdate();
}

function logic(dt)
{
	for(var key in gameObjects)
	{
		if(gameObjects[key].logic) gameObjects[key].logic(dt);
	}
}

function render(ctx)
{
	for(var key in gameObjects)
	{
		if(gameObjects[key].render) gameObjects[key].render(ctx);
	}
}

//main loop & deltatime
var oldDate = +new Date();
var newDate,dt;
function mainloop()
{
	requestAnimationFrame(mainloop);
	newDate = +new Date();
	dt = (newDate - oldDate)/1000;
	oldDate = newDate;
	ctxBuffer.clearRect(0,0,buffer.width,buffer.height);//clean buffer
	logic(dt);
	render(ctxBuffer); //draw all in buffer
	canvasUpdate();
}
//Launch mainloop
requestAnimationFrame(mainloop);