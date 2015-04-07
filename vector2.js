var Vector2 = function() 
{
	this.xPos = canvas.width/2;
	this.yPos = canvas.height/2;
};

Vector2.prototype.setPos = function(x, y)
{
	this.xPos = x;
	this.yPos = y;
}

Vector2.prototype.normalize = function()
{
	var result = new Vector21;
	
	result.x = this.xPos / math.sqrt((this.xPos * this.xPos) + (this.yPos * this.yPos));
	result.y = this.yPos / math.sqrt((this.xPos * this.xPos) + (this.yPos * this.yPos));
	
	return result;
}

Vector2.prototype.add = function(x2, y2)
{
	var result = new Vector22;
	
	result.x = this.xPos + x2
	result.y = this.yPos + y2
	
	return result;
}

Vector2.prototype.subtract = function(x2, y2)
{
	var result = new Vector23;
	
	result.x = this.xPos - x2
	result.y = this.yPos - y2
	
	return result;
}

Vector2.prototype.multiplyScalar = function(num)
{
	var result = new Vector24;
	
	result.x = this.xPos * num;
	result.y = this.yPos * num;
	
	return result;
}

Vector2.prototype.length = function(x2, y2)
{
	var result = math.sqrt(this.xPos * this.xPos + this.yPos * this.yPos);
	return result;
}