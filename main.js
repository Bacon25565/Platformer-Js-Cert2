var canvas = document.getElementById("gameCanvas");
var context = canvas.getContext("2d");



var startFrameMillis = Date.now();
var endFrameMillis = Date.now();

var background = document.createElement("img");
background.src = "background.png";

// This function will return the time in seconds since the function 
// was last called
// You should only call this function once per frame
function getDeltaTime()
{
	endFrameMillis = startFrameMillis;
	startFrameMillis = Date.now();

		// Find the delta time (dt) - the change in time since the last drawFrame
		// We need to modify the delta time to something we can use.
		// We want 1 to represent 1 second, so if the delta is in milliseconds
		// we divide it by 1000 (or multiply by 0.001). This will make our 
		// animations appear at the right speed, though we may need to use
		// some large values to get objects movement and rotation correct
	var deltaTime = (startFrameMillis - endFrameMillis) * 0.001;
	
		// validate that the delta is within range
	if(deltaTime > 1)
		deltaTime = 1;
		
	return deltaTime;
}

//-------------------- Don't modify anything above here

var SCREEN_WIDTH = canvas.width;
var SCREEN_HEIGHT = canvas.height;

// some variables to calculate the Frames Per Second (FPS - this tells use
// how fast our game is running, and allows us to make the game run at a 
// constant speed)
var fps = 0;
var fpsCount = 0;
var fpsTime = 0;

var deathTimer = 0;

var LAYER_COUNT = 4;
var MAP = {tw: 100, th: 50};
var TILE = 35;
var TILESET_TILE = 70;
var TILESET_PADDING = 2;
var TILESET_SPACING = 2;
var TILESET_COUNT_X = 14;
var TILESET_COUNT_Y = 14;

var LAYER_BACKGROUND = 0;
var LAYER_PLATFORMS = 1;
var LAYER_LADDERS = 2;
var LAYER_ADDINS = 3;

var tileset = document.createElement("img");
tileset.src = "tileset.png";

var player = new Player();
var keyboard = new Keyboard();
var enemy = new Enemy();

var playerX = player.xPos;
var playerY = player.yPos;
var playerRot = player.rotation;

var cells = [];

function intCollision()
{
	//loop through each layer
	for(var layerIdx = 0; layerIdx < LAYER_COUNT; ++layerIdx)
	{
		cells[layerIdx] = [];
		var idx = 0;
		
		//loop through each row
		for(var y = 0; y < level1.layers[layerIdx].width; ++y)
		{
			cells[layerIdx][y] = [];
			
			//loop through each cell
			for(var x = 0; x < level1.layers[layerIdx].width; ++x)
			{
				//if the tiles for this cell is not empty
				if(level1.layers[layerIdx].data[idx] != 0)
				{
					//set 4 cells around it to be colliders
					cells[layerIdx][y][x] = 1;
					cells[layerIdx][y][x + 1] = 1;
					cells[layerIdx][y - 1][x + 1] = 1;
					cells[layerIdx][y - 1][x] = 1;
				}
				//if the cell hasn't already been set to 1, set it to 0
				else if(cells[layerIdx][y][x] != 1)
				{
					cells[layerIdx][y][x] = 0;
				}
				++idx;
			}
		}
	}
}

function tileToPixel(tile_coord)
{
	return tile_coord * TILE;
}

function pixelToTile(pixel)
{
	return Math.floor(pixel / TILE);
}

function cellAtTileCoord(layer, tx, ty)
{
	if(tx < 0 || tx > MAP.tw || ty < 0)
	{
		return 1;
	}
	
	if(ty >= MAP.th)
	{
		return 0;
	}
	
	return cells[layer][ty][tx];
}

function cellAtPixelCoord(layer, x, y)
{
	var tx = poxelToTile(x);
	var ty = poxelToTile(y);
	
	return cellAtTileCoord(layer, tx, ty);
}

function drawMap(offSetX, offSetY)
{
	//this loops over all the layers in our tilemap
	for(var layerIdx = 0; layerIdx < LAYER_COUNT; layerIdx++)
	{
		var idx = 0;
		//render everything in the current layer (layerIdx), look at every tile in the layer in turn, and render them
		//look at each row
		for( var y = 0; y < level1.layers[layerIdx].height; ++y )
		{
			//look at each tile in the row
			for( var x = 0; x < level1.layers[layerIdx].width; ++x )
			{
				var tileIndex = level1.layers[layerIdx].data[idx] - 1;
			
				//if there's actually a tile here
				if(tileIndex != -1)
				{
					var sx = TILESET_PADDING + (tileIndex % TILESET_COUNT_X) * (TILESET_TILE + TILESET_SPACING);
					var sy = TILESET_PADDING + (Math.floor(tileIndex / TILESET_COUNT_X)) * (TILESET_TILE + TILESET_SPACING);
					var dx = x * TILE - offSetX;
					var dy = (y - 1) * TILE - offSetY;
					
					// the tiles in the Tiled map are base 1 (meaning a value of 0 means no tile), so subtract one from the tileset id to get the correct tile
					
					context.drawImage(tileset, sx, sy, TILESET_TILE, TILESET_TILE, dx, dy, TILESET_TILE, TILESET_TILE);
				}
				++idx;
				
			}
		}
	}
}

