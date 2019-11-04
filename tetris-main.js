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
				TetrisPlus.board.rotatePiece();
			}
			if (Key.getKeyDown(Key.LEFT)){
				TetrisPlus.board.movePieceLeft();
			}

			if(Key.getKey(Key.DOWN)){
				TetrisPlus.board.userMoveDown();
			}

			if (Key.getKeyDown(Key.RIGHT)){
				TetrisPlus.board.movePieceRight();
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
		game.frameCounter++;
		//console.log("Frame rate = " + game.frameRate);
		TetrisPlus.debug.updateDebugDisplay();
	},

	drawGraphics : function(){
		TetrisPlus.board.drawBoard();
		TetrisPlus.board.drawPiece();
		TetrisPlus.board.drawScore();
		if(isPaused){
			TetrisPlus.board.drawPauseState();
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
			TetrisPlus.board.movePieceDown();
			game.resetTickTimer();
		} 
	},

	frameCounter : 0,
	frameRate : 0,
	frameRateUpdate : setInterval(function(){game.frameRate = game.frameCounter*2; game.frameCounter = 0;}, 500),

	stop : function(){
		clearInterval(instance);
	}

};



//Main Code:
TetrisPlus.start = function(){
	canvas = new Canvas(document.getElementById("canvas"));
	tickTimer = tickRate;
	randomBag = new RandomBag(pieceArray);
	TetrisPlus.board.createBoard();
	window.addEventListener('resize', this.board.resize);
	if(useTouch){
		setupTouchButton();
	}
	TetrisPlus.board.spawnPiece(new Piece(randomBag.getNextLetter()));
	TetrisPlus.debug.toggleDebugDisplay();
	instance = setInterval(game.update, (1000/targetFrameRate));
}

$(document).ready(TetrisPlus.start());

function gameOver(){
	game.stop();
	TetrisPlus.board.drawOverlay();
	TetrisPlus.board.overlayTextCentre("Game Over", 19);
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

