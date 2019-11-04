"use strict";
var instance;
var tickTimer = tickRate;
var frameCounter
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
			/*
			if (Key.getKeyDown(Key.DOWN)){
				movePieceDown();
			}else{*/
				if(Key.getKey(Key.DOWN)){
					userMoveDown();
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
		game.drawGraphics();

		if(!isPaused){
			game.decreaseTickTimer(previousTime);
		}
		frameCounter++;
		updateDebugDisplay();
	},

	drawGraphics : function(){
		drawBoard();
		drawPiece();
		drawScore();
		if(isPaused){
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

	frameRate : 0,
	frameRateUpdate : setInterval(function(){game.frameRate = frameCounter*2; frameCounter = 0;}, 500),

	stop : function(){
		clearInterval(instance);
	}

};

$(document).ready(start());

var userMoveDown = Helper.throttle(function(){movePieceDown();}, 100);

//Main Code:
function start(){
	canvas = new Canvas(document.getElementById("canvas"));
	tickTimer = tickRate;
	randomBag = new RandomBag(pieceArray);
	createBoard();
	window.addEventListener('resize', resize);
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
		clearInterval(instance);
		instance = setInterval(game.update, (1000/targetFrameRate));
	}
	else{
		isPaused = true;
		if(instance != null){
			clearInterval(instance);
			instance = setInterval(game.update, (1000/pausedFrameRate));
		}
	}
}

