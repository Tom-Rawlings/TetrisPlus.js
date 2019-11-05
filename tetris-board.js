"use strict";
var xCoord, yCoord;
var overlayOn = false;


TetrisPlus.board = {
	calculateCanvasDimensions(){
		this.canvas.element.height = window.innerHeight-(canvasRelativeVerticalMargin*window.innerHeight * 2);
		canvasScaleMultiplier = this.canvas.element.height/canvasHeightRelative;
		console.log("calculateCanvasDimensions");
		blockSize = Math.floor(blockSizeRelative * canvasScaleMultiplier);
		gapSize = Math.floor(gapSizeRelative * canvasScaleMultiplier);
		if(gapSize < 1) gapSize = 1;
		if(blockSize < 1) blockSize = 1;
	
		this.canvas.element.height = blockSize*boardHeight + gapSize*(boardHeight+1); 
		this.canvas.element.width = blockSize*boardWidth + gapSize*(boardWidth+1);
		this.canvas.element.style.marginTop = (window.innerHeight - this.canvas.element.height)/2 + "px";
	},

	createBoard(){

		this.calculateCanvasDimensions();
		this.setupBoardArrays();
		this.drawBoard();
		this.showBoard();
	
	},

	drawBoard(){
		this.canvas.ctx.fillStyle = backgroundColour;
		this.canvas.ctx.fillRect(0, 0, this.canvas.element.width, this.canvas.element.height);
		//Make the blocks, activeSquare, and collision maps 
		for(var x = 0; x < boardWidth; x++){
			for(var y = 0; y < boardHeight; y++){
				xCoord = (blockSize+gapSize)*x + gapSize;
				yCoord = ((blockSize+gapSize)*(boardHeight-1))-(y*(blockSize+gapSize)) + gapSize;
				this.canvas.ctx.fillStyle = blocks[x][y].getColour();
				this.canvas.ctx.fillRect(xCoord, yCoord, blockSize, blockSize);
				blocks[x][y].setXcoord(xCoord);
				blocks[x][y].setYcoord(yCoord);
			}
		}
		if(overlayOn){
			drawOverlay();
		}
	},

	setupBoardArrays(){
		blocks = [];
		collisionMap = [];
		for(var x = 0; x < boardWidth; x++){
			collisionMap.push( [] );
			blocks.push( [] );
			for(var y = 0; y < boardHeight; y++){
				collisionMap[x].push(false);
				blocks[x].push(new Block(x, y, emptyBlockColour));
			}
		}
	},

	showBoard(){
		this.canvas.element.style.display = "block";
	},

	spawnPiece(piece){
		currentPiece = piece;
	
		if(this.checkCollisionForPiecePosition(currentPiece.spawnCoords)){
			/*
			for(var i = 0; i < currentPiece.spawnCoords.length; i++){
				blocks[currentPiece.spawnCoords[i].x][currentPiece.spawnCoords[i].y].setColour(currentPiece.getColour());
			}
			*/
			//spawn piece
			this.updatePieceOnBoard();
		}
		else
			//game over
			TetrisPlus.Game.gameOver();
		;
	},

	setPieceInPlace(){
		for(var i = 0; i < currentPiece.currentCoords.length; i++){
			collisionMap[currentPiece.currentCoords[i].x][currentPiece.currentCoords[i].y] = true;
		}
		//Check for completed lines then move everything down
			this.checkCompletedLines();
		//
		this.spawnPiece(new Piece(randomBag.getNextLetter()));
	},

	/*
	Move piece on board
	*/
	movePieceDown(){
		if(this.checkCollisionDown()){
			this.clearPieceFromBoard();
			currentPiece.moveDown();
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
		}, moveDownDelay),

	movePieceLeft(){
		if(this.checkCollisionLeft()){
			this.clearPieceFromBoard();
			currentPiece.moveLeft();
			this.updatePieceOnBoard();
		}
	},

	movePieceRight(){
		if(this.checkCollisionRight()){
			this.clearPieceFromBoard();
			currentPiece.moveRight();
			this.updatePieceOnBoard();
		}
	},

	rotatePiece(){
		currentPiece.rotate();
	},

	clearBoard(){
		for(var x = 0; x < boardWidth; x++){
			for(var y = 0; y < boardHeight; y++){
				blocks[x][y].setColour(emptyBlockColour);
				collisionMap[x][y] = false;;
			}
		}
	},
	
	clearPieceFromBoard(){
		for(var i = 0; i < currentPiece.currentCoords.length; i++){
			blocks[currentPiece.currentCoords[i].x][currentPiece.currentCoords[i].y].setColour(emptyBlockColour);
		}
	},
	
	updatePieceOnBoard(){
			for(var i = 0; i < currentPiece.currentCoords.length; i++){
				blocks[currentPiece.currentCoords[i].x][currentPiece.currentCoords[i].y].setColour(currentPiece.getColour());
			}
	},
	
	drawPiece(){
		for(var i = 0; i < currentPiece.currentCoords.length; i++){
			blocks[currentPiece.currentCoords[i].x][currentPiece.currentCoords[i].y].draw();
		}
	},


	//
	// Collision checking
	//
	checkCollisionDown(){
		for(var i = 0; i < currentPiece.currentCoords.length; i++){
			if(currentPiece.currentCoords[i].y == 0)
				return false;
			else if(collisionMap[currentPiece.currentCoords[i].x][currentPiece.currentCoords[i].y - 1])
				return false;
		}
		return true;
	},

	checkCollisionLeft(){
		for(var i = 0; i < currentPiece.currentCoords.length; i++){
			if(currentPiece.currentCoords[i].x == 0)
				return false;
			else if(collisionMap[currentPiece.currentCoords[i].x - 1][currentPiece.currentCoords[i].y])
				return false;
		}
		return true;
	},

	checkCollisionRight(){
		for(var i = 0; i < currentPiece.currentCoords.length; i++){
			if(currentPiece.currentCoords[i].x == boardWidth-1)
				return false;
			else if(collisionMap[currentPiece.currentCoords[i].x + 1][currentPiece.currentCoords[i].y])
				return false;
		}
		return true;
	},

	checkCollisionForPiecePosition(positionCoords){
		for(var i = 0; i < positionCoords.length; i++){
			if(positionCoords[i].x < 0 || positionCoords[i].x > boardWidth-1)
				return false;
			else if(positionCoords[i].y < 0 || positionCoords[i].y > boardHeight-1)
				return false;
			else if(collisionMap[positionCoords[i].x][positionCoords[i].y])
				return false;
		}
		return true;
	},


	
	checkCompletedLines(){
		for(var y = 0; y < boardHeight; y++){
			var lineCount = 0;
			for(var x = 0; x < boardWidth; x++){
				if(collisionMap[x][y] == true){
					lineCount++;
				}
			}
			if(lineCount >= 10){
				this.clearLine(y);
				this.moveLinesDown(y);
				y--;
			}
		}
	},

	clearLine(lineNumber){
		for(var x = 0; x < boardWidth; x++){
			blocks[x][lineNumber].setColour(emptyBlockColour);
			collisionMap[x][lineNumber] = false;
		}
		linesCleared++;
		$("#score").html("Lines Cleared: " + linesCleared);
	},

	moveLinesDown(startLine){
		for(var y = startLine+1; y < boardHeight; y++){
			for(var x = 0; x < boardWidth; x++){
				if(collisionMap[x][y] == true){
					blocks[x][y-1].setColour(blocks[x][y].getColour());
					blocks[x][y].setColour(emptyBlockColour);
					collisionMap[x][y] = false;
					collisionMap[x][y-1] = true;
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
		this.canvas.ctx.fillStyle = overlayTextColour;
		this.canvas.ctx.globalAlpha = 0.7;
		this.canvas.ctx.fillText("Lines Cleared: " + linesCleared, 2*canvasScaleMultiplier, size);
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
		this.canvas.ctx.fillStyle = overlayColour;
		this.canvas.ctx.globalAlpha = 0.5;
		this.canvas.ctx.fillRect(0, 0, canvas.element.width, canvas.element.height);
		this.canvas.ctx.globalAlpha = 1.0;
	},
	
	overlayTextCentre(message, size){
		size = size*canvasScaleMultiplier;
		this.canvas.ctx.font = `${size}px Arial`;
		this.canvas.ctx.fillStyle = overlayTextColour;
		this.canvas.ctx.fillText(message, 0, this.canvas.element.height/2);
	},

	canvas : {
		element : null,
		ctx : null
	}

}


class Block{
	constructor(xCoord, yCoord, colour){
		this.xCoord = xCoord;
		this.yCoord = yCoord;
		this.colour = colour;
	}

	setColour (colour){
	 	this.colour = colour;
		//this.draw();
	}

	getColour(){
		return this.colour;
	}

	setXcoord(xCoord){
		this.xCoord = xCoord;
	}

	setYcoord(yCoord){
		this.yCoord = yCoord;
	}

	draw(){
		TetrisPlus.board.canvas.ctx.fillStyle = this.colour;
		TetrisPlus.board.canvas.ctx.fillRect(this.xCoord, this.yCoord, blockSize, blockSize);
	}

}

TetrisPlus.canvas = {
	element : null,
	ctx: null
}

class Canvas{
	constructor(element){
		this.element = element;
		this.ctx = element.getContext("2d");
	}
}
