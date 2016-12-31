/**************************************************
 ** UTILITY FUNCTION
 **************************************************/

function loadFile(file) {
	var xhr = new XMLHttpRequest();
	xhr.open('GET', file);
	xhr.onreadystatechange = function() { 
		if (xhr.readyState == 4 && xhr.status == 200) { 
			data = JSON.parse(xhr.responseText);
			for(var i = 0; i < Math.min(10,data.length); i++) {
				var text = data[i].pseudo + ":" + data[i].points;
				document.getElementById('highScores').innerHTML += '<span>' + text + '</span><br/>'; 
			}
			window.low = data[i-1].points;
		}
	};
	xhr.send(null);

};
function sendFile(file, pseudo, points) {
	var xhr = new XMLHttpRequest();
	xhr.open('POST', file);
	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhr.send('pseudo=' + pseudo + '&points=' + points);
}

/**************************************************
 ** GAME INITIALISATION
 **************************************************/

function init() {
    // Create the canvas
    window.canvas = document.getElementById("canvas");
    window.ctx = canvas.getContext("2d");
    canvas.width = 600;
    canvas.height = 300;
    canvas.style.border = "black 1px solid";
    canvas.style.display = "block";

    window.count = 0;
    window.score = 0;
    window.stop = false;

    // Initialise keyboard controls
    window.keys = new Keys();

    // Initialise the local player
    window.ship = new Spaceship(15, canvas.height-15);

    // initialisation of the land.
    window.land = [];
    land.push(0);
    land.push(canvas.height-10);
    land.push(30);
    land.push(canvas.height-10);

    land.push(canvas.width/4);
    land.push(50);
    land.push(canvas.width/2);
    land.push(canvas.height-10);
    land.push(canvas.width/4*3);
    land.push(50);


    land.push(canvas.width-30);
    land.push(canvas.height-10);
    land.push(canvas.width);
    land.push(canvas.height-10);

    // initialisation of the sky
    window.sky = [];
    sky.push(0);
    sky.push(-90);

    sky.push(canvas.width/2-17);
    sky.push(-90);
    sky.push(canvas.width/2);
    sky.push(canvas.height-150);
    sky.push(canvas.width/2+17);
    sky.push(-90);

    sky.push(canvas.width);
    sky.push(-90);

    // Start listening for events
    setEventHandlers();

	window.lastTime = Date.now();
    document.getElementById("outcome").innerHTML = "";
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
	document.getElementById("fuel").innerHTML = "fuel:"+ship.fuel;
	ship.update(keys, canvas);
};

/**************************************************
 ** GAME DRAW
 **************************************************/

function drawLand() {
		ctx.fillStyle = "black";
		ctx.beginPath(); 
		ctx.moveTo(land[0],land[1]);
		for(i=2;i<land.length;i+=2) {
			ctx.lineTo(land[i],land[i+1]);
			//console.log(land[i],land[i+1]);
		}
		ctx.stroke();
}
function drawSky() {
		ctx.fillStyle = "black";
		ctx.beginPath(); 
		ctx.moveTo(sky[0],sky[1]);
		for(i=2;i<sky.length;i+=2) {
			ctx.lineTo(sky[i],sky[i+1]);
		}
		ctx.stroke();
}

function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ship.draw(ctx);
	drawLand();
	drawSky();
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
//function onResize(e) {
//	// Maximise the canvas
//	canvas.width = window.innerWidth;
//	canvas.height = window.innerHeight;
//};

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

/**************************************************
 ** GAME INITIALISATION
 **************************************************/

