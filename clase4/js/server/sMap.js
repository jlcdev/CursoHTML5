var Pos = require('./sPos.js');
var Cell = require('./sCell.js');
var Player = require('./sPlayer.js');
//Map class
function Map()
{
	this.playerCount = 0;
	this.cells = {};
	this.respawnArea = 50;
}
Map.prototype =
{
	getCellAt: function (pos)
	{
		if(pos === undefined) return;
		var index;
		if(typeof(pos) === 'string') index = pos;
		else index = pos.getIndex();
		var cell = this.cells[index];
		if(cell === undefined)
		{
			cell = new Cell();
			this.cells[index] = cell;
		}
		return cell;
	},
	newPlayer: function (id)
	{
		if(id === undefined) return;
		var x = Math.round(Math.random()*this.respawnArea);
		var y = Math.round(Math.random()*this.respawnArea);
		var cell = this.getCellAt(new Pos(x,y))
		if(cell.player !== undefined) return this.newPlayer();
		else
		{
			++this.playerCount;
			cell.player = new Player(x,y,id,'#'+Math.floor(Math.random()*16777215).toString(16));
			return cell.player;
		}
	},
	getCellPlayer: function (id)
	{
		if(id === undefined) return;
		for(var key in this.cells)
		{
			var cell = this.cells[key];
			if(cell.player)
			{
				if(cell.player.id === id) return cell;
			}
		}
	},
	deleteCell: function(pos)
	{
		if(pos === undefined) return;
		delete this.cells[pos.getIndex()];
	}
}
module.exports = Map;