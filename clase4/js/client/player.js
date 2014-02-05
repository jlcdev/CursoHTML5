function Player(x,y,id,color)
{
	this._id = objPrototype()._id;//Engine internal id
	this.pos = new Pos(x,y);
	this.vPos = this.pos.clone();//for camera
	this.color = color;
	this.id = id //player id (from server)
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
		if(keys[83] && !key_move_blocked)
		{
			key_move_blocked = !key_move_blocked;
			server.emit('move',{direction:'down',date:+new Date()});
			setTimeout(function()
			{
				key_move_blocked = false;
			},key_cooldown);
		}
		if(keys[68] && !key_move_blocked)
		{
			key_move_blocked = !key_move_blocked;
			server.emit('move',{direction:'right',date:+new Date()});
			setTimeout(function()
			{
				key_move_blocked = false;
			},key_cooldown);
		}
		if(keys[65] && !key_move_blocked)
		{
			key_move_blocked = !key_move_blocked;
			server.emit('move',{direction:'left',date:+new Date()});
			setTimeout(function()
			{
				key_move_blocked = false;
			},key_cooldown);
		}
		if(keys[87] && !key_move_blocked)
		{
			key_move_blocked = !key_move_blocked;
			server.emit('move',{direction:'up',date:+new Date()});
			setTimeout(function()
			{
				key_move_blocked = false;
			},key_cooldown);
		}
		if(keys[32] && !key_attack_blocked)
		{
			console.log('Send attack in area.');
			key_attack_blocked = !key_attack_blocked;
			server.emit('attack');
			setTimeout(function(){key_attack_blocked = false;},key_cooldown);
		}
	},
	update: function (sPlayer)
	{
		if(sPlayer === undefined) return;
		if(sPlayer.color) this.color = sPlayer.color;
		if(sPlayer.pos)
		{
			this.pos.x = sPlayer.pos.x;
			this.pos.y = sPlayer.pos.y;
			/*
			//console.log(this.vPos);
			if(this.vPos === undefined) this.vPos = new Pos(this.pos.x,this.pos.y);
			//this.vPos = new Pos(this.pos.x,this.pos.y);*/
		}
		if(sPlayer.control) this.control = sPlayer.control;
		if(sPlayer.id) this.id = sPlayer.id;
		if(sPlayer.life) this.life = sPlayer.life;
		if(sPlayer.vision) this.vision = sPlayer.vision;
	},
	render: function (ctx)
	{
		ctx.save();
		if (this.id == server.id) camera.center(this.pos);
		ctx.translate(-camera.pos.x,-camera.pos.y);
		ctx.fillStyle = this.color;
		ctx.fillRect(this.vPos.x,this.vPos.y,50,50);
		ctx.fillStyle = 'white';
		ctx.fillRect(this.vPos.x,this.vPos.y-10,50,8);
		ctx.fillStyle = 'red';
		ctx.fillRect(this.vPos.x+1,this.vPos.y-9,(48*this.life)/100,6);
		ctx.restore();
	}
}
