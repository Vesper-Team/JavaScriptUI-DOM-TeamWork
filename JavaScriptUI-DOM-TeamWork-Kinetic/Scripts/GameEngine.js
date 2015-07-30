/// <reference path="GameDraw.js" />
/// <reference path="GameObjects.js" />
var GameEngine = ( function () {
    var board,
        players,
        dices,
        firstDiceThrow,
        currentPlayer,
        hasChosen,
        indexOfChosenField,
        indexOfTargetField,
        diceSound = new Audio('Sounds/dice.wav');

    function start() {
        players = [];
        // playerOneName , playerTwoName - variables containing names from start screen
        players.push(Object.create(GameObjects.Player).init('First', 'white'));
        players.push(Object.create(GameObjects.Player).init('Second', 'black'));

        board = GameObjects.Board.init();

        // dices.rollDices() ; dices.usedNumber(number) ; dices.clearNumbers()
        dices = GameObjects.Dices.init();

        firstDiceThrow = true;

        GameDraw.initGame(board, players);
    }

    function clickedToRollDices() {
        diceSound.play();
        if (firstDiceThrow) {
            throwFirstDiceToDeterminePlayer();
            dices.numbers[2] = true; // Whether should throw again ..
            // after the first throw which is for who will be first the first player throws again his real dices
            currentPlayer = players[0].isOnTurn ? players[0] : players[1];
            firstDiceThrow = false;
        } else if (dices.numbers.length === 0) {
            dices.rollDices();
            //dices.numbers = [6,6,6,6];
            currentPlayer = players[0].isOnTurn ? players[0] : players[1];
        }

        diceSound.currentTime = 1.25;
        GameDraw.updatePlayerNames(currentPlayer);
        // DO NOT USE dices.clearNumbers here!!!!
    }

    function throwFirstDiceToDeterminePlayer() {
        dices.rollDices();
        if (dices.numbers[dices.numbers.length - 2] > dices.numbers[dices.numbers.length - 1]) {
            players[0].isOnTurn = true;
        } else if (dices.numbers[dices.numbers.length - 2] < dices.numbers[dices.numbers.length - 1]) {
            players[1].isOnTurn = true;
        } else {
            firstDiceThrow = true;
            dices.clearNumbers();
            throwFirstDiceToDeterminePlayer();
        }
    }

    function setCurrentPlayerOnTurn() {
        if (players[0].isOnTurn) {
            players[0].isOnTurn = false;
            players[1].isOnTurn = true;
            return players[0];
        } else {
            players[0].isOnTurn = true;
            players[1].isOnTurn = false;
            return players[1];
        }
    }

    function update(pressedField) {
        var canExtract = checkIfPlayerCanExtractPieces(currentPlayer, board);

        // alert(hasChosen +' ' + indexOfChosenField +' ' +  indexOfTargetField +' ' +  canExtract)

        if (hasChosen) {
            indexOfTargetField = getIndexOfPossibleTargetFields(indexOfChosenField, currentPlayer, board, dices.numbers);

            if (indexOfTargetField.indexOf(pressedField) < 0) {
                return;
            }

            board.movePiece(indexOfChosenField, pressedField);

            hasChosen = false;

            updatePlayGround();

            dices.usedNumber(Math.abs(pressedField - indexOfChosenField));

            checkForPinnedPiece(board);

            if (dices.numbers.length === 0) {
                alert('No more moves. Next player turn');
                GameDraw.updateDices();
                setCurrentPlayerOnTurn();
            }

        } else {
            if (!canExtract) {
                var possibleStartPositions = getIndexOfFieldsWithMovesAvailable(currentPlayer, board, dices.numbers);
                // alert(possibleStartPositions)
                if (!possibleStartPositions.length) {
                    alert('No moves');
                    dices.clearNumbers();
                    return;
                } else if (possibleStartPositions.length === 1) {

                    if (board[possibleStartPositions[0]].pieces.length >= 5) {
                        board[possibleStartPositions[0]].pieces[4].isChosen = true;
                    } else {
                        board[possibleStartPositions[0]].pieces[board[possibleStartPositions[0]].pieces.length - 1].isChosen = true;
                    }

                    hasChosen = true;
                    indexOfChosenField = possibleStartPositions[0];
                    // alert(hasChosen + ' ' + indexOfChosenField)

                } else {
                    if (possibleStartPositions.indexOf(pressedField) > -1) {
                        if (board[pressedField].pieces.length >= 5) {
                            board[pressedField].pieces[4].isChosen = true;
                        } else {
                            board[pressedField].pieces[board[pressedField].pieces.length - 1].isChosen = true;
                        }
                    } else {
                        return;
                    }

                    hasChosen = true;
                    indexOfChosenField = pressedField;
                    // alert(hasChosen + ' ' + indexOfChosenField)

                }

            } else {
                // drago tuka move da tegli playera..

            }
        }

        updatePlayGround();

        GameDraw.updateDices();

        if (!currentPlayer.countOfPieces) {
            alert(currentPlayer.name + ' WINS!!!')
        }
    }

    function getIndexOfFieldsWithMovesAvailable(player, board, numbers) {
        var direction,
            i, j,
            result = [],
            color = player.color,
            index;

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
                    index = i + numbers[j] * direction;
                    if (0 < index && index < 25 && board[index]['availableFor' + color]) {
                        result.push(i);
                        break;
                    }
                }
            }
        }

        return result;
    }

    function getIndexOfPossibleTargetFields(markedIndex, player, board, numbers) {
        alert('clicked position ' + markedIndex + '\n dices to play' + numbers)

        var color = player.color,
            i,
            result = [],
            direction,
            index;

        if (color === 'white') {
            direction = 1
        } else {
            direction = -1
        }

        color = color.substring(0, 1).toUpperCase() + color.substring(1);

        for (i = 0; i < numbers.length; i++) {
            index = markedIndex + numbers[i] * direction;

            if (0 < index && index < 25 && board[index]['availableFor' + color]) {
                result.push(markedIndex + numbers[i] * direction);
            }
        }

        return result;
    }

    function checkForPinnedPiece(board) {
        var i,
            len = board.length;

        for (i = 1; i < len - 1; i += 1) {
            if (board[i].pieces.length === 2 && board[i].pieces[0].color !== board[i].pieces[1].color) {
                var shifted = board[i].pieces.shift();
                if (shifted.color === 'white') {
                    board[0].pieces.push(shifted);
                    return;
                } else {
                    board[len - 1].pieces.push(shifted);
                    return;
                }
            }
        }
    }

    function checkIfPlayerCanExtractPieces(player, board) {
        var color = player.color,
            i,
            count = 0;

        if (color === 'white') {
            for (i = 19; i <= 24; i += 1) {
                if (board[i].pieces.length > 0 && board[i].pieces[0].color === color) {
                    count += board[i].pieces.length;
                }
            }
        } else {
            for (i = 1; i <= 6; i += 1) {
                if (board[i].pieces.length > 0 && board[i].pieces[0].color === color) {
                    count += board[i].pieces.length;
                }
            }
        }

        return count === player.countOfPieces;
    }

    function updatePlayGround() {
        GameDraw.updatePlayGround(board);
    }

    function getDices() {
        return dices;
    }

    return {
        start: start,
        update: update,
        clickedToRollDices: clickedToRollDices,
        dices: getDices
    };
}() );


// // All events will call GameEngine.Update() and GameDraw.Update().


//// Logic to add
function checkIfPlayerIsMakingNormalMoves(currentActivePlayer, currentPlayerMoves, maximumAllowedMovesInTurn) {
    if (currentPlayerMoves < maximumAllowedMovesInTurn && !currentActivePlayer.hasHitChecker && !currentActivePlayer.canTakeChecker) {
        return true;
    }
    return false;
}

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
