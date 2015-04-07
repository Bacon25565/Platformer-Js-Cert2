var Enemy = function() 
{
	this.image = document.createElement("img");
	this.image.src = "enemy.png";
	
	this.xPos = canvas.width/2;
	this.yPos = canvas.height/2;
	
	this.width = 62.83;
	this.height = 50.67;
	
	this.velocityX = 0;
	this.velocityY = 0;
	this.speed = 5;
	
	this.angularVelocity = 0;
	
	this.rotation = 0;
	
};

Enemy.prototype.draw = function()
{
	context.save();
		context.translate(this.x, this.y);
		context.rotate(this.rotation);
		context.drawImage(this.image, -this.width/2, -this.height/2)
	context.restore();
}

Enemy.prototype.update = function(deltaTime)
{
	if(keyboard.isKeyDown(keyboard.KEY_SPACE))
	{
		this.rotation += deltaTime;
	}
	else
	{
		this.rotation -= deltaTime;
	}
	
}