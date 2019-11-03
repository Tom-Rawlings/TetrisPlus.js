"use strict";
var instance;
var tickTimer = tickRate;
var game;
game = {
	update : function(){
		var previousTime = game.lastUpdateTime();
		//Process input
		//Single hit keys: up, escape

		if (Key.isDownSingleShot(Key.UP)){
			rotatePiece();
		}
		if (Key.isDown(Key.LEFT)){
			movePieceLeft();
		}
		if (Key.isDown(Key.DOWN)){
			movePieceDown();
		}
		if (Key.isDown(Key.RIGHT)){
			movePieceRight();
		}
		if (Key.isDown(Key.ESCAPE)){
			clearInterval(instance);
		}
		//Update graphics
		drawBoard();
		game.decreaseTickTimer(previousTime);
	},

	lastUpdateTime : (function(){
		var time = Date.now();
		return function() {var oldTime = time; time = Date.now(); return oldTime;}
	})(),

	decreaseTickTimer : function (previousTime) {
		tickTimer -= (Date.now() - previousTime);
		if(tickTimer <= 0){
			movePieceDown();
			tickTimer = tickRate;
		} 
		//console.log("timer = " + tickTimer/1000); 
	},

	stop : function(){
		clearInterval(instance);
	}

};

$(document).ready(start());

//Main Code:
function start(){
	tickTimer = tickRate;
	randomBag = new RandomBag(pieceArray);
	createBoard();
	if(useTouch){
		setupTouchButton();
	}
	spawnPiece(new Piece(randomBag.getNextLetter()));
	toggleDebugDisplay();
	instance = setInterval(game.update, 16.7);
}

function gameOver(){
	stopGame();
	toggleGreyOverlay();
	$("#centreMessageParent").css("font-size", "25vh");
	$("#centreMessage").css("font-size", "7vh");
	$("#centreMessage").html("Game Over<br/>Lines Cleared: " + linesCleared);
}

function togglePause(){
	if(isPaused){
		game = setInterval(gameTick, tickRate);
		isPaused = false;
		$("#centreMessage").html("");
	}
	else{
		clearInterval(game);
		isPaused = true;
		addHtml("#centreMessage", "Paused");
	}
	toggleGreyOverlay();
}
