"use strict";
TetrisPlus.Game = {

		instance : null,
		tickTimer : TetrisPlus.config.tickRate,
		gameTime : 0,
		isPaused : false,
		linesCleared : 0,
		randomBag : undefined,

		start(){
			canvasHeightRelative = TetrisPlus.config.blockSizeRelative*TetrisPlus.config.boardHeight + TetrisPlus.config.gapSizeRelative*(TetrisPlus.config.boardHeight+1); 
			canvasWidthRelative = TetrisPlus.config.blockSizeRelative*TetrisPlus.config.boardWidth + TetrisPlus.config.gapSizeRelative*(TetrisPlus.config.boardWidth+1);
			TetrisPlus.board.canvas.element = document.getElementById(TetrisPlus.config.cavnasId);
			TetrisPlus.board.canvas.ctx = TetrisPlus.board.canvas.element.getContext("2d");
			TetrisPlus.board.createBoard();
			window.addEventListener('resize', TetrisPlus.board.resize);
			this.randomBag = TetrisPlus.makeRandomBag();
			TetrisPlus.board.spawnPiece(this.randomBag.getNextLetter());
			
			TetrisPlus.debug.toggleDebugDisplay();
			window.addEventListener('keyup', function(event) { TetrisPlus.Input.Key.onKeyup(event); }, false);
			window.addEventListener('keydown', function(event) { TetrisPlus.Input.Key.onKeydown(event); }, false);
			this.instance = setInterval(this.update, (1000/TetrisPlus.config.targetFrameRate));
		},

		update(){
		var previousTime = TetrisPlus.Game.lastUpdateTime();

		//Process input
		if(!TetrisPlus.Game.isPaused){
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

		if(!TetrisPlus.Game.isPaused){
			TetrisPlus.Game.decreaseTickTimer(previousTime);
		}
		TetrisPlus.Game.FrameCounter.increaseCounter(previousTime);
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

	FrameCounter : (function(){
		var frameCounter = 0;
		var frameRate = 0;
		//var previousFrameTime = 0;
		var instance;
		var timeSinceLastUpdate = 0;
		var updatePeriod = 500;
		return {
			getFrameRate : function(){
				return frameRate;
			},

			increaseCounter : function(previousFrameTime){
				frameCounter++;
				timeSinceLastUpdate += (Date.now() - previousFrameTime);
				if(timeSinceLastUpdate > updatePeriod){
					this.updateFrameRate(1000/updatePeriod);
					timeSinceLastUpdate = 0;
					console.log("timeSinceLastUpdate > 500");
				}
				console.log("frameCounter = " + frameCounter);
			},

			updateFrameRate : function(multiplier){
				frameRate = frameCounter * multiplier;
				frameCounter = 0;
				console.log("frameRate = " + frameRate);
			},

		}
		
	}()),

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

	stop(){
		clearInterval(this.instance);
	},

	
	gameOver(){
		this.stop();
		TetrisPlus.board.drawOverlay();
		TetrisPlus.board.overlayTextCentre("Game Over", 19);
	},

	togglePause(){
		if(this.isPaused){
			this.isPaused = false;
			clearInterval(this.instance);
			this.instance = setInterval(this.update, (1000/TetrisPlus.config.targetFrameRate));
		}
		else{
			this.isPaused = true;
			if(this.instance != null){
				clearInterval(this.instance);
				this.instance = setInterval(this.update, (1000/TetrisPlus.config.pausedFrameRate));
			}
		}
	}

};

$(document).ready(TetrisPlus.init({}));
