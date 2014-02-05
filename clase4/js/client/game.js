


var map = new Map();
var key_move_blocked = false;
var key_attack_blocked = false;
var key_cooldown = 500;
/*ADD SOUND USING HOWLER*//*
var sound = new Howl({
	urls: ['http://s1download-universal-soundbank.com/mp3/sounds/829.mp3'],
	autoplay: true,
	loop: true,
	volume: 0.6
});*/

function Camera()
{
  this._id = objPrototype()._id;
  this.pos = new Pos(midCanvasWidth,midCanvasHeight);
  this.v = 1500;
  //this.active = false;
  this.initialX = Math.floor((this.pos.x - midCanvasWidth)/50);
  this.initialY = Math.floor((this.pos.y - midCanvasHeight)/50);
  this.endX = Math.floor((this.pos.x + canvas.width)/50);
  this.endY = Math.floor((this.pos.y + canvas.height)/50);
}
Camera.prototype =
{
  logic: function(dt)
  {
  	/*
    if(this.active)
    {
      var desp = this.v*dt;
      if(keys[40]) this.pos.y += desp;//DOWN arrow
      if(keys[39]) this.pos.x += desp; //RIGHT arrow
      if(keys[37]) this.pos.x -= desp; //LEFT arrow
      if(keys[38]) this.pos.y -= desp; //UP arrow
    }
    */
    this.initialX = Math.floor((this.pos.x - midCanvasWidth)/50);
    this.initialY = Math.floor((this.pos.y - midCanvasHeight)/50);
    this.endX = Math.floor((this.pos.x + canvas.width)/50);
    this.endY = Math.floor((this.pos.y + canvas.height)/50);
  },
  center: function (pos)
  {
    this.pos = new Pos(pos.x*50-midCanvasWidth,pos.y*50-midCanvasHeight);
  },/*
  render: function (ctx)
  {
  	if(this.active) ctx.translate(-this.pos.x,-this.pos.y);
  },
  changeStatus: function()
  {
    this.active = !this.active;
  }*/
};

var camera = new Camera(); //Create camera


gameObjects[camera._id] = camera;
gameObjects[map._id] = map; //Add map to engine
 //Add player to engine


function Manager()
{
	this._id = objPrototype()._id;
	this.my_player_id;
	this.players = {};
}
Manager.prototype =
{
	setPlayerId: function (id)
	{
		console.log('manager setPlayerId');
		if(id === undefined) return;
		this.my_player_id = id;
	},
	add: function (player)
	{
		if(player === undefined) return;
		var tmp = new Player(player.pos.x,player.pos.y,player.id,player.color);
		tmp.control = (player.id !== this.my_player_id)?false:true;
		this.players[tmp.id] = tmp;
	},
	update: function (player)
	{
		var tmp = this.players[player.id];
		if(tmp === undefined) return;
		tmp.update(player);
	},
	logic: function (dt)
	{
		for(var key in this.players)
		{
			//console.log(player);
			this.players[key].logic(dt);
		}
	},
	render: function (ctx)
	{
		for(var key in this.players)
		{
			this.players[key].render(ctx);
		}
	},
	deletePlayer: function (id)
	{
		console.log('manager deletePlayer');
		delete this.players[id];
	}
}

var manager = new Manager();



/*SOCKET IO CONNECTION*/
var dir = 'http://localhost:4242';
var server = io.connect(dir);

server.on('connect',function ()
{
	console.log('connected');
	server.emit('newPlayer');
	server.id = server.socket.sessionid;
});

server.on('setPlayer',function (player)
{
	if(player === undefined) return;
	manager.my_player_id = player.id;
	manager.add(player);
});

server.on('addPlayer',function (player)
{
	if(player === undefined) return;
	console.log('addPlayer launched');
	manager.add(player);
});

server.on('playerUpdate',function (player)
{
	if(player === undefined) return;
	manager.update(player);
});

server.on('exit',function (id)
{
	if(id === undefined) return;
	console.log('exit launched');
	manager.deletePlayer(id);
});

gameObjects[manager._id] = manager;
















