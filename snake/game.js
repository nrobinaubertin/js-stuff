
/**************************************************
 ** UTILITY FUNCTION
 **************************************************/

function snakeReverse(arr) {
	var newArr = [];
	for(i=0; i < arr.length; i += 3) {
		var d = arr[arr.length-i-1];
		d += 2;
		if(d > 3) {
			d -= 4;
		}
		var y = arr[arr.length-i-2];
		var x = arr[arr.length-i-3];
		newArr.push(x,y,d);
	}
	return newArr;
}

/**************************************************
 ** GAME INITIALISATION
 **************************************************/

function init() {
    window.canvas = document.getElementById("gameCanvas");
    window.ctx = canvas.getContext("2d");
    canvas.width = 300;
    canvas.height = 300;
    canvas.style.border = "black 1px solid";
    canvas.style.display = "block";

    window.count = 0;
    window.score = 0;
    window.stop = false;
    window.lastTime = Date.now();

    // Initialise keyboard controls
    window.keys = new Keys();

    // Initialise the local player
    window.player = new Player(3, 3);

    window.pill = new Pill();

    // Start listening for events
    setEventHandlers();

    var retry = document.getElementById("retry");
    if(retry) {
        retry.parentNode.removeChild(retry);
    }
	main();
}

/**************************************************
 ** MAIN GAME LOOP
 **************************************************/
function main() {
	var now = Date.now();
	var dt = (now - lastTime) / 1000.0;

	if(!stop) {
		update(dt);
		draw();

		lastTime = now;
		requestAnimFrame(main);
	} else {
        document.body.innerHTML += '<button id="retry" onclick="init()">Retry</button>';
	}
}

/**************************************************
 ** GAME UPDATE
 **************************************************/
function update() {
	document.getElementById("score").innerHTML = "score:"+score;
	player.update(keys, canvas);
};

/**************************************************
 ** GAME DRAW
 **************************************************/
function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	player.draw(ctx);
	pill.draw(ctx);
};
/**************************************************
 ** GAME EVENT HANDLERS
 **************************************************/
var setEventHandlers = function() {
	// Keyboard
	window.addEventListener("keydown", onKeydown, false);
	window.addEventListener("keyup", onKeyup, false);

	// Window resize
	//window.addEventListener("resize", onResize, false);
};

// Keyboard key down
function onKeydown(e) {
	keys.onKeyDown(e);
};

// Keyboard key up
function onKeyup(e) {
	keys.onKeyUp(e);
};

// Browser window resize
function onResize(e) {
	// Maximise the canvas
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
};

/**************************************************
 ** REQUEST ANIMATION FRAME
 **************************************************/
// A cross-browser requestAnimationFrame
var requestAnimFrame = (function(){
		return window.requestAnimationFrame       ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame    ||
		window.oRequestAnimationFrame      ||
		window.msRequestAnimationFrame     ||
		function(callback){
		window.setTimeout(callback, 1000 / 60);
    };
})();

