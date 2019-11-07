"use strict";
var TetrisPlus = {};

TetrisPlus.config = {
  parentId : "parentDiv",           //ID of the html div that TetrisPlus will occupy.
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
/*
TetrisPlus.Helper.debounce = function(func, wait, immediate) {

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
*/

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