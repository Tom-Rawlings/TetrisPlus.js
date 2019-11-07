# TetrisPlus.js

A configurable version of tetris built with JavaScript using the HTML5 canvas element.
**[Try the demo here](http://tomrawlings.online/TetrisPlus/demo)**

## Setup

To embed into your own page, simply link to TetrisPlus.min.js, create a parent div for the game with an ID and call:
```js
TetrisPlus.init({parentID: 'parentDivId'});
```
Where 'parentDivId' is the ID of the div element on your page in which you want TetrisPlus to be created.
This function needs to be called once the parent div has been created, so inside`$( document ).ready()` if using jQuery or just at the bottom of the html body.

A configuration object can be passed as a parameter in order to change various aspects of the game.


## Configuration
The game has a number of settings that can be configured. An object with all, or only some, of the variables below can be passed to the initialisation function.
```js
{
	parentId :  "game", //ID of the html div that TetrisPlus will occupy.
	backgroundColour :  "#DDDDDD", //Background colour of the canvas that will be visible as grid between blocks.
	emptyBlockColour :  "#FFFFFF", //Colour of empty blocks that will make up the tetris board.
	overlayColour :  "#000000", //Base colour of the transparent overlay used when the game is paused.
	overlayTextColour :  "#FFFFFF", //Colour of overlayed text such as the introduction message.
	scoreTextColour :  "#000000", //Colour used to display the number of lines cleared on screen.
	borderColour :  "#000000", //Colour of border around the generated canvas element.
	blockSizeRelative :  10, //Size of the onscreen blocks relative to the gaps inbetween.
	gapSizeRelative :  0.5, //Size of the gaps inbetween blocks relative to the blocks themselves.
	//canvasRelativeVerticalMargin : 0.1, //
	boardWidth :  10, //Number of blocks wide the tetris board will be.
	boardHeight :  20, //Number of blocks tall the tetris board will be.
	//tickRate : 800, //
	moveDownDelay :  80, //Millisecond delay between the piece moving down when holding the down arrow key .
	targetFrameRate :  60, //Number of frames per second the game will attempt to run at.
	//pausedFrameRate : 5, //Number of frames per second the game will.
	dropSpeeds : [800, 720, 630, 550, //Drop speeds used for difficulty levels in milliseconds.
	470, 380, 300, 220, 130, 100, 80],
	linesPerLevel :  5,	//Number of lines needed to be cleared before difficulty level increases.
	useDarkTheme :  false, //Whether or not to use the provided dark theme.
	useBackgroundGrid :  false, //Whether or not to use separate background colour from empty blocks to form grid lines.

	//Colours used for the pieces.
	pieceColours : { 
		I :  "#f7d308",
		O :  "#47e6ff",
		J :  "#5a65ad",
		L :  "#ef7921",
		S :  "#42b642",
		Z :  "#ef2029",
		T :  "#ad4d9c"
	}
}
```
