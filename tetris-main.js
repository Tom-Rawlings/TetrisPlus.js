"use strict";

$(document).ready(start());

//Main Code:
function start(){
	//toggleDebugDisplay();
	randomBag = new RandomBag(pieceArray);
	createBoard();
	if(useTouch){
		setupTouchButton();
	}
	//requestAnimationFrame(colourChangeTest);
	spawnPiece(new Piece(randomBag.getNextLetter()));

}

var game = setInterval(gameTick, tickRate);

function gameTick(){
	gameTime += (tickRate/1000);
	updateDebugDisplay();
	//requestAnimationFrame(gameLoop)
	//fixedDebug("timer",`Time = ${gameTime}s`);
	movePieceDown();
}

function tickReset(){
	clearInterval(game);
	game = setInterval(gameTick, tickRate);
}

function stopGame(){
	clearInterval(game);
}

function gameOver(){
	stopGame();
	toggleGreyOverlay();
	$("#centreMessageParent").css("font-size", "25vh");
	$("#centreMessage").css("font-size", "7vh");
	$("#centreMessage").html("Game Over<br/>Lines Cleared: " + linesCleared);
}

function togglePause(){
	if(isPaused){
		game = setInterval(gameTick, tickRate);
		isPaused = false;
		$("#centreMessage").html("");
	}
	else{
		clearInterval(game);
		isPaused = true;
		addHtml("#centreMessage", "Paused");
	}
	toggleGreyOverlay();
}
