/// <reference path="GameDraw.js" />
/// <reference path="GameObjects.js" />

var GameEngine = ( function () {
	var board;

	function start() {
		var x,
		y,
		color,
		i,
		j,
		lengthBoard,
		lengthField;

		var players = [];
		players.push(Object.create(GameObjects.Player).init('First', 'white'));
		players.push(Object.create(GameObjects.Player).init('Second', 'black'));

        //TODO check 
        board = GameObjects.Board.init();

        // dices.rollDices() ; dices.usedNumber(number) ; dices.clearNumbers()
        dices = GameObjects.Dices.init();

        // TESTING Dices:
        //dices.rollDices();
        //console.log('dices.rollDices() - [' + dices.numbers + ']');
        //console.log('dices.removeNumber(' + dices.numbers[0] + ') - ');
        //dices.usedNumber(dices.numbers[0]);
        //console.log(dices.numbers);
        //console.log('dices.clearNumbers() - ');
        //dices.clearNumbers();
        //console.log(dices.numbers);
        // END OF TEST;

        GameDraw.initGame(board);
    }

    function updatePlayGround() {
    	GameDraw.updatePlayGround(board);
    }


    function update(numberOfBoardField) {

        // currentPlayer = GetCurrentPlayer - depending on player.isOnTurn or isFirstPlayerOnTurn

        // flag hasThrownDice -> if not - throw dice(allowedMoves = diceResult, currentPlayerMoves = 0); else - continue

        // if (currentPlayer.hasHitPiece) -> Call function(s) to deal with this situation.
        // if can't put piece -> playerMoves = allowedMoves

        // if ((currentPlayerMoves < allowedMoves) && hasMovedPiece (sets to true when called from onDrag event on piece)

        // Subcases: move from position to position/ collect piece
        // Call function(s) to deal with this situation. -> hasMovedPiece = false, currentPlayerMoves++;

        // Missed logic?

        // if current player has no pieces on the board -> He wins.

        // if (playerMoves === allowedMoves) -> change player, hasThrownDice = false
        function addListenersToPossibleGameFields(gameFields) {
        	var i,
        	len;
        	for (i = 0, len = gameFields.length; i < len; i += 1) {
        		var currentField = gameFields[i];
        		currentField.addEventListener('click', selectAndPaintLastPiece(currentField));
        	}
        }

        function selectAndPaintLastPiece(gameField) {
        	var len = gameField.pieces.length;
        	gameField.pieces[len - 1].isChosen = true;
        }
    }


    /////////////
    function test(x, y) {
        //alert( x + ' ' + y );

        board.movePiece(6, 7);

        updatePlayGround();
    }

    /////////////

    return {
    	start: start,
    	update: update,
    	test: test,
    };
}() );

function getFieldsWithMovesAvailable (player, board, numbers) {
	var direction,
	i, j,
	result = [],
	color = player.color;

	if (color === 'white') {
		direction = 1;
	} else {
		direction = -1;
	}

	color = color.substring(0, 1).toUpperCase() + color.substring(1);

	for (i = 0; i < board.length; i += 1) {
		if (board[i].pieces[0].color === color.toLowerCase()) {
			for (j = 0; j < numbers.length; j += 1) {
				if (board[i + numbers[j] * direction]['availableFor' + color]) {
					result.push(i);
					break;
				}
			}
		}
	}

	return result;
}
// // All events will call GameEngine.Update() and GameDraw.Update().


//// Logic to add
function checkIfDiceHaveBeenThrownBefore(firstDiceThrow) {
    return !firstDiceThrow;
}

function throwFirstDiceToDeterminePlayer() {
    firstDice.generateNewNumber();
    secondDice.generateNewNumber();
    if (firstDice.number > secondDice.number) {
        firstPlayerOnTurn = true;
    } else if (firstDice.number < secondDice.number) {
        firstPlayerOnTurn = false;
    } else {
        firstDiceThrow = true;
        play();
    }
}

function setCurrentPlayerOnTurn(firstPlayerOnTurn) {
    if (firstPlayerOnTurn) {
        currentActivePlayer = firstPlayer;
        inactivePlayer = secondPlayer;
    }
    else {
        currentActivePlayer = secondPlayer;
        inactivePlayer = firstPlayer;
    }
}

function throwDiceAndCheckMaxMovesForTurn() {
    firstDice.generateNewNumber();
    secondDice.generateNewNumber();
    //ANIMATE 
    if (firstDice.number === secondDice.number) {
        maximumAllowedMovesInTurn = 4;
    }
    else {
        maximumAllowedMovesInTurn = 2;
    }
}

function checkIfPlayerIsMakingNormalMoves(currentActivePlayer, currentPlayerMoves,maximumAllowedMovesInTurn) {
    if(currentPlayerMoves < maximumAllowedMovesInTurn && !currentActivePlayer.hasHitChecker && !currentActivePlayer.canTakeChecker) { 
        return true;
    }
    return false;
}

