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
			if(dist > 8) ctx.globalAlpha = 0;
			else if(dist > 7 && dist <= 8) ctx.globalAlpha = 0.3;
			else if(dist > 4 && dist <= 7) ctx.globalAlpha = 0.5;
			else ctx.globalAlpha = 1-dist/10;
			ctx.drawImage(cell.buffer,i*cell.edge,j*cell.edge);
		}
	}
	ctx.restore();
}