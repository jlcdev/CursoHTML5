//Object declaration
function createCube()
{
	var cube = objPrototype();
	cube.x = Math.random()*canvas.width;
	cube.y = Math.random()*canvas.height;
	cube.v = Math.random()*(2000+1000)+1000;
	cube.size = Math.random()*100;
	cube.logic = function(dt)
	{
		/*
		var desp = this.v*dt;
		if(keys[40]) this.y += desp; //DOWN arrow
		if(keys[39]) this.x += desp; //RIGHT arrow
		if(keys[37]) this.x -= desp; //LEFT arrow
		if(keys[38]) this.y -= desp; //UP arrow
		*/
	};
	cube.render = function(ctx)
	{
		ctx.fillRect(this.x,this.y,this.size,this.size);
	};
	return cube;
}

for(var i = 0; i < 100; ++i)
{
	var cube = createCube();
	gameObjects[cube._id] = cube;
}

var camera = objPrototype();
camera.x = canvas.width/2;
camera.y = canvas.height/2;
camera.v = 100;

//MAPA de casillas
//Clase llamada celda o cell