var bgMusic = new Howl(
	{
		urls:["background.ogg"], 
		loop: true, 
		buffer: true, 
		volume: 0.5
	});
bgMusic.play();
	
var stateSplash = 0;
var stateGame = 1;
var stateControls = 2;
var gameState = stateSplash;

function run()
{
	var deltaTime = getDeltaTime();
	switch(gameState)
	{
		case stateSplash:
		splashStateUpdate(deltaTime);
		break;
		
		case stateGame:
		gameStateUpdate(deltaTime);
		break;
		
		case stateControls:
		controlsStateUpdate(deltaTime);
		break;
	}
}

function splashStateUpdate(deltaTime)
{
	//resets background image by clearing previous one
	canvas.width = canvas.width;
	context.drawImage(background, 0 ,0);
	
	if(keyboard.isKeyDown(keyboard.KEY_SPACE) == true)
	{
		gameState = stateGame;
	}
	
	if(keyboard.isKeyDown(keyboard.KEY_I) == true)
	{
		gameState = stateControls;
	}
	
	//draw the win game text
	context.fillStyle = "white";
	context.font = "100px Cooper Black";
	var startText = "Chucky Kills The Bunny";
	var center = context.measureText(startText);
	context.fillText(startText, canvas.width / 2 - center.width / 2, canvas.height / 2);
	
	context.fillStyle = "white";
	context.font = "50px Cooper Black";
	var startText = "Press 'Space' To Play";
	var center = context.measureText(startText);
	context.fillText(startText, canvas.width / 2 - center.width / 2, canvas.height / 2 + 100);
	
	context.fillStyle = "white";
	context.font = "50px Cooper Black";
	var contText = "Press 'I' For Controls";
	var center = context.measureText(contText);
	context.fillText(contText, canvas.width / 2 - center.width / 2, canvas.height / 2 + 500);
}

function controlsStateUpdate(deltaTime)
{
	//resets background image by clearing previous one
	canvas.width = canvas.width;
	context.drawImage(background, 0 ,0);
	
	//draw the control text
	context.fillStyle = "#DC143C";
	context.font = "100px Cooper Black";
	var startText = "Controls";
	var center = context.measureText(startText);
	context.fillText(startText, canvas.width / 2 - center.width / 2, 100);
	
	context.fillStyle = "#DC143C";
	context.font = "50px Cooper Black";
	var contText = "W = Jump";
	var center = context.measureText(contText);
	context.fillText(contText, canvas.width / 2 - center.width / 2, 200);
	
	context.fillStyle = "#DC143C";
	context.font = "50px Cooper Black";
	var contText = "A = Left";
	var center = context.measureText(contText);
	context.fillText(contText, canvas.width / 2 - center.width / 2, 300);
	
	context.fillStyle = "#DC143C";
	context.font = "50px Cooper Black";
	var contText = "D = Right";
	var center = context.measureText(contText);
	context.fillText(contText, canvas.width / 2 - center.width / 2, 400);
	
	context.fillStyle = "#DC143C";
	context.font = "50px Cooper Black";
	var contText = "K = Suicide";
	var center = context.measureText(contText);
	context.fillText(contText, canvas.width / 2 - center.width / 2, 500);
	
	context.fillStyle = "#DC143C";
	context.font = "50px Cooper Black";
	var contText = "'Space' = Shoot";
	var center = context.measureText(contText);
	context.fillText(contText, canvas.width / 2 - center.width / 2, 600);
	
	context.fillStyle = "#DC143C";
	context.font = "50px Cooper Black";
	var contText = "Press 'I' To Go Back Or Press 'Space' To Play";
	var center = context.measureText(contText);
	context.fillText(contText, canvas.width / 2 - center.width / 2, canvas.height / 2 + 500);
	
	if(keyboard.isKeyDown(keyboard.KEY_I) == true)
	{
		gameState = stateSplash;
	}
	
	if(keyboard.isKeyDown(keyboard.KEY_SPACE) == true)
	{
		gameState = stateGame;
	}
}

