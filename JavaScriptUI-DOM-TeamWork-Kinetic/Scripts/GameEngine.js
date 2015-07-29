/// <reference path="GameDraw.js" />
/// <reference path="GameObjects.js" />
var GameEngine = ( function () {
    var board,
        players,
        dices,
        firstDiceThrow;

    function start() {
        players = [];
        // playerOneName , playerTwoName - variables containing names from start screen
        players.push(Object.create(GameObjects.Player).init('First', 'white'));
        players.push(Object.create(GameObjects.Player).init('Second', 'black'));

        //TODO check 
        board = GameObjects.Board.init();

        // dices.rollDices() ; dices.usedNumber(number) ; dices.clearNumbers()
        dices = GameObjects.Dices.init();
        firstDiceThrow = true;

        GameDraw.initGame(board);
    }

    function clickedToRollDices() {
        if (firstDiceThrow) {
            firstDiceThrow = false;
            throwFirstDiceToDeterminePlayer();
        }
        if (dices.numbers.length === 0) {
            dices.rollDices();
        }
        update();
    }

    function updatePlayGround() {
        GameDraw.updatePlayGround(board);
    }


    function update() {
        // taking player
        var currentPlayer = players[0].isOnTurn ? players[0] : players[1];

        // finding his possible moves
        var possibleStartMoves = getIndexOfFieldsWithMovesAvailable(currentPlayer, board, dices.numbers);
        if (possibleStartMoves.length === 0) {
            clickedToRollDices();
            setCurrentPlayerOnTurn();
            // TODO: show that there are no more moves, next player -> calling clickedToRollDices or telling to roll again
        }

        // adding where the player can play; Reconsider this!
        //addListenersToPossibleGameFields(possibleStartMoves);

        // currentPlayer = GetCurrentPlayer - depending on player.isOnTurn or isFirstPlayerOnTurn

        // flag hasThrownDice -> if not - throw dice(allowedMoves = diceResult, currentPlayerMoves = 0); else - continue

        // if (currentPlayer.hasHitPiece) -> Call function(s) to deal with this situation.
        // if can't put piece -> playerMoves = allowedMoves

        // if ((currentPlayerMoves < allowedMoves) && hasMovedPiece (sets to true when called from onDrag event on piece)

        // Subcases: move from position to position/ collect piece
        // Call function(s) to deal with this situation. -> hasMovedPiece = false, currentPlayerMoves++;

        // Missed logic?

        // if current player has no pieces on the board -> He wins.

        // if (playerMoves === allowedMoves) -> setCurrentPlayerOnTurn() , hasThrownDice = false


        // dunno whether this should be here
        updatePlayGround();
    }

    // Event targets can be document elements, the document itself, window or any other object that supports events.
    //function addListenersToPossibleGameFields(gameFields) {
    //    var i,
    //        len,
    //        currentFieldIndex,
    //        currentField;
    //
    //    for (i = 0, len = gameFields.length; i < len; i += 1) {
    //        currentFieldIndex = gameFields[i];
    //        currentField = board[currentFieldIndex];
    //        currentField.addEventListener('mousedown', selectAndPaintLastPiece(currentField));
    //    }
    //}
    //
    //function selectAndPaintLastPiece(gameField) {
    //    var lengthOfPiecesInField = gameField.pieces.length;
    //    gameField.pieces[lengthOfPiecesInField - 1].isChosen = true;
    //}

    function throwFirstDiceToDeterminePlayer() {
        dices.rollDices();
        if (dices.numbers[dices.numbers.length - 2] > dices.numbers[dices.numbers.length - 1]) {
            players[0].isOnTurn = true;
        } else if (dices.numbers[dices.numbers.length - 2] < dices.numbers[dices.numbers.length - 1]) {
            players[1].isOnTurn = true;
        } else {
            firstDiceThrow = true;
            dices.numbers = [];
            clickedToRollDices();
        }
    }

    function setCurrentPlayerOnTurn() {
        var currentPlayer;

        if (players[0].isOnTurn) {
            currentPlayer = players[0];
            players[0].isOnTurn = false;
            players[1].isOnTurn = true;
        } else {
            currentPlayer = players[1];
            players[0].isOnTurn = true;
            players[1].isOnTurn = false;
        }
    }

    return {
        start: start,
        update: update,
        clickedToRollDices: clickedToRollDices,
    };
}() );

function getIndexOfFieldsWithMovesAvailable(player, board, numbers) {
    var direction,
        i, j,
        result = [],
        color = player.color;

    color = color.substring(0, 1).toUpperCase() + color.substring(1);

    if (color.toLowerCase() === 'white') {
        direction = 1;

        if (board[0].pieces.length) {
            for (j = 0; j < numbers.length; j += 1) {
                if (board[0 + numbers[j] * direction]['availableFor' + color]) {
                    return [0];
                }
            }

            return result;            
        }
    } else {
        direction = -1;

        if (board[board.length - 1].pieces.length) {
            for (j = 0; j < numbers.length; j += 1) {
                if (board[board.length - 1 + numbers[j] * direction]['availableFor' + color]) {
                    return [board.length - 1];
                }
            }

            return result;
        }
    }

    for (i = 1, len = board.length; i < board.length - 1; i += 1) {
        if (board[i].pieces.length > 0 && board[i].pieces[0].color === color.toLowerCase()) {
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
function checkIfPlayerIsMakingNormalMoves(currentActivePlayer, currentPlayerMoves, maximumAllowedMovesInTurn) {
    if (currentPlayerMoves < maximumAllowedMovesInTurn && !currentActivePlayer.hasHitChecker && !currentActivePlayer.canTakeChecker) {
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
            if (board.fields[firstDice.number].availableForWhite) {
                if (board.fields[firstDice.number].length > 0 && board.fields[firstDice.number][0].color === inactivePlayer.color) {
                    //HIT HIS CHECKER AND PLACE YOUR OWN
                }
                else {
                    //TODO JUST ADD YOUR CHECKER
                }
                //CHANGE THE STATE OF THAT BOARD SPOT
                currentPlayerMoves++;
                if (board.fields[25].length === 0) {
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
                if (board.fields[25].length === 0) {
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
            if (board.fields[firstDice.number].availableForBlack) {
                if (board.fields[firstDice.number].length > 0 && board.fields[firstDice.number][0].color === inactivePlayer.color) {
                    //HIT HIS CHECKER AND PLACE YOUR OWN
                }
                else {
                    //TODO JUST ADD YOUR CHECKER
                }
                //CHANGE THE STATE OF THAT BOARD SPOT
                currentPlayerMoves++;
                if (board.fields[0].length === 0) {
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
                if (board.fields[0].length === 0) {
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
}