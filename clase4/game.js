var map = new Map();
gameObjects[map._id] = map; //Add map to engine

var key_blocked = false;
var key_cooldown = 200;

function Player(x,y)
{
	this._id = objPrototype()._id;
	this.pos = new Pos(x,y);
	this.vPos = this.pos.clone();
	this.playerId = genId();
	this.cell = map.getCellAt(this.pos);
	this.cell.playerId = this.playerId;
	this.color = 'blue';
	camera.center(this.vPos,this.cell.edge);
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

var player = new Player(0,0);
gameObjects[player._id] = player;
