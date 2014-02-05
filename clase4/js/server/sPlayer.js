var Pos = require('sPos');
function Player(x,y,id,color)
{
	this.pos = new Pos(x,y);
	this.color = color;
	this.id = id
	this.life = 100;
	this.vision = 10;
}
module.exports = Player