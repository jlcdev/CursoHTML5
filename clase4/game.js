var map = new Map();
var key_blocked = false;
var key_cooldown = 500;

function Camera()
{
	this._id = objPrototype()._id;
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
    this.initialX = Math.floor((this.pos.x - midCanvasWidth)/50);
    this.initialY = Math.floor((this.pos.y - midCanvasHeight)/50);
    this.endX = Math.floor((this.pos.x + canvas.width)/50);
    this.endY = Math.floor((this.pos.y + canvas.height)/50);
  },
  center: function (pos,tam)
  {
    this.pos = new Pos(pos.x*tam-midCanvasWidth,pos.y*tam-midCanvasHeight);
  },
  render: function (ctx)
  {
  	if(this.active) ctx.translate(-this.pos.x,-this.pos.y);
  },
  changeStatus: function()
  {
    this.active = !this.active;
  }
};

var camera = new Camera(); //Create camera

function Player(x,y)
{
	this._id = objPrototype()._id;
	this.pos = new Pos(x,y);
	this.vPos = this.pos.clone();
	this.playerId = genId();
	this.cell = map.getCellAt(this.pos);
	this.cell.playerId = this.playerId;
	this.color = 'blue';
	this.vision = 10;
	this.life = 75;
}
Player.prototype =
{
	logic: function(dt)
	{
		if(keys[83] && !key_blocked)
		{
			//server.emit('move',{direction:'down',date:+new Date()});
			this.move('down');
			key_blocked = !key_blocked;
			setTimeout(function(){key_blocked = false;},key_cooldown);
		}
		if(keys[68] && !key_blocked)
		{
			//server.emit('move',{direction:'right',date:+new Date()});
			this.move('right');
			key_blocked = !key_blocked;
			setTimeout(function(){key_blocked = false;},key_cooldown);
		}
		if(keys[65] && !key_blocked)
		{
			//server.emit('move',{direction:'left',date:+new Date()});
			this.move('left');
			key_blocked = !key_blocked;
			setTimeout(function(){key_blocked = false;},key_cooldown);
		}
		if(keys[87] && !key_blocked)
		{
			//server.emit('move',{direction:'up',date:+new Date()});
			this.move('up');
			key_blocked = !key_blocked;
			setTimeout(function(){key_blocked = false;},key_cooldown);
		}
		this.vPos.x += (this.pos.x*this.cell.edge-this.vPos.x)/5;
		this.vPos.y += (this.pos.y*this.cell.edge-this.vPos.y)/5;
	},
	render: function (ctx)
	{
		ctx.save();
		camera.center(this.pos,this.cell.edge); //center camera
		ctx.translate(-camera.pos.x,-camera.pos.y);
		ctx.fillStyle = this.color;
		ctx.fillRect(this.vPos.x,this.vPos.y,this.cell.edge,this.cell.edge);
		ctx.fillStyle = 'white';
		ctx.fillRect(this.vPos.x,this.vPos.y-10,this.cell.edge,8);
		ctx.fillStyle = 'red';
		ctx.fillRect(this.vPos.x+1,this.vPos.y-9,((this.cell.edge-2)*this.life)/100,6);
		ctx.restore();
	},
	move: function (direction)
	{
		switch(direction)
		{
			case 'up': 
				var mCell = map.getCellAt(new Pos(this.pos.x,this.pos.y-1));
				if(mCell.playerId === undefined)
				{
					this.cell.playerId = undefined;
					this.cell = mCell;
					this.cell.playerId = this.playerId;
					--this.pos.y;
				}
				break;
			case 'down':
				var mCell = map.getCellAt(new Pos(this.pos.x,this.pos.y+1));
				if(mCell.playerId === undefined)
				{
					this.cell.playerId = undefined;
					this.cell = mCell;
					this.cell.playerId = this.playerId;
					++this.pos.y;
				}
				break;
			case 'left':
				var mCell = map.getCellAt(new Pos(this.pos.x-1,this.pos.y));
				if(mCell.playerId === undefined)
				{
					this.cell.playerId = undefined;
					this.cell = mCell;
					this.cell.playerId = this.playerId;
					--this.pos.x;
				}
				break;
			case 'right':
				var mCell = map.getCellAt(new Pos(this.pos.x+1,this.pos.y));
				if(mCell.playerId === undefined)
				{
					this.cell.playerId = undefined;
					this.cell = mCell;
					this.cell.playerId = this.playerId;
					++this.pos.x;
				}
				break;
		}
		//camera.center(this.vPos,this.cell.edge);
	}
}
gameObjects[camera._id] = camera;
gameObjects[map._id] = map; //Add map to engine
var player = new Player(0,0);
gameObjects[player._id] = player; //Add player to engine
