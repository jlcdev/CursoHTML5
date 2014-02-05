function Pos(x,y)
{
  this.x = x;
  this.y = y;
}
Pos.prototype =
{
	getIndex: function ()
	{
		return this.x+'x'+this.y;
	},
	toString: function ()
	{
		return this.getIndex();
	},
	clone: function ()
	{
		return new Pos(this.x,this.y);
	}
}

module.exports = Pos;