"use strict";
var TetrisPlus = {};

TetrisPlus.config = {
  parentId : "game",                //ID of the html div that TetrisPlus will occupy.
  backgroundColour : "#DDDDDD",     //Background colour of the canvas that will be visible as grid between blocks.
  emptyBlockColour : "#FFFFFF",     //Colour of empty blocks that will make up the tetris board.
  overlayColour : "#000000",        //Base colour of the transparent overlay used when the game is paused.
  overlayTextColour : "#FFFFFF",    //Colour of overlayed text such as the introduction message.
  scoreTextColour : "#000000",      //Colour used to display the number of lines cleared on screen.
  borderColour : "#000000",         //Colour of border around the generated canvas element.
  
  blockSizeRelative : 10,           //Size of the onscreen blocks relative to the gaps inbetween.
  gapSizeRelative : 0.5,            //Size of the gaps inbetween blocks relative to the blocks themselves.
  //canvasRelativeVerticalMargin : 0.1, //
  
  boardWidth : 10,                  //Number of blocks wide the tetris board will be.
  boardHeight : 20,                 //Number of blocks tall the tetris board will be.
  
  //tickRate : 800,                   //
  moveDownDelay : 80,               //Millisecond delay between the piece moving down when holding the down arrow key .
  targetFrameRate : 60,             //Number of frames per second the game will attempt to run at.
  //pausedFrameRate : 5,              //Number of frames per second the game will.

  dropSpeeds : [800, 720, 630, 550, //Drop speeds used for difficulty levels in milliseconds.
    470, 380, 300, 220, 130, 100, 80],
  linesPerLevel : 5,                //Number of lines needed to be cleared before difficulty level increases.

  useDarkTheme : false,             //Whether or not to use the provided dark theme.
  useBackgroundGrid : false,        //Whether or not to use separate background colour from empty blocks to form grid lines.

  pieceColours : {                  //Colours used for the pieces.
    I : "#f7d308",
    O : "#47e6ff",
    J : "#5a65ad",
    L : "#ef7921",
    S : "#42b642",
    Z : "#ef2029",
    T : "#ad4d9c"
  }
};

TetrisPlus.darkTheme = {            //Provided dark theme
  backgroundColour : "#000000",
  emptyBlockColour : "#4c5a61",
  overlayColour : "#000000",
  overlayTextColour : "#FFFFFF",
  scoreTextColour : "#FFFFFF",
  borderColour : "#FFFFFF",
};

//2D coordinate class used for block positions and rotations.
TetrisPlus.Coord2d = class{
	constructor(x, y){
			this.x = x;
			this.y = y;
	}

	clone(){
			return new TetrisPlus.Coord2d(this.x, this.y);
	}
};

//Key event codes and input manager.
TetrisPlus.Input = {};
TetrisPlus.Input.Key = {
  
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
  ESCAPE: 27,
  SPACE: 32,
  P: 80,
  R: 82,

  pressed: {},  //List of keys currently held down.
  down: {},     //List of keys pressed down since last frame.
  up: {},       //List of keys released since last frame.

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
};

TetrisPlus.Helper = {};

//Method used to throttle moving the piece down and also resizing the canvas
TetrisPlus.Helper.throttle = function(func, wait, options) {
  var context, args, result;
  var timeout = null;
  var previous = 0;
  if (!options) options = {};
  var later = function() {
    previous = options.leading === false ? 0 : Date.now();
    timeout = null;
    result = func.apply(context, args);
    if (!timeout) context = args = null;
  };
  return function() {
    var now = Date.now();
    if (!previous && options.leading === false) previous = now;
    var remaining = wait - (now - previous);
    context = this;
    args = arguments;
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining);
    }
    return result;
  };
};

//Extends an object. Used for applying user supplied configurations.
TetrisPlus.Helper.extend = function(a, b){
  for(var key in b)
    if(b.hasOwnProperty(key))
      a[key] = b[key];
  return a;
};



