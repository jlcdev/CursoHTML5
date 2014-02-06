
var key_attack_lock = false;
key_attack_lock_cooldown = 100;
//var keyW = util.getKeyCode('w');
var keyA = util.getKeyCode('a');
var keyD = util.getKeyCode('d');
//var keyS = util.getKeyCode('s');
var keySpace = util.getKeyCode(' ');

var background = new GameObject();

var offsetY = 0;

//ctxBuffer.globalAlpha = 0.5;

background.render = function (ctx)
{
	offsetY += 10;
	offsetY %= 256;
	ctx.drawImage(this.finalRender,0,-(256-offsetY));
};

var player = new GameObject();
player.coord = new CoordXY(midWidth-50,canvas.height-150);
player.imgs = ['player.png','playerLeft.png','playerRight.png'];
player.speed = 20;
player.currentSprite = 0;
player.logic = function (dt)
{
	if(keys[keyA])//LEFT direction
	{
		this.currentSprite = 1;
		this.coord.x -= this.speed;
	}
	if(keys[keyD])//RIGHT direction
	{
		this.currentSprite = 2;
		this.coord.x += this.speed;
	}
	if(keys[keySpace] && !key_attack_lock)
	{
		key_attack_lock = !key_attack_lock;
		var bullet = new GameObject();
		bullet.speed = 1000;
		if(this.currentSprite === 0) bullet.coord = new CoordXY(this.coord.x+90,this.coord.y-5);
		else if(this.currentSprite === 1) bullet.coord = new CoordXY(this.coord.x+85,this.coord.y-5);
		else bullet.coord = new CoordXY(this.coord.x+85,this.coord.y-5);
		//bullet.coord = new CoordXY(this.coord.x+90,this.coord.y-5);
		bullet.logic = function (dt)
		{
			this.coord.y -= this.speed*dt;
			if(bullet.coord.y < -20) gameManager.deleteGameObject(bullet._id);
		}
		bullet.render = function (ctx)
		{
			Eximo.drawSprite('laserRed.png',ctx,this.coord.x,this.coord.y);
		}
		var bullet2 = new GameObject();
		bullet2.speed = 1000;
		if(this.currentSprite === 0) bullet2.coord = new CoordXY(this.coord.x,this.coord.y-5);
		else if(this.currentSprite === 1) bullet2.coord = new CoordXY(this.coord.x-5,this.coord.y-5);
		else bullet2.coord = new CoordXY(this.coord.x,this.coord.y-5);
		bullet2.logic = function (dt)
		{
			this.coord.y -= this.speed*dt;
			if(bullet2.coord.y < -20) gameManager.deleteGameObject(bullet2._id);
		}
		bullet2.render = function (ctx)
		{
			Eximo.drawSprite('laserRed.png',ctx,this.coord.x,this.coord.y);
		}
		gameManager.addGameObject(bullet);
		gameManager.addGameObject(bullet2);
		setTimeout(function(){key_attack_lock = false;},key_attack_lock_cooldown);
	}
	if(!keys[keyA] && !keys[keyD])// Restore img
	{
		this.currentSprite = 0;
	}
};
player.render = function (ctx)
{
	Eximo.drawSprite(this.imgs[this.currentSprite],ctx,this.coord.x,this.coord.y);
	Eximo.drawSprite('jetFlame1.png',ctx,this.coord.x+43,this.coord.y+75);
};

function setInitialConfigs()
{
	background.buffer = (function()
	{
		var tmpCanvas = document.createElement('canvas');
		tmpCanvas.width = Eximo.sprites['starBackground.png'].sourceSize.w;
		tmpCanvas.height = Eximo.sprites['starBackground.png'].sourceSize.h;
		var tmpCtx = tmpCanvas.getContext('2d');
		Eximo.drawSprite('starBackground.png',tmpCtx,0,0);
		return tmpCanvas;
	})();
	background.finalRender = (function()
	{
		var tmpCanvas = document.createElement('canvas');
		tmpCanvas.width = canvas.width;
		tmpCanvas.height = canvas.height+256;
		var tmpCtx = tmpCanvas.getContext('2d');
		var pattern = tmpCtx.createPattern(background.buffer,'repeat'); // Create a pattern with this image, and set it to "repeat".
    	tmpCtx.fillStyle = pattern;
    	tmpCtx.fillRect(0,0,canvas.width,canvas.height+256);
		return tmpCanvas;
	})();
	gameManager.addGameObject(background);
	gameManager.addGameObject(player);
}
window.addEventListener('resize',function (e)
{
	player.coord = new CoordXY(midWidth-50,canvas.height-200);
	background.finalRender = (function()
	{
		var tmpCanvas = document.createElement('canvas');
		tmpCanvas.width = canvas.width;
		tmpCanvas.height = canvas.height;
		var tmpCtx = tmpCanvas.getContext('2d');
		var pattern = tmpCtx.createPattern(background.buffer,'repeat'); // Create a pattern with this image, and set it to "repeat".
    	tmpCtx.fillStyle = pattern;
    	tmpCtx.fillRect(0,0,canvas.width,canvas.height);
		return tmpCanvas;
	})();
	background.render(ctxBuffer);
	frontUpdate();
});

Eximo.loadSpriteSheets(['assets.json'],function()
{
	setInitialConfigs();
	gameManager.gameInit(); //init engine
});