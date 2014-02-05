var Pos = require('./sPos.js');
function Player(x,y,id,color)
{
	this.pos = new Pos(x,y);
	this.color = color;
	this.id = id
	this.life = 100;
	this.vision = 10;
}
Player.prototype =
{
	update: function (sPlayer)
	{
		if(sPlayer === undefined) return;
		if(sPlayer.pos) this.pos = sPlayer.pos;
		if(sPlayer.id) this.id = sPlayer.id;
		if(sPlayer.life) this.life = sPlayer.life;
		if(sPlayer.vision) this.vision = sPlayer.vision;
	}
}
module.exports = Player