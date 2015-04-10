var LEFT = 0;
var RIGHT = 1;
var ANIM_IDLE_LEFT = 0;
var ANIM_JUMP_LEFT = 1;
var ANIM_WALK_LEFT = 2;
var ANIM_IDLE_RIGHT = 3;
var ANIM_JUMP_RIGHT = 4;
var ANIM_WALK_RIGHT = 5;
var ANIM_CLIMB = 6;
var ANIM_SHOOT_LEFT = 7;
var ANIM_SHOOT_RIGHT = 8;
var ANIM_MAX = 9;

var Player = function() 
{
	this.sprite = new Sprite("ChuckNorris.png");
	this.sprite.buildAnimation(12, 8, 165, 126, 0.10, [0, 1, 2, 3, 4, 5, 6, 7]);//idle left
	this.sprite.buildAnimation(12, 8, 165, 126, 0.05, [8, 9, 10, 11, 12]);// LEFT_JUMP
	this.sprite.buildAnimation(12, 8, 165, 126, 0.05, [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26]);//LEFT_WALK
	this.sprite.buildAnimation(12, 8, 165, 126, 0.10, [52, 53, 54, 55, 56, 57, 58, 59]);//RIGHT IDLE
	this.sprite.buildAnimation(12, 8, 165, 126, 0.05, [60, 61, 62, 63, 64]);//RIGHT JUMP
	this.sprite.buildAnimation(12, 8, 165, 126, 0.05, [65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78]);//RIGHT WALK
	this.sprite.buildAnimation(12, 8, 165, 126, 0.05, [42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 51]);//climb
	this.sprite.buildAnimation(12, 8, 165, 126, 0.05, [28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40]);//shoot left
	this.sprite.buildAnimation(12, 8, 165, 126, 0.05, [79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91]);//shoot right
	
	this.startPos = new Vector2();
	this.startPos.set(15*TILE, 45 * TILE);
	
	this.position = new Vector2();
	this.position.set(this.startPos.xPos, this.startPos.yPos);
	
	this.width = 165;
	this.height = 100;
	
	for(var i=0; i<ANIM_MAX; i++)
	{
		this.sprite.setAnimationOffset(i, -this.width/2, -this.height/2);
	}
	
	this.velocity = new Vector2();
	this.speed = 5;
	
	this.dirX = 0;
	this.dirY = 0;
	this.angularVelocity = 0;
	
	this.rotation = Math.PI;
	this.direction = LEFT;
	
	this.jumping = false;
	this.falling = false;
	this.isDead = false;
	
	this.score = 0;
	this.lives = 5;
	this.time = 0;
	this.win = false;
	
	this.bulletTimer = 0;
	
	this.bullets = [];
	
};

