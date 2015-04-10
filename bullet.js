var Bullet = function(player)
{
	this.image = document.createElement("img");
	this.image.src = "plasmabullet.png"
	
	this.xPos = player.position.xPos;
	this.yPos = player.position.yPos;
	
	this.width = 65;
	this.height = 8;
	
	if ( player.direction == RIGHT )
		this.speed = 25;
	else
		this.speed = -25;
	
	
	this.isDead = false;
}

Bullet.prototype.draw = function()
{
	context.save();
		context.translate(this.xPos, this.yPos);
		context.rotate(this.rotation);
		context.drawImage(this.image, -this.width/2, -this.height/2)
	context.restore();
}

Bullet.prototype.update = function(deltaTime)
{
	this.xPos += this.speed;
	
	if (this.xPos < 0 || this.xPos > canvas.width )
	{
		this.isDead = true;
	}
}