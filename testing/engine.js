//GLOBAL ELEMENTS
var GameManager;
var keys = []; //Keys pressed
var mouse;
var util;
//Utility classes
function CoordXY(x,y)
{
  this.x = x;
  this.y = y;
}
CoordXY.prototype =
{
  getIndex: function()
  {
    return this.x+'x'+this.y;
  },
  toString: function()
  {
    return this.getIndex();
  },
  clone: function()
  {
    return new CoordXY(this.x,this.y);
  }
}
function Util()
{
  this.keyCodeMap = {
    8:"backspace", 9:"tab", 13:"return", 16:"shift", 17:"ctrl", 18:"alt", 19:"pausebreak", 20:"capslock",
    27:"escape", 32:" ", 33:"pageup", 34:"pagedown", 35:"end", 36:"home", 37:"left", 38:"up", 39:"right",
    40:"down", 43:"+", 44:"printscreen", 45:"insert", 46:"delete", 48:"0", 49:"1", 50:"2", 51:"3", 52:"4",
    53:"5", 54:"6", 55:"7", 56:"8", 57:"9", 59:";", 61:"=", 65:"a", 66:"b", 67:"c", 68:"d", 69:"e", 70:"f",
    71:"g", 72:"h", 73:"i", 74:"j", 75:"k", 76:"l", 77:"m", 78:"n", 79:"o", 80:"p", 81:"q", 82:"r", 83:"s",
    84:"t", 85:"u", 86:"v", 87:"w", 88:"x", 89:"y", 90:"z", 96:"0", 97:"1", 98:"2", 99:"3", 100:"4", 101:"5",
    102:"6", 103:"7", 104:"8", 105:"9", 106: "*", 107:"+", 109:"-", 110:".", 111: "/", 112:"f1", 113:"f2",
    114:"f3", 115:"f4", 116:"f5", 117:"f6", 118:"f7", 119:"f8", 120:"f9", 121:"f10", 122:"f11", 123:"f12",
    144:"numlock", 145:"scrolllock", 186:";", 187:"=", 188:",", 189:"-", 190:".", 191:"/", 192:"`", 219:"[",
    220:"\\", 221:"]", 222:"'"
  };
  this.modifiedByShift = {
    192:"~", 48:")", 49:"!", 50:"@", 51:"#", 52:"$", 53:"%", 54:"^", 55:"&", 56:"*", 57:"(", 109:"_", 61:"+",
    219:"{", 221:"}", 220:"|", 59:":", 222:"\"", 188:"<", 189:">", 191:"?",
    96:"insert", 97:"end", 98:"down", 99:"pagedown", 100:"left", 102:"right", 103:"home", 104:"up", 105:"pageup"
  };
}
Util.prototype =
{
  distance: function(coord1,coord2)
  {
    return Math.sqrt(Math.pow((coord2.x - coord1.x),2) + Math.pow((coord2.y - coord1.y),2));
  },
  randomRange: function(min,max)
  {
    return Math.random()*(max-min)+min;
  },
  randomRangeInt: function(min,max)
  {
    return Math.floor(Math.random()*(max-min+ 1))+min;
  },
  generateRandomId: function()
  {
    var date = this.date();
    return '#'+date+Math.floor(Math.random()*date);
  },
  generateRandomColor: function()
  {
    return '#'+Math.floor(Math.random()*16777215).toString(16);
  },
  generateRandomWithMax: function(max)
  {
    return Math.random()*max;
  },
  generateRandom01: function()
  {
    return Math.floor(Math.random()*9)%2;
  },
  generateRandom1orMin1: function()
  {
    if(this.generateRandom01() === 0) return 1;
    else return -1;
  },
  date: function()
  {
    return +new Date();
  },
  toRadian: function(degree)
  {
    return (degree*Math.PI)/180;
  },
  getKeyCodeValue: function(key,shiftKey)
  {
    if(key === undefined) return;
    var shiftKey = shiftKey || false;
    var value = null;
        if(shiftKey === true){
            value = this.modifiedByShift[key];
        }else{
            value = this.keyCodeMap[key];
        }
        return value;
  },
  getKeyCode: function (key,shiftKey)
  {
    if(key === undefined) return;
    var shiftKey = shiftKey || false;
    if(shiftKey === true)
    {
      for(var i in this.modifiedByShift)
      {
        if(this.modifiedByShift[i] === key) return i;
      }
    }else{
      for(var i in this.keyCodeMap)
      {
        if(this.keyCodeMap[i] === key) return i;
      }
    }
  }
}
util = new Util();