//function checkIfWhitePlayerCanSetCheckerThere(diceNumber) {
//    if (board.fields[1 + diceNumber].length === 0 ||
//                     (board.fields[1 + diceNumber].length === 1 && board.fields[1 + diceNumber][0].color === inactivePlayer.color) ||
//                    (board.fields[1 + diceNumber].length > 0 && board.fields[1 + diceNumber][0].color === currentActivePlayer.color)) { 
//        return true;
//    }
//    return false;
//}

function play() {

    var maximumAllowedMovesInTurn;
    var currentActivePlayer;
    var inactivePlayer;
    var currentPlayerMoves = 0;   // DA SE IZNESAT TEZI PROMENLIVI GORE POSLE

    //FIRST DICE ROLL CHECK
    if (!checkIfDiceHaveBeenThrownBefore(firstDiceThrow)) {
        throwFirstDiceToDeterminePlayer();
    }
    
    setCurrentPlayerOnTurn(firstPlayerOnTurn); //Will create the current player on turn
    //value,and have a inactivePlayer  value for the one that isnt  on turn at the moment
    
    //IF NO MOVES AVAILABLE SWITCH PLAYERS WITHOUT THROWING DICE (player hit and all his 6 spaces are currently closed by enemy)
    if (!currentActivePlayer.hasMovesAvailable) {  //LOGIC NEEDS TO BE ADDED,WHEN  HAS MOVES AVAILABLE BECOMES FALSE- IT'S TRUE ON START,BUT CHANGES
        firstPlayerOnTurn = !firstPlayerOnTurn;
        play();
    }

    //THROW DICE
    throwDiceAndCheckMaxMovesForTurn();


    //IF HAS HIT CHECKERS
    while (currentActivePlayer.hasHitChecker) {

        if (!currentActivePlayer.hasHitChecker) {
            break;
        }
       
        //WHITE PLAYER - player 1
        if (currentActivePlayer.color === 'white') {
            //check if first dice number field is available
            if (board.fields[firstDice.number].availableForWhite)
            {
                if (board.fields[firstDice.number].length > 0 && board.fields[firstDice.number][0].color === inactivePlayer.color) {
                    //HIT HIS CHECKER AND PLACE YOUR OWN
                }
                else {
                    //TODO JUST ADD YOUR CHECKER
                }
                //CHANGE THE STATE OF THAT BOARD SPOT
                currentPlayerMoves++;
                if(board.fields[25].length ===0) { 
                    currentActivePlayer.hasHitChecker = false;
                    break;
                }
                if (currentPlayerMoves === maximumAllowedMovesInTurn) {
                    firstPlayerOnTurn = !firstPlayerOnTurn;
                    break;
                }

            } 
            else {
                currentPlayerMoves++; //you lose a move,because u cant set your pull there
                if (currentPlayerMoves === maximumAllowedMovesInTurn) {
                    firstPlayerOnTurn = !firstPlayerOnTurn;
                    break;
                }
            }
            if (board.fields[secondDice.number].availableForWhite) {
                if (board.fields[secondDice.number].length > 0 && board.fields[secondDice.number][0].color === inactivePlayer.color) {
                    //HIT HIS CHECKER AND PLACE YOUR OWN
                }
                else {
                    //TODO JUST ADD YOUR CHECKER
                }
                //CHANGE THE STATE OF THAT BOARD SPOT
                currentPlayerMoves++;
                if(board.fields[25].length ===0) { 
                    currentActivePlayer.hasHitChecker = false;
                    break;
                }
                if (currentPlayerMoves === maximumAllowedMovesInTurn) {
                    firstPlayerOnTurn = !firstPlayerOnTurn;
                    break;
                }

            }
            else {
                currentPlayerMoves++; //you lose a move,because u cant set your pull there
                if (currentPlayerMoves === maximumAllowedMovesInTurn) {
                    hasNoMoves = true;
                    break;
                }
            }
               
        }
       
        

            //IF BLACK PLAYER - player 2
        

        else {
            //check if first dice number field is available
            if (board.fields[firstDice.number].availableForBlack)
            {
                if (board.fields[firstDice.number].length > 0 && board.fields[firstDice.number][0].color === inactivePlayer.color) {
                    //HIT HIS CHECKER AND PLACE YOUR OWN
                }
                else {
                    //TODO JUST ADD YOUR CHECKER
                }
                //CHANGE THE STATE OF THAT BOARD SPOT
                currentPlayerMoves++;
                if(board.fields[0].length ===0) { 
                    currentActivePlayer.hasHitChecker = false;
                    break;
                }
                if (currentPlayerMoves === maximumAllowedMovesInTurn) {
                    firstPlayerOnTurn = !firstPlayerOnTurn;
                    break;
                }

            } 
            else {
                currentPlayerMoves++; //you lose a move,because u cant set your pull there
                if (currentPlayerMoves === maximumAllowedMovesInTurn) {
                    firstPlayerOnTurn = !firstPlayerOnTurn;
                    break;
                }
            }
            if (board.fields[secondDice.number].availableForBlack) {
                if (board.fields[secondDice.number].length > 0 && board.fields[secondDice.number][0].color === inactivePlayer.color) {
                    //HIT HIS CHECKER AND PLACE YOUR OWN
                }
                else {
                    //TODO JUST ADD YOUR CHECKER
                }
                //CHANGE THE STATE OF THAT BOARD SPOT
                currentPlayerMoves++;
                if(board.fields[0].length ===0) { 
                    currentActivePlayer.hasHitChecker = false;
                    break;
                }
                if (currentPlayerMoves === maximumAllowedMovesInTurn) {
                    firstPlayerOnTurn = !firstPlayerOnTurn;
                    break;
                }

            }
            else {
                currentPlayerMoves++; //you lose a move,because u cant set your pull there
                if (currentPlayerMoves === maximumAllowedMovesInTurn) {
                    firstPlayerOnTurn = !firstPlayerOnTurn;
                    break;
                }
            }
               
        }

    }


    if (currentPlayerMoves === maximumAllowedMovesInTurn) {
        play();
    }


        
      

    //CHECK IF PLAYER IS CURRENTLY TAKING CHECKERS


    

    if (currentPlayerMoves === maximumAllowedMovesInTurn) {
        play();
    }


    //JUST MOVE CHECKERS
    if (!checkIfPlayerIsMakingNormalMoves(currentActivePlayer, currentPlayerMoves, maximumAllowedMovesInTurn)) { //CHECK IF PLAYER HAS TO END TURN
        firstPlayerOnTurn = !firstPlayerOnTurn;
        play();
    }

    if (currentActivePlayer.color === 'white') {//white player - player1


        var isClickValidForStartPosition = false;

        while (!isClickValidForStartPosition) {
            //wait for mouse click for start position
            //get X and Y of clicked position
            //determine which board.fields place it is
            //check if that position contains his checkers  (isAvailable for white/black)
            //if no -> leave ,the  while loop will repeat itself and await new click for start position 
            // if yes =>  isClickValidForStartPosition = true;
            //highlight which board places the checker from the start position can move to
            //wait for click to determine end position
            //get X and Y of clicked position
            //determine which board.fields place it is
            //if it is one of the possible places,considering the start position -> make the move and draw ,
            //else keep highligted and wait correct click for end position
            //currentPlayerMoves++
            //check is all possible moves for this player,for this turn are made and change players if so
        }


    }
    else {  //black player - player 2

    }


    draw();
    requestAnimationFrame(play);

}

