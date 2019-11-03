"use strict";
/*more changes*/
var backgroundColour = "#4c5a61";
var frameColour = "#000000";
var testColour = "#ff00ee";
var boardWidth = 10;
var boardHeight = 20;
//--relative sizes--
var blockSizeRelative = 10;
var gapSizeRelative = 0.5;
var canvasHeightRelative = blockSizeRelative*boardHeight + gapSizeRelative*(boardHeight+1); 
var canvasWidthRelative = blockSizeRelative*boardWidth + gapSizeRelative*(boardWidth+1);
var canvasRelativeVerticalMargin = 0.05;

//--Actual sizes--
var blockSize;
var gapSize;

var canvasScaleMultiplier = 1.0;
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var blocks = [];
var collisionMap = [];

var pieceArray = ['I', 'O', 'J', 'L', 'S', 'Z', 'T'];
var randomBag;
var currentPiece;

var tickRate = 700;
var gameTime = 0;
var isPaused = false;
var useTouch = false;
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