//GameObject class
function GameObject()
{
  this.genId();
}
GameObject.prototype =
{
  genId: function()
  {
    var id = util.generateRandomId();
    if(gameManager.findGameObjectById(id) === undefined) this._id = id;
    else this.genId();
  },
  logic: function(dt){},
  render: function(ctx){},
  resize: function(){}
};

//GameManager class
function GameManager()
{
  this.countGameObjects = 0;
  this.gameObjects = {};
  this.active = true;
}
GameManager.prototype =
{
  addGameObject: function (gameObject)
  {
    if(gameObject === undefined) return;
    ++this.countGameObjects;
    if(gameObject._id === undefined) return;
    this.gameObjects[gameObject._id] = gameObject;
    return gameObject;
  },
  findGameObjectById: function (id)
  {
    if(id === undefined) return;
    var gameObject = this.gameObjects[id];
    if(gameObject !== undefined) return gameObject;
    else return undefined;
  },
  findGameObjectByProperty: function(property)
  {
    if(property === undefined) return;
    for(var key in this.gameObjects)
    {
      if(property in this.gameObjects[key]) return this.gameObjects[key];
    }
    return undefined;
  },
  deleteGameObject: function (id)
  {
    if(id === undefined) return;
    --this.countGameObjects;
    if(this.gameObjects[id] === undefined) return;
    delete this.gameObjects[id];
  },
  getNumGameObjects: function ()
  {
    return this.countGameObjects;
  },
  getAllGameObjects: function ()
  {
    return this.gameObjects;
  },
  logic: function (dt)
  {
    for(var key in this.gameObjects)
      if(this.gameObjects[key].logic)
        this.gameObjects[key].logic(dt);
  },
  render: function (ctx)
  {
    for(var key in this.gameObjects)
      if(this.gameObjects[key].render)
        this.gameObjects[key].render(ctx);
  },
  resize: function()
  {
    for(var key in this.gameObjects)
      if(this.gameObjects[key].resize)
        this.gameObjects[key].resize();
    },
  gameInit: function()
  {
    requestAnimationFrame(mainloop);//Engine init
  }
}
gameManager = new GameManager();

//Event binding
window.addEventListener('keydown',function (e){
  keys[e.keyCode] = true;
},false);
window.addEventListener('keyup',function (e){
  keys[e.keyCode] = false;
},false);
window.addEventListener('mousemove',function (e){
  var rect = canvas.getBoundingClientRect();
  mouse = new CoordXY(e.clientX - rect.left,e.clientY - rect.top);
},false);
window.addEventListener('resize',resizeControl);

//Front canvas
var canvas = document.getElementById('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var ctxFront = canvas.getContext('2d');

//Back canvas
var buffer = document.createElement('canvas');
buffer.width = canvas.width;
buffer.height = canvas.height;
var ctxBuffer = buffer.getContext('2d');

//precalculate mid distances about canvas size
var midWidth = canvas.width/2;
var midHeight = canvas.height/2;

//Find requestAnimationFrame 
window.requestAnimationFrame = (function()
{
  return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function(callback){window.setTimeout(callback,1000/60);};
})();

//main loop & deltatime
function logic(dt)
{
  gameManager.logic(dt);
  /*
  for(var key in gameObjects) 
    if(gameObjects[key].logic) 
      gameObjects[key].logic(dt);
    */
}
function render(ctx)
{
  ctx.clearRect(0,0,buffer.width,buffer.height);
  ctx.save();
  gameManager.render(ctx);
  ctx.restore();
}
function frontUpdate()
{
  ctxFront.clearRect(0,0,canvas.width,canvas.height); //clean front canvas
  ctxFront.drawImage(buffer,0,0); //copy buffer into front canvas
}

var oldDate = util.date();
var newDate,dt;
function mainloop()
{
  requestAnimationFrame(mainloop);
  if(gameManager.active)
  {
  newDate = util.date();
  deltaTime = (newDate-oldDate)/1000;
  oldDate = newDate;
  logic(deltaTime); //send deltaTime to all objects
  render(ctxBuffer); //draw all in buffer
  frontUpdate(); //draws all content in buffer to front canvas
  }
}

//if change screen size resize front & buffer canvas
function resizeControl() 
{
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  buffer.width = canvas.width;
  buffer.height = canvas.height;
  midWidth = canvas.width/2;
  midHeight = canvas.height/2;
  render(ctxBuffer); 
  frontUpdate();
  gameManager.resize();
}