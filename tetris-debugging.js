"use strict";
TetrisPlus.debug = {

	outputElement : document.getElementById("testing"),
	isDebugOn : false,
	dynamicDebugInfo : "",
	staticDebugInfo: "",

	toggleDebugDisplay(){
		if(this.isDebugOn == false){
			//document.get$("#testing").css("display", "initial");
			this.outputElement.style.display = "initial";
			//$("#tetrisBoard").css("left", "30%");
			this.isDebugOn = true;
		}else{
			//$("#testing").css("display", "none");
			this.outputElement.style.display = "none";
			//$("#tetrisBoard").css("left", "0%");
			this.isDebugOn = false;
		}
	},

	updateDebugDisplay(){
		$("#testing").html("");
		this.debugMap("collisionMap", TetrisPlus.board.collisionMap);
	
		//TESTING STUFF
		this.log("Frame Rate", TetrisPlus.Game.frameRate);
		this.log("Window innerHeight", window.innerHeight);
		this.log("canvas height", TetrisPlus.board.canvas.element.height);
		this.log("canvas width", TetrisPlus.board.canvas.element.width);
		this.log("canvasScaleMultiplier", canvasScaleMultiplier);
		if(currentPiece != null)
		this.log("currentPiece", currentPiece.toString());
		
		this.addHtml("#testing", this.staticDebugInfo);
		this.addHtml("#testing", this.dynamicDebugInfo);
		this.addHtml("#testing", TetrisPlus.Game.randomBag.printContents());
		this.dynamicDebugInfo = "";
	},

	log(name, object){
		var newHtml = name + " = " + object + "<br>";
		this.addHtml("#testing", newHtml);
	},

	staticDebug(text){
		staticDebugInfo += ("\n" + text);
	},

	fixedDebug(id, text){
		var label = document.getElementById(`${id}`);
		if(label == null)
			staticDebugInfo += `<br/><span id="${id}">${text}</span>`;
		else
			label.innerHtml = text;
	},

	dynamicDebug(text){
		dynamicDebugInfo += ("\n" + text);
	},

	debugMap(name, map){
		var trueColour = "#adadad";
		var falseColour = "#ffffff";
		var tableHtml = "<table>";
		this.addHtml("#testing", name+":<br>");
		for(var y = TetrisPlus.config.boardHeight-1; y >= 0 ; y--){
			tableHtml += "<tr>";
			for(var x = 0; x < TetrisPlus.config.boardWidth; x++){
				if(map[x][y] == true){
					tableHtml += '<td style="background-color: '+trueColour+'"></td>';
				}
				else{
					tableHtml += '<td style="background-color: '+falseColour+'"></td>';
				}
			}
			tableHtml += "</tr>";
		}
		tableHtml += "</table>";
		this.addHtml("#testing", tableHtml);
	},

	randomBag_Test(){
		var bag = new RandomBag(pieceArray);
		staticDebugInfo = `<br/>pieceArray.length = ${pieceArray.length}`;
		for(var i = 0; i < pieceArray.length; i++){
			staticDebugInfo += `<br/>Piece ${i} = ${bag.getNextLetter()}`;
		}
	},

	coordArrayToString(coordArray){
		var arrayString = "";
		for(var i = 0; i < coordArray.length; i++){
			arrayString += `${i} : [${coordArray[i].x}][${coordArray[i].y}]\n`;
		}
		return arrayString;
	},

	addHtml(id, htmlToAdd){
		var currentHtml = $(id).html();
		currentHtml += htmlToAdd;
		$(id).html(currentHtml);
	}

};