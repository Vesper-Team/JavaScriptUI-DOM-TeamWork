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
        canExtract,
        diceSound = new Audio('Sounds/dice.wav');

    function start(playerOneName, playerTwoName) {
        players = [];
        // playerOneName , playerTwoName - variables containing names from start screen
        players.push(Object.create(GameObjects.Player).init(playerOneName, 'white'));
        players.push(Object.create(GameObjects.Player).init(playerTwoName, 'black'));

        board = GameObjects.Board.init();
        dices = GameObjects.Dices.init();
        firstDiceThrow = true;

        GameDraw.initGame(board, players);
        setAvailabilityOfFields(board);
    }

    function clickedToRollDices() {
        diceSound.play();
        if (firstDiceThrow) {
            throwFirstDiceToDeterminePlayer();
            dices.numbers['mustThrowAgain'] = true;
            // after the first throw which is for who will be first the first player throws again his real dices
            currentPlayer = players[0].isOnTurn ? players[0] : players[1];
            firstDiceThrow = false;
            setTimeout(function () {
                swal(currentPlayer.name + " begins the game!", "Good luck!")
            }, 710);
        } else if (dices.numbers.length === 0) {
            dices.rollDices();
            //dices.numbers = [6,6,6,6];
            currentPlayer = players[0].isOnTurn ? players[0] : players[1];
            var possibleStartPositions = getIndexOfFieldsWithMovesAvailable(currentPlayer, board, dices.numbers);
            canExtract = checkIfPlayerCanExtractPieces(currentPlayer, board);
            if (possibleStartPositions.length === 1 && !canExtract) {
                if (board[possibleStartPositions[0]].pieces.length >= 5) {
                    board[possibleStartPositions[0]].pieces[4].isChosen = true;
                } else {
                    board[possibleStartPositions[0]].pieces[board[possibleStartPositions[0]].pieces.length - 1].isChosen = true;
                }
                hasChosen = true;
                indexOfChosenField = possibleStartPositions[0];
                updatePlayGround();
            }
        }
        diceSound.currentTime = 0;
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
        var currentPieces;

        if (dices.numbers['mustThrowAgain']) {
            return;
        }
        if (dices.numbers.length === 0) { // because when clicked without dices checkIfPlayerCanExtractPieces throws
            swal({
                title: 'Roll dices first!',
                timer: 1500,
                showConfirmButton: false
            });
            return;
        }
        canExtract = checkIfPlayerCanExtractPieces(currentPlayer, board);
        if (hasChosen) { // needed when escape is pressed
            verifyHasChosen();
        }
        if (hasChosen) {
            if (!canExtract && pressedField === indexOfChosenField) { // when you want to deselect
                board.forEach(function (gameField) {
                    var currentGameField = gameField;
                    currentGameField.pieces.forEach(function (piece) {
                        piece.isChosen = false;
                    })
                });
                updatePlayGround(board);
                return;
            }
            indexOfTargetField = getIndexOfPossibleTargetFields(indexOfChosenField, currentPlayer, board, dices.numbers);
            if (canExtract) {
                if (pressedField === indexOfChosenField) {
                    currentPieces = currentPlayer.countOfPieces;

                    checkIfCanExtractPiece(pressedField, currentPlayer, dices.numbers, board);

                    if (currentPlayer.countOfPieces !== currentPieces) {
                        checkForWin();
                        hasChosen = false;
                    }

                } else {
                    if (indexOfTargetField.indexOf(pressedField) < 0) {
                        return;
                    }
                    
                    board.movePiece(indexOfChosenField, pressedField);
                    hasChosen = false;
                    dices.usedNumber(Math.abs(pressedField - indexOfChosenField));
                    checkForPinnedPiece(pressedField);
                }
            } else {
                if (indexOfTargetField.indexOf(pressedField) < 0) {
                    return;
                }
                
                board.movePiece(indexOfChosenField, pressedField);
                hasChosen = false;
                dices.usedNumber(Math.abs(pressedField - indexOfChosenField));
                checkForPinnedPiece(pressedField);
            }

            if (dices.numbers.length === 0) {
                if (!currentPlayer.countOfPieces) {
                    checkForWin();
                    return;
                }
                swal({
                    title: "Next player turn!",
                    timer: 1500,
                    showConfirmButton: false
                });

                setAvailabilityOfFields(board);
                GameDraw.updateDices();
                updatePlayGround();
                setCurrentPlayerOnTurn();
                return;
            }

        } else {
            if (!canExtract) {
                var possibleStartPositions = getIndexOfFieldsWithMovesAvailable(currentPlayer, board, dices.numbers);
                // alert(possibleStartPositions)
                if (!possibleStartPositions.length) {
                    swal({
                        title: "Next player turn!",
                        text: "No moves available",
                        timer: 1500,
                        showConfirmButton: false
                    });
                    
                    dices.clearNumbers();
                    setAvailabilityOfFields(board);
                    GameDraw.updateDices();
                    updatePlayGround();
                    setCurrentPlayerOnTurn();
                    return;
                } else if (possibleStartPositions.length === 1 && !canExtract) {
                    markPiece(possibleStartPositions[0]);
                    hasChosen = true;
                    indexOfChosenField = possibleStartPositions[0];
                    updatePlayGround();
                } else {
                    if (possibleStartPositions.indexOf(pressedField) > -1) {
                        markPiece(pressedField);
                    } else {
                        return;
                    }

                    hasChosen = true;
                    indexOfChosenField = pressedField;
                }

            } else {
                // not right but better than nothing - probably will allow to finish a game or two :) - to be done
                if (board[pressedField].pieces.length) {
                    markPiece(pressedField);
                    indexOfChosenField = pressedField;
                    hasChosen = true;
                } else {
                    return;
                }
            }
        }

        updatePlayGround();
        GameDraw.updateDices();

        function checkForWin() {
            if (!currentPlayer.countOfPieces) {
                swal({
                    title: "Congratulations",
                    text: currentPlayer.name + " WINS!!!",
                    imageUrl: "images/trophy_image.jpg",
                }, function (isConfirm) {
                    if (isConfirm) {
                        setTimeout(function () {
                            swal({
                                title: "Do you want to start a new game?",
                                confirmButtonColor: "#DD6B55",
                                confirmButtonText: "Yes, plx",
                                cancelButtonText: "No, thanks!",
                                showCancelButton: true,
                                closeOnConfirm: false,
                                closeOnCancel: false
                            }, function (beginGame) {
                                if (beginGame) {
                                    swal({
                                        title: "Starting a new Game!",
                                        text: "yaay.",
                                        type: "success",
                                        timer: 1300,
                                        showConfirmButton: false,
                                        showCancelButton: false
                                    });
                                    setTimeout(function () {
                                        location.reload();
                                    }, 1400);
                                } else {
                                    swal("Cancelled", "Ookay :(", "error");
                                }
                            })
                        }, 500);
                    }
                });
            }
        }

        function markPiece(field) {
            if (board[field].pieces.length >= 5) {
                board[field].pieces[4].isChosen = true;
            } else {
                board[field].pieces[board[field].pieces.length - 1].isChosen = true;
            }
        }

        function verifyHasChosen() {
            var j, lent,
                k, kent; // escape purposes
            for (j = 0, lent = board.length; j < lent; j += 1) {
                for (k = 0, kent = board[j].pieces.length; k < kent; k += 1) {
                    if (!board[j].pieces[k].isChosen) {
                        hasChosen = false;
                    } else {
                        hasChosen = true;
                        return;
                    }
                }
            }
        }
    }

    function checkIfCanExtractPiece(pressedField, player, numbers, board) {
        var color = player.color,
            i, j, k,
            sum;

        function unmarkPiece(field) {
            if (board[field].pieces.length > 5) {
                board[field].pieces[4].isChosen = false;
            }
        }

        numbers.sort(function (a, b) {
            return a - b;
        });
        //alert(numbers)

        if (color === 'white') {
            for (i = 0; i < numbers.length; i++) {
                if (pressedField < 25 - numbers[i]) {
                    continue;
                }
                if (pressedField === 25 - numbers[i]) {
                    player.countOfPieces--;
                    unmarkPiece(pressedField);
                    board[pressedField].pieces.pop();
                    dices.usedNumber(numbers[i]);
                    return;
                } else {
                    for (j = 19; j < 25 - i; j++) {
                        sum += board[j].pieces.length;
                    }
                    if (!sum) {
                        player.countOfPieces--;
                        unmarkPiece(pressedField);
                        board[pressedField].pieces.pop();
                        dices.usedNumber(numbers[i]);
                        return;
                    }
                }
            }
        } else {
            //alert('in')
            for (i = 0; i < numbers.length; i++) {
                if (pressedField > numbers[i]) {
                    continue;
                }
                if (pressedField === numbers[i]) {
                    player.countOfPieces--;
                    unmarkPiece(pressedField);
                    board[pressedField].pieces.pop();
                    dices.usedNumber(numbers[i]);
                    return;

                } else {
                    for (j = 6; j > i; j--) {
                        sum += board[j].pieces.length;
                    }
                    if (!sum) {
                        player.countOfPieces--;
                        unmarkPiece(pressedField);
                        board[pressedField].pieces.pop();
                        dices.usedNumber(numbers[i]);
                        return;
                    }
                }
            }
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

    function checkForPinnedPiece(pressedField) {
        if (board[pressedField].pieces.length === 2 && board[pressedField].pieces[0].color !== board[pressedField].pieces[1].color) {
            var shifted = board[pressedField].pieces.shift();
            if (shifted.color === 'white') {
                board[0].pieces.push(shifted);
                updatePlayGround();
                return;
            } else {
                board[len - 1].pieces.push(shifted);
                updatePlayGround();
                return;
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

    function setAvailabilityOfFields(board) {
        var i,
            len = board.length - 1;
        for (i = 1; i < len; i += 1) {
            board[i].availableForBlack = true;
            board[i].availableForWhite = true;

            if (board[i].pieces.length > 1 && board[i].pieces[1].color === 'white') {
                board[i].availableForBlack = false;
            }
            if (board[i].pieces.length > 1 && board[i].pieces[1].color === 'black') {
                board[i].availableForWhite = false;
            }
        }
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
}());


// // All events will call GameEngine.Update() and GameDraw.Update().


//// Logic to add
//// function checkIfPlayerIsMakingNormalMoves(currentActivePlayer, currentPlayerMoves, maximumAllowedMovesInTurn) {
////     if (currentPlayerMoves < maximumAllowedMovesInTurn && !currentActivePlayer.hasHitChecker && !currentActivePlayer.canTakeChecker) {
////         return true;
////     }
////     return false;
//// }
