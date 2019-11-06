"use strict";
TetrisPlus.Game = {
	//update : function(){

		instance : null,
		tickTimer : TetrisPlus.config.tickRate,
		gameTime : 0,
		isPaused : false,
		linesCleared : 0,
		randomBag : TetrisPlus.makeRandomBag(),

		update(){
		var previousTime = TetrisPlus.Game.lastUpdateTime();

		//Process input
		if(!this.isPaused){
			if (TetrisPlus.Input.Key.getKeyDown(TetrisPlus.Input.Key.UP)){
				TetrisPlus.board.rotatePiece();
			}
			if (TetrisPlus.Input.Key.getKeyDown(TetrisPlus.Input.Key.LEFT)){
				TetrisPlus.board.movePieceLeft();
			}

			if(TetrisPlus.Input.Key.getKey(TetrisPlus.Input.Key.DOWN)){
				TetrisPlus.board.userMoveDown();
			}

			if (TetrisPlus.Input.Key.getKeyDown(TetrisPlus.Input.Key.RIGHT)){
				TetrisPlus.board.movePieceRight();
			}
		}

		if (TetrisPlus.Input.Key.getKeyDown(TetrisPlus.Input.Key.P)){
			TetrisPlus.Game.togglePause();
		}
		if (TetrisPlus.Input.Key.getKeyDown(TetrisPlus.Input.Key.ESCAPE)){
			TetrisPlus.Game.stop();
		}
		TetrisPlus.Input.Key.clear();

		//Update graphics
		TetrisPlus.Game.drawGraphics();

		if(!this.isPaused){
			TetrisPlus.Game.decreaseTickTimer(previousTime);
		}
		TetrisPlus.Game.frameCounter++;
		TetrisPlus.debug.updateDebugDisplay();
	},

	drawGraphics(){
		TetrisPlus.board.drawBoard();
		TetrisPlus.board.drawPiece();
		TetrisPlus.board.drawScore();
		if(this.isPaused){
			TetrisPlus.board.drawPauseState();
		}
	},

	lastUpdateTime : (function(){
		var time = Date.now();
		return function() {var oldTime = time; time = Date.now(); return oldTime;}
	})(),

	resetTickTimer : function(){
		this.tickTimer = TetrisPlus.config.tickRate;
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
			this.instance = setInterval(this.update, (1000/TetrisPlus.config.targetFrameRate));
		}
		else{
			isPaused = true;
			if(this.instance != null){
				clearInterval(this.instance);
				this.instance = setInterval(this.update, (1000/TetrisPlus.config.pausedFrameRate));
			}
		}
	}

};


//Main Code:
TetrisPlus.start = function(){
	//canvas = new Canvas(document.getElementById(canvasId));
	canvasHeightRelative = TetrisPlus.config.blockSizeRelative*TetrisPlus.config.boardHeight + TetrisPlus.config.gapSizeRelative*(TetrisPlus.config.boardHeight+1); 
	canvasWidthRelative = TetrisPlus.config.blockSizeRelative*TetrisPlus.config.boardWidth + TetrisPlus.config.gapSizeRelative*(TetrisPlus.config.boardWidth+1);
	this.board.canvas.element = document.getElementById(TetrisPlus.config.cavnasId);
	this.board.canvas.ctx = this.board.canvas.element.getContext("2d");
	//randomBag = new RandomBag(pieceArray);
	this.board.createBoard();
	window.addEventListener('resize', this.board.resize);
	//TetrisPlus.board.spawnPiece(new Piece(TetrisPlus.Game.randomBag.getNextLetter()));
	TetrisPlus.board.spawnPiece(TetrisPlus.Game.randomBag.getNextLetter());
	
	TetrisPlus.debug.toggleDebugDisplay();
	window.addEventListener('keyup', function(event) { TetrisPlus.Input.Key.onKeyup(event); }, false);
	window.addEventListener('keydown', function(event) { TetrisPlus.Input.Key.onKeydown(event); }, false);
	this.Game.instance = setInterval(this.Game.update, (1000/TetrisPlus.config.targetFrameRate));
}

//$(document).ready(TetrisPlus.start("canvas"));
$(document).ready(TetrisPlus.init({}));
