"use strict";
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
		var htmlToReturn = `<table>`;
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
					htmlToReturn += `<td style="background-color: ${piece.colour}"></td>`;
				else
					htmlToReturn += `<td style="background-color: white"></td>`;
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
	
		/*
			Returns an HTML table string visually showing the tetris piece.
		*/
		printPiece : function(){
			var xOffset = 3;
			var yOffset = 18;
			var htmlToReturn = `<table>`;
	
			for(var y = 1; y >= 0 ; y--){
				htmlToReturn += "<tr>";
				for(var x = 0; x < 4; x++){
					var hasMatched = false;
					for(var i = 0; i < spawnCoords.length; i++){
						if(x == spawnCoords[i].x - xOffset && y == spawnCoords[i].y - yOffset){
							hasMatched = true;
							break;
						}
					}
					if(hasMatched == true)
						htmlToReturn += `<td style="background-color: ${colour}"></td>`;
					else
						htmlToReturn += `<td style="background-color: white"></td>`;
				}
				htmlToReturn += "</tr>";
			}
	
			htmlToReturn += "</table>";
	
			return htmlToReturn;
			
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
