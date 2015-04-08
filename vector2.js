var Vector2 = function() 
{
	this.xPos =0;
	this.yPos =0;
};

Vector2.prototype.set = function(x, y)
{
	this.xPos = x;
	this.yPos = y;
}

Vector2.prototype.normalize = function()
{
	var result = new Vector2();
	
	result.xPos = this.xPos / math.sqrt((this.xPos * this.xPos) + (this.yPos * this.yPos));
	result.yPos = this.yPos / math.sqrt((this.xPos * this.xPos) + (this.yPos * this.yPos));
	
	return result;
}

Vector2.prototype.add = function(x2, y2)
{
	var result = new Vector2();
	
	result.xPos = this.xPos + x2;
	result.yPos = this.yPos + y2;
	
	return result;
}

Vector2.prototype.subtract = function(x2, y2)
{
	var result = new Vector2();
	
	result.xPos = this.xPos - x2
	result.yPos = this.yPos - y2
	
	return result;
}

Vector2.prototype.multiplyScalar = function(num)
{
	var result = new Vector2();
	
	result.xPos = this.xPos * num;
	result.yPos = this.yPos * num;
	
	return result;
}

Vector2.prototype.length = function(x2, y2)
{
	var result = math.sqrt(this.xPos * this.xPos + this.yPos * this.yPos);
	return result;
}