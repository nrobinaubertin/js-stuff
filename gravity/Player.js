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
	this.base = 50;


	this.update = function(keys, canvas) {
		if(keys.enter) {
			//this.length++;
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
			if (keys.up && this.direction != 3) {
				this.direction = 1;
				flag = 1;
			} 
			if (flag == 0 && keys.down && this.direction != 1) {
				this.direction = 3;
				flag = 1;
			}
			if (flag == 0 && keys.left && this.direction != 0) {
				this.direction = 2;
				flag = 1;
			}
			if (flag == 0 && keys.right && this.direction != 2) {
				this.direction = 0;
				flag = 1;
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
					case 0:
						this.speed = 20;
						this.hidden = false;
						this.length += 3;
						score++;
						break;
					case 1:
						this.speed = 33;
						this.hidden = false;
						this.length += 3;
						score++;
						break;
					case 2:
						this.speed = 10;
						this.hidden = false;
						this.length += 3;
						score++;
						break;
					case 3:
						this.hidden = true;
						this.speed = 20;
						this.length += 3;
						score++;
						break;
					case 4:
						this.hidden = false;
						this.speed = 20;
						this.length += 10;
						score += 3;
						break;
					case 5:
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
						console.log(this.history);
						this.history = snakeReverse(this.history);
						console.log(this.history);
						break;
					case 6:
						this.hidden = false;
						this.speed = 20;
						this.length += 3;
						score++;;
						this.base--;
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
