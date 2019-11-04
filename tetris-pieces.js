"use strict";
//Spawn locations
var Pieces = {
	I : {
		spawnCoords : [new Coord2d(3, 18), new Coord2d(4, 18), new Coord2d(5, 18), new Coord2d(6, 18)],
		rotations : [
			[new Coord2d(-2, 0), new Coord2d(-1, 0), new Coord2d(0, 0), new Coord2d(1, 0)],
			[new Coord2d(0, 2), new Coord2d(0, 1),  new Coord2d(0, 0), new Coord2d(0, -1)]
		],
		colour : "#f7d308"
	},
	
	O : {
		spawnCoords : [new Coord2d(4, 19), new Coord2d(5, 19), new Coord2d(4, 18), new Coord2d(5, 18)],
		rotations : [
			[new Coord2d(1, 0), new Coord2d(1, 1), new Coord2d(0, 0), new Coord2d(0, 1)]
		],
		colour : "#47e6ff"
	},
	
	J : {
		spawnCoords : [new Coord2d(3, 19), new Coord2d(3, 18), new Coord2d(4, 18), new Coord2d(5, 18)],
		rotations : [
			[new Coord2d(-1, 1), new Coord2d(-1, 0), new Coord2d(0, 0), new Coord2d(1, 0)],
			[new Coord2d(0, -1),  new Coord2d(0, 1),  new Coord2d(0, 0), new Coord2d(1, 1)],
			[new Coord2d(-1, 0),  new Coord2d(1, 0),  new Coord2d(0, 0), new Coord2d(1, -1)],
			[new Coord2d(-1, -1), new Coord2d(0, -1), new Coord2d(0, 0), new Coord2d(0, 1)]
		],
		colour : "#5a65ad"
	},

	L : {
		spawnCoords : [new Coord2d(5, 19), new Coord2d(3, 18), new Coord2d(4, 18), new Coord2d(5, 18)],
		rotations : [
			[new Coord2d(-1, 0), new Coord2d(1, 0),  new Coord2d(0, 0), new Coord2d(1, 1)],
			[new Coord2d(0, 1),   new Coord2d(0, -1), new Coord2d(0, 0), new Coord2d(1, -1)],
			[new Coord2d(-1, -1), new Coord2d(-1, 0), new Coord2d(0, 0), new Coord2d(1, 0)],
			[new Coord2d(-1, 1),  new Coord2d(0, 1),  new Coord2d(0, 0), new Coord2d(0, -1)]
		],
		colour : "#ef7921"
	},

	S : {
		spawnCoords : [new Coord2d(3, 18), new Coord2d(5, 19), new Coord2d(4, 19), new Coord2d(4, 18)],
		rotations : [
			[new Coord2d(-1, -1), new Coord2d(0, -1), new Coord2d(0, 0), new Coord2d(1, 0)],
			[new Coord2d(0, 1),    new Coord2d(1, 0),  new Coord2d(0, 0), new Coord2d(1, -1)],
			[new Coord2d(-1, -1),  new Coord2d(0, -1), new Coord2d(0, 0), new Coord2d(1, 0)],
			[new Coord2d(0, 1),    new Coord2d(1, 0),  new Coord2d(0, 0), new Coord2d(1, -1)]
		],
		colour : "#42b642"
	},

	Z : {
		spawnCoords : [new Coord2d(3, 19), new Coord2d(4, 18), new Coord2d(4, 19), new Coord2d(5, 18)],
		rotations : [
			[new Coord2d(-1, 0), new Coord2d(0, -1), new Coord2d(0, 0), new Coord2d(1, -1)],
			[new Coord2d(0, -1),  new Coord2d(1, 0),  new Coord2d(0, 0), new Coord2d(1, 1)],
			[new Coord2d(-1, 0),  new Coord2d(0, -1), new Coord2d(0, 0), new Coord2d(1, -1)],
			[new Coord2d(0, -1),  new Coord2d(1, 0),  new Coord2d(0, 0), new Coord2d(1, 1)]
		],
		colour : "#ef2029"
	},

	T : {
		spawnCoords : [new Coord2d(4, 19), new Coord2d(3, 18), new Coord2d(4, 18), new Coord2d(5, 18)],
		rotations : [
			[new Coord2d(-1, 0), new Coord2d(0, 1),  new Coord2d(0, 0), new Coord2d(1, 0)],
			[new Coord2d(0, 1),   new Coord2d(1, 0),  new Coord2d(0, 0), new Coord2d(0, -1)],
			[new Coord2d(-1, 0),  new Coord2d(0, -1), new Coord2d(0, 0), new Coord2d(1, 0)],
			[new Coord2d(-1, 0),  new Coord2d(0, 1),  new Coord2d(0, 0), new Coord2d(0, -1)]
		],
		colour : "#ad4d9c"
	}

};



