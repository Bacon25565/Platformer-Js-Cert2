var Bullet = function()
{
	this.image = document.createElement("img");
	this.image.src = "plasmabullet.png"
	
	this.xPos = player.x;
	this.yPos = player.y;
	this.rotation = player.rotation;
	
	this.width = 65;
	this.height = 8;
	
	this.velocityX = 0;
	this.velocityY = 0;
	this.speed = 5;
}

Bullet.prototype.draw = function()
{
	bullet.rotation = player.rotation + Math.PI / 2;
	
	context.save();
		context.translate(this.xPos, this.yPos);
		context.rotate(this.rotation);
		context.drawImage(this.image, -this.width/2, -this.height/2)
	context.restore();
}

Bullet.prototype.update = function(deltaTime)
{
	this.xPos += this.speed;
}