var Enemy = function() 
{
	this.image = document.createElement("img");
	this.image.src = "enemy_1.png";
	
	this.width = 62.83;
	this.height = 50.67;
	
	this.position = new Vector2();
	
	this.position.set(1000, 1625);
	this.velocity = new Vector2();
	
	
	this.direction = RIGHT;
};

Enemy.prototype.update = function(deltaTime)
{
	var acceleration = new Vector2();
	var enemyAccel = 2000;
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
	
	var v_delta = acceleration.multiplyScalar(deltaTime);
	this.velocity = this.velocity.add(v_delta.xPos, v_delta.yPos);
	
	var p_delta = this.velocity.multiplyScalar(deltaTime);
	this.position = this.position.add(p_delta.xPos, p_delta.yPos);
	
	var collOffset = new Vector2();
	collOffset.set(-TILE/2, 40);
	
	var collPos = this.position.add(collOffset.xPos, collOffset.yPos);
	var tx = pixelToTile(this.position.xPos);
	var ty = pixelToTile(this.position.yPos);
	var nx = collPos.xPos % TILE;
	var ny = collPos.yPos % TILE;
	
	var cell = cellAtTileCoord(LAYER_PLATFORMS, tx, ty);
	var cell_right = cellAtTileCoord(LAYER_PLATFORMS, tx + 1, ty);
	var cell_down = cellAtTileCoord(LAYER_PLATFORMS, tx, ty + 1);
	var cell_diag = cellAtTileCoord(LAYER_PLATFORMS, tx + 1, ty + 1);
	
	//walk along a platform
	
	//if the enemy runs into a wall. or is about for a fall off the platform, we will have him turn around
	if(this.direction == RIGHT)
	{
		if(!cell && (cell_right && nx))
		{
			this.direction = LEFT;
		}
		if(cell_down && (!cell_diag && nx))
		{
			this.direction = LEFT;
		}
	}
	else
	{
		if(cell && (!cell_right && nx))
		{
			this.direction = RIGHT;
		}
		else
		{
			if(!cell_down && (cell_diag && nx))
			{
				this.direction = RIGHT;
			}
		}
	}
}

Enemy.prototype.draw = function(offSetX, offSetY)
{
		context.drawImage(this.image, this.position.xPos - offSetX, this.position.yPos - offSetY, this.width, this.height)
}