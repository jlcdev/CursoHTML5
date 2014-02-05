function Player(x,y,id,color)
{
	this._id = objPrototype()._id;//Engine internal id
	this.pos = new Pos(x,y);
	this.vPos = this.pos.clone();//for camera
	this.color = color;
	this.id = id //player id (from server)
	this.key_blocked = false;
	this.key_cooldown = 500;
	this.vision = 10;
	this.life = 100;
}
Player.prototype =
{
	logic: function (dt)
	{
		this.vPos.x += (this.pos.x*50-this.vPos.x)/5;
		this.vPos.y += (this.pos.y*50-this.vPos.y)/5;

		if(!this.control) return;

		if(keys[83] && !this.key_blocked)
		{
			this.key_blocked = !key_blocked;
			server.emit('move',{direction:'down',date:+new Date()});
			setTimeout(function(){this.key_blocked = false;},this.key_cooldown);
		}
		if(keys[68] && !this.key_blocked)
		{
			this.key_blocked = !key_blocked;
			server.emit('move',{direction:'right',date:+new Date()});
			setTimeout(function(){this.key_blocked = false;},this.key_cooldown);
		}
		if(keys[65] && !this.key_blocked)
		{
			this.key_blocked = !key_blocked;
			server.emit('move',{direction:'left',date:+new Date()});
			setTimeout(function(){this.key_blocked = false;},this.key_cooldown);
		}
		if(keys[87] && !this.key_blocked)
		{
			this.key_blocked = !key_blocked;
			server.emit('move',{direction:'up',date:+new Date()});
			setTimeout(function(){this.key_blocked = false;},this.key_cooldown);
		}
	},
	update: function (sPlayer)
	{
		if(sPlayer === undefined) return;
		if(sPlayer.pos)
		{
			this.pos = sPlayer.pos;
			this.vPos = this.pos.clone();
		}
		if(sPlayer.id) this.id = sPlayer.id;
		if(sPlayer.life) this.life = sPlayer.life;
		if(sPlayer.vision) this.vision = sPlayer.vision;
	},
	render: function (ctx)
	{
		ctx.save();
		if(camera !== undefined) //center player in camera
		{
			camera.center(this.pos);
			ctx.translate(-camera.pos.x,-camera.pos.y);
		}
		ctx.fillStyle = this.color;
		ctx.fillRect(this.vPos.x,this.vPos.y,50,50);
		ctx.fillStyle = 'white';
		ctx.fillRect(this.vPos.x,this.vPos.y-10,50,8);
		ctx.fillStyle = 'red';
		ctx.fillRect(this.vPos.x+1,this.vPos.y-9,(48*this.life)/100,6);
		ctx.restore();
	}
}
