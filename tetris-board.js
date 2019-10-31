"use strict";

class squareDiv{
	constructor(div, x, y){
		this.x = x;
		this.y = y;
		this.colour;
		this.div = div;
	}

	setColour (colour){
	 	this.colour = colour;
		$("#"+this.div.id).css("background-color", this.colour);
	}

	getColour(){
		return this.colour;
	}

}

function createBoard(){
	board = document.getElementById("tetrisBoard");
	board.innerHTML = "";
	boardHeightActual = $(document).height() - boardPadding;
	boardHeightActual = window.innerHeight - boardPadding;
	console.group("Board Update");
	console.log(`Board update:\n$(document).height() = ${$(document).height()}\n$(document).height() - boardPadding = ${$(document).height() - boardPadding}\nboardHeightActual = ${boardHeightActual}`);	
	boardSizeMultiplier = boardHeightActual/boardHeightRelative;
	console.log(`boardSizeMultiplier = ${boardSizeMultiplier}`);
	boardWidthActual = boardWidthRelative*boardSizeMultiplier;
	frameSizeActual = frameSize*boardSizeMultiplier;
	squareSizeActual = squareSize*boardSizeMultiplier;
	gapSizeActual = gapSize*boardSizeMultiplier;

	board.style.width = boardWidthActual + "px";
	board.style.height = boardHeightActual + "px";
	board.style.backgroundColor = frameColour;
	board.style.position = "absolute";

	console.log(`board.style.height = ${board.style.height}`);
	console.groupEnd("Board Update");

	addHtml("#tetrisBoard", '<div id="boardInner"></div>');
	//$(document).html('<div id="boardInner"/>');
	var boardInner = document.getElementById("boardInner");
	boardInner.style.top =  unitPixels(frameSizeActual);
	boardInner.style.left =  unitPixels(frameSizeActual);


	boardInner.style.width = unitPixels($("#"+board.id).width() - 2*frameSizeActual);
	boardInner.style.height = unitPixels($("#"+board.id).height() - 2*frameSizeActual);
	boardInner.style.backgroundColor = backgroundColour;
	boardInner.style.position = "absolute";

	//Make the squares, activeSquare, and collision maps 
	var initialOffset = frameSizeActual + gapSizeActual;
	for(var x = 0; x < gameWidth; x++){
		collisionMap.push(new Array());
		squares.push(new Array());
		for(var y = 0; y < gameHeight; y++){
			addHtml("#tetrisBoard", '<div id="square'+x+'-'+y+'" ></div>');
			var square = document.getElementById("square"+x+"-"+y);
			square.style.width = unitPixels(squareSizeActual);
			square.style.height = unitPixels(squareSizeActual);
			square.style.left = unitPixels((squareSizeActual+gapSizeActual)*x + initialOffset);
			square.style.top = unitPixels((squareSizeActual+gapSizeActual)*(gameHeight-1-y) + initialOffset);
			square.style.position = "absolute";
			
			squares[x].push(new squareDiv(square, x, y));
			squares[x][y].setColour(backgroundColour);
			collisionMap[x].push(false);
		}
	}

	var htmlToAdd = `
	<div id="overlay">
		<div id="greyOverlay"></div>
		<div id="score"></div>
		<div id="centreMessageParent">
			<div id="centreMessage"></div>
		</div>
		<div id="touchButtonsParent">
			<div id="touchButtonUp" class="touchButtons"></div>
			<div id="touchButtonRight" class="touchButtons"></div>
			<div id="touchButtonDown" class="touchButtons"></div>
			<div id="touchButtonLeft" class="touchButtons"></div>
		</div>
	</div>`;

	if(useTouch){
		$("#touchButtonsParent").css("display", "initial");
	}
	else{
		$("#touchButtonsParent").css("display", "none");
	}

	addHtml("#boardInner", htmlToAdd);
	addHtml("#score", "Lines Cleared: " + linesCleared);

	if(isPaused){
		toggleGreyOverlay();
		addHtml("#centreMessage", "Paused");
	}
	console.log("boardSizeMultiplier = " + boardSizeMultiplier);
	console.log("document height = " + $(document).height());

	updateDebugDisplay();

}

function spawnPiece(piece){
	currentPiece = piece;

	if(checkCollisionForPiecePosition(currentPiece.spawnCoords)){
		for(var i = 0; i < currentPiece.spawnCoords.length; i++){
			squares[currentPiece.spawnCoords[i].x][currentPiece.spawnCoords[i].y].setColour(currentPiece.getColour());
		}
		//spawn piece
		updatePieceOnBoard();
	}
	else
		//game over
		gameOver();
	;


}

function clearBoard(){
	for(var x = 0; x < gameWidth; x++){
		for(var y = 0; y < gameHeight; y++){
			squares[x][y].setColour(backgroundColour);
			collisionMap[x][y] = false;;
		}
	}
}

function clearPieceFromBoard(){
	for(var i = 0; i < currentPiece.currentCoords.length; i++){
		squares[currentPiece.currentCoords[i].x][currentPiece.currentCoords[i].y].setColour(backgroundColour);
	}
}

function updatePieceOnBoard(){
		for(var i = 0; i < currentPiece.currentCoords.length; i++){
			squares[currentPiece.currentCoords[i].x][currentPiece.currentCoords[i].y].setColour(currentPiece.getColour());
		}

		updateDebugDisplay();
}

/*
	Move piece on board
*/
function movePieceDown(){
	if(checkCollisionDown()){
		currentPiece.moveDown();
		return true;
	}else{
		setPieceInPlace();
		return false;
	}
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
		if(currentPiece.currentCoords[i].x == gameWidth-1)
			return false;
		else if(collisionMap[currentPiece.currentCoords[i].x + 1][currentPiece.currentCoords[i].y])
			return false;
	}
	return true;
}

function checkCollisionForPiecePosition(positionCoords){
	for(var i = 0; i < positionCoords.length; i++){
		if(positionCoords[i].x < 0 || positionCoords[i].x > gameWidth-1)
			return false;
		else if(positionCoords[i].y < 0 || positionCoords[i].y > gameHeight-1)
			return false;
		else if(collisionMap[positionCoords[i].x][positionCoords[i].y])
			return false;
	}
	return true;
}

function checkCompletedLines(){
	for(var y = 0; y < gameHeight; y++){
		var lineCount = 0;
		for(var x = 0; x < gameWidth; x++){
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
	for(var x = 0; x < gameWidth; x++){
		squares[x][lineNumber].setColour(backgroundColour);
		collisionMap[x][lineNumber] = false;
	}
	linesCleared++;
	$("#score").html("Lines Cleared: " + linesCleared);
}

function moveLinesDown(startLine){
	for(var y = startLine+1; y < gameHeight; y++){
		for(var x = 0; x < gameWidth; x++){
			if(collisionMap[x][y] == true){
				squares[x][y-1].setColour(squares[x][y].getColour());
				squares[x][y].setColour(backgroundColour);
				collisionMap[x][y] = false;
				collisionMap[x][y-1] = true;
			}
		}
	}
}

//-- End of Collision checking



//Adds "px" unit for html and ensure value never goes below 1
function unitPixels(value){
	return value > 1 ? value + "px" : 1 + "px";
}

$(window).resize(function() {
	createBoard();
});

function changeSquareColour(x, y, colour){
	document.getElementById("square"+x+"-"+y).style.backgroundColor = colour;
}

function toggleGreyOverlay(){
	if($("#greyOverlay").css("display") == "none")
		$("#greyOverlay").css("display", "initial");
	else
		$("#greyOverlay").css("display", "none");
}