Player.prototype.update = function(deltaTime)
{
	if(!(this.isDead || this.win))
	{
		this.sprite.update(deltaTime);
		
		this.time += deltaTime;
		this.bulletTimer -= deltaTime;
		
		var acceleration = new Vector2();
		var playerAccel = 5000;
		var playerDrag = 8;
		var playerGravity = TILE * 9.8 * 6;
		var jumpForce = 65000;
		
		acceleration.yPos = playerGravity;
		
		var currFrame = this.sprite.currentFrame;
		
		if(keyboard.isKeyDown(keyboard.KEY_K) == true)
		{
			player.lives = player.lives - 1;
		}
		
		if(keyboard.isKeyDown(keyboard.KEY_A) == true )
		{
			acceleration.xPos -= playerAccel;
			left = true;
			this.direction = LEFT;
			if(this.sprite.currentAnimation != ANIM_WALK_LEFT && this.jumping == false && this.falling == false)
			{
				this.sprite.setAnimation(ANIM_WALK_LEFT);
			}
		}
		else if(keyboard.isKeyDown(keyboard.KEY_SPACE) == true)
		{
			if ( this.bulletTimer < 0 )
			{
				this.bullets.push(new Bullet(this));
				this.bulletTimer = 0.05;
			}
			if(this.direction == LEFT)
			{  
				if(this.sprite.currentAnimation != ANIM_SHOOT_LEFT)
				{
					this.sprite.setAnimation(ANIM_SHOOT_LEFT);
				}	
			} 
			else
			{
				if(this.sprite.currentAnimation != ANIM_SHOOT_RIGHT)
				{
					this.sprite.setAnimation(ANIM_SHOOT_RIGHT);
				}	
			}
		}
		else if(keyboard.isKeyDown(keyboard.KEY_D) == true)
		{
			acceleration.xPos += playerAccel;
			right = true;
			this.direction = RIGHT;
			if(this.sprite.currentAnimation != ANIM_WALK_RIGHT && this.jumping == false && this.falling == false)
			{
				this.sprite.setAnimation(ANIM_WALK_RIGHT);
			}
		}
		else
		{
			if(this.jumping == false && this.falling == false)
			{
				if(this.direction == LEFT)
				{
					if(this.sprite.currentAnimation != ANIM_IDLE_LEFT)
					this.sprite.setAnimation(ANIM_IDLE_LEFT);
				}
				else
				{
					if(this.sprite.currentAnimation != ANIM_IDLE_RIGHT)
					this.sprite.setAnimation(ANIM_IDLE_RIGHT);
				}
			}
		}
		
		if(this.jumping || this.falling )
		{
			if(this.direction == LEFT)
			{
				if(this.sprite.currentAnimation != ANIM_JUMP_LEFT)
				this.sprite.setAnimation(ANIM_JUMP_LEFT);
			}
			else
			{
				if(this.sprite.currentAnimation != ANIM_JUMP_RIGHT)
				this.sprite.setAnimation(ANIM_JUMP_RIGHT);
			}
		}
		
		if ( this.velocity.y > 0 )
		{
			this.falling = true;
		}
		else
		{
			this.falling = false;
		}
		
		if ( keyboard.isKeyDown(keyboard.KEY_W) && !this.jumping && !this.falling )
		{
			acceleration.yPos -= jumpForce;
			this.jumping = true;
			if(this.direction == LEFT)
			{
				this.sprite.setAnimation(ANIM_JUMP_LEFT)
			}
			else
			{
				this.sprite.setAnimation(ANIM_JUMP_RIGHT)
			}
		}
		
		var dragVector = this.velocity.multiplyScalar(playerDrag);
		dragVector.yPos = 0;
		acceleration = acceleration.subtract(dragVector.xPos, dragVector.yPos);

		var v_delta = acceleration.multiplyScalar(deltaTime);
		this.velocity = this.velocity.add(v_delta.xPos, v_delta.yPos);
		
		var collOffset = new Vector2();
		collOffset.set(-TILE/2, 40);
		
		var collPos = this.position.add(collOffset.xPos, collOffset.yPos);
		var tx = pixelToTile(collPos.xPos);
		var ty = pixelToTile(collPos.yPos);
		var nx = collPos.xPos % TILE;
		var ny = collPos.yPos % TILE;
		
		
		if ( cellAtTileCoord(LAYER_LADDERS, tx, ty) ||
			(cellAtTileCoord(LAYER_LADDERS, tx+1, ty) && nx) ||
			(cellAtTileCoord(LAYER_LADDERS, tx, ty+1) && ny))
		{
			if(this.sprite.currentAnimation != ANIM_CLIMB)
			{
				this.sprite.setAnimation(ANIM_CLIMB);
				if (this.sprite.animations[this.sprite.currentAnimation].length > currFrame)
					this.sprite.currentFrame = currFrame;
				else
					this.sprite.currentFrame = 0;
			}		
			if(keyboard.isKeyDown(keyboard.KEY_W))
			{
				this.velocity.yPos = -600;
			}
			else if(keyboard.isKeyDown(keyboard.KEY_S))
			{
				this.velocity.yPos = 600;
			}
			else
			{
				this.velocity.yPos = 0;
			}
		}
		
		
		
		var p_delta = this.velocity.multiplyScalar(deltaTime);
		this.position = this.position.add(p_delta.xPos, p_delta.yPos);
		
		collPos = this.position.add(collOffset.xPos, collOffset.yPos);
		tx = pixelToTile(collPos.xPos);
		ty = pixelToTile(collPos.yPos);
		nx = collPos.xPos % TILE;
		ny = collPos.yPos % TILE;
		
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
	
	
	for (var b = 0 ; b < this.bullets.length ; ++ b)
	{
		this.bullets[b].update(deltaTime);
		if (this.bullets[b].isDead)
		{
			this.bullets[b] = this.bullets[this.bullets.length-1];
			this.bullets.length -= 1;
		}
	}
}

Player.prototype.draw = function(offSetX, offSetY)
{
	this.sprite.draw(context, this.position.xPos - offSetX, this.position.yPos - offSetY);
	
	for (var b = 0 ; b < this.bullets.length ; ++ b)
	{
		this.bullets[b].draw(offSetX, offSetY);
	}
	
	//draw the FPS
	context.fillStyle = "white";
	context.font="32px Cooper Black";
	context.fillText("FPS: " + fps, 10, 35);
	
	//draw the score
	context.fillStyle = "white";
	context.font = "32px Cooper Black";
	var scoreText = "Score: " + player.score;
	context.fillText(scoreText, 10, 70);
}
