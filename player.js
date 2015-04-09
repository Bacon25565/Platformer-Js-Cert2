var Player = function() 
{
	this.image = document.createElement("img");
	this.image.src = "hero.png";
	
	this.position = new Vector2();
	this.position.set(canvas.width/2, canvas.height/2);
	
	this.width = 165;
	this.height = 100;
	
	this.velocity = new Vector2();
	this.speed = 5;
	
	this.dirX = 0;
	this.dirY = 0;
	this.angularVelocity = 0;
	
	this.rotation = 0;
	
	this.jumping = false;
	this.falling = false;
};

Player.prototype.update = function(deltaTime)
{
	var acceleration = new Vector2();
	var playerAccel = 5000;
	var playerDrag = 5;
	var playerGravity = TILE * 9.8 * 6;
	var jumpForce = 65000;
	
	acceleration.yPos = playerGravity;
	
	if(keyboard.isKeyDown(keyboard.KEY_A))
	{
		acceleration.xPos -= playerAccel;
	}
	if(keyboard.isKeyDown(keyboard.KEY_D))
	{
		acceleration.xPos += playerAccel;
	}
	if(this.velocity.yPos > 0)
	{
		this.falling = true;
	}
	else 
	{
		this.falling = false;
	}
	if(keyboard.isKeyDown(keyboard.KEY_SPACE) && !this.jumping && !this.falling)
	{
		acceleration.yPos -= jumpForce;
		this.jumping = true;
	}
	
	var dragVector = this.velocity.multiplyScalar(playerDrag);
	dragVector.yPos = 0;
	acceleration = acceleration.subtract(dragVector.xPos, dragVector.yPos);

	var v_delta = acceleration.multiplyScalar(deltaTime);
	this.velocity = this.velocity.add(v_delta.xPos, v_delta.yPos);
	
	var p_delta = this.velocity.multiplyScalar(deltaTime);
	this.position = this.position.add(p_delta.xPos, p_delta.yPos);
	
	var collOffset = new Vector2();
	collOffset.set(-TILE/2, 40);//this.height/2 - TILE);
	
	var collPos = this.position.add(collOffset.xPos, collOffset.yPos);
	
	var tx = pixelToTile(collPos.xPos);
	var ty = pixelToTile(collPos.yPos);
	var nx = collPos.xPos % TILE;
	var ny = collPos.yPos % TILE;
	
	var cell = cellAtTileCoord(LAYER_PLATFORMS, tx, ty);
	var cell_right = cellAtTileCoord(LAYER_PLATFORMS, tx + 1, ty);
	var cell_down = cellAtTileCoord(LAYER_PLATFORMS, tx, ty + 1);
	var cell_diag = cellAtTileCoord(LAYER_PLATFORMS, tx + 1, ty + 1);
	
	//actual collision
	if(this.velocity.yPos > 0)//moving down
	{
		if( (cell_down && !cell) || (cell_diag && !cell_right && nx))
		{
			this.position.yPos = tileToPixel(ty) - collOffset.yPos;
			this.velocity.yPos = 0;
			this.jumping = false;
			ny = 0;
		}
	}
	else if(this.velocity.yPos < 0)//moving up
	{
		if((cell && !cell_down) || (cell_right && !cell_diag && nx))
		{
			this.position.yPos = tileToPixel(ty + 1) - collOffset.yPos;
			this.velocity.yPos = 0;
			
			cell = cell_down;
			cell_right = cell_diag;
			cell_down = cellAtTileCoord(LAYER_PLATFORMS, tx, ty + 2);
			cell_diag = cellAtTileCoord(LAYER_PLATFORMS, tx + 1, ty + 2);
			
			ny = 0;
		}
	}
	if(this.velocity.xPos > 0)//if we are moving right
	{
		if((cell_right && !cell) || (cell_diag && !cell_down && ny))
		{
			this.position.xPos = tileToPixel(tx) - collOffset.xPos;
			this.velocity.xPos = 0;
		}
	}
	else if(this.velocity.xPos <0)//if we are moving left
	{
		if((cell && !cell_right) || (cell_down && !cell_diag && ny))
		{
			this.position.xPos = tileToPixel(tx + 1) - collOffset.xPos;
			this.velocity.xPos = 0;
		}
	}
}

Player.prototype.draw = function()
{
	context.save();
		context.translate(this.position.xPos, this.position.yPos);
		context.rotate(this.rotation);
		context.drawImage(this.image, -this.width/2, -this.height/2);
	context.restore();
}
