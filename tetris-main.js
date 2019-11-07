"use strict";
TetrisPlus.Game = {

		instance : null,
		tickTimer : 800,
		gameTime : 0,
		isPaused : false,
		linesCleared : 0,
		randomBag : undefined,
		currentLevel : 0,

		start : function(){
			TetrisPlus.board.overlayMessages = [];
			this.linesCleared = 0;
			this.currentLevel = 0;
			this.tickTimer = TetrisPlus.config.dropSpeeds[this.currentLevel];
			TetrisPlus.board.setupBoardArrays();
			window.removeEventListener('keydown', TetrisPlus.startInput);
			this.randomBag.reshuffle();
			TetrisPlus.board.spawnPiece(this.randomBag.getNextLetter());
			TetrisPlus.debug.showDebugDisplay(true);
			window.addEventListener('keyup', function(event) { TetrisPlus.Input.Key.onKeyup(event); }, false);
			window.addEventListener('keydown', function(event) { TetrisPlus.Input.Key.onKeydown(event); }, false);

			this.instance = setInterval(this.update, (1000/TetrisPlus.config.targetFrameRate));
		},

		startScreen : function(){
			TetrisPlus.board.overlayMessages.push({message : "Press Space", size: 15, x: 10, y: 90});
			TetrisPlus.board.overlayMessages.push({message : "To Start", size: 15, x: 25, y: 110});
			TetrisPlus.board.overlayMessages.push({message : "Up Arrow: Rotate", size: 7, x: 24, y: 130});
			TetrisPlus.board.overlayMessages.push({message : "Left Arrow: Move Left", size: 7, x: 18, y: 140});
			TetrisPlus.board.overlayMessages.push({message : "Right Arrow: Move Right", size: 7, x: 14, y: 150});
			TetrisPlus.board.overlayMessages.push({message : "Down Arrow: Move Down", size: 7, x: 13, y: 160});
			this.drawGraphics();
		},

		update : function(){
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

		if (TetrisPlus.Input.Key.getKeyDown(TetrisPlus.Input.Key.R)){
			if(TetrisPlus.Game.isPaused){
				TetrisPlus.Game.togglePause();
				TetrisPlus.Game.stop();
				TetrisPlus.Game.start();
			}
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

	drawGraphics : function(){
		TetrisPlus.board.drawBoard();
		TetrisPlus.board.drawPiece();
		TetrisPlus.board.drawScore();
		if(this.isPaused){
			TetrisPlus.board.drawPauseState();
		}
		if(TetrisPlus.board.overlayMessages.length > 0){
			TetrisPlus.board.drawOverlayMessages();
		}
	},

	FrameCounter : (function(){
		var frameCounter = 0;
		var frameRate = 0;
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
				}
			},

			updateFrameRate : function(multiplier){
				frameRate = frameCounter * multiplier;
				frameCounter = 0;
			},

		};
		
	}()),

	lastUpdateTime : (function(){
		var time = Date.now();
		return function() {var oldTime = time; time = Date.now(); return oldTime;};
	})(),

	resetTickTimer : function(){
		this.tickTimer = TetrisPlus.config.dropSpeeds[this.currentLevel];
	},

	decreaseTickTimer : function (previousTime) {
		this.tickTimer -= (Date.now() - previousTime);
		if(this.tickTimer <= 0){
			TetrisPlus.board.movePieceDown();
			this.resetTickTimer();
		} 
	},

	stop : function(){
		clearInterval(this.instance);
	},

	
	gameOver : function(){
		TetrisPlus.board.overlayMessages.push({message : "Game Over", size: 19, x: 0, y: 100});
		TetrisPlus.board.overlayMessages.push({message : "Press Space", size: 15, x: 10, y: 130});
		TetrisPlus.board.overlayMessages.push({message : "to Play Again", size: 14, x: 9, y: 150});
		this.drawGraphics();
		this.stop();
		window.addEventListener('keydown', TetrisPlus.startInput, false);
	},

	togglePause : function(){
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

TetrisPlus.startInput = function(){
	if(event.keyCode == TetrisPlus.Input.Key.SPACE) 
		TetrisPlus.Game.start(); 
};

TetrisPlus.init = function(config){
	TetrisPlus.Helper.extend(this.config, config);
	if(TetrisPlus.config.useDarkTheme){
		TetrisPlus.Helper.extend(this.config, TetrisPlus.darkTheme);
	}
	if(!TetrisPlus.config.useBackgroundGrid){
		TetrisPlus.config.backgroundColour = TetrisPlus.config.emptyBlockColour;
	}

	//Load piece colours
	var keys = Object.keys(TetrisPlus.config.pieceColours);
	for(var i = 0; i < keys.length; i++){
		TetrisPlus.Pieces[keys[i]].colour = TetrisPlus.config.pieceColours[keys[i]];
	}
	
	TetrisPlus.board.canvasHeightRelative = TetrisPlus.config.blockSizeRelative*TetrisPlus.config.boardHeight + TetrisPlus.config.gapSizeRelative*(TetrisPlus.config.boardHeight+1); 
	TetrisPlus.board.canvasWidthRelative = TetrisPlus.config.blockSizeRelative*TetrisPlus.config.boardWidth + TetrisPlus.config.gapSizeRelative*(TetrisPlus.config.boardWidth+1);
	
	TetrisPlus.board.canvas.parent = document.getElementById(TetrisPlus.config.parentId);
	TetrisPlus.board.canvas.element = document.createElement("canvas");
	TetrisPlus.board.canvas.parent.appendChild(TetrisPlus.board.canvas.element);
	TetrisPlus.board.canvas.element.style.margin = "0 auto";
	TetrisPlus.board.canvas.element.style.border = "2px solid " + TetrisPlus.config.borderColour;

	TetrisPlus.board.canvas.ctx = TetrisPlus.board.canvas.element.getContext("2d");
	TetrisPlus.board.createBoard();
	TetrisPlus.Game.randomBag = TetrisPlus.makeRandomBag();
	TetrisPlus.board.showBoard();
	TetrisPlus.Game.startScreen();
	window.addEventListener('resize', TetrisPlus.board.resize);
	window.addEventListener('keydown', TetrisPlus.startInput, false);
};
