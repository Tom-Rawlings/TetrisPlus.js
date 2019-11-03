"use strict";
//Spawn locations
var spawnCoordsPieceI = [new Coord2d(3, 18),
												 new Coord2d(4, 18),
												 new Coord2d(5, 18),
												 new Coord2d(6, 18)];
var spawnCoordsPieceO = [new Coord2d(4, 19),
												 new Coord2d(5, 19),
												 new Coord2d(4, 18),
												 new Coord2d(5, 18)];
var spawnCoordsPieceJ = [new Coord2d(3, 19),
												 new Coord2d(3, 18),
												 new Coord2d(4, 18),
												 new Coord2d(5, 18)];
var spawnCoordsPieceL = [new Coord2d(5, 19),
												 new Coord2d(3, 18),
												 new Coord2d(4, 18),
												 new Coord2d(5, 18)];
var spawnCoordsPieceS = [new Coord2d(3, 18),
												 new Coord2d(5, 19),
												 new Coord2d(4, 19),
												 new Coord2d(4, 18)];
var spawnCoordsPieceZ = [new Coord2d(3, 19),
												 new Coord2d(4, 18),
												 new Coord2d(4, 19),
												 new Coord2d(5, 18)];
var spawnCoordsPieceT = [new Coord2d(4, 19),
												 new Coord2d(3, 18),
												 new Coord2d(4, 18),
												 new Coord2d(5, 18)];

var rotationsPieceI = [[new Coord2d(-2, 0), new Coord2d(-1, 0), new Coord2d(0, 0), new Coord2d(1, 0)],
											[new Coord2d(0, 2), new Coord2d(0, 1),  new Coord2d(0, 0), new Coord2d(0, -1)]];

var rotationsPieceJ = [[new Coord2d(-1, 1), new Coord2d(-1, 0), new Coord2d(0, 0), new Coord2d(1, 0)],
											[new Coord2d(0, -1),  new Coord2d(0, 1),  new Coord2d(0, 0), new Coord2d(1, 1)],
											[new Coord2d(-1, 0),  new Coord2d(1, 0),  new Coord2d(0, 0), new Coord2d(1, -1)],
											[new Coord2d(-1, -1), new Coord2d(0, -1), new Coord2d(0, 0), new Coord2d(0, 1)]];

var rotationsPieceL = [[new Coord2d(-1, 0), new Coord2d(1, 0),  new Coord2d(0, 0), new Coord2d(1, 1)],
											[new Coord2d(0, 1),   new Coord2d(0, -1), new Coord2d(0, 0), new Coord2d(1, -1)],
											[new Coord2d(-1, -1), new Coord2d(-1, 0), new Coord2d(0, 0), new Coord2d(1, 0)],
											[new Coord2d(-1, 1),  new Coord2d(0, 1),  new Coord2d(0, 0), new Coord2d(0, -1)]];

var rotationsPieceS = [[new Coord2d(-1, -1), new Coord2d(0, -1), new Coord2d(0, 0), new Coord2d(1, 0)],
											[new Coord2d(0, 1),    new Coord2d(1, 0),  new Coord2d(0, 0), new Coord2d(1, -1)],
											[new Coord2d(-1, -1),  new Coord2d(0, -1), new Coord2d(0, 0), new Coord2d(1, 0)],
											[new Coord2d(0, 1),    new Coord2d(1, 0),  new Coord2d(0, 0), new Coord2d(1, -1)]];

var rotationsPieceZ = [[new Coord2d(-1, 0), new Coord2d(0, -1), new Coord2d(0, 0), new Coord2d(1, -1)],
											[new Coord2d(0, -1),  new Coord2d(1, 0),  new Coord2d(0, 0), new Coord2d(1, 1)],
											[new Coord2d(-1, 0),  new Coord2d(0, -1), new Coord2d(0, 0), new Coord2d(1, -1)],
											[new Coord2d(0, -1),  new Coord2d(1, 0),  new Coord2d(0, 0), new Coord2d(1, 1)]];

var rotationsPieceT = [[new Coord2d(-1, 0), new Coord2d(0, 1),  new Coord2d(0, 0), new Coord2d(1, 0)],
											[new Coord2d(0, 1),   new Coord2d(1, 0),  new Coord2d(0, 0), new Coord2d(0, -1)],
											[new Coord2d(-1, 0),  new Coord2d(0, -1), new Coord2d(0, 0), new Coord2d(1, 0)],
											[new Coord2d(-1, 0),  new Coord2d(0, 1),  new Coord2d(0, 0), new Coord2d(0, -1)]];

var colourPieceI = "#f7d308";
var colourPieceO = "#47e6ff";
var colourPieceJ = "#5a65ad";
var colourPieceL = "#ef7921";
var colourPieceS = "#42b642";
var colourPieceZ = "#ef2029";
var colourPieceT = "#ad4d9c";

class Piece{
	constructor(pieceLetter){
		this.pieceLetter = pieceLetter;
		this.spawnCoords = Array.from(spawnCoordsPieceZ);
		this.rotations = Array.from(rotationsPieceZ);
		this.currentRotation = 0;
		this.colour = colourPieceZ;
		switch (this.pieceLetter){
			case 'I':
				this.spawnCoords = Array.from(spawnCoordsPieceI);
				this.rotations = Array.from(rotationsPieceI);
				this.colour = colourPieceI
				break;
			case 'O':
				this.spawnCoords = Array.from(spawnCoordsPieceO);
				this.rotations = [[new Coord2d(1, 0), new Coord2d(1, 1), new Coord2d(0, 0), new Coord2d(0, 1)]];
				this.colour = colourPieceO;
				break;
			case 'J':
				this.spawnCoords = Array.from(spawnCoordsPieceJ);
				this.rotations = Array.from(rotationsPieceJ);
				this.colour = colourPieceJ;
				break;
			case 'L':
				this.spawnCoords = Array.from(spawnCoordsPieceL);
				this.rotations = Array.from(rotationsPieceL);
				this.colour = colourPieceL;
				break;
			case 'S':
				this.spawnCoords = Array.from(spawnCoordsPieceS);
				this.rotations = Array.from(rotationsPieceS);
				this.colour = colourPieceS;
				break;
			case 'T':
				this.spawnCoords = Array.from(spawnCoordsPieceT);
				this.rotations = Array.from(rotationsPieceT);
				this.colour = colourPieceT;
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