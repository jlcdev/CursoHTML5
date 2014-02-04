//Front canvas
var canvas = document.getElementById('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var midCanvasWidth = canvas.width/2;
var midCanvasHeight = canvas.height/2;
var ctx = canvas.getContext('2d');

//Back canvas
var buffer = document.createElement('canvas');
buffer.width = canvas.width;
buffer.height = canvas.height;
var ctxBuffer = buffer.getContext('2d');

// shim layer with setTimeout fallback
window.requestAnimationFrame = (function()
{
  return window.requestAnimationFrame ||
         window.webkitRequestAnimationFrame ||
         window.mozRequestAnimationFrame ||
         function(callback)
         {
           window.setTimeout(callback,1000/60);
         };
})();

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
  }else{
    return objPrototype();
  }
}

function Pos(x,y)
{
  this.x = x;
  this.y = y;
}
Pos.prototype.getIndex = function ()
{
  return this.x+'x'+this.y;
}
Pos.prototype.toString = function ()
{
  return this.getIndex();
}
Pos.prototype.clone = function ()
{
  return new Pos(this.x,this.y);
}

//Game entities
var gameObjects = {};
//Keyboard control
var keys = [];
//Mouse coords
//var mouse_x,mouse_y;

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
/*
window.addEventListener('mousemove',function (e){
  var rect = canvas.getBoundingClientRect();
  mouse_x = (e.clientX - rect.left);
  mouse_y = (e.clientY - rect.top);
},false);
*/

//Other function support
function distanceBetwenPoints(pos1,pos2)
{
  var dx = pos2.x - pos1.x;
  var dy = pos2.y - pos1.y;
  return Math.sqrt(Math.pow(dx,2) + Math.pow(dy,2));
}


//Mainloop support 
function resizeControl()
{
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  buffer.width = window.innerWidth;
  buffer.height = window.innerHeight;
  render(ctxBuffer);
}

function logic(dt)
{
  //camera.logic(dt);
  for(var key in gameObjects)
  {
    if(gameObjects[key].logic) gameObjects[key].logic(dt);
  }
}

function render(ctx)
{
  ctx.clearRect(0,0,buffer.width,buffer.height);
  ctx.save();
  ctx.fillStyle = 'black';
  ctx.fillRect(0,0,canvas.width,canvas.height);
  //ctx.rotate((Math.PI / 180) * -45);
  //if(camera.active) ctx.translate(-camera.pos.x,-camera.pos.y);
  for(var key in gameObjects)
  {
    if(gameObjects[key].render) gameObjects[key].render(ctx);
  }
  ctx.restore();
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
  logic(dt);
  render(ctxBuffer); //draw all in buffer
  ctx.clearRect(0,0,canvas.width,canvas.height); //clean front canvas
  ctx.drawImage(buffer,0,0); //copy buffer into front canvas
}
//Launch mainloop
requestAnimationFrame(mainloop);