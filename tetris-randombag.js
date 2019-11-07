"use strict";
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