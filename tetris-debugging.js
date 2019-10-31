var staticDebugInfo = "";
var dynamicDebugInfo = "";
var isDebugOn = false;

function toggleDebugDisplay(){
	if(isDebugOn == false){
		$("#testing").css("display", "initial");
		$("#tetrisBoard").css("left", "30%");
		isDebugOn = true;
	}else{
		$("#testing").css("display", "none");
		$("#tetrisBoard").css("left", "0%");
		isDebugOn = false;
	}

}

function updateDebugDisplay(){
	$("#testing").html("");
	debugMap("collisionMap", collisionMap);

	//TESTING STUFF
	debug("document height", $(document).height());
	debug("boardinner height", $("#"+board.id).height());
	debug("boardinner width", $("#"+board.id).width());
	debug("frameSizeActual",frameSizeActual);
	debug("boardSizeMultiplier", boardSizeMultiplier);
	debug("unitPixels 2.5",unitPixels(2.5));
	debug("unitPixels 0.5",unitPixels(0.5));
	debug("boardInnerWidth", $("#"+boardInner.id).width());
	if(currentPiece != null)
		debug("currentPiece", currentPiece.toString());
	
	addHtml("#testing", staticDebugInfo);
	addHtml("#testing", dynamicDebugInfo);
	addHtml("#testing", randomBag.printContents());
	dynamicDebugInfo = "";
}

function debug(name, object){
	var newHtml = name + " = " + object + "<br>";
	addHtml("#testing", newHtml);
}

function staticDebug(text){
	staticDebugInfo += ("\n" + text);
}

function fixedDebug(id, text){
	var label = document.getElementById(`${id}`);
	if(label == null)
		staticDebugInfo += `<br/><span id="${id}">${text}</span>`;
	else
		label.innerHtml = text;
}

function dynamicDebug(text){
	dynamicDebugInfo += ("\n" + text);
}

function debugMap(name, map){
	var trueColour = "#adadad";
	var falseColour = "#ffffff";
	var tableHtml = "<table>";
	addHtml("#testing", name+":<br>");
	for(var y = gameHeight-1; y >= 0 ; y--){
		tableHtml += "<tr>";
		for(var x = 0; x < gameWidth; x++){
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
	addHtml("#testing", tableHtml);
}


function randomBag_Test(){
	var bag = new RandomBag(pieceArray);
	staticDebugInfo = `<br/>pieceArray.length = ${pieceArray.length}`;
	for(var i = 0; i < pieceArray.length; i++){
		staticDebugInfo += `<br/>Piece ${i} = ${bag.getNextLetter()}`;
	}
}

function coordArrayToString(coordArray){
	var arrayString = "";
	for(var i = 0; i < coordArray.length; i++){
		arrayString += `${i} : [${coordArray[i].x}][${coordArray[i].y}]\n`;
	}
	return arrayString;
}