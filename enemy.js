var Enemy = function() 
{
	this.image = document.createElement("img");
	this.image.src = "enemy_1.png";
	
	this.width = 62.83;
	this.height = 50.67;
	
	this.position = new Vector2();
	this.velocity = new Vector2();
	
	this.direction = RIGHT;
};

Enemy.prototype.update = function(deltaTime)
{
	var acceleration = new Vector2();
	var enemyAccel = 4000;
	var enemyDrag = 10;
	
	if(this.direction == RIGHT)
	{
		acceleration.xPos = enemyAccel;
	}
	else
	{
		acceleration.xPos = -enemyAccel;
	}
	
	var dragX = this.velocity.xPos * enemyDrag;
	acceleration.xPos -= dragX;
	this.velocity = this.velocity.add(acceleration.multiplyScalar(deltaTime));
	this.velocity = this.position.add(this.velocity.multiplyScalar(deltaTime));
}

Enemy.prototype.draw = function(offSetX, offSetY)
{
		context.drawImage(this.image, this.position.xPos - offSetX, this.position.yPos - offSetY, this.width, this.height)
}