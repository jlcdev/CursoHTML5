function Cell()
{
	this.playerId = undefined;
	this.colors = ['#57C75C','#47C24E','#3BB042','#3AA437'];
	this.color = this.colors[Math.floor(Math.random()*this.colors.length)];
	this.edge = 50;
	this.newBuffer();
}
Cell.prototype.newBuffer = function ()
{
	var temp = document.createElement('canvas');
	temp.width = this.edge;
	temp.height = this.edge;
	var ctxTemp = temp.getContext('2d');
	ctxTemp.fillStyle = this.color;
	ctxTemp.fillRect(0,0,this.edge,this.edge);
	this.buffer = temp;
}