/**************************************************
** GAME SPACESHIP CLASS
**************************************************/
var Spaceship = function(startX, startY) {
		this.x = startX;
		this.y = startY;
		this.vectorX = 0; //Math.random()*2+0.1;
		this.vectorY = 0; //Math.random()*2+0.1;
		this.direction = -Math.PI/2;
		this.factor = 0.05;
		this.rayon = 10;
		this.fuel = 450;
		this.localHeight = 0;
		this.landed = true;

	this.update = function(keys, canvas) {
	

		// spaceship too far away
		if(this.x < -50 || this.x > canvas.width+50 || this.y < -50) {
			document.getElementById("outcome").innerHTML = "LOST";
			document.getElementById("score").innerHTML = "score:0";
			stop = true;
		}


		// verify collision
		for(i = 0; i < land.length; i+=2) {
			if(land[i] > this.x) {
				break;
			}
		}
		this.localHeight = (land[i+1]-land[i-1]) / (land[i]-land[i-2]) * (this.x-land[i-2]) + land[i-1];
		//console.log(localHeight);

		//console.log(this.localHeight, this.y+this.rayon-3);
		if(this.localHeight < this.y+this.rayon-3) {
			var sx = Math.abs(Math.floor(this.vectorX*100)/100);
			var sy = Math.abs(Math.floor(this.vectorY*100)/100);
			var sc = Math.floor(this.fuel*(1-sx)*(1-sy));
			if(this.vectorY < 0.8 && this.vectorX < 0.5) {
				if(this.x > canvas.width-30 && this.x < canvas.width+50) {
					stop = true;
					this.landed = true;
					document.getElementById("outcome").innerHTML = "SUCCESS"+" speed X:"+sx+" Y:"+sy;
					document.getElementById("score").innerHTML = "score:"+sc;
					score = sc;
				} else {
					this.vectorY = 0;
					this.vectorX = 0;
					this.landed = true;
				}
			} else {
				stop = true;
				document.getElementById("outcome").innerHTML = "FAIL"+" speed X:"+sx+" Y:"+sy;
				document.getElementById("score").innerHTML = "score:0";
			}
		} else {
			this.landed = false;
		}

		if(!this.landed) {
			for(i = 0; i < sky.length; i+=2) {
				if(sky[i] > this.x) {
					break;
				}
			}
			this.localHeight = (sky[i+1]-sky[i-1]) / (sky[i]-sky[i-2]) * (this.x-sky[i-2]) + sky[i-1];
			if(this.localHeight > this.y-this.rayon-3) {
				stop = true;
				document.getElementById("outcome").innerHTML = "FAIL";;
				document.getElementById("score").innerHTML = "score:0";
			}
		}



		// Up key takes priority over down
		if (keys.up && this.fuel > 0) {
			this.vectorX += this.factor*Math.cos(this.direction);
			this.vectorY += this.factor*Math.sin(this.direction);
			this.fuel--;
		} 
		//else if (keys.down) {
			//this.vectorX -= this.factor*Math.cos(this.direction);
			//this.vectorY -= this.factor*Math.sin(this.direction);
		//};
		if(this.vectorX > 30) {
			this.vectorX = 30;
		} else {
			if(this.vectorX < -30) {
				this.vectorX = -30;
			}
		}
		if(this.vectorY > 30) {
			this.vectorY = 30;
		} else {
			if(this.vectorY < -30) {
				this.vectorY = -30;
			}
		}
		
		// gravity
		if(!this.landed) {
			this.vectorY += 0.015;
		}

		// Left key takes priority over right
		if (keys.left) {
			this.direction -= Math.PI/24;
		} else if (keys.right) {
			this.direction += Math.PI/24;
		};

		this.x += this.vectorX;
		this.y += this.vectorY;
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

		if(stop && !this.landed) {
			ctx.fillStyle = "gold";
			ctx.beginPath(); 
			ctx.arc(this.x,this.y,12,0,Math.PI*2);
			ctx.fill();
		}

		//ctx.fillStyle = "red";
		//ctx.beginPath(); 
		//ctx.arc(this.x,this.localHeight,2,0,Math.PI*2);
		//ctx.fill();


	};
};
