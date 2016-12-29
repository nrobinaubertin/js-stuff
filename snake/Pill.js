/**************************************************
** GAME PILL CLASS
**************************************************/
var Pill = function() {

    this.x = Math.floor(Math.random()*(canvas.height/6-1))*6+6;
    this.y = Math.floor(Math.random()*(canvas.width/6-1))*6+6;
    if(Math.random() < 0.7) {
        this.type = Math.floor(Math.random()*5);
    } else {
        this.type = 0;
    }

	this.draw = function(ctx) {
		switch (this.type) {
			case 0:
				ctx.fillStyle = "black";
				break;
			case 1:
				ctx.fillStyle = "red";
				break;
			case 2:
				ctx.fillStyle = "yellow";
				break;
			case 3:
				ctx.fillStyle = "purple";
				break;
			case 4:
				ctx.fillStyle = "blue";
				break;
		};
		x1 = this.x - 6;
		y1 = this.y - 6; 
		x2 = this.x + 6;
		y2 = this.y + 6; 
		ctx.beginPath(); 
		ctx.moveTo(x1,y1);
		ctx.lineTo(x1,y2);
		ctx.lineTo(x2,y2);
		ctx.lineTo(x2,y1);
		ctx.fill();
	};
};
