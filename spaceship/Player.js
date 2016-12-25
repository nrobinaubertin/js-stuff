/**************************************************
** GAME PLAYER CLASS
**************************************************/
var Player = function(startX, startY) {
		this.x = startX;
		this.y = startY;
		this.vectorX = 0;
		this.vectorY = 0;
		this.direction = 0;
		this.factor = 0.5;
		this.rayon = 10;

	this.collide = function(r) {
		if( ((this.x-r.x)*(this.x-r.x) + (this.y-r.y)*(this.y-r.y)) < (r.rayon+Math.floor(this.rayon/2))*(r.rayon+Math.floor(this.rayon/2)) ) {
			return true;
		}
		return false;
	}
	this.update = function(keys, canvas) {
		for(var i = 0; i < rock.length; i++) {
			if(this.collide(window.rock[i])) {
				window.stop = true;
			}
		}
			if(this.collide(window.bonus)) {
				window.score += 500;
				window.bonus = new Bonus(0,0);
			}
		// Up key takes priority over down
		if (keys.up) {
			this.vectorX += this.factor*Math.cos(this.direction);
			this.vectorY += this.factor*Math.sin(this.direction);
		} else if (keys.down) {
			this.vectorX -= this.factor*Math.cos(this.direction);
			this.vectorY -= this.factor*Math.sin(this.direction);
		};
		if(this.vectorX > 12) {
			this.vectorX = 12;
		} else {
			if(this.vectorX < -12) {
				this.vectorX = -12;
			}
		}
		if(this.vectorY > 12) {
			this.vectorY = 12;
		} else {
			if(this.vectorY < -12) {
				this.vectorY = -12;
			}
		}

		// Left key takes priority over right
		if (keys.left) {
			this.direction -= Math.PI/18;
		} else if (keys.right) {
			this.direction += Math.PI/18;
		};

		this.x += this.vectorX;
		this.y += this.vectorY;

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

		ctx.fillStyle = "blue";
		x1 = this.x + this.rayon*Math.cos(this.direction); 
		y1 = this.y + this.rayon*Math.sin(this.direction); 
		x2 = this.x + this.rayon*Math.cos(Math.PI/3*2+this.direction); 
		y2 = this.y + this.rayon*Math.sin(Math.PI/3*2+this.direction); 
		x3 = this.x + this.rayon*Math.cos(Math.PI/3*4+this.direction); 
		y3 = this.y + this.rayon*Math.sin(Math.PI/3*4+this.direction); 
		ctx.beginPath(); 
		ctx.moveTo(x1,y1);
		ctx.lineTo(x2,y2);
		ctx.lineTo(x3,y3);
		ctx.fill();

		ctx.fillStyle = "red";
		x1 = this.x + (this.rayon+3)*Math.cos(this.direction); 
		y1 = this.y + (this.rayon+3)*Math.sin(this.direction); 
		x2 = this.x + (this.rayon-5)*Math.cos(Math.PI/3*2+this.direction); 
		y2 = this.y + (this.rayon-5)*Math.sin(Math.PI/3*2+this.direction); 
		x3 = this.x + (this.rayon-5)*Math.cos(Math.PI/3*4+this.direction); 
		y3 = this.y + (this.rayon-5)*Math.sin(Math.PI/3*4+this.direction); 
		ctx.beginPath(); 
		ctx.moveTo(x1,y1);
		ctx.lineTo(x2,y2);
		ctx.lineTo(x3,y3);
		ctx.fill();
	};
};
