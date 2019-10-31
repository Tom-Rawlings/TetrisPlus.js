"use strict";
/*more changes*/
var backgroundColour = "#FFFFFF";
var frameColour = "#000000";
var testColour = "#ff00ee";
var gameWidth = 10;
var gameHeight = 20;
//--relative sizes--
var squareSize = 10;
var frameSize = 1;
var gapSize = 1;
var boardHeightRelative = frameSize*2 + squareSize*20 + gapSize*21; 
var boardWidthRelative = frameSize*2 + squareSize*10 + gapSize*11; 
//--Actual sizes--
var squareSizeActual;
var frameSizeActual;
var gapSizeActual;
var boardHeightActual;
var boardWidthActual;

var boardPadding = 20;
var boardSizeMultiplier = 1.0;
var board;
var squares = new Array();
var collisionMap = new Array();

var pieceArray = ['I', 'O', 'J', 'L', 'S', 'Z', 'T'];
var randomBag;
var currentPiece;

var tickRate = 700;
var gameTime = 0;
var isPaused = false;
var useTouch = true;
var linesCleared = 0;


class Coord2d{
    constructor(x, y){
        this.x = x;
        this.y = y;
    }

    clone(){
        return new Coord2d(this.x, this.y);
    }
}


//
//---Random bag stuff---
//

class RandomBag{
	constructor(pieceArray){
		//NEED TO COPY ARRAY 
		this.piecesInBag = Array.from(pieceArray);
		this.reshuffle();
	}

    reshuffle(){
        this.piecesInBag = Array.from(pieceArray);
        var randomPiece;
        var j = 0;
        for(var i = 0; i < pieceArray.length; i++){
            j = Math.floor(Math.random() * 7);
            randomPiece = this.piecesInBag[j];
            this.piecesInBag[j] = this.piecesInBag[i];
            this.piecesInBag[i] = randomPiece;
        }
    }

	getNextLetter(){
		var pieceToReturn = 'Z';
		if(this.piecesInBag.length == 0){
			this.reshuffle();
		}
        pieceToReturn = this.piecesInBag.pop();
		return pieceToReturn;
	}

  printContents(){
    var htmlToPrint = "piecesInBag.length = " + this.piecesInBag.length;
    for(var i = 0; i < this.piecesInBag.length; i++){
      htmlToPrint += new Piece(this.piecesInBag[i]).printPiece();

    }
    return htmlToPrint;
  }


}


//-------------------------------------

//
//---Contol Stuff---
//

//touch control
function setupTouchButton(){
  $("#touchButtonUp").click(
    function(){
      currentPiece.rotate();
    }
  );
  $("#touchButtonDown").click(
    function(){
      if(movePieceDown()){
        tickReset();
      }
    }
  );
  $('#touchButtonLeft').on('click',
    function(){
      if(checkCollisionLeft()){
        currentPiece.moveLeft();
      }
    }
  );
  $("#touchButtonRight").click(
    function(){
      if(checkCollisionRight())
      currentPiece.moveRight();
    }
  );
}


document.onkeydown = checkKeyDown;

function checkKeyDown(e) {

    e = e || window.event;

    //SPACE
    if (e.keyCode == '32') {
      clearPieceFromBoard();
      spawnPiece(new Piece(randomBag.getNextLetter()));
    }


    //ESCAPE
    else if (e.keyCode == '27'){
      togglePause();
    }


    if(isPaused)
      return;

    //Arrow Key UP
    else if (e.keyCode == '38') {
      currentPiece.rotate();
    }

    //Arrow Key DOWN
    else if (e.keyCode == '40') {

      if(movePieceDown()){
        tickReset();
      }
    }

    //Arrow Key LEFT
    else if (e.keyCode == '37') {
      if(checkCollisionLeft())
        currentPiece.moveLeft();
    }

    //Arrow Key RIGHT
    else if (e.keyCode == '39') {
      if(checkCollisionRight())
        currentPiece.moveRight();
    }

}


function addHtml(id, htmlToAdd){
	var currentHtml = $(id).html();
	currentHtml += htmlToAdd;
	$(id).html(currentHtml);
}

function cloneCoordArray(arrayToClone){
  var clonedArray = new Array();
  for(var i = 0; i < arrayToClone.length; i++){
    clonedArray.push(arrayToClone[i].clone());
  }
  return clonedArray;
}