TetrisPlus.makeRandomBag = (function(){
  var randomBag = {};
  (function () {
    var pieces = ['I', 'O', 'J', 'L', 'S', 'Z', 'T'];
    var piecesInBag;

    this.getNextLetter = function () {
      var pieceToReturn = 'Z';
      if(piecesInBag.length == 0){
        this.reshuffle();
      }
      pieceToReturn = piecesInBag.pop();
      return pieceToReturn;
    };
    
    this.reshuffle = function() {
      piecesInBag = Array.from(pieces);
      var randomPiece;
      var j = 0;
      for(var i = 0; i < pieces.length; i++){
        j = Math.floor(Math.random() * 7);
        randomPiece = piecesInBag[j];
        piecesInBag[j] = piecesInBag[i];
        piecesInBag[i] = randomPiece;
      }
    };
    this.printContents = function(){
      var htmlToPrint = "piecesInBag.length = " + piecesInBag.length;
      for(var i = 0; i < piecesInBag.length; i++){
        htmlToPrint += TetrisPlus.Pieces.printPiece(piecesInBag[i]);
      }
      return htmlToPrint;
    };

    this.reshuffle();
      
  }).apply( randomBag );

  return randomBag;

});



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
			};
	 
			this.getColour = function(){
				return colour;
			};
	 
			this.setXcoord = function(_xCoord){
				xCoord = _xCoord;
			};
	 
			this.setYcoord = function(_yCoord){
				yCoord = _yCoord;
			};
	 
			this.draw = function(){
				TetrisPlus.board.canvas.ctx.fillStyle = colour;
				TetrisPlus.board.canvas.ctx.fillRect(xCoord, yCoord, this.blockSize, this.blockSize);
			};
				
		}).apply( block );
	
		return block;
	
	}),

	calculateCanvasDimensions : function(){
		this.canvas.element.height = this.canvas.parent.offsetHeight;//-(TetrisPlus.config.canvasRelativeVerticalMargin*this.canvas.parent.offsetHeight * 2);
		this.canvasScaleMultiplier = this.canvas.element.height/this.canvasHeightRelative;
		//this.blockSize = Math.floor(TetrisPlus.config.blockSizeRelative * this.canvasScaleMultiplier);
		//this.gapSize = Math.floor(TetrisPlus.config.gapSizeRelative * this.canvasScaleMultiplier);
		this.blockSize = (TetrisPlus.config.blockSizeRelative * this.canvasScaleMultiplier);
		this.gapSize = (TetrisPlus.config.gapSizeRelative * this.canvasScaleMultiplier);
		//if(this.gapSize < 1) this.gapSize = 1;
		//if(this.blockSize < 1) this.blockSize = 1;
	
		this.canvas.element.height = this.blockSize*TetrisPlus.config.boardHeight + this.gapSize*(TetrisPlus.config.boardHeight+1); 
		this.canvas.element.width = this.blockSize*TetrisPlus.config.boardWidth + this.gapSize*(TetrisPlus.config.boardWidth+1);
	},

	createBoard : function(){

		this.calculateCanvasDimensions();
		this.setupBoardArrays();

	},

	drawBoard : function(){
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

	setupBoardArrays : function(){
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

	showBoard : function(){
		this.canvas.element.style.display = "block";
	},

	spawnPiece : function(pieceLetter){
		TetrisPlus.board.currentPiece.setupPiece(pieceLetter);
	
		if(this.checkCollisionForPiecePosition(TetrisPlus.board.currentPiece.getSpawnCoords())){
			//spawn piece
			this.updatePieceOnBoard();
		}
		else{
			//game over
			TetrisPlus.Game.gameOver();
		}
	},

	setPieceInPlace : function(){
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
	movePieceDown : function(){
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

	movePieceLeft : function(){
		if(this.checkCollisionLeft()){
			this.clearPieceFromBoard();
			TetrisPlus.board.currentPiece.moveLeft();
			this.updatePieceOnBoard();
		}
	},

	movePieceRight : function(){
		if(this.checkCollisionRight()){
			this.clearPieceFromBoard();
			TetrisPlus.board.currentPiece.moveRight();
			this.updatePieceOnBoard();
		}
	},

	rotatePiece : function(){
		TetrisPlus.board.currentPiece.rotate();
	},

	clearBoard : function(){
		for(var x = 0; x < TetrisPlus.config.boardWidth; x++){
			for(var y = 0; y < TetrisPlus.config.boardHeight; y++){
				this.blocks[x][y].setColour(TetrisPlus.config.emptyBlockColour);
				this.collisionMap[x][y] = false;
			}
		}
	},
	
	clearPieceFromBoard : function(){
		for(var i = 0; i < TetrisPlus.board.currentPiece.getCurrentCoords().length; i++){
			this.blocks[TetrisPlus.board.currentPiece.getCurrentCoords()[i].x][TetrisPlus.board.currentPiece.getCurrentCoords()[i].y].setColour(TetrisPlus.config.emptyBlockColour);
		}
	},
	
	updatePieceOnBoard : function(){
			for(var i = 0; i < TetrisPlus.board.currentPiece.getCurrentCoords().length; i++){
				this.blocks[TetrisPlus.board.currentPiece.getCurrentCoords()[i].x][TetrisPlus.board.currentPiece.getCurrentCoords()[i].y].setColour(TetrisPlus.board.currentPiece.getColour());
			}
	},
	
	drawPiece : function(){
		for(var i = 0; i < TetrisPlus.board.currentPiece.getCurrentCoords().length; i++){
			this.blocks[TetrisPlus.board.currentPiece.getCurrentCoords()[i].x][TetrisPlus.board.currentPiece.getCurrentCoords()[i].y].draw();
		}
	},


	//
	// Collision checking
	//
	checkCollisionDown : function(){
		for(var i = 0; i < TetrisPlus.board.currentPiece.getCurrentCoords().length; i++){
			if(TetrisPlus.board.currentPiece.getCurrentCoords()[i].y == 0)
				return false;
			else if(this.collisionMap[TetrisPlus.board.currentPiece.getCurrentCoords()[i].x][TetrisPlus.board.currentPiece.getCurrentCoords()[i].y - 1])
				return false;
		}
		return true;
	},

	checkCollisionLeft : function(){
		for(var i = 0; i < TetrisPlus.board.currentPiece.getCurrentCoords().length; i++){
			if(TetrisPlus.board.currentPiece.getCurrentCoords()[i].x == 0)
				return false;
			else if(this.collisionMap[TetrisPlus.board.currentPiece.getCurrentCoords()[i].x - 1][TetrisPlus.board.currentPiece.getCurrentCoords()[i].y])
				return false;
		}
		return true;
	},

	checkCollisionRight : function(){
		for(var i = 0; i < TetrisPlus.board.currentPiece.getCurrentCoords().length; i++){
			if(TetrisPlus.board.currentPiece.getCurrentCoords()[i].x == TetrisPlus.config.boardWidth-1)
				return false;
			else if(this.collisionMap[TetrisPlus.board.currentPiece.getCurrentCoords()[i].x + 1][TetrisPlus.board.currentPiece.getCurrentCoords()[i].y])
				return false;
		}
		return true;
	},

	checkCollisionForPiecePosition : function(positionCoords){
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


	
	checkCompletedLines : function(){
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

	clearLine : function(lineNumber){
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

	moveLinesDown : function(startLine){
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


	drawScore : function(){
		var size = 8;
		size = size*this.canvasScaleMultiplier;
		this.canvas.ctx.font = size + "px Arial";
		this.canvas.ctx.fillStyle = TetrisPlus.config.scoreTextColour;
		this.canvas.ctx.globalAlpha = 0.7;
		this.canvas.ctx.fillText("Lines Cleared: " + TetrisPlus.Game.linesCleared, 2*this.canvasScaleMultiplier, size);
		this.canvas.ctx.globalAlpha = 1.0;
	},
	
	toggleOverlayBackground : function(){
		if(overlayOn){
			overlayOn = false;
			drawBoard();
		}else{
			drawOverlay();
			overlayOn = true;
		}
	},
	
	drawPauseState : function(){
		this.drawOverlay();
		this.overlayTextCentre("Paused", 30);
		this.overlayText("Press 'R'", 14, 25, 130);
		this.overlayText("To Restart", 14, 20, 145);
	},
	
	drawOverlay : function(){
		this.canvas.ctx.fillStyle = TetrisPlus.config.overlayColour;
		this.canvas.ctx.globalAlpha = 0.5;
		this.canvas.ctx.fillRect(0, 0, this.canvas.element.width, this.canvas.element.height);
		this.canvas.ctx.globalAlpha = 1.0;
	},
	
	overlayTextCentre : function(message, size){
		size = size*TetrisPlus.board.canvasScaleMultiplier;
		this.canvas.ctx.font = size + "px Arial";
		this.canvas.ctx.fillStyle = TetrisPlus.config.overlayTextColour;
		this.canvas.ctx.fillText(message, 0, this.canvas.element.height/2);
	},

	drawOverlayMessages : function(){
		this.drawOverlay();
		for(var i = 0; i < this.overlayMessages.length; i++){
			this.overlayText(this.overlayMessages[i].message, this.overlayMessages[i].size, this.overlayMessages[i].x, this.overlayMessages[i].y);
		}
	},

	overlayText : function(message, size, x, y){
		size = size*TetrisPlus.board.canvasScaleMultiplier;
		this.canvas.ctx.font = size + "px Arial";
		this.canvas.ctx.fillStyle = TetrisPlus.config.overlayTextColour;
		this.canvas.ctx.fillText(message, x*TetrisPlus.board.canvasScaleMultiplier, y*TetrisPlus.board.canvasScaleMultiplier);
	}


};



TetrisPlus.Pieces = {
	I : {
		spawnCoords : [new TetrisPlus.Coord2d(3, 18), new TetrisPlus.Coord2d(4, 18), new TetrisPlus.Coord2d(5, 18), new TetrisPlus.Coord2d(6, 18)],
		rotations : [
			[new TetrisPlus.Coord2d(-2, 0), new TetrisPlus.Coord2d(-1, 0), new TetrisPlus.Coord2d(0, 0), new TetrisPlus.Coord2d(1, 0)],
			[new TetrisPlus.Coord2d(0, 2), new TetrisPlus.Coord2d(0, 1),  new TetrisPlus.Coord2d(0, 0), new TetrisPlus.Coord2d(0, -1)]
		],
		colour : "#f7d308"
	},
	
	O : {
		spawnCoords : [new TetrisPlus.Coord2d(4, 19), new TetrisPlus.Coord2d(5, 19), new TetrisPlus.Coord2d(4, 18), new TetrisPlus.Coord2d(5, 18)],
		rotations : [
			[new TetrisPlus.Coord2d(1, 0), new TetrisPlus.Coord2d(1, 1), new TetrisPlus.Coord2d(0, 0), new TetrisPlus.Coord2d(0, 1)]
		],
		colour : "#47e6ff"
	},
	
	J : {
		spawnCoords : [new TetrisPlus.Coord2d(3, 19), new TetrisPlus.Coord2d(3, 18), new TetrisPlus.Coord2d(4, 18), new TetrisPlus.Coord2d(5, 18)],
		rotations : [
			[new TetrisPlus.Coord2d(-1, 1), new TetrisPlus.Coord2d(-1, 0), new TetrisPlus.Coord2d(0, 0), new TetrisPlus.Coord2d(1, 0)],
			[new TetrisPlus.Coord2d(0, -1),  new TetrisPlus.Coord2d(0, 1),  new TetrisPlus.Coord2d(0, 0), new TetrisPlus.Coord2d(1, 1)],
			[new TetrisPlus.Coord2d(-1, 0),  new TetrisPlus.Coord2d(1, 0),  new TetrisPlus.Coord2d(0, 0), new TetrisPlus.Coord2d(1, -1)],
			[new TetrisPlus.Coord2d(-1, -1), new TetrisPlus.Coord2d(0, -1), new TetrisPlus.Coord2d(0, 0), new TetrisPlus.Coord2d(0, 1)]
		],
		colour : "#5a65ad"
	},

	L : {
		spawnCoords : [new TetrisPlus.Coord2d(5, 19), new TetrisPlus.Coord2d(3, 18), new TetrisPlus.Coord2d(4, 18), new TetrisPlus.Coord2d(5, 18)],
		rotations : [
			[new TetrisPlus.Coord2d(-1, 0), new TetrisPlus.Coord2d(1, 0),  new TetrisPlus.Coord2d(0, 0), new TetrisPlus.Coord2d(1, 1)],
			[new TetrisPlus.Coord2d(0, 1),   new TetrisPlus.Coord2d(0, -1), new TetrisPlus.Coord2d(0, 0), new TetrisPlus.Coord2d(1, -1)],
			[new TetrisPlus.Coord2d(-1, -1), new TetrisPlus.Coord2d(-1, 0), new TetrisPlus.Coord2d(0, 0), new TetrisPlus.Coord2d(1, 0)],
			[new TetrisPlus.Coord2d(-1, 1),  new TetrisPlus.Coord2d(0, 1),  new TetrisPlus.Coord2d(0, 0), new TetrisPlus.Coord2d(0, -1)]
		],
		colour : "#ef7921"
	},

	S : {
		spawnCoords : [new TetrisPlus.Coord2d(3, 18), new TetrisPlus.Coord2d(5, 19), new TetrisPlus.Coord2d(4, 19), new TetrisPlus.Coord2d(4, 18)],
		rotations : [
			[new TetrisPlus.Coord2d(-1, -1), new TetrisPlus.Coord2d(0, -1), new TetrisPlus.Coord2d(0, 0), new TetrisPlus.Coord2d(1, 0)],
			[new TetrisPlus.Coord2d(0, 1),    new TetrisPlus.Coord2d(1, 0),  new TetrisPlus.Coord2d(0, 0), new TetrisPlus.Coord2d(1, -1)],
			[new TetrisPlus.Coord2d(-1, -1),  new TetrisPlus.Coord2d(0, -1), new TetrisPlus.Coord2d(0, 0), new TetrisPlus.Coord2d(1, 0)],
			[new TetrisPlus.Coord2d(0, 1),    new TetrisPlus.Coord2d(1, 0),  new TetrisPlus.Coord2d(0, 0), new TetrisPlus.Coord2d(1, -1)]
		],
		colour : "#42b642"
	},

	Z : {
		spawnCoords : [new TetrisPlus.Coord2d(3, 19), new TetrisPlus.Coord2d(4, 18), new TetrisPlus.Coord2d(4, 19), new TetrisPlus.Coord2d(5, 18)],
		rotations : [
			[new TetrisPlus.Coord2d(-1, 0), new TetrisPlus.Coord2d(0, -1), new TetrisPlus.Coord2d(0, 0), new TetrisPlus.Coord2d(1, -1)],
			[new TetrisPlus.Coord2d(0, -1),  new TetrisPlus.Coord2d(1, 0),  new TetrisPlus.Coord2d(0, 0), new TetrisPlus.Coord2d(1, 1)],
			[new TetrisPlus.Coord2d(-1, 0),  new TetrisPlus.Coord2d(0, -1), new TetrisPlus.Coord2d(0, 0), new TetrisPlus.Coord2d(1, -1)],
			[new TetrisPlus.Coord2d(0, -1),  new TetrisPlus.Coord2d(1, 0),  new TetrisPlus.Coord2d(0, 0), new TetrisPlus.Coord2d(1, 1)]
		],
		colour : "#ef2029"
	},

	T : {
		spawnCoords : [new TetrisPlus.Coord2d(4, 19), new TetrisPlus.Coord2d(3, 18), new TetrisPlus.Coord2d(4, 18), new TetrisPlus.Coord2d(5, 18)],
		rotations : [
			[new TetrisPlus.Coord2d(-1, 0), new TetrisPlus.Coord2d(0, 1),  new TetrisPlus.Coord2d(0, 0), new TetrisPlus.Coord2d(1, 0)],
			[new TetrisPlus.Coord2d(0, 1),   new TetrisPlus.Coord2d(1, 0),  new TetrisPlus.Coord2d(0, 0), new TetrisPlus.Coord2d(0, -1)],
			[new TetrisPlus.Coord2d(-1, 0),  new TetrisPlus.Coord2d(0, -1), new TetrisPlus.Coord2d(0, 0), new TetrisPlus.Coord2d(1, 0)],
			[new TetrisPlus.Coord2d(-1, 0),  new TetrisPlus.Coord2d(0, 1),  new TetrisPlus.Coord2d(0, 0), new TetrisPlus.Coord2d(0, -1)]
		],
		colour : "#ad4d9c"
	},

	printPiece : function(pieceLetter){
		var xOffset = 3;
		var yOffset = 18;
		var htmlToReturn = "<table>";
		var pieces = {"I":this.I, "O":this.O, "J":this.J, "L":this.L, "S":this.S,"Z":this.Z, "T":this.T};
		var piece = pieces[pieceLetter];

		for(var y = 1; y >= 0 ; y--){
			htmlToReturn += "<tr>";
			for(var x = 0; x < 4; x++){
				var hasMatched = false;
				for(var i = 0; i < piece.spawnCoords.length; i++){
					if(x == piece.spawnCoords[i].x - xOffset && y == piece.spawnCoords[i].y - yOffset){
						hasMatched = true;
						break;
					}
				}
				if(hasMatched == true)
					htmlToReturn += '<td style="background-color: ' + piece.colour + '"></td>';
				else
					htmlToReturn += '<td style="background-color: white"></td>';
			}
			htmlToReturn += "</tr>";
		}

		htmlToReturn += "</table>";

		return htmlToReturn;
		
	},

};

TetrisPlus.board.currentPiece = (function(){
	var pieceLetter = pieceLetter;
	var spawnCoords = Array.from(TetrisPlus.Pieces.Z.spawnCoords);
	var currentCoords = Array.from(spawnCoords);
	var rotations = Array.from(TetrisPlus.Pieces.Z.rotations);
	var currentRotation = 0;
	var colour = TetrisPlus.Pieces.Z.colour;
	return {

		setupPiece : function(_pieceLetter){
			pieceLetter = _pieceLetter;
			currentRotation = 0;
			switch (pieceLetter){
				case 'I':
					spawnCoords = Array.from(TetrisPlus.Pieces.I.spawnCoords);
					rotations = Array.from(TetrisPlus.Pieces.I.rotations);
					colour = TetrisPlus.Pieces.I.colour;
					break;
				case 'O':
					spawnCoords = Array.from(TetrisPlus.Pieces.O.spawnCoords);
					rotations = Array.from(TetrisPlus.Pieces.O.rotations);
					colour = TetrisPlus.Pieces.O.colour;
					break;
				case 'J':
					spawnCoords = Array.from(TetrisPlus.Pieces.J.spawnCoords);
					rotations = Array.from(TetrisPlus.Pieces.J.rotations);
					colour = TetrisPlus.Pieces.J.colour;
					break;
				case 'L':
					spawnCoords = Array.from(TetrisPlus.Pieces.L.spawnCoords);
					rotations = Array.from(TetrisPlus.Pieces.L.rotations);
					colour = TetrisPlus.Pieces.L.colour;
					break;
				case 'S':
					spawnCoords = Array.from(TetrisPlus.Pieces.S.spawnCoords);
					rotations = Array.from(TetrisPlus.Pieces.S.rotations);
					colour = TetrisPlus.Pieces.S.colour;
					break;
				case 'T':
					spawnCoords = Array.from(TetrisPlus.Pieces.T.spawnCoords);
					rotations = Array.from(TetrisPlus.Pieces.T.rotations);
					colour = TetrisPlus.Pieces.T.colour;
					break;
				default:
					spawnCoords = Array.from(TetrisPlus.Pieces.Z.spawnCoords);
					rotations = Array.from(TetrisPlus.Pieces.Z.rotations);
					colour = TetrisPlus.Pieces.Z.colour;
			}
			currentCoords = this.copyCoords(spawnCoords);
		},

		toString : function(){
			return "Piece" + pieceLetter;
		},
	
		getColour : function(){
			return colour;
		},

		getSpawnCoords : function(){
			return spawnCoords;
		},

		getCurrentCoords : function(){
			return currentCoords;
		},
	
		rotate : function(){
			/*
			loop through new rotation and create new coords by adding them to current coords
			check each new coord for collision
	
			Added to the third [2] square's coords
			*/
			TetrisPlus.board.clearPieceFromBoard();
	
			var nextRotation = currentRotation;
			nextRotation++;
			if(nextRotation >= rotations.length){
				nextRotation = 0;
			}
	
			var currentPosition = this.copyCoords(currentCoords);
	
			//Piece pivots based on the its second square
			var pivotCoords = new TetrisPlus.Coord2d(currentCoords[2].x, currentCoords[2].y);
	
			for(var i = 0; i < rotations[nextRotation].length; i++){
				currentCoords[i].x = pivotCoords.x + rotations[nextRotation][i].x;
				currentCoords[i].y = pivotCoords.y + rotations[nextRotation][i].y;
			}
	
	
			if(!TetrisPlus.board.checkCollisionForPiecePosition(currentCoords)){
				//Revert the coords back as there's no room to rotate
				currentCoords = currentPosition;
			}else{
				currentRotation = nextRotation;	
			}
	
			TetrisPlus.board.updatePieceOnBoard();
		},
	
		moveDown : function(){
			for(var i = 0; i < currentCoords.length; i++){
				currentCoords[i].y--;
			}
		},
	
		moveLeft : function(){
			for(var i = 0; i < currentCoords.length; i++){
				currentCoords[i].x--;
			}
		},
	
		moveRight : function(){
			for(var i = 0; i < currentCoords.length; i++){
				currentCoords[i].x++;
			}
		},

		copyCoords : function(arrayToCopy){
			var copiedArray = [];
			for(var i = 0; i < arrayToCopy.length; i++){
				copiedArray.push(new TetrisPlus.Coord2d(arrayToCopy[i].x, arrayToCopy[i].y));
			}
			return copiedArray;
		},

	};
}());



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

		if (TetrisPlus.Input.Key.getKeyDown(TetrisPlus.Input.Key.ESCAPE)){
			TetrisPlus.Game.togglePause();
		}

		TetrisPlus.Input.Key.clear();

		//Update graphics
		TetrisPlus.Game.drawGraphics();

		if(!TetrisPlus.Game.isPaused){
			TetrisPlus.Game.decreaseTickTimer(previousTime);
		}
		TetrisPlus.Game.FrameCounter.increaseCounter(previousTime);
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
				window.addEventListener('keydown', TetrisPlus.startInput, false);
			}
		}
	}

};

TetrisPlus.startInput = function(event){
	if(TetrisPlus.Game.isPaused){
		if(event.keyCode == TetrisPlus.Input.Key.ESCAPE){
			window.removeEventListener('keydown', TetrisPlus.startInput);
			TetrisPlus.Input.Key.clear();
			TetrisPlus.Game.togglePause();
		}
		if(event.keyCode == TetrisPlus.Input.Key.R){
			window.removeEventListener('keydown', TetrisPlus.startInput);
			TetrisPlus.Input.Key.clear();
			TetrisPlus.Game.togglePause();
			TetrisPlus.Game.stop();
			TetrisPlus.Game.start();
		}
	}else{
		if(event.keyCode == TetrisPlus.Input.Key.SPACE) 
			TetrisPlus.Game.start(); 
	}

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
