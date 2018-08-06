imagesPool = [
	"http://i.imgur.com/XT0XGxw.jpg",
	"http://i.imgur.com/Ss0savf.jpg",
	"http://i.imgur.com/SVsENoS.jpg",
	"http://i.imgur.com/vRlLmiV.jpg",
	"http://i.imgur.com/c39ARnF.jpg",
	"http://i.imgur.com/9P3gqDJ.jpg",
	"http://i.imgur.com/EkjpI7B.jpg",
	"http://i.imgur.com/LDS1ceI.jpg",
	"http://i.imgur.com/KVWkusr.jpg",
	"http://i.imgur.com/Lotps1v.jpg",
	"http://i.imgur.com/MkoS7VY.jpg",
	"http://i.imgur.com/4M1AjOF.jpg",
	"http://i.imgur.com/0pU5sVL.jpg",
	"http://i.imgur.com/0fS64wa.jpg",
	"http://i.imgur.com/E0KbyiN.jpg",
	"http://i.imgur.com/ZSMfkLu.jpg",
	"http://i.imgur.com/382ReEY.jpg",
	"http://i.imgur.com/g6qBov8.jpg",
	"http://i.imgur.com/RvrXUgT.jpg",
	"http://i.imgur.com/BhbgJjn.jpg",
	"http://i.imgur.com/PIigKeQ.jpg",
	"http://i.imgur.com/qyrjLqy.jpg",
	"http://i.imgur.com/IX9YUcq.jpg",
	"http://i.imgur.com/Y7icJAN.jpg",
	"http://i.imgur.com/8p6P3gN.jpg",
	"http://i.imgur.com/bAglKHW.jpg",
	"http://i.imgur.com/vkUNuCx.jpg",
	"http://i.imgur.com/VG0nBdD.jpg",
	"http://i.imgur.com/mecau7B.jpg",
	"http://i.imgur.com/4d1D7u0.jpg",
	"http://i.imgur.com/vNIMDeo.jpg",
	"http://i.imgur.com/f2j3uZi.jpg",
	"http://i.imgur.com/c755wCC.jpg",
	"http://i.imgur.com/EPrNTyP.jpg",
	"http://i.imgur.com/EDtEKAk.jpg",
	"http://i.imgur.com/BYTGSmO.jpg",
	"http://i.imgur.com/s6ZFp10.jpg",
	"http://i.imgur.com/fx5bAuE.png"
];

cardsLoaded = 0;
cardsFlipped = 0;
flippedURL = "";
flippedCard = null;
pair = null;
gameStarted = false;
startTime = 0;
numberOfPairFlipped = 0;
numberOfPairs = 0;

function shuffle(array) {
	var counter = array.length;

	// While there are elements in the array
	while (counter > 0) {
		// Pick a random index
		var index = Math.floor(Math.random() * counter);
		// Decrease counter by 1
		counter--;
		// And swap the last element with it
		var temp = array[counter];
		array[counter] = array[index];
		array[index] = temp;
	}
	return array;
}

function launchGame() {
	cardsLoaded++;
	if(cardsLoaded == document.getElementsByClassName('card').length) {
		document.getElementsByClassName('container')[0].style.display = "flex";
		numberOfPairs = Math.floor(cardsLoaded/2);
	}
}

function distributeImages() {
	var cards = document.getElementsByTagName('img');
	var numCards = [];
	for(let i=0;i<cards.length;i++) {
		numCards.push(i);
	}
	numCards = shuffle(numCards);
	var images = shuffle(imagesPool);
	var url = "";
	var img1, img2;
	for(let i=0;i<cards.length;i=i+2) {
		url = images[i];
		img1 = cards.item(numCards.shift());
		img2 = cards.item(numCards.shift());
		img1.onload = launchGame;
		img2.onload = launchGame;
		img1.src = url;
		img2.src = url;
	}
}


function flipCard(t) {
	if(t.classList.contains('flipped')) {
		t.classList.remove('flipped');
		setTimeout(function() {
			t.getElementsByTagName('img')[0].style.opacity = '0';
		}, 50);
	} else {
		t.classList.add('flipped');
		setTimeout(function() {
			t.getElementsByTagName('img')[0].style.opacity = '1';
		}, 50);
	}
}

function hideAllCards() {
	var cards = document.getElementsByClassName('card');
	for(let i=0; i<cards.length; i++) {
		if(cards.item(i).classList.contains('flipped')) {
			flipCard(cards.item(i));
		}
	}
	cardsFlipped = 0;
	flippedURL = "";
	flippedCard = null;
}

function removeCard(t) {
	t.insertAdjacentHTML('beforebegin','<div class="void unselectable"></div>');
	t.parentNode.removeChild(t);
}

function endGame() {
	var time = Math.floor((Date.now() - startTime)/1000);
	var neg =  time + numberOfPairFlipped * 2;
	var pos = Math.pow(numberOfPairs,2)*2;
	var score = Math.max(pos - neg, 0);
	document.body.innerHTML = "time : "+time+", pairs : "+numberOfPairs+", pairs flipped : "+numberOfPairFlipped+", score : "+score;
	document.body.innerHTML += '<br><br><button onclick="location.reload()">Retry ?</button>';
}

window.onload = function() {

	distributeImages();

	var cards = document.getElementsByClassName('card');
	for(let i=0; i<cards.length; i++) {
		cards.item(i).addEventListener('click', function(e) {
			if(!gameStarted) {
				startTime = Date.now();
				gameStarted = true;
			}
			e.preventDefault();
			e.stopPropagation();
			if(e.currentTarget.classList.contains('flipped')) {
				return true;
			}
			if(cardsFlipped < 2) {
				flipCard(e.currentTarget);	
				cardsFlipped++;
				if(cardsFlipped == 2) {
					numberOfPairFlipped++;
					if(e.currentTarget.childNodes[0].src == flippedURL) {
						pair = e.currentTarget
						setTimeout(function() {
							removeCard(pair);
							removeCard(flippedCard);
							cardsFlipped = 0;
							flippedURL = "";
							flippedCard = null;
							pair = null;
							if(document.getElementsByClassName('card').length == 0) {
								endGame();
							}
						}, 1000);
					} else {
						setTimeout(hideAllCards, 1000);
					}
				} else {
					flippedURL = e.currentTarget.childNodes[0].src;
					flippedCard = e.currentTarget;
				}
			}
		});
	}
};