play();

function findPressedField( event ) {
    var x = event.offsetX;
    var y = event.offsetY;
    if ( ( ( x < canvas.width - boardFrameOffset && x > boardFrameOffset + boardSide + boardBar ) ||
        ( x < boardFrameOffset + boardSide && x > boardFrameOffset ) ) &&
        ( y < canvas.height - boardFrameOffset && y > boardFrameOffset ) ) { // ignoring every piece of the frame
        var i = 0,
            len,
            foundField,
            upperSide = false;
        // determining in which quadrant are we exactly
        if ( y < canvas.height / 2 && y > boardFrameOffset ) {
            i = 12; // last field of the upper side, last because if we take the first our condition in the for-loop will be achieved every time
            upperSide = true;
        } else {
            i = 0; // first field of the lower side
        }
        if ( x < boardSide + boardFrameOffset && x > boardFrameOffset ) { // left side of the board
            if ( i === 0 ) { // bottom left side
                i = 6;
            } else { // upper left side
                i = 12;
            }
        } else { // right side of the board
            if ( i === 0 ) { // bottom right side
                i = 0;
            } else { // upper left side
                i = 18; // again last of the array
            }
        }
        for ( len = i + 6; i < len; i += 1 ) {
            var currentField = board.fields[i];
            if ( upperSide ) { /* its all because of the fields..
             the start position of the lower side is most-right and it starts from 0,
             while the start position of the upper side is the most-left which confuses the algorithm */
                var previousField = board.fields[i - 1];
                if ( currentField.x > x ) {
                    foundField = previousField;
                    break;
                }
            } else {
                if ( x > currentField.x ) {
                    foundField = currentField;
                    break;
                }
            }
        }
        if ( typeof foundField === 'undefined' ) { // when we are going out of the for-in and the condition for the upperSide is not met,
            // because we take the previous field element we could not get to check the last one
            foundField = board.fields[len - 1];
        }
        clickedField = foundField;
        console.log( clickedField ); // testing purposes
    }
}