var colourPieceI = "#f7d308";
var colourPieceO = "#47e6ff";
var colourPieceJ = "#5a65ad";
var colourPieceL = "#ef7921";
var colourPieces = "#42b642";
var colourPieceZ = "#ef2029";
var colourPieceT = "#ad4d9c";

class Piece{
	constructor(pieceLetter){
		this.pieceLetter = pieceLetter;
		this.spawnCoords = Array.from(Pieces.Z.spawnCoords);
		this.rotations = Array.from(Pieces.Z.rotations);
		this.currentRotation = 0;
		this.colour = colourPieceZ;
		switch (this.pieceLetter){
			case 'I':
				//this.spawnCoords = Array.from(Pieces.spawnCoordsPieceI);
				this.spawnCoords = Array.from(Pieces.I.spawnCoords);
				this.rotations = Array.from(Pieces.I.rotations);
				this.colour = Pieces.I.colour;
				break;
			case 'O':
				this.spawnCoords = Array.from(Pieces.O.spawnCoords);
				this.rotations = Array.from(Pieces.O.rotations);
				this.colour = Pieces.O.colour;
				break;
			case 'J':
				this.spawnCoords = Array.from(Pieces.J.spawnCoords);
				this.rotations = Array.from(Pieces.J.rotations);
				this.colour = Pieces.J.colour;
				break;
			case 'L':
				this.spawnCoords = Array.from(Pieces.L.spawnCoords);
				this.rotations = Array.from(Pieces.L.rotations);
				this.colour = Pieces.L.colour;
				break;
			case 'S':
				this.spawnCoords = Array.from(Pieces.S.spawnCoords);
				this.rotations = Array.from(Pieces.S.rotations);
				this.colour = Pieces.S.colour;
				break;
			case 'T':
				this.spawnCoords = Array.from(Pieces.T.spawnCoords);
				this.rotations = Array.from(Pieces.T.rotations);
				this.colour = Pieces.T.colour;
				break;
		}
		//this.currentCoords = Array.from(this.spawnCoords);
		this.currentCoords = this.copyCoords(this.spawnCoords);
	}

	toString(){
		return "Piece" + this.pieceLetter;
	}

	/*
		Returns an HTML table string visually showing the tetris piece.
	*/
	printPiece(){
    var xOffset = 3;
    var yOffset = 18;
		var htmlToReturn = `<table>`;

		for(var y = 1; y >= 0 ; y--){
			htmlToReturn += "<tr>";
			for(var x = 0; x < 4; x++){
				var hasMatched = false;
				for(var i = 0; i < this.spawnCoords.length; i++){
					if(x == this.spawnCoords[i].x - xOffset && y ==this.spawnCoords[i].y - yOffset){
						hasMatched = true;
						break;
					}
				}
				if(hasMatched == true)
					htmlToReturn += `<td style="background-color: ${this.colour}"></td>`;
				else
					htmlToReturn += `<td style="background-color: white"></td>`;
			}
			htmlToReturn += "</tr>";
		}

		htmlToReturn += "</table>";

		return htmlToReturn;
		
	}

	getColour(){
		return this.colour;
	}

	copyCoords(arrayToCopy){
		var copiedArray = [];
		for(var i = 0; i < arrayToCopy.length; i++){
			copiedArray.push(new Coord2d(arrayToCopy[i].x, arrayToCopy[i].y));
		}
		return copiedArray;
	}

	rotate(){
		/*
		loop through new rotation and create new coords by adding them to current coords
		check each new coord for collision

		Added to the third [2] square's coords
		*/
		clearPieceFromBoard();

		var nextRotation = this.currentRotation;
		nextRotation++;
		if(nextRotation >= this.rotations.length)
			nextRotation = 0;

		var currentPosition = cloneCoordArray(this.currentCoords);

		//Piece pivots based on the its second square
		var pivotCoords = new Coord2d(this.currentCoords[2].x, this.currentCoords[2].y);

		for(var i = 0; i < this.rotations[nextRotation].length; i++){
			this.currentCoords[i].x = pivotCoords.x + this.rotations[nextRotation][i].x;
			this.currentCoords[i].y = pivotCoords.y + this.rotations[nextRotation][i].y;
		}


		if(!checkCollisionForPiecePosition(this.currentCoords)){
			//Revert the coords back as there's no room to rotate
			this.currentCoords = currentPosition;
		}else{
			this.currentRotation = nextRotation;	
		}

		updatePieceOnBoard();
	}

	moveDown(){
		for(var i = 0; i < this.currentCoords.length; i++){
			this.currentCoords[i].y--;
		}
	}

	moveLeft(){
		for(var i = 0; i < this.currentCoords.length; i++){
			this.currentCoords[i].x--;
		}
	}

	moveRight(){
		for(var i = 0; i < this.currentCoords.length; i++){
			this.currentCoords[i].x++;
		}
	}

}