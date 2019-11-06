"use strict";
var TetrisPlus = {};
TetrisPlus.Game = {};
TetrisPlus.board = {};

/*
  Non-Configurable
*/
var canvasHeightRelative; 
var canvasWidthRelative;
var canvasScaleMultiplier = 1.0;

var blockSize;
var gapSize;

//var pieceArray = ['I', 'O', 'J', 'L', 'S', 'Z', 'T'];
var randomBag;
var currentPiece;



//var blocks = [];
//var collisionMap = [];



/*
  Configurable

  var backgroundColour = "#000000";
  var emptyBlockColour = "#4c5a61";
  var overlayColour = "#000000";
  var overlayTextColour = "#FFFFFF";
  
  var blockSizeRelative = 10;
  var gapSizeRelative = 0.5;
  var canvasRelativeVerticalMargin = 0.05;
  
  var boardWidth = 10;
  var boardHeight = 20;
  
  var tickRate = 700;
  var moveDownDelay = 100;
  var targetFrameRate = 60;
  var pausedFrameRate = 5;
*/


TetrisPlus.config = {
  cavnasId : "canvas",
  backgroundColour : "#000000",
  emptyBlockColour : "#4c5a61",
  overlayColour : "#000000",
  overlayTextColour : "#FFFFFF",
  
  blockSizeRelative : 10,
  gapSizeRelative : 0.5,
  canvasRelativeVerticalMargin : 0.05,
  
  boardWidth : 10,
  boardHeight : 20,
  
  tickRate : 700,
  moveDownDelay : 100,
  targetFrameRate : 60,
  pausedFrameRate : 5
};

TetrisPlus.init = function(config){
  TetrisPlus.Helper.extend(this.config, config);
  TetrisPlus.Game.start();
};


class Coord2d{
    constructor(x, y){
        this.x = x;
        this.y = y;
    }

    clone(){
        return new Coord2d(this.x, this.y);
    }
}

//-------------------------------------

//
//---Contol Stuff---
//
TetrisPlus.Input = {};
TetrisPlus.Input.Key = {
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
};

TetrisPlus.Helper = {};
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

TetrisPlus.Helper.extend = function(a, b){
  for(var key in b)
      if(b.hasOwnProperty(key))
          a[key] = b[key];
  return a;
};
