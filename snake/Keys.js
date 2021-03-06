/**************************************************
** GAME KEYBOARD CLASS
**************************************************/
var Keys = function(up, left, right, down, enter) {
	var up = up || false,
		left = left || false,
		right = right || false,
		down = down || false;
		enter = enter || false;
		
	var onKeyDown = function(e) {
		var that = this,
		c = e.keyCode;
		this.left = this.up = this.right = this.down = false;
			switch (c) {
				// Controls
				case 37: // Left
					that.left = true;
					break;
				case 38: // Up
					that.up = true;
					break;
				case 39: // Right
					that.right = true;
					break;
				case 40: // Down
					that.down = true;
					break;
				case 13: // Enter
					that.enter = true;
					break
			};
	};
	
	var onKeyUp = function(e) {
		var that = this,
			c = e.keyCode;
		switch (c) {
			case 37: // Left
				that.left = false;
				break;
			case 38: // Up
				that.up = false;
				break;
			case 39: // Right
				that.right = false;
				break;
			case 40: // Down
				that.down = false;
				break;
			case 13: // Enter
				that.enter = false;
				break
		};
	};

	return {
		up: up,
		left: left,
		right: right,
		down: down,
		onKeyDown: onKeyDown,
		onKeyUp: onKeyUp
	};
};
