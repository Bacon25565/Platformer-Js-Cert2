var Player = function() 
{
	this.image = document.createElement("img");
	this.image.src = "hero.png";
	
	this.x = canvas.width/2;
	this.y = canvas.height/2;
	
	this.width = 159;
	this.height = 163;
	
	this.velocityX = 0;
	this.velocityY = 0;
	this.speed = 5;
	
	this.dirX = 0;
	this.dirY = 0;
	this.angularVelocity = 0;
	
	this.rotation = 0;
	
	this.isMoving = false;
	this.shoot = false;
	
};

Player.prototype.update = function(deltaTime)
{
	if(keyboard.isKeyDown(keyboard.KEY_SPACE))
	{
		this.shoot = true;
		this.rotation += deltaTime;
	} 
	else if (keyboard.isKeyDown(keyboard.KEY_SHIFT))
	{
		this.rotation -= deltaTime;
	}
	if (keyboard.isKeyDown(keyboard.KEY_W))
	{
		player.dirY = 1;
		player.isMoving = true;
	}
	if (event.keyCode === keyRight || event.keyCode === keyD)
	{
		player.angularVelocity = player.turnSpeed;
		player.left = true;
	}
	if (event.keyCode === keyDown || event.keyCode === keyS)
	{
		player.dirY = -0.55;
		player.isMoving = false;
	}
	if (event.keyCode === keyLeft || event.keyCode === keyA)
	{
		player.angularVelocity = -player.turnSpeed;
		player.right = true;
	}
}

Player.prototype.draw = function()
{
	context.save();
		context.translate(this.x, this.y);
		context.rotate(this.rotation);
		context.drawImage(this.image, -this.width/2, -this.height/2);
	context.restore();
}
