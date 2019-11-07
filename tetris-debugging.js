"use strict";
TetrisPlus.debug = {

	outputElement : document.getElementById("testing"),
	isDebugOn : false,
	dynamicDebugInfo : "",
	staticDebugInfo: "",

	showDebugDisplay : function(bool){
		if(bool){
			this.outputElement.style.display = "initial";
			this.isDebugOn = true;
		}else{
			this.outputElement.style.display = "none";
			this.isDebugOn = false;
		}
	},

	updateDebugDisplay : function(){
		this.outputElement.innerHTML = "";
		this.debugMap("collisionMap", TetrisPlus.board.collisionMap);
	
		//TESTING STUFF
		this.log("Frame Rate", TetrisPlus.Game.FrameCounter.getFrameRate());
		this.log("parent innerHeight", TetrisPlus.board.canvas.parent.offsetHeight);
		this.log("canvas height", TetrisPlus.board.canvas.element.height);
		this.log("canvas width", TetrisPlus.board.canvas.element.width);
		this.log("canvasScaleMultiplier", TetrisPlus.board.canvasScaleMultiplier);
		this.log("currentPiece", TetrisPlus.board.currentPiece.toString());
		this.log("current level = " + TetrisPlus.Game.currentLevel);
		
		this.addHtml(this.outputElement, this.staticDebugInfo);
		this.addHtml(this.outputElement, this.dynamicDebugInfo);
		this.addHtml(this.outputElement, TetrisPlus.Game.randomBag.printContents());
		this.dynamicDebugInfo = "";
	},

	log : function(name, object){
		var newHtml = name + " = " + object + "<br>";
		this.addHtml(this.outputElement, newHtml);
	},

	staticDebug : function(text){
		this.staticDebugInfo += ("\n" + text);
	},

	dynamicDebug : function(text){
		this.dynamicDebugInfo += ("\n" + text);
	},

	debugMap : function(name, map){
		var trueColour = "#adadad";
		var falseColour = "#ffffff";
		var tableHtml = "<table>";
		this.addHtml(this.outputElement, name+":<br>");
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
		this.addHtml(this.outputElement, tableHtml);
	},

	addHtml : function(element, htmlToAdd){
		var currentHtml = element.innerHTML;
		currentHtml += htmlToAdd;
		element.innerHTML = currentHtml;
	}

};