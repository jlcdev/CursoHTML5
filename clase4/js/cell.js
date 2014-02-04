function Cell()
{
	this.playerId = undefined;
	this.edge = 50;
	this.newColor();//generate color
	this.newBuffer();//Precalculate canvas draw
}
Cell.prototype =
{
	newColor: function()
	{
		var opt = ['#57C75C','#47C24E','#3BB042','#3AA437'];
		this.color = opt[Math.floor(Math.random()*opt.length)];
	},
	newBuffer: function()
	{
		var temp = document.createElement('canvas');
		temp.width = this.edge;
		temp.height = this.edge;
		var ctxTemp = temp.getContext('2d');
		ctxTemp.fillStyle = this.color;
		ctxTemp.fillRect(0,0,this.edge,this.edge);
		this.buffer = temp;
	}
}