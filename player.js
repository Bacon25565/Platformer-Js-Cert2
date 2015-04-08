var Player = function() 
{
	this.image = document.createElement("img");
	this.image.src = "hero.png";
	
	this.position = new Vector2();
	this.position.set(canvas.width/2, canvas.height/2);
	
	this.width = 159;
	this.height = 163;
	
	this.velocity = new Vector2();
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
	} 

	var acceleration = new Vector2();
	var playerAccel = 5000;
	var playerDrag = 11;
	var playerGravity =0;// TILE * 9.8 * 3;
	
	acceleration.y = playerGravity;
	
	if(keyboard.isKeyDown(keyboard.KEY_A))
	{
		acceleration.xPos -= playerAccel;
	}
	if(keyboard.isKeyDown(keyboard.KEY_D))
	{
		acceleration.xPos += playerAccel;
	}
	if(keyboard.isKeyDown(keyboard.KEY_W))
	{
		acceleration.yPos -= playerAccel;
	}
	if(keyboard.isKeyDown(keyboard.KEY_S))
	{
		acceleration.yPos += playerAccel;
	}
	
	//acceleration = acceleration.subtract(this.velocity.multiplyScalar(playerDrag));
	//this.velocity.multiplyScalar(deltaTime)

	var v_delta = acceleration.multiplyScalar(deltaTime);
	this.velocity = this.velocity.add(v_delta.xPos, v_delta.yPos);
	
	var p_delta = this.velocity.multiplyScalar(deltaTime);
	this.position = this.position.add(p_delta.xPos, p_delta.yPos);
	
	var tx = pixelToTile(this.position.xPos);
	var ty = pixelToTile(this.position.yPos);
	
	var cell = cellAtTileCoord(LAYER_PLATFORMS, tx, ty);
	var cell_right = cellAtTileCoord(LAYER_PLATFORMS, tx + 1, ty);
	var cell_down = cellAtTileCoord(LAYER_PLATFORMS, tx, ty + 1);
	var cell_diag = cellAtTileCoord(LAYER_PLATFORMS, tx + 1, ty + 1);
}

Player.prototype.draw = function()
{
	context.save();
		context.translate(this.position.xPos, this.position.yPos);
		context.rotate(this.rotation);
		context.drawImage(this.image, -this.width/2, -this.height/2);
	context.restore();
}
