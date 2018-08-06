imagesPool = [
    "https://picsum.photos/150/150?image=1",
    "https://picsum.photos/150/150?image=2",
    "https://picsum.photos/150/150?image=3",
    "https://picsum.photos/150/150?image=4",
    "https://picsum.photos/150/150?image=5",
    "https://picsum.photos/150/150?image=6",
    "https://picsum.photos/150/150?image=7",
    "https://picsum.photos/150/150?image=8",
    "https://picsum.photos/150/150?image=9",
    "https://picsum.photos/150/150?image=10",
    "https://picsum.photos/150/150?image=11",
    "https://picsum.photos/150/150?image=12",
    "https://picsum.photos/150/150?image=13",
    "https://picsum.photos/150/150?image=14",
    "https://picsum.photos/150/150?image=15",
    "https://picsum.photos/150/150?image=16",
    "https://picsum.photos/150/150?image=17",
    "https://picsum.photos/150/150?image=18",
    "https://picsum.photos/150/150?image=19",
    "https://picsum.photos/150/150?image=20",
    "https://picsum.photos/150/150?image=21",
    "https://picsum.photos/150/150?image=22",
    "https://picsum.photos/150/150?image=23",
    "https://picsum.photos/150/150?image=24",
    "https://picsum.photos/150/150?image=25",
    "https://picsum.photos/150/150?image=26",
    "https://picsum.photos/150/150?image=27",
    "https://picsum.photos/150/150?image=28",
    "https://picsum.photos/150/150?image=29",
    "https://picsum.photos/150/150?image=30",
    "https://picsum.photos/150/150?image=31",
    "https://picsum.photos/150/150?image=32",
    "https://picsum.photos/150/150?image=33",
    "https://picsum.photos/150/150?image=34",
    "https://picsum.photos/150/150?image=35",
    "https://picsum.photos/150/150?image=36",
    "https://picsum.photos/150/150?image=37",
    "https://picsum.photos/150/150?image=38",
    "https://picsum.photos/150/150?image=39",
    "https://picsum.photos/150/150?image=40"
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
