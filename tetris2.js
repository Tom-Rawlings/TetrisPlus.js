"use strict";
/*more changes*/
var backgroundColour = "#000000";
var emptyBlockColour = "#4c5a61";
var testColour = "#ff00ee";
var overlayColour = "#000000";
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
var canvas;
var blocks = [];
var collisionMap = [];

var pieceArray = ['I', 'O', 'J', 'L', 'S', 'Z', 'T'];
var randomBag;
var currentPiece;

var tickRate = 700;
var targetFrameRate = 60;
var pausedFrameRate = 10;
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
  P: 80,

  down: {},
  up: {},

  getKey: function(keyCode) {
    return this.pressed[keyCode];
  },

  getKeyDown: function(keyCode){
    return this.down[keyCode];
  },

  getKeyUp: function(keyCode){
    return this.up[keyCode];
  },

  clear: function(){
    this.down = {};
    this.up = {};
  },
  
  onKeydown: function(event) {
    if(this.pressed[event.keyCode] != true){
      this.down[event.keyCode] = true;
    }
    this.pressed[event.keyCode] = true;
  },
  
  onKeyup: function(event) {
    if(this.pressed[event.keyCode] == true){
      this.up[event.keyCode] = true;
    }
    delete this.pressed[event.keyCode];
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
