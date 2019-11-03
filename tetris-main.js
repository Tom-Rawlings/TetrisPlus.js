"use strict";
var instance;
var tickTimer = tickRate;
var game;
game = {
	update : function(){
		var previousTime = game.lastUpdateTime();

		//Process input
		if(!isPaused){
			if (Key.getKeyDown(Key.UP)){
				rotatePiece();
			}
			if (Key.getKeyDown(Key.LEFT)){
				movePieceLeft();
			}
			if (Key.getKeyDown(Key.DOWN)){
				movePieceDown();
			}
			if (Key.getKeyDown(Key.RIGHT)){
				movePieceRight();
			}
		}

		if (Key.getKeyDown(Key.P)){
			togglePause();
		}
		if (Key.getKeyDown(Key.ESCAPE)){
			game.stop();
		}
		Key.clear();

		//Update graphics
		
		drawBoard();
		drawPiece();
		drawScore();
		if(!isPaused){
			game.decreaseTickTimer(previousTime);
		}else{
			drawPauseState();
		}
		
	},

	lastUpdateTime : (function(){
		var time = Date.now();
		return function() {var oldTime = time; time = Date.now(); return oldTime;}
	})(),

	resetTickTimer : function(){
		tickTimer = tickRate;
	},

	decreaseTickTimer : function (previousTime) {
		tickTimer -= (Date.now() - previousTime);
		if(tickTimer <= 0){
			movePieceDown();
			game.resetTickTimer();
		} 
	},

	stop : function(){
		clearInterval(instance);
	}

};

$(document).ready(start());

//Main Code:
function start(){
	canvas = new Canvas(document.getElementById("canvas"));
	tickTimer = tickRate;
	randomBag = new RandomBag(pieceArray);
	createBoard();
	if(useTouch){
		setupTouchButton();
	}
	spawnPiece(new Piece(randomBag.getNextLetter()));
	toggleDebugDisplay();
	instance = setInterval(game.update, (1000/targetFrameRate));
}

function gameOver(){
	game.stop();
	drawOverlay();
	overlayTextCentre("Game Over", 19);
}

function togglePause(){
	if(isPaused){
		isPaused = false;
	}
	else{
		isPaused = true;
	}
}

