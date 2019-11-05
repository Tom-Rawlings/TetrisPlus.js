"use strict";
TetrisPlus.Game = {
	//update : function(){

		instance : null,
		tickTimer : tickRate,

		update(){
		var previousTime = TetrisPlus.Game.lastUpdateTime();

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
			TetrisPlus.Game.togglePause();
		}
		if (Key.getKeyDown(Key.ESCAPE)){
			TetrisPlus.Game.stop();
		}
		Key.clear();

		//Update graphics
		TetrisPlus.Game.drawGraphics();

		if(!isPaused){
			TetrisPlus.Game.decreaseTickTimer(previousTime);
		}
		TetrisPlus.Game.frameCounter++;
		//console.log("Frame rate = " + game.frameRate);
		TetrisPlus.debug.updateDebugDisplay();
	},

	drawGraphics(){
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
		this.tickTimer = tickRate;
	},

	decreaseTickTimer : function (previousTime) {
		this.tickTimer -= (Date.now() - previousTime);
		if(this.tickTimer <= 0){
			TetrisPlus.board.movePieceDown();
			this.resetTickTimer();
		} 
	},

	frameCounter : 0,
	frameRate : 0,
	frameRateUpdate : setInterval(function(){TetrisPlus.Game.frameRate = TetrisPlus.Game.frameCounter*2; TetrisPlus.Game.frameCounter = 0;}, 500),

	stop(){
		clearInterval(this.instance);
		console.log("stop");
	},

	
	gameOver(){
		this.stop();
		TetrisPlus.board.drawOverlay();
		TetrisPlus.board.overlayTextCentre("Game Over", 19);
	},

	togglePause(){
		if(isPaused){
			isPaused = false;
			clearInterval(this.instance);
			this.instance = setInterval(this.update, (1000/targetFrameRate));
		}
		else{
			isPaused = true;
			if(this.instance != null){
				clearInterval(this.instance);
				this.instance = setInterval(this.update, (1000/pausedFrameRate));
			}
		}
	}

};


//Main Code:
TetrisPlus.start = function(canvasId){
	//canvas = new Canvas(document.getElementById(canvasId));
	canvasHeightRelative = blockSizeRelative*boardHeight + gapSizeRelative*(boardHeight+1); 
	canvasWidthRelative = blockSizeRelative*boardWidth + gapSizeRelative*(boardWidth+1);
	this.board.canvas.element = document.getElementById(canvasId);
	this.board.canvas.ctx = this.board.canvas.element.getContext("2d");
	randomBag = new RandomBag(pieceArray);
	this.board.createBoard();
	window.addEventListener('resize', this.board.resize);
	if(useTouch){
		setupTouchButton();
	}
	TetrisPlus.board.spawnPiece(new Piece(randomBag.getNextLetter()));
	TetrisPlus.debug.toggleDebugDisplay();
	this.Game.instance = setInterval(this.Game.update, (1000/targetFrameRate));
}

$(document).ready(TetrisPlus.start("canvas"));


var testObject = {};

(function (testObject){
	testObject.test = function(){
		alert("public");
		test1();
	}
	function test1(){
		alert("private");
	}
}(testObject));