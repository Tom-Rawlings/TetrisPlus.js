"use strict";
var xCoord, yCoord;
var overlayOn = false;


TetrisPlus.board = {

	canvas : {},

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
				TetrisPlus.board.canvas.ctx.fillRect(xCoord, yCoord, blockSize, blockSize);
			}
				
		}).apply( block );
	
		return block;
	
	}),

	calculateCanvasDimensions(){
		this.canvas.element.height = window.innerHeight-(TetrisPlus.config.canvasRelativeVerticalMargin*window.innerHeight * 2);
		canvasScaleMultiplier = this.canvas.element.height/canvasHeightRelative;
		blockSize = Math.floor(TetrisPlus.config.blockSizeRelative * canvasScaleMultiplier);
		gapSize = Math.floor(TetrisPlus.config.gapSizeRelative * canvasScaleMultiplier);
		if(gapSize < 1) gapSize = 1;
		if(blockSize < 1) blockSize = 1;
	
		this.canvas.element.height = blockSize*TetrisPlus.config.boardHeight + gapSize*(TetrisPlus.config.boardHeight+1); 
		this.canvas.element.width = blockSize*TetrisPlus.config.boardWidth + gapSize*(TetrisPlus.config.boardWidth+1);
		this.canvas.element.style.marginTop = (window.innerHeight - this.canvas.element.height)/2 + "px";
	},

	createBoard(){

		this.calculateCanvasDimensions();
		this.setupBoardArrays();
		this.drawBoard();
		this.showBoard();
	
	},

	drawBoard(){
		this.canvas.ctx.fillStyle = TetrisPlus.config.backgroundColour;
		this.canvas.ctx.fillRect(0, 0, this.canvas.element.width, this.canvas.element.height);
		//Make the blocks, activeSquare, and collision maps 
		for(var x = 0; x < TetrisPlus.config.boardWidth; x++){
			for(var y = 0; y < TetrisPlus.config.boardHeight; y++){
				xCoord = (blockSize+gapSize)*x + gapSize;
				yCoord = ((blockSize+gapSize)*(TetrisPlus.config.boardHeight-1))-(y*(blockSize+gapSize)) + gapSize;
				this.canvas.ctx.fillStyle = this.blocks[x][y].getColour();
				this.canvas.ctx.fillRect(xCoord, yCoord, blockSize, blockSize);
				this.blocks[x][y].setXcoord(xCoord);
				this.blocks[x][y].setYcoord(yCoord);
			}
		}
		if(overlayOn){
			drawOverlay();
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
		$("#score").html("Lines Cleared: " + TetrisPlus.Game.linesCleared);
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
	}, 500),


	drawScore(){
		var size = 8;
		size = size*canvasScaleMultiplier;
		this.canvas.ctx.font = `${size}px Arial`;
		this.canvas.ctx.fillStyle = TetrisPlus.config.overlayTextColour;
		this.canvas.ctx.globalAlpha = 0.7;
		this.canvas.ctx.fillText("Lines Cleared: " + TetrisPlus.Game.linesCleared, 2*canvasScaleMultiplier, size);
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
		size = size*canvasScaleMultiplier;
		this.canvas.ctx.font = `${size}px Arial`;
		this.canvas.ctx.fillStyle = TetrisPlus.config.overlayTextColour;
		this.canvas.ctx.fillText(message, 0, this.canvas.element.height/2);
	}


};