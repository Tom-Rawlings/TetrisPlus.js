"use strict";
TetrisPlus.board = {

	canvas : {},
	canvasHeightRelative : 0, 
	canvasWidthRelative : 0,
	canvasScaleMultiplier : 1.0,
	overlayMessages : [],

	blockSize : 0,
	gapSize : 0,

	makeBlock : (function(_xCoord, _yCoord, _colour){
		var block = {};
		(function () {
			var xCoord = _xCoord;
			var yCoord = _yCoord;
			var colour = _colour;

			this.setColour = function(_colour){
				colour = _colour;
			 },
	 
			 this.getColour = function(){
			 return colour;
			 },
	 
			this.setXcoord = function(_xCoord){
				xCoord = _xCoord;
			},
	 
			this.setYcoord = function(_yCoord){
				yCoord = _yCoord;
			}
	 
			this.draw = function(){
				TetrisPlus.board.canvas.ctx.fillStyle = colour;
				TetrisPlus.board.canvas.ctx.fillRect(xCoord, yCoord, this.blockSize, this.blockSize);
			}
				
		}).apply( block );
	
		return block;
	
	}),

	calculateCanvasDimensions(){
		this.canvas.element.height = this.canvas.parent.offsetHeight-(TetrisPlus.config.canvasRelativeVerticalMargin*this.canvas.parent.offsetHeight * 2);
		this.canvasScaleMultiplier = this.canvas.element.height/this.canvasHeightRelative;
		//this.blockSize = Math.floor(TetrisPlus.config.blockSizeRelative * this.canvasScaleMultiplier);
		//this.gapSize = Math.floor(TetrisPlus.config.gapSizeRelative * this.canvasScaleMultiplier);
		this.blockSize = (TetrisPlus.config.blockSizeRelative * this.canvasScaleMultiplier);
		this.gapSize = (TetrisPlus.config.gapSizeRelative * this.canvasScaleMultiplier);
		//if(this.gapSize < 1) this.gapSize = 1;
		//if(this.blockSize < 1) this.blockSize = 1;
	
		this.canvas.element.height = this.blockSize*TetrisPlus.config.boardHeight + this.gapSize*(TetrisPlus.config.boardHeight+1); 
		this.canvas.element.width = this.blockSize*TetrisPlus.config.boardWidth + this.gapSize*(TetrisPlus.config.boardWidth+1);
		//this.canvas.element.style.paddingTop = (this.canvas.parent.offsetHeight - this.canvas.element.height)/2 + "px";
	},

	createBoard(){

		this.calculateCanvasDimensions();
		this.setupBoardArrays();

	},

	drawBoard(){
		this.canvas.ctx.fillStyle = TetrisPlus.config.backgroundColour;
		this.canvas.ctx.fillRect(0, 0, this.canvas.element.width, this.canvas.element.height);
		var xCoord = 0;
		var yCoord = 0;
		//Make the blocks, activeSquare, and collision maps 
		for(var x = 0; x < TetrisPlus.config.boardWidth; x++){
			for(var y = 0; y < TetrisPlus.config.boardHeight; y++){
				xCoord = (this.blockSize+this.gapSize)*x + this.gapSize;
				yCoord = ((this.blockSize+this.gapSize)*(TetrisPlus.config.boardHeight-1))-(y*(this.blockSize+this.gapSize)) + this.gapSize;
				this.canvas.ctx.fillStyle = this.blocks[x][y].getColour();
				this.canvas.ctx.fillRect(xCoord, yCoord, this.blockSize, this.blockSize);
				this.blocks[x][y].setXcoord(xCoord);
				this.blocks[x][y].setYcoord(yCoord);
			}
		}
	},

	setupBoardArrays(){
		this.blocks = [];
		this.collisionMap = [];
		for(var x = 0; x < TetrisPlus.config.boardWidth; x++){
			this.collisionMap.push( [] );
			this.blocks.push( [] );
			for(var y = 0; y < TetrisPlus.config.boardHeight; y++){
				this.collisionMap[x].push(false);
				this.blocks[x].push(TetrisPlus.board.makeBlock(x, y, TetrisPlus.config.emptyBlockColour));
			}
		}
	},

	showBoard(){
		this.canvas.element.style.display = "block";
	},

	spawnPiece(pieceLetter){
		TetrisPlus.board.currentPiece.setupPiece(pieceLetter);
	
		if(this.checkCollisionForPiecePosition(TetrisPlus.board.currentPiece.getSpawnCoords())){
			//spawn piece
			this.updatePieceOnBoard();
		}
		else
			//game over
			TetrisPlus.Game.gameOver();
		;
	},

	setPieceInPlace(){
		for(var i = 0; i < TetrisPlus.board.currentPiece.getCurrentCoords().length; i++){
			this.collisionMap[TetrisPlus.board.currentPiece.getCurrentCoords()[i].x][TetrisPlus.board.currentPiece.getCurrentCoords()[i].y] = true;
		}
		//Check for completed lines then move everything down
			this.checkCompletedLines();
		//
		this.spawnPiece(TetrisPlus.Game.randomBag.getNextLetter());
	},

	/*
	Move piece on board
	*/
	movePieceDown(){
		if(this.checkCollisionDown()){
			this.clearPieceFromBoard();
			TetrisPlus.board.currentPiece.moveDown();
			this.updatePieceOnBoard();
			TetrisPlus.Game.resetTickTimer();
			return true;
		}else{
			this.setPieceInPlace();
			return false;
		}
	},

	userMoveDown : TetrisPlus.Helper.throttle(
		function(){
			TetrisPlus.board.movePieceDown();
		}, TetrisPlus.config.moveDownDelay),

	movePieceLeft(){
		if(this.checkCollisionLeft()){
			this.clearPieceFromBoard();
			TetrisPlus.board.currentPiece.moveLeft();
			this.updatePieceOnBoard();
		}
	},

	movePieceRight(){
		if(this.checkCollisionRight()){
			this.clearPieceFromBoard();
			TetrisPlus.board.currentPiece.moveRight();
			this.updatePieceOnBoard();
		}
	},

	rotatePiece(){
		TetrisPlus.board.currentPiece.rotate();
	},

	clearBoard(){
		for(var x = 0; x < TetrisPlus.config.boardWidth; x++){
			for(var y = 0; y < TetrisPlus.config.boardHeight; y++){
				this.blocks[x][y].setColour(TetrisPlus.config.emptyBlockColour);
				this.collisionMap[x][y] = false;;
			}
		}
	},
	
	clearPieceFromBoard(){
		for(var i = 0; i < TetrisPlus.board.currentPiece.getCurrentCoords().length; i++){
			this.blocks[TetrisPlus.board.currentPiece.getCurrentCoords()[i].x][TetrisPlus.board.currentPiece.getCurrentCoords()[i].y].setColour(TetrisPlus.config.emptyBlockColour);
		}
	},
	
	updatePieceOnBoard(){
			for(var i = 0; i < TetrisPlus.board.currentPiece.getCurrentCoords().length; i++){
				this.blocks[TetrisPlus.board.currentPiece.getCurrentCoords()[i].x][TetrisPlus.board.currentPiece.getCurrentCoords()[i].y].setColour(TetrisPlus.board.currentPiece.getColour());
			}
	},
	
	drawPiece(){
		for(var i = 0; i < TetrisPlus.board.currentPiece.getCurrentCoords().length; i++){
			this.blocks[TetrisPlus.board.currentPiece.getCurrentCoords()[i].x][TetrisPlus.board.currentPiece.getCurrentCoords()[i].y].draw();
		}
	},


	//
	// Collision checking
	//
	checkCollisionDown(){
		for(var i = 0; i < TetrisPlus.board.currentPiece.getCurrentCoords().length; i++){
			if(TetrisPlus.board.currentPiece.getCurrentCoords()[i].y == 0)
				return false;
			else if(this.collisionMap[TetrisPlus.board.currentPiece.getCurrentCoords()[i].x][TetrisPlus.board.currentPiece.getCurrentCoords()[i].y - 1])
				return false;
		}
		return true;
	},

	checkCollisionLeft(){
		for(var i = 0; i < TetrisPlus.board.currentPiece.getCurrentCoords().length; i++){
			if(TetrisPlus.board.currentPiece.getCurrentCoords()[i].x == 0)
				return false;
			else if(this.collisionMap[TetrisPlus.board.currentPiece.getCurrentCoords()[i].x - 1][TetrisPlus.board.currentPiece.getCurrentCoords()[i].y])
				return false;
		}
		return true;
	},

	checkCollisionRight(){
		for(var i = 0; i < TetrisPlus.board.currentPiece.getCurrentCoords().length; i++){
			if(TetrisPlus.board.currentPiece.getCurrentCoords()[i].x == TetrisPlus.config.boardWidth-1)
				return false;
			else if(this.collisionMap[TetrisPlus.board.currentPiece.getCurrentCoords()[i].x + 1][TetrisPlus.board.currentPiece.getCurrentCoords()[i].y])
				return false;
		}
		return true;
	},

	checkCollisionForPiecePosition(positionCoords){
		for(var i = 0; i < positionCoords.length; i++){
			if(positionCoords[i].x < 0 || positionCoords[i].x > TetrisPlus.config.boardWidth-1)
				return false;
			else if(positionCoords[i].y < 0 || positionCoords[i].y > TetrisPlus.config.boardHeight-1)
				return false;
			else if(this.collisionMap[positionCoords[i].x][positionCoords[i].y])
				return false;
		}
		return true;
	},


	
	checkCompletedLines(){
		for(var y = 0; y < TetrisPlus.config.boardHeight; y++){
			var lineCount = 0;
			for(var x = 0; x < TetrisPlus.config.boardWidth; x++){
				if(this.collisionMap[x][y] == true){
					lineCount++;
				}
			}
			if(lineCount >= TetrisPlus.config.boardWidth){
				this.clearLine(y);
				this.moveLinesDown(y);
				y--;
			}
		}
	},

	clearLine(lineNumber){
		for(var x = 0; x < TetrisPlus.config.boardWidth; x++){
			this.blocks[x][lineNumber].setColour(TetrisPlus.config.emptyBlockColour);
			this.collisionMap[x][lineNumber] = false;
		}
		TetrisPlus.Game.linesCleared++;
		//$("#score").html("Lines Cleared: " + TetrisPlus.Game.linesCleared);
		//Recalculate game level
		TetrisPlus.Game.currentLevel = Math.floor(TetrisPlus.Game.linesCleared / TetrisPlus.config.linesPerLevel);
		TetrisPlus.Game.resetTickTimer();//TetrisPlus.config.dropSpeeds[this.currentLevel]
	},

	moveLinesDown(startLine){
		for(var y = startLine+1; y < TetrisPlus.config.boardHeight; y++){
			for(var x = 0; x < TetrisPlus.config.boardWidth; x++){
				if(this.collisionMap[x][y] == true){
					this.blocks[x][y-1].setColour(this.blocks[x][y].getColour());
					this.blocks[x][y].setColour(TetrisPlus.config.emptyBlockColour);
					this.collisionMap[x][y] = false;
					this.collisionMap[x][y-1] = true;
				}
			}
		}
	},

	resize : TetrisPlus.Helper.throttle(function() {
		TetrisPlus.board.calculateCanvasDimensions();
		TetrisPlus.Game.drawGraphics();
		console.log("canvas resize triggered");
	}, 500),


	drawScore(){
		var size = 8;
		size = size*this.canvasScaleMultiplier;
		this.canvas.ctx.font = `${size}px Arial`;
		this.canvas.ctx.fillStyle = TetrisPlus.config.overlayTextColour;
		this.canvas.ctx.globalAlpha = 0.7;
		this.canvas.ctx.fillText("Lines Cleared: " + TetrisPlus.Game.linesCleared, 2*this.canvasScaleMultiplier, size);
		this.canvas.ctx.globalAlpha = 1.0;
	},
	
	toggleOverlayBackground(){
		if(overlayOn){
			overlayOn = false;
			drawBoard();
		}else{
			drawOverlay();
			overlayOn = true;
		}
	},
	
	drawPauseState(){
		this.drawOverlay();
		this.overlayTextCentre("Paused", 30);
	},
	
	drawOverlay(){
		this.canvas.ctx.fillStyle = TetrisPlus.config.overlayColour;
		this.canvas.ctx.globalAlpha = 0.5;
		this.canvas.ctx.fillRect(0, 0, this.canvas.element.width, this.canvas.element.height);
		this.canvas.ctx.globalAlpha = 1.0;
	},
	
	overlayTextCentre(message, size){
		size = size*TetrisPlus.board.canvasScaleMultiplier;
		this.canvas.ctx.font = `${size}px Arial`;
		this.canvas.ctx.fillStyle = TetrisPlus.config.overlayTextColour;
		this.canvas.ctx.fillText(message, 0, this.canvas.element.height/2);
	},

	drawOverlayMessages(){
		this.drawOverlay();
		for(var i = 0; i < this.overlayMessages.length; i++){
			this.overlayText(this.overlayMessages[i].message, this.overlayMessages[i].size, this.overlayMessages[i].x, this.overlayMessages[i].y);
		}
	},

	overlayText(message, size, x, y){
		size = size*TetrisPlus.board.canvasScaleMultiplier;
		this.canvas.ctx.font = `${size}px Arial`;
		this.canvas.ctx.fillStyle = TetrisPlus.config.overlayTextColour;
		this.canvas.ctx.fillText(message, x*TetrisPlus.board.canvasScaleMultiplier, y*TetrisPlus.board.canvasScaleMultiplier);
	}


};