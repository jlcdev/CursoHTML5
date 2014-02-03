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
    return newGameObject();
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

function Camera()
{
  this.pos = new Pos(canvas.width/2,canvas.height/2);
  this.v = 1000;
  this.active = false;
  this.initialX = Math.floor((this.pos.x - midCanvasWidth)/50);
  this.initialY = Math.floor((this.pos.y - midCanvasHeight)/50);
  this.endX = Math.floor((this.pos.x + canvas.width)/50);
  this.endY = Math.floor((this.pos.y + canvas.height)/50);
}
Camera.prototype =
{
  logic: function(dt)
  {
    if(this.active)
    {
      var desp = this.v*dt;
      if(keys[40]) this.pos.y += desp;//DOWN arrow
      if(keys[39]) this.pos.x += desp; //RIGHT arrow
      if(keys[37]) this.pos.x -= desp; //LEFT arrow
      if(keys[38]) this.pos.y -= desp; //UP arrow*/
    }
    this.initialX = Math.floor((camera.pos.x - midCanvasWidth)/50);
    this.initialY = Math.floor((camera.pos.y - midCanvasHeight)/50);
    this.endX = Math.floor((camera.pos.x + canvas.width)/50);
    this.endY = Math.floor((camera.pos.y + canvas.height)/50);
  },
  changeStatus: function()
  {
    this.active = !this.active;
  },
  center: function (pos,tam)
  {
    this.pos = new Pos(pos.x*tam-midCanvasWidth,pos.y*tam-midCanvasHeight);
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
  camera.logic(dt);
  for(var key in gameObjects)
  {
    if(gameObjects[key].logic) gameObjects[key].logic(dt);
  }
}

function render(ctx)
{
  ctxBuffer.clearRect(0,0,buffer.width,buffer.height);
  ctx.save();
  if(camera.active) ctx.translate(-camera.pos.x,-camera.pos.y);
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