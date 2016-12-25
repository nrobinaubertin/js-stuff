function dump(obj) {
	var out = '';
	for (var i in obj) {
		out += i + ": " + obj[i] + "\n";
	}
	alert(out);
};

/**************************************************
** GAME VARIABLES
**************************************************/
var canvas,			// Canvas DOM element
	ctx,			// Canvas rendering context
	keys,			// Keyboard input
	localPlayer;	// Local player


/**************************************************
** GAME INITIALISATION
**************************************************/
function init() {
    var retry = document.getElementById("retry");
    if(retry) {
        retry.parentNode.removeChild(retry);
    }
	canvas = document.getElementById("canvas");
	ctx = canvas.getContext("2d");
	window.rock = new Array();
	window.count = 0;
	window.score = 0;
	window.stop = false;
	window.low = 0;

	//canvas.width = window.innerWidth;
	//canvas.height = window.innerHeight;
	canvas.width = 300;
	canvas.height = 300;
	canvas.style.display ="block";
	canvas.style.border ="black 1px solid";

	// Initialise keyboard controls
	keys = new Keys();
	
	for(var i = 0; i < 10; i++) {
		window.rock[i] = new Rock(0,0);
	}

	window.bonus = new Bonus(0,0);

	// Initialise the local player
	localPlayer = new Player(Math.floor(canvas.width/2), Math.floor(canvas.height/2));
	
	// Start listening for events
	setEventHandlers();

    animate();
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
** GAME ANIMATION LOOP
**************************************************/
function animate() {

	setTimeout(function() {
		if(!window.stop) {
			requestAnimationFrame(animate);
			update();
			draw();
		} else {
			if(window.score > window.low) {
                document.body.innerHTML += '<button id="retry" onclick="init()">Retry</button>';
			}
		}
	}, 1000 / 50);
};


/**************************************************
** GAME UPDATE
**************************************************/
function update() {
	window.count++;
	window.score++;
	document.getElementById("score").innerHTML = "score:"+window.score;
	if( window.count > 500) {
		rock[rock.length] = new Rock(0,0);
		window.count = 0;
	}
	localPlayer.update(keys, canvas);
	window.bonus.update(canvas);
	for(var i = 0; i < rock.length; i++) {
		window.rock[i].update(canvas);
	}
};


/**************************************************
** GAME DRAW
**************************************************/
function draw() {
	// Wipe the canvas clean
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	localPlayer.draw(ctx);
	window.bonus.draw(ctx);
	for(var i = 0; i < rock.length; i++) {
		window.rock[i].draw(ctx);

	}
};
