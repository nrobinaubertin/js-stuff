/**************************************************
** GAME ROCK CLASS
**************************************************/
var Rock = function(startX, startY) {
		this.x = startX,
		this.y = startY,
		this.moveAmount = 1;
		this.direction = Math.random()*Math.PI*2;
		this.rayon = 5;

	this.update = function(canvas) {
			this.direction += Math.random()*Math.PI/5 - Math.PI/10;
			//console.log(this.direction);
			this.x += this.moveAmount*Math.cos(this.direction);
			this.y += this.moveAmount*Math.sin(this.direction);
			//console.log(this.x, this.y);
		if(this.x > canvas.width) {
			this.x -= canvas.width;
		} else {
			if(this.x < 0) {
				this.x += canvas.width;
			}
		}
		if(this.y > canvas.height) {
			this.y -= canvas.height;
		} else {
			if(this.y < 0) {
				this.y += canvas.height;
			}
		}
	};

	this.draw = function(ctx) {
		ctx.fillStyle = "black";
		ctx.beginPath(); 
		ctx.arc(this.x,this.y,this.rayon,0,Math.PI*2);
		ctx.fill();
	};
};
