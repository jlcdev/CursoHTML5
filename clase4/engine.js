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

// shim layer with setTimeout fallback
window.requestAnimFrame = (function()
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
    return newGameObject();
  }
}

function Camera()
{
  this.x = 0;
  this.y = 0;
  this.v = 1000;
  this.active = false;
}
Camera.prototype =
{
  logic: function(dt)
  {
    var desp = this.v*dt;
    if(keys[40]) this.y += desp; //DOWN arrow
    if(keys[39]) this.x += desp; //RIGHT arrow
    if(keys[37]) this.x -= desp; //LEFT arrow
    if(keys[38]) this.y -= desp; //UP arrow
  },
  changeStatus: function()
  {
    this.active = !this.active;
  }
};

//Game entities
var gameObjects = {};
//Keyboard control
var keys = [];
//Mouse coords
var mouse_x,mouse_y;
var camera = new Camera();

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
  if(camera.active){ camera.logic(dt);}
  for(var key in gameObjects)
  {
    if(gameObjects[key].logic) gameObjects[key].logic(dt);
  }
}

function render(ctx)
{
  ctxBuffer.clearRect(0,0,buffer.width,buffer.height);
  ctx.save();
  ctx.translate(-camera.x,-camera.y);
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
  requestAnimFrame(mainloop);
  newDate = +new Date();
  dt = (newDate - oldDate)/1000;
  oldDate = newDate;
  logic(dt);
  render(ctxBuffer); //draw all in buffer
  ctx.clearRect(0,0,canvas.width,canvas.height); //clean front canvas
  ctx.drawImage(buffer,0,0); //copy buffer into front canvas
}
//Launch mainloop
requestAnimFrame(mainloop);