function gameStateUpdate(deltaTime)
{
	if(deltaTime > 0.03)
	{
		deltaTime = 0.03;
	}
	
	
	
	var xScroll = player.position.xPos -  canvas.width/2;
	var yScroll = player.position.yPos - canvas.height/2;
	
	if(xScroll < 0)
	{
		xScroll = 0;
	}
	if(xScroll > MAP.tw * TILE - canvas.width)
	{
		xScroll = MAP.tw * TILE - canvas.width;
	}
	if(yScroll < 0)
	{
		yScroll = 0;
	}
	if(yScroll > MAP.th * TILE - canvas.height)
	{
		yScroll = MAP.th * TILE - canvas.height;
	}
	
	drawMap(xScroll, yScroll);
	context.fillStyle = "#000000";		
	
		context.save();
		context.fillStyle = "black";
		context.fillRect(0, 0, 260, 180);
	
	if(player.win == true)
	{
		deathTimer += deltaTime;
		
		if (deathTimer > 6 )
		{
			deathTimer = 0;
			player.lives = 5;
			player.position.set(player.startPos.xPos, player.startPos.yPos);
			player.score = player.score - 10;
			player.win = false;
		}
		
	}
	
	//door detection
	if((player.position.xPos >= canvas.width / 2 + 615 && player.position.xPos <= canvas.width / 2 + 715 + 70) && (player.position.yPos >= 28 && player.position.yPos <= 28 + 110))
	{
		player.win = true;
		
		//draw the win game text
		context.fillStyle = "black";
		context.font = "100px Cooper Black";
		var winText = "You Win!";
		var center = context.measureText(winText);
		context.fillText(winText, canvas.width / 2 - center.width / 2, canvas.height / 2);
		
		context.fillStyle = "black";
		context.font = "50px Cooper Black";
		var scoreText = "Your Score Was: " + player.score;
		var center = context.measureText(scoreText);
		context.fillText(scoreText, canvas.width / 2 - center.width / 2, canvas.height / 2 + 100);
		
		context.fillStyle = "black";
		context.font = "50px Cooper Black";
		var endText = "Respawn in - " + Math.floor(7 - deathTimer);
		var center = context.measureText(endText);
		context.fillText(endText, canvas.width / 2 - center.width / 2, canvas.height / 2 + 150);
	}
	

	player.update(deltaTime);
	player.draw(xScroll, yScroll);
	
	enemy.update(deltaTime);
	enemy.draw(xScroll, yScroll);
	
	// update the frame counter 
	fpsTime += deltaTime;
	fpsCount++;
	if(fpsTime >= 1)
	{
		fpsTime -= 1;
		fps = fpsCount;
		fpsCount = 0;
	}		
	
	if(player.lives <= 0)
	{
		player.isDead = true;
		deathTimer += deltaTime;
		
		if (deathTimer > 6 )
		{
			deathTimer = 0;
			player.lives = 5;
			player.position.set(player.startPos.xPos, player.startPos.yPos);
			player.score = player.score - 10;
			player.isDead = false;
		}
		
	}
	
	if (player.lives <= 0)
	{
		//draw the end game text
		context.fillStyle = "black";
		context.font = "100px Cooper Black";
		var endText = "Game Over";
		var center = context.measureText(endText);
		context.fillText(endText, canvas.width / 2 - center.width / 2, canvas.height / 2);
		
		context.fillStyle = "black";
		context.font = "50px Cooper Black";
		var endText = "Respawn in - " + Math.floor(7 - deathTimer);
		var center = context.measureText(endText);
		context.fillText(endText, canvas.width / 2 - center.width / 2, canvas.height / 2 + 100);
	}
	
	//draw the timer
	context.fillStyle = "white";
	context.font = "32px Cooper Black";
	var timerText = "Time: " + Math.floor(player.time);
	context.fillText(timerText, 10, 110);
	
	//draw the lives
	for(var i = 0; i < player.lives; i++)
	{
		var heart = document.createElement("img");
		heart.src = "Heart.png";
		context.drawImage(heart, 10 + ((heart.width + 20) * i), 120, 50, 50);
	}
}

intCollision();

//------------------------------------------------------------- Don't modify anything below here ------------------------------------------------------------------------

// This code will set up the framework so that the 'run' function is called 60 times per second.
// We have a some options to fall back on in case the browser doesn't support our preferred method.
(function() {
  var onEachFrame;
  if (window.requestAnimationFrame) {
    onEachFrame = function(cb) {
      var _cb = function() { cb(); window.requestAnimationFrame(_cb); }
      _cb();
    };
  } else if (window.mozRequestAnimationFrame) {
    onEachFrame = function(cb) {
      var _cb = function() { cb(); window.mozRequestAnimationFrame(_cb); }
      _cb();
    };
  } else {
    onEachFrame = function(cb) {
      setInterval(cb, 1000 / 60);
    }
  }
  
  window.onEachFrame = onEachFrame;
})();

window.onEachFrame(run);
