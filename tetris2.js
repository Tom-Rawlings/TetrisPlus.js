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


var Key = {
  pressed: {},

  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
  ESCAPE: 27,

  singleShot: {},
  keysDown: {},

  isDown: function(keyCode) {
    return this.pressed[keyCode];
  },

  isDownSingleShot: function(keyCode){
    if(this.singleShot[keyCode]){
      delete this.singleShot[keyCode];
      return true;
    }
    else return false;

  },
  
  onKeydown: function(event) {
    this.pressed[event.keyCode] = true;
    if(this.keysDown[event.keyCode] != true){
      this.singleShot[event.keyCode] = true;
    }
    this.keysDown[event.keyCode] = true;
  },
  
  onKeyup: function(event) {
    delete this.pressed[event.keyCode];
    delete this.keysDown[event.keyCode];
  }
}

window.addEventListener('keyup', function(event) { Key.onKeyup(event); }, false);
window.addEventListener('keydown', function(event) { Key.onKeydown(event); }, false);

var Helper = {};
Helper.debounce = function(func, wait, immediate) {

  var timeout;

  return function() {

      var context = this,
          args = arguments; 

      var later = function() {
          
          timeout = null;

          if ( !immediate ) {
              func.apply(context, args);
          }
      };

      var callNow = immediate && !timeout;

      clearTimeout(timeout);

      timeout = setTimeout(later, wait || 200);

      if ( callNow ) { 
          func.apply(context, args);
      }
  };
};


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
