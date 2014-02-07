
var key_attack_lock = false;
key_attack_lock_cooldown = 100;


var keyA = util.getKeyCode('a');
var keyD = util.getKeyCode('d');
/*
var keyW = util.getKeyCode('w');
var keyS = util.getKeyCode('s');
*/
var keyP = util.getKeyCode('p');
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

var collision = {};

var player = new GameObject();
player.coord = new CoordXY(midWidth,canvas.height-100);
player.imgs = ['player.png','playerLeft.png','playerRight.png'];
player.hspeed = 30;
//player.vspeed = 5;
player.life = 3;
player.shield = false;
player.currentSprite = 0;
player.radius = 40;

function clearShield()
{
	player.shield = false;
}
function activateShield()
{
	player.shield = true;
	setTimeout(clearShield,5000);
}
player.logic = function (dt)
{
	//check colisions with other objects
	if(!this.shield)
	{
		for(var c in collision)
		{
			var coordOBJ = collision[c].coord;
			var dist = util.distance(new CoordXY(this.coord.x+25,this.coord.y),new CoordXY(coordOBJ.x,coordOBJ.y));
			if(dist < this.radius+collision[c].radius)
			{
				activateShield();
				--this.life;
				if(this.life < 0) this.life = 0;
				delete collision[c];
				gameManager.deleteGameObject(c);
				break;
			}
		}
	}
	/*
	if(keys[keyW])//UP direction
	{
		this.coord.y -= this.vspeed;
		if(this.coord.y < 0) this.coord.y = 0;
	}
	if(keys[keyS])//DOWN direction
	{
		this.coord.y += this.vspeed;
		if(this.coord.y > canvas.height-100) this.coord.y = canvas.height-100;
	}
	*/
	if(keys[keyA])//LEFT direction
	{
		this.currentSprite = 1;
		this.coord.x -= this.hspeed;
		if(this.coord.x < 50) this.coord.x = 50
	}
	if(keys[keyD])//RIGHT direction
	{
		this.currentSprite = 2;
		this.coord.x += this.hspeed;
		if(this.coord.x > canvas.width-100) this.coord.x = canvas.width-100;
	}
	if(keys[keySpace] && !key_attack_lock)
	{
		key_attack_lock = !key_attack_lock;
		var bullet = new GameObject();
		bullet.speed = 2000;
		bullet.radius = 3;
		bullet.explosion = false;
		if(this.currentSprite === 0) bullet.coord = new CoordXY(this.coord.x+40,this.coord.y-55);
		else if(this.currentSprite === 1) bullet.coord = new CoordXY(this.coord.x+30,this.coord.y-55);
		else bullet.coord = new CoordXY(this.coord.x+30,this.coord.y-55);
		//bullet.coord = new CoordXY(this.coord.x+90,this.coord.y-5);
		bullet.logic = function (dt)
		{
			for(var c in collision) //Check colisions
			{
				var coordOBJ = collision[c].coord;
				var dist = util.distance(new CoordXY(this.coord.x+25,this.coord.y),new CoordXY(coordOBJ.x,coordOBJ.y));
				if(dist < this.radius+collision[c].radius)
				{
					//Explosion
					this.explosion = true;
					delete collision[c];
					gameManager.deleteGameObject(c);
					break;
				}
			}
			this.coord.y -= this.speed*dt;
			if(bullet.coord.y < -20) gameManager.deleteGameObject(bullet._id);
		}
		bullet.render = function (ctx)
		{
			if(this.explosion) Eximo.drawSprite('laserGreenShot.png',ctxBuffer,this.coord.x,this.coord.y);
			else Eximo.drawSprite('laserGreen.png',ctx,this.coord.x,this.coord.y);
		}
		var bullet2 = new GameObject();
		bullet2.speed = 2000;
		bullet2.radius = 3;
		bullet2.explosion = false;
		if(this.currentSprite === 0) bullet2.coord = new CoordXY(this.coord.x-50,this.coord.y-55);
		else if(this.currentSprite === 1) bullet2.coord = new CoordXY(this.coord.x-50,this.coord.y-55);
		else bullet2.coord = new CoordXY(this.coord.x-50,this.coord.y-55);
		bullet2.logic = function (dt)
		{
			for(var c in collision) //Check colisions
			{
				var coordOBJ = collision[c].coord;
				var dist = util.distance(new CoordXY(this.coord.x+25,this.coord.y),new CoordXY(coordOBJ.x,coordOBJ.y));
				if(dist < this.radius+collision[c].radius)
				{
					//Explosion
					this.explosion = true;
					delete collision[c];
					gameManager.deleteGameObject(c);
					break;
				}
			}
			this.coord.y -= this.speed*dt;
			if(bullet2.coord.y < -20) gameManager.deleteGameObject(bullet2._id);
		}
		bullet2.render = function (ctx)
		{
			if(this.explosion) Eximo.drawSprite('laserGreenShot.png',ctxBuffer,this.coord.x,this.coord.y);
			else Eximo.drawSprite('laserGreen.png',ctx,this.coord.x,this.coord.y);
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
	//draw spaceship
	Eximo.drawSprite(this.imgs[this.currentSprite],ctx,this.coord.x-50,this.coord.y-50);
	if(this.shield === true) Eximo.drawSprite('shield.png',ctx,this.coord.x-77,this.coord.y-90);

	//jetflame 1
	if(this.currentSprite === 0) Eximo.drawSprite('jetFlame1.png',ctx,util.randomRange(this.coord.x-10,this.coord.x-4),this.coord.y+25);
	else if(this.currentSprite === 1) Eximo.drawSprite('jetFlame1.png',ctx,util.randomRange(this.coord.x-15,this.coord.x-10),this.coord.y+25);
	else Eximo.drawSprite('jetFlame1.png',ctx,util.randomRange(this.coord.x-15,this.coord.x-10),this.coord.y+25);
	//jetflame 2
	if(this.currentSprite === 0) Eximo.drawSprite('jetFlame2.png',ctx,util.randomRange(this.coord.x-10,this.coord.x-4),this.coord.y+37);
	else if(this.currentSprite === 1) Eximo.drawSprite('jetFlame2.png',ctx,util.randomRange(this.coord.x-15,this.coord.x-10),this.coord.y+37);
	else Eximo.drawSprite('jetFlame2.png',ctx,util.randomRange(this.coord.x-15,this.coord.x-10),this.coord.y+37);
	//draw player life
	for(var i = 0; i < this.life; ++i)
	{
		Eximo.drawSprite('life.png',ctx,30+45*i,canvas.height-50);
	}
	/*
	ctx.save();
	ctx.globalAlpha = 0.2;
	ctx.beginPath();
	ctx.arc(this.coord.x,this.coord.y,this.radius,0,2*Math.PI,false);
	ctx.fillStyle = 'green';
	ctx.fill();
	ctx.lineWidth = 5;
	ctx.strokeStyle = '#003300';
	ctx.stroke();
	ctx.restore();
	*/
};

var meteorInt;

function launchMeteor()
{
	clearInterval(meteor); //Clear old interval
	if(gameManager.active){
	var meteor = new GameObject();
	meteor.coord = new CoordXY(util.randomRange(0,canvas.width),util.randomRange(-200,0));
	meteor.vspeed = util.randomRange(5,15);
	meteor.rotationSpeed = util.randomRange(50,500);
	meteor.angle = util.randomRange(0,360);
	meteor.dirX = util.generateRandom1orMin1();
	meteor.type = util.generateRandom01();
	meteor.radius = (meteor.type === 0)?20:80;
	//console.log(meteor.radius);
	meteor.logic = function (dt)
	{
		this.coord.y += this.vspeed;
		this.angle += this.rotationSpeed*dt*this.dirX;
		if(this.coord.y > canvas.height+50)
		{
			gameManager.deleteGameObject(this._id);
			delete collision[this._id];
		}
	};
	meteor.render = function (ctx)
	{
		ctx.save();
		ctx.translate(this.coord.x,this.coord.y);
		ctx.rotate(util.toRadian(this.angle));
		ctx.translate( -this.coord.x, -this.coord.y);
		if(this.type === 0) Eximo.drawSprite('meteorSmall.png',ctx,this.coord.x-25,this.coord.y-25);
		else Eximo.drawSprite('meteorBig.png',ctx,this.coord.x-70,this.coord.y-50);
		ctx.restore();
		/*
		ctx.save();
		ctx.globalAlpha = 0.2;
		ctx.beginPath();
		
		if(this.type === 0) ctx.arc(this.coord.x, this.coord.y,this.radius,0,2*Math.PI,false);
		else ctx.arc(this.coord.x, this.coord.y,this.radius,0,2*Math.PI,false);
		ctx.fillStyle = 'green';
		ctx.fill();
		ctx.lineWidth = 5;
		ctx.strokeStyle = '#003300';
		ctx.stroke();
		ctx.restore();
		*/
	};
	collision[meteor._id] = meteor;
	gameManager.addGameObject(meteor);
	}
	meteorInt = setTimeout(launchMeteor,util.generateRandomWithMax(1000)); //Prepare new meteor
}

var enemyInt;
var keys_block = {};

function launchEnemy()
{
	clearInterval(enemyInt);
	var enemy = new GameObject();
	enemy.coord = new CoordXY(util.randomRange(0,canvas.width),util.randomRange(-200,0));
	enemy.vspeed = util.randomRange(3,8);
	enemy.hspeed = util.randomRange(5,30);
	enemy.radius = 60;
	enemy.canShoot = true;
	enemy.cooldown = util.randomRange(50,100);
	enemy.logic = function(dt)
	{
		if(!this.canShoot && util.generateRandom01() === 0)
		{
			keys_block[enemy._id] = enemy;
			this.canShoot = false;
			this.cooldown = true;
			var bullet = new GameObject();
			bullet.vspeed = 2000;
			bullet.radius = 3;
			bullet.logic = function(dt)
			{
				this.coord.y += this.vspeed*dt;
				if(bullet2.coord.y < -20) gameManager.deleteGameObject(bullet2._id);
			};
			bullet.render = function(ctx)
			{
				Eximo.drawSprite('laserRed.png',ctx,this.coord.x,this.coord.y);
			};
			setTimeout(function(){keys_block[enemy._id].canShoot = false;},keys_block[enemy._id].cooldown);
		}
	};
	enemy.render = function(ctx)
	{
		Eximo.drawSprite('enemyShip.png',ctx,this.coord.x,this.coord.y);
	};

	enemyInt = setTimeout(launchEnemy,util.generateRandomWithMax(10000)); //Prepare new Enemy
}



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
    	tmpCtx.fillRect(0,0,canvas.width,canvas.height+512);
		return tmpCanvas;
	})();
	gameManager.addGameObject(background);
	gameManager.addGameObject(player);
	meteorInt = setTimeout(launchMeteor,util.generateRandomWithMax(5000));
	enemyInt = setTimeout(launchEnemy,util.generateRandomWithMax(5000));
}

/*
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
*/

Eximo.loadSpriteSheets(['assets.json'],function()
{
	setInitialConfigs();
	gameManager.gameInit(); //init engine
});