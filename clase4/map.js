function Map()
{
	this._id = objPrototype()._id;
	this.cells = {};
}
Map.prototype.getCellAt = function (pos)
{
	var index = pos.getIndex();
	var cell = this.cells[index];
	if (cell === undefined)
	{
		cell = new Cell();
		this.cells[index] = cell;
	}
	return cell;
}
Map.prototype.render = function(ctx)
{
	ctx.save();
	ctx.translate(-camera.pos.x,-camera.pos.y);
	//ctx.globalAlpha = 0.3;
	for(var i = camera.initialX; i <= camera.endX; ++i)
	{
		for(var j = camera.initialY; j <= camera.endY; ++j)
		{
			var cell = this.getCellAt(new Pos(i,j));
			var dist = distanceBetwenPoints(player.pos,new Pos(i,j));
			dist = 1-dist/10;
			if(dist < 0) dist = 0;
			ctx.globalAlpha = dist;
			ctx.drawImage(cell.buffer,i*cell.edge,j*cell.edge);
		}
	}
	ctx.restore();
}