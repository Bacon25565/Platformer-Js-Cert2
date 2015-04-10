var Bullet = function(player)
{
	this.image = document.createElement("img");
	this.image.src = "bullet.png"
	
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

Bullet.prototype.draw = function(offSetX, offSetY)
{
	context.drawImage(this.image, this.xPos - offSetX, this.yPos-offSetY);

}

Bullet.prototype.update = function(deltaTime)
{
	this.xPos += this.speed;
	
	if (this.xPos < 0 || this.xPos > MAP.tw * TILE )
	{
		this.isDead = true;
	}
}