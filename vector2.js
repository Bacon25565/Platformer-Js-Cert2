Vector2.prototype.setPos = function(x, y)
{
	this.xPos = x;
	this.yPos = y;
}

Vector2.prototype.normalize = function()
{
	xPos = xPos / math.sqrt((xPos * xPos) + (yPos * yPos));
	yPos = yPos / math.sqrt((xPos * xPos) + (yPos * yPos));
}

Vector2.prototype.add = function(x2, y2)
{
	xPos = xPos + x2
	yPos = yPos + y2
}

Vector2.prototype.subtract = function(x2, y2)
{
	xPos = xPos - x2
	yPos = yPos - y2
}

Vector2.prototype.multiplyScalar = function(num)
{
	xPos = xPos * num;
	yPos = yPos * num;
}