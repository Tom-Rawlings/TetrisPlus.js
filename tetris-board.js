"use strict";
var xCoord, yCoord;


class Block{
	constructor(xCoord, yCoord, colour){
		this.xCoord = xCoord;
		this.yCoord = yCoord;
		this.colour = colour;
	}

	setColour (colour){
	 	this.colour = colour;
		this.draw();
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
		ctx.fillStyle = this.colour;
		ctx.fillRect(this.xCoord, this.yCoord, blockSize, blockSize);
	}

}

function calculateCanvasDimensions(){
	canvas.height = window.innerHeight-(canvasRelativeVerticalMargin*window.innerHeight * 2);
	canvasScaleMultiplier = canvas.height/canvasHeightRelative;

	blockSize = Math.floor(blockSizeRelative * canvasScaleMultiplier);
	gapSize = Math.floor(gapSizeRelative * canvasScaleMultiplier);
	if(gapSize < 1) gapSize = 1;
	if(blockSize < 1) blockSize = 1;

	canvas.height = blockSize*boardHeight + gapSize*(boardHeight+1); 
	canvas.width = blockSize*boardWidth + gapSize*(boardWidth+1);
	canvas.style.marginTop = (window.innerHeight - canvas.height)/2 + "px";
}

function createBoard(){

	createArrays();
	drawBoard();
	showBoard();

}

function drawBoard(){
	calculateCanvasDimensions();

	//Make the blocks, activeSquare, and collision maps 
	for(var x = 0; x < boardWidth; x++){
		for(var y = 0; y < boardHeight; y++){
			xCoord = (blockSize+gapSize)*x + gapSize;
			yCoord = ((blockSize+gapSize)*(boardHeight-1))-(y*(blockSize+gapSize)) + gapSize;
			ctx.beginPath();
			ctx.fillStyle = blocks[x][y].getColour();
			ctx.fillRect(xCoord, yCoord, blockSize, blockSize);
			blocks[x][y].setXcoord(xCoord);
			blocks[x][y].setYcoord(yCoord);
		}
	}
}

function createArrays(){
	blocks = [];
	collisionMap = [];
	for(var x = 0; x < boardWidth; x++){
		collisionMap.push( [] );
		blocks.push( [] );
		for(var y = 0; y < boardHeight; y++){
			collisionMap[x].push(false);
			blocks[x].push(new Block(x, y, backgroundColour));
		}
	}
}

function showBoard(){
	canvas.style.display = "block";
}

function spawnPiece(piece){
	currentPiece = piece;

	if(checkCollisionForPiecePosition(currentPiece.spawnCoords)){
		/*
		for(var i = 0; i < currentPiece.spawnCoords.length; i++){
			blocks[currentPiece.spawnCoords[i].x][currentPiece.spawnCoords[i].y].setColour(currentPiece.getColour());
		}
		*/
		//spawn piece
		updatePieceOnBoard();
	}
	else
		//game over
		gameOver();
	;


}

function clearBoard(){
	for(var x = 0; x < boardWidth; x++){
		for(var y = 0; y < boardHeight; y++){
			blocks[x][y].setColour(backgroundColour);
			collisionMap[x][y] = false;;
		}
	}
}

function clearPieceFromBoard(){
	for(var i = 0; i < currentPiece.currentCoords.length; i++){
		blocks[currentPiece.currentCoords[i].x][currentPiece.currentCoords[i].y].setColour(backgroundColour);
	}
}

function updatePieceOnBoard(){
		for(var i = 0; i < currentPiece.currentCoords.length; i++){
			blocks[currentPiece.currentCoords[i].x][currentPiece.currentCoords[i].y].setColour(currentPiece.getColour());
		}

		updateDebugDisplay();
}

/*
	Move piece on board
*/
function movePieceDown(){
	if(checkCollisionDown()){
		clearPieceFromBoard();
		currentPiece.moveDown();
		updatePieceOnBoard();
		return true;
	}else{
		setPieceInPlace();
		return false;
	}
}

function movePieceLeft(){
	if(checkCollisionLeft()){
		clearPieceFromBoard();
		currentPiece.moveLeft();
		updatePieceOnBoard();
	}
}

function movePieceRight(){
	if(checkCollisionRight()){
		clearPieceFromBoard();
		currentPiece.moveRight();
		updatePieceOnBoard();
	}
}

function rotatePiece(){
	currentPiece.rotate();
}

function setPieceInPlace(){
		for(var i = 0; i < currentPiece.currentCoords.length; i++){
			collisionMap[currentPiece.currentCoords[i].x][currentPiece.currentCoords[i].y] = true;
		}
		//Check for completed lines then move everything down
			checkCompletedLines();
		//
		spawnPiece(new Piece(randomBag.getNextLetter()));
}

//--End of move piece on board

//
// Collision checking
//
function checkCollisionDown(){
	for(var i = 0; i < currentPiece.currentCoords.length; i++){
		if(currentPiece.currentCoords[i].y == 0)
			return false;
		else if(collisionMap[currentPiece.currentCoords[i].x][currentPiece.currentCoords[i].y - 1])
			return false;
	}
	return true;
}

function checkCollisionLeft(){
	for(var i = 0; i < currentPiece.currentCoords.length; i++){
		if(currentPiece.currentCoords[i].x == 0)
			return false;
		else if(collisionMap[currentPiece.currentCoords[i].x - 1][currentPiece.currentCoords[i].y])
			return false;
	}
	return true;
}

function checkCollisionRight(){
	for(var i = 0; i < currentPiece.currentCoords.length; i++){
		if(currentPiece.currentCoords[i].x == boardWidth-1)
			return false;
		else if(collisionMap[currentPiece.currentCoords[i].x + 1][currentPiece.currentCoords[i].y])
			return false;
	}
	return true;
}

function checkCollisionForPiecePosition(positionCoords){
	for(var i = 0; i < positionCoords.length; i++){
		if(positionCoords[i].x < 0 || positionCoords[i].x > boardWidth-1)
			return false;
		else if(positionCoords[i].y < 0 || positionCoords[i].y > boardHeight-1)
			return false;
		else if(collisionMap[positionCoords[i].x][positionCoords[i].y])
			return false;
	}
	return true;
}

function checkCompletedLines(){
	for(var y = 0; y < boardHeight; y++){
		var lineCount = 0;
		for(var x = 0; x < boardWidth; x++){
			if(collisionMap[x][y] == true){
				lineCount++;
			}
		}
		if(lineCount >= 10){
			clearLine(y);
			moveLinesDown(y);
			y--;
		}
	}
}

function clearLine(lineNumber){
	for(var x = 0; x < boardWidth; x++){
		blocks[x][lineNumber].setColour(backgroundColour);
		collisionMap[x][lineNumber] = false;
	}
	linesCleared++;
	$("#score").html("Lines Cleared: " + linesCleared);
}

function moveLinesDown(startLine){
	for(var y = startLine+1; y < boardHeight; y++){
		for(var x = 0; x < boardWidth; x++){
			if(collisionMap[x][y] == true){
				blocks[x][y-1].setColour(blocks[x][y].getColour());
				blocks[x][y].setColour(backgroundColour);
				collisionMap[x][y] = false;
				collisionMap[x][y-1] = true;
			}
		}
	}
}

//-- End of Collision checking


$(window).resize(function() {
	drawBoard();
});

function toggleGreyOverlay(){
	if($("#greyOverlay").css("display") == "none")
		$("#greyOverlay").css("display", "initial");
	else
		$("#greyOverlay").css("display", "none");
}