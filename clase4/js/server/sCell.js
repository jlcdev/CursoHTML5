function Cell()
{
	this.edge = 50;
	this.newColor();//generate color
}
Cell.prototype =
{
	newColor: function()
	{
		var opt = ['#57C75C','#47C24E','#3BB042','#3AA437'];
		this.color = opt[Math.floor(Math.random()*opt.length)];
	}
}
module.exports = Cell;