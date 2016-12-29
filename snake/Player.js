/**************************************************
 ** GAME PLAYER CLASS
 **************************************************/
var Player = function(startX, startY) {
	this.x = startX;
	this.y = startY;
	this.direction = 0;
	this.length = 15;
	this.history = [startX, startY, this.direction];
	this.lastMove = Date.now();
	this.speed = 20;
	this.hidden = false;
	this.pause = false;
    // base speed
	this.base = 50;


	this.update = function(keys, canvas) {
		if(keys.enter) {
			if(!this.pause) {
				this.pause = true;
			} else {
				this.pause = false;
			}
			keys.enter = false;
		}
		if((Date.now() - this.lastMove > (this.base-this.speed)) && !this.pause) {
			// Up key takes priority over down
			var flag = 0;
            var previous = this.direction;
			if (keys.up && previous != 3) {
				this.direction = 1;
				flag = 1;
			} 
			if (flag == 0 && keys.down && previous != 1) {
				this.direction = 3;
				flag = 1;
			}
			if (flag == 0 && keys.left && previous != 0) {
				this.direction = 2;
				flag = 1;
			}
			if (flag == 0 && keys.right && previous != 2) {
				this.direction = 0;
				flag = 1;
			}
            if(this.dizzy && flag == 1 && this.direction != previous) {
                this.direction = (this.direction + 2) % 4;
            }
			switch (this.direction) {
				case 0:
					this.x += 6;
					break;
				case 1:
					this.y -= 6;
					break;
				case 2:
					this.x -= 6;
					break;
				case 3:
					this.y += 6;
					break;
			};
			for(i=0;i<this.length; i++) {
				if(this.history[i*3] == this.x) {
					if(this.history[i*3+1] == this.y) {
						stop = true;
					}
				}
			}
			if((this.x >= pill.x-6 && this.x <= pill.x+6 && this.y >= pill.y-6 && this.y <= pill.y+6)) {
				switch (pill.type) {
                    // black : nothing special
					case 0:
                        this.dizzy = false;
						this.speed = 20;
						this.hidden = false;
						this.length += 3;
						score++;
						break;
                    // red : high speed
					case 1:
                        this.dizzy = false;
						this.speed = 34;
						this.hidden = false;
						this.length += 3;
						score++;
						break;
                    // yellow : dizzy
					case 2:
                        this.dizzy = true;
						this.speed = 20;
						this.hidden = false;
						this.length += 3;
						score++;
						break;
                    // purple : invisible
					case 3:
                        this.dizzy = false;
						this.hidden = true;
						this.speed = 20;
						this.length += 3;
						score++;
						break;
                    // blue : reverse snake
					case 4:
                        this.dizzy = false;
						this.hidden = false;
						this.speed = 20;
						this.length += 3;
						score++;
						this.x = this.history[0];
						this.y = this.history[1];
						this.direction = this.history[2];
						this.direction += 2;
						if(this.direction > 3) {
							this.direction -= 4;
						}
						this.history = snakeReverse(this.history);
						break;
				};
				pill = new Pill();
			}

			if(this.x > canvas.width) {
				this.x = 3;
			} else {
				if(this.x < 0) {
					this.x = canvas.width-3;
				}
			}
			if(this.y > canvas.height) {
				this.y = 3;
			} else {
				if(this.y < 0) {
					this.y = canvas.height-3;
				}
			}
			this.history.push(this.x,this.y,this.direction);	
			if(this.history.length > this.length*3) {
				this.history.shift();
				this.history.shift();
				this.history.shift();
			}
			this.lastMove = Date.now();
		}
	};

	this.draw = function(ctx) {

		if(!this.hidden) {
			for(i = 0; i < this.length; i++) {
				ctx.fillStyle = "black";
				x1 = this.history[i*3] - 3;
				y1 = this.history[i*3+1] - 3; 
				x2 = this.history[i*3] + 3;
				y2 = this.history[i*3+1] + 3; 
				ctx.beginPath(); 
				ctx.moveTo(x1,y1);
				ctx.lineTo(x1,y2);
				ctx.lineTo(x2,y2);
				ctx.lineTo(x2,y1);
				ctx.fill();
			}
		} else {
			ctx.fillStyle = "black";
			x1 = this.x - 3;
			y1 = this.y - 3; 
			x2 = this.x + 3;
			y2 = this.y + 3; 
			ctx.beginPath(); 
			ctx.moveTo(x1,y1);
			ctx.lineTo(x1,y2);
			ctx.lineTo(x2,y2);
			ctx.lineTo(x2,y1);
			ctx.fill();
		}
	};
};
