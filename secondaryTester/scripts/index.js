// CONSTANTS
var fieldWidth = 54, // the width of every of the 24 fields
    offsetBetweenFields = 5, // between small field(white) and big field(dark)
    boardSide = 324, // the width of one side of the board
    boardBar = 34, // the thing between the board sides in pixels
    boardFrameOffset = 18, // the offset in the corners between the board itself and the frame in pixels
    checkerHeight = 42, // the height of the checker after being fully drawn in pixels
    checkerRadius = 21, // full width = 44; outer stroke 1px
    checkerInnerCircleRadius = 10,
    initialDiceValue = 6;

// GAME ELEMENTS - canvas, ctx, keystate, etc.
var canvas,
    ctx,
    diceCanvas,
    diceCtx,
    clickedField,
    firstPlayer,
    secondPlayer,
    firstDice,
    secondDice,
    firstDiceThrow,
    firstPlayerOnTurn,
    mustThrowDices;

// DEFINING GAME OBJECTS - player, checker, dice, board(not if it is just a background) ...
var player = (function () {
    var player = {
        init: function (name, color) {
            this.name = name;
            this.color = color;
            this.currentCheckersCount = 15;
            this.hasHitChecker = false;
            this.hitCheckersCount = 0;
            this.canTakeChecker = false;
            return this;
        },
        tookChecker: function () {
            // TODO: Validate depending on call.
            this.currentCheckersCount -= 1;
        }
    };

    Object.defineProperty(player, 'name', {
        get: function () {
            return this._name;
        },
        set: function (value) {
            //TODO: Validate
            this._name = value;
        }
    });

    Object.defineProperty(player, 'currentCheckersCount', {
        get: function () {
            return this._currentCheckersCount;
        },
        set: function (value) {
            //TODO: Validate
            this._currentCheckersCount = value;
        }
    });

    Object.defineProperty(player, 'color', {
        get: function () {
            return this._color;
        },
        set: function (value) {
            // TODO: Validate
            this._color = value;
        }
    });

    Object.defineProperty(player, 'hasHitChecker', {
        get: function () {
            return this._hasHitChecker;
        },
        set: function (value) {
            // TODO: Validate
            this._hasHitChecker = value;
        }
    });

    Object.defineProperty(player, 'hitCheckersCount', {
        get: function () {
            return this._hitCheckersCount;
        },
        set: function (value) {
            // TODO: Validate
            this._hitCheckersCount = value;
        }
    });

    Object.defineProperty(player, 'canTakeChecker', {
        get: function () {
            return this._canTakeChecker;
        },
        set: function (value) {
            // TODO: Validate
            this._canTakeChecker = value;
        }
    });

    return player;
}());

var field = (function () { /* the board is filled with 24 fields,
 IT IS A RESPONSIBILITY OF THE FIELDS TO GIVE COORDINATES TO THE CHECKERS, WITH RESPECT TO THEIR OWN X,Y COORDINATES
 IN THIS WAY WE DON'T CARE HOW TO STACK CHECKERS AND TO TAKE INTO ACCOUNT THEIR Xs AND Ys,
 THE FIELD JUST STACKS THEM DEPENDING ON THE COUNT IT IS HOLDING, GIVING HIS OWN X, Y */
    var field = {
        init: function (x, y) {
            this.checkers = [];
            this.x = x;
            this.y = y;
            /* if field is 0~11 y = canvas.height - boardFrameOffset; else y = boardFrameOffset;
             this is needed only for knowing at which side are we, so we can draw the checkers properly */
            return this;
        },
        addChecker: function (checker) {
            this.checkers.push(checker);
        },
        removeChecker: function () {
            this.checkers.pop();
        },
        draw: function () {
            var count = this.checkers.length, // count checkers, if more than 5 draw stacked
                i,
                fieldCenter;
            for (i = 0; i < count; i += 1) {
                if (i > 4) {
                    // draw stacked
                    ctx.save();
                    ctx.fillStyle = 'red';
                    ctx.font = "12px Verdana";
                    ctx.fillText('x' + (i - 3), (this.x - 6) + fieldWidth / 2, this.y + checkerRadius + 4);
                    // x2 for the 6th checker because it represents how many checkers are stacked
                    // 6 and 4 are just a magic numbers to position the text in the center of the checker, because the text has also its own offset
                    ctx.restore();
                } else {
                    if (this.y < canvas.height / 2) { // if field is in the upper half of the board, should stack them up to bottom
                        fieldCenter = this.x + (fieldWidth / 2); // x coordinate for the checker center
                        this.checkers[i].draw(fieldCenter, this.y + i * checkerHeight + checkerRadius + 2);
                        /* +2 just to look better,
                         the checker from the board frame */
                    } else { // when the field is in the lower part, should stack them from bottom to up
                        fieldCenter = this.x + (fieldWidth / 2); // x coordinate for the checker center
                        this.checkers[i].draw(fieldCenter, this.y - i * checkerHeight + checkerRadius - 2); // -2 just to look better
                    }
                }
            }
        }
    };

    Object.defineProperty(field, 'checkers', {
        get: function () {
            return this._checkers;
        },
        set: function (value) {
            this._checkers = value;
        }
    });

    Object.defineProperty(field, 'x', {
        get: function () {
            return this._x;
        },
        set: function (value) {
            this._x = value;
        }
    });

    Object.defineProperty(field, 'y', {
        get: function () {
            return this._y;
        },
        set: function (value) {
            this._y = value;
        }
    });

    return field;
}());

var checker = (function () {
    var checker = {
        init: function (color) {
            this.color = color; // can be only 'black' or 'white'
            return this;
        },
        draw: function (x, y) {
            ctx.save();
            if (this.color === 'black') {
                ctx.strokeStyle = 'white';
            }
            // outer circle
            ctx.beginPath();
            ctx.fillStyle = this.color;
            ctx.lineWidth = 1;
            ctx.arc(x, y, checkerRadius, 0, 2 * Math.PI);
            ctx.fill();
            ctx.stroke();

            // inner circle
            ctx.beginPath();
            ctx.strokeStyle = '#808080';
            ctx.lineWidth = 2;
            ctx.arc(x, y, checkerInnerCircleRadius, 0, 2 * Math.PI);
            ctx.stroke();

            ctx.restore();
        }
    };

    Object.defineProperty(checker, 'color', {
        get: function () {
            return this._color;
        },
        set: function (value) {
            this._color = value;
        }
    });

    return checker;
}());

var board = (function () {
    var bottomSideAllSet, // flag to indicate that we must start with a field having 5 checkers in it(the 12th field)
    // at bottom we start with  12. 5 3 5 2 .23
    // at top we start with     11. 5 3 5 2 .0
        patternToPutColors = []; // colors are inverted in the opposite sides of the field, sorry it truly looks ugly..

    var gameboard = {
        init: function () {
            this.fields = [];
            bottomSideAllSet = false;
            patternToPutColors[0] = 1;
            patternToPutColors[5] = 0;
            patternToPutColors[7] = 0;
            patternToPutColors[11] = 1;
            var self = this;
            setupHalfGameBoard(self, bottomSideAllSet);
            bottomSideAllSet = true;
            setupHalfGameBoard(self, bottomSideAllSet);
            return this;
        },
        addField: function (value) {
            this.fields.push(value);
        }
    };

    function setupHalfGameBoard(self, bottomSideAllSet) {
        var i,
            len,
            x,
            y,
            currentField,
            patternOfTheNumberOfCheckersToPut = [2, 0, 0, 0, 0, 5, 0, 3, 0, 0, 0, 5],// on 0 field put 2, on field 1 put 0, etc.. the setup rules..
            j,  // needed to go trough the patternToPutCheckers
            colorToPut,
            countPassedFields = 0; // needed to add a boardBar offset to the X coordinate

        if (bottomSideAllSet) {
            i = 12;
            j = 11;
        } else {
            i = 0;
            j = 0;
        }
        for (len = i + 12; i < len; i += 1, (i >= 12) ? j -= 1 : j += 1, countPassedFields += 1) {
            if (countPassedFields >= 6) {  // after every 6 fields we must consider the boardBar also, in both the upper and the lower side of the board
                x = (!bottomSideAllSet) * canvas.width - boardFrameOffset - ((countPassedFields + !bottomSideAllSet) * fieldWidth) - boardBar;
            } else {
                x = (!bottomSideAllSet) * canvas.width - boardFrameOffset - ((countPassedFields + !bottomSideAllSet) * fieldWidth);
                // if we are at the bottom we must consider the canvas width and to subtract from it
            }
            y = (!bottomSideAllSet) * (canvas.height - checkerHeight) - boardFrameOffset;

            if (x < 0) { // because we are extracting everything from the canvas width or height
                x *= -1; // when we are at the bottom side, we start from the MOST-RIGHT field(our 0 field) so canvas height, and width must be considered,
            }            // while when we are at the upper side of the board, the MOST-LEFT field(the 12th field) must be filled first,
            if (y < 0) { // so canvas width and height in the upper side are 0, and we get a negative number but we actually need that number to be positive,
                y *= -1; // to go to the right.. to fill the rest of the fields.. it's all because of how the fields position in backgammon
            }
            if (patternToPutColors[j] === 1) {
                colorToPut = 'white';
                patternToPutColors[j] = 0; // swapping the pattern for the next half of the board
            } else if (patternToPutColors[j] === 0) {
                colorToPut = 'black';
                patternToPutColors[j] = 1;
            }
            currentField = Object.create(field).init(x, y); // creating one of the 24 fields in the board
            putCheckersOnField(patternOfTheNumberOfCheckersToPut[j], currentField, colorToPut); // assigning checkers to it with respect to the Backgammon setup rules
            self.addField(currentField); // adding the field to the board, used 'self' because the scope of this has changed
        }
    }

    function putCheckersOnField(checkersToPut, givenField, color) {
        var i;
        for (i = 0; i < checkersToPut; i += 1) {
            givenField.addChecker(Object.create(checker).init(color));
        }
    }

    return gameboard;
}());

var dice = (function () {
    var dice = {
        init: function () {
            this.number = initialDiceValue;
            return this;
        }
    };

    Object.defineProperty(dice, 'number', {
        get: function () {
            return this._number;
        },
        set: function (value) {
            checkIfDiceValueIsValid(value);
            this._number = value;
        }
    });

    Object.defineProperty(dice, 'generateNewNumber', {
        value: function () {
            return this.number = Math.round(Math.random() * 5) + 1;
        }
    });

    function checkIfDiceValueIsValid(number) {
        if (isNaN(number) || number % 1 != 0 || number < 1 || number > 6) {
            throw new Error('Dice number is invalid!');
        }
    }

    return dice;
}());


// function newGame() or main()
// create initiate and append game canvas
// INITIATE GAME OBJECTS;
function newGame() {
    canvas = document.getElementById('board-canvas');
    ctx = canvas.getContext('2d');
    firstPlayer = Object.create(player).init('GOSHO','white'); //DA HVANEM USER INPUTA
    secondPlayer = Object.create(player).init('Pesho','black'); //DA HVANEM USER INPUTA

    // INIT GAME OBJECTS, SETS UP GAME
    board.init();
    firstDice = Object.create(dice).init();
    secondDice = Object.create(dice).init();
    firstDiceThrow = true;
}
newGame();

function play() {
    // GAME LOOP - game logic, updating the fields, players turns, dices etc. Update update update
    // change fields depending on how the player interact(key presses)
    canvas.addEventListener('click', findPressedField);

    //THROW DICE - at first time, throw to see who will be playing first
    if (firstDiceThrow) {
        firstDiceThrow = false;
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
    } else {
        firstDice.generateNewNumber();
        secondDice.generateNewNumber();
    }
    var currentActivePlayer;
    var currentPlayerMoves = 0;   // DA SE IZNESAT TEZI PROMENLIVI GORE POSLE
    var startSearchPosition = 0;
    var hasNoMoves = false;
    //USING THE CURRENT PLAYER ON TURN
    if (firstPlayerOnTurn) {
        currentActivePlayer = firstPlayer;
    }
    else {
        currentActivePlayer = secondPlayer;
    }
    //FINDING IF THIS CURRENT PLAYER HAS ANY HIT CHECKERS
    if (currentActivePlayer.currentCheckersCount > 0 && !currentActivePlayer.canTakeChecker) {
        currentActivePlayer.hasHitChecker = true;
    }
    else {
        currentActivePlayer.hasHitChecker = false;
    }

    //IF HAS HIT CHECKERS
    while (currentActivePlayer.hasHitChecker) {

        if (currentActivePlayer.currentCheckersCount === 0) {
            currentActivePlayer.hasHitChecker = false;
            break;
        }
        if (currentActivePlayer === firstPlayer) {
            startSearchPosition = 0;
            if (board.fields[startSearchPosition - 1 + firstDice.number].length >= 2 &&
               board.fields[startSearchPosition - 1 + firstDice.number][0].color === 'black') {
                currentPlayerMoves++; //you lose a move,because u cant set your pull there
                if (currentPlayerMoves === 2) {
                    hasNoMoves = true;
                    break;
                }
            }

            if (board.fields[startSearchPosition - 1 + secondDice.number].length >= 2 &&
               board.fields[startSearchPosition - 1 + secondDice.number][0].color === 'black') {
                currentPlayerMoves++; //you lose a move,because u cant set your pull there
                if (currentPlayerMoves === 2) {
                    hasNoMoves = true;
                    break;
                }
            }

            if (board.fields[startSearchPosition - 1 + firstDice.number].length === 1 &&
                board.fields[startSearchPosition - 1 + firstDice.number][0].color === 'black') {
                secondPlayer.canTakeChecker = false;
                secondPlayer.currentCheckersCount++;
                currentPlayerMoves++;
                currentPlayer.currentCheckersCount--;
                //DRAW THE PULL ON THAT SPOT AND REMOVE THE LAST ONE
                if (currentPlayerMoves === 2) {
                    hasNoMoves = true;
                    break;
                }
            }


            if (board.fields[startSearchPosition - 1 + secondDice.number].length === 1 &&
             board.fields[startSearchPosition - 1 + secondDice.number][0].color === 'black') {
                secondPlayer.canTakeChecker = false;
                secondPlayer.currentCheckersCount++;
                currentPlayerMoves++;
                currentPlayer.currentCheckersCount--;
                //DRAW THE PULL ON THAT SPOT AND REMOVE THE LAST ONE
                if (currentPlayerMoves === 2) {
                    hasNoMoves = true;
                    break;
                }
            }

            if (board.fields[startSearchPosition - 1 + firstDice.number].length === 0) {
                currentPlayerMoves++;
                currentPlayer.currentCheckersCount--;
                //PUSH?                                          /WTF MISSED?/
                //DRAW THE PULL ON THE NEW SPOT
                if (currentPlayerMoves === 2) {
                    hasNoMoves = true;
                    break;
                }
            }

            if (board.fields[startSearchPosition - 1 + secondDice.number].length === 0) {
                currentPlayerMoves++;
                currentPlayer.currentCheckersCount--;
                //PUSH?                                          /WTF MISSED?/
                //DRAW THE PULL ON THE NEW SPOT
                if (currentPlayerMoves === 2) {
                    hasNoMoves = true;
                    break;
                }
            }

        }
        else { //if second player           
            startSearchPosition = 23;
            if (board.fields[startSearchPosition + 1 - firstDice.number].length >= 2 &&
             board.fields[startSearchPosition + 1 - firstDice.number][0].color === 'white') {
                currentPlayerMoves++; //you lose a move,because u cant set your pull there
                if (currentPlayerMoves === 2) {
                    hasNoMoves = true;
                    break;
                }
            }

            if (board.fields[startSearchPosition + 1 - firstDice.number].length >= 2 &&
               board.fields[startSearchPosition + 1 - firstDice.number][0].color === 'white') {
                currentPlayerMoves++; //you lose a move,because u cant set your pull there
                if (currentPlayerMoves === 2) {
                    hasNoMoves = true;
                    break;
                }
            }

            if (board.fields[startSearchPosition + 1 - firstDice.number].length === 1 &&
                board.fields[startSearchPosition + 1 - firstDice.number][0].color === 'white') {
                firstPlayer.canTakeChecker = false;
                firstPlayer.currentCheckersCount++;
                currentPlayerMoves++;
                currentPlayer.currentCheckersCount--;
                //DRAW THE PULL ON THAT SPOT AND REMOVE THE LAST ONE

                //TODO MAKE THE SWITCH !!!!
                if (currentPlayerMoves === 2) {
                    hasNoMoves = true;
                    break;
                }
            }


            if (board.fields[startSearchPosition + 1 - firstDice.number].length === 1 &&
             board.fields[startSearchPosition + 1 - firstDice.number][0].color === 'white') {
                firstPlayer.canTakeChecker = false;
                firstPlayer.currentCheckersCount++;
                currentPlayerMoves++;
                currentPlayer.currentCheckersCount--;
                //DRAW THE PULL ON THAT SPOT AND REMOVE THE LAST ONE

                //TODO MAKE THE SWITCH !!!!
                if (currentPlayerMoves === 2) {
                    hasNoMoves = true;
                    break;
                }
            }

            if (board.fields[startSearchPosition + 1 - firstDice.number].length === 0) {
                currentPlayerMoves++;
                currentPlayer.currentCheckersCount--;
                //PUSH?                                          /WTF MISSED?/
                //DRAW THE PULL ON THE NEW SPOT
                if (currentPlayerMoves === 2) {
                    hasNoMoves = true;
                    break;
                }
            }

            if (board.fields[startSearchPosition + 1 - firstDice.number].length === 0) {
                currentPlayerMoves++;
                currentPlayer.currentCheckersCount--;
                //PUSH?                                          /WTF MISSED?/
                //DRAW THE PULL ON THE NEW SPOT
                if (currentPlayerMoves === 2) {
                    hasNoMoves = true;
                    break;
                }
            }

        }

        if (hasNoMoves) {
            firstPlayerOnTurn = !firstPlayerOnTurn;   //this will repeat a few times !!!!!!!!!!!!!!!!!!!!!!!!!!!
            play();
        }


        //CHECK IF PLAYER IS CURRENTLY TAKING CHECKERS
        var from = 0;
        var to = 0;
        var sum = 0,
            searcher = 0;
        if (currentActivePlayer === firstPlayer) {
            from = 18;
            to = 23;
        }
        else {
            from = 0;
            to = 5;
        }
        //CHECK IF ALL 15 CHECKERS ARE IN THE ZONE,WHICH WILL INDICATE THAT THE PLAYER CAN EXTRACT THEM
        for (searcher = from ; searcher <= to; searcher += 1) {
            if (board.fields[searcher].length > 0 || board.fields[searcher][0].color === currentActivePlayer.color) {
                sum += board.fields[searcher].length;
            }
        }
        if (sum < 15 - currentActivePlayer.currentCheckersCount) {
            currentActivePlayer.canTakeChecker = false;
        }
        else if (sym === (15 - currentActivePlayer.currentCheckersCount)) {
            currentActivePlayer.canTakeChecker = true;
        }
        else {
            throw new Error('invalid number of checkers of a player on the field');
        }

        //TAKING CHECKERS ON TURN
        while (currentActivePlayer.canTakeChecker) {
            if (currentPlayerMoves === 2) {
                break;
            }
            //if white player
            if (currentActivePlayer === firstPlayer) {
                //if first dice spot is not empty and has this players' checkers
                if (board.fields[23 + 1 - firstDice.number].length > 0 &&
                    board.fields[23 + 1 - firstDice.number][0].color === currentActivePlayer.color) {
                    currentActivePlayer.currentCheckersCount--;
                    currentPlayerMoves++;
                    board.fields[23 + 1 - firstDice.number].pop();
                    if (currentPlayerMoves === 2) {
                        break;
                    }
                }
                //if second dice spot is not empty
                if (board.fields[23 + 1 - secondDice.number].length > 0 &&
                    board.fields[23 + 1 - secondDice.number][0].color === currentActivePlayer.color) {
                    currentActivePlayer.currentCheckersCount--;
                    currentPlayerMoves++;
                    board.fields[23 + 1 - secondDice.number].pop();
                    if (currentPlayerMoves === 2) {
                        break;
                    }
                }
                var moveOptions = 0;
                //if first dice spot IS empty
                //LOOKING FOR POSSIBLE SHUFFLE OPTIONS
                if (board.fields[23 + 1 - firstDice.number].length === 0 ||
                    board.fields[23 + 1 - firstDice.number][0].color !== currentActivePlayer.color) {
                    for (var i = 18; i <= 23; i += 1) {
                        if (i === (23 + 1 - firstDice.number)) {
                            continue;
                        }
                        if (i + firstDice.number <= 23) {
                            moveOptions++;
                        }
                    }
                    if (moveOptions === 0) {
                        currentPlayerMoves++;
                        if (currentPlayerMoves === 2) {
                            break;
                        }
                    }
                    else {
                        //SHOW WHICH MOVES ARE POSSIBLE,SINCE THERE ARE
                        //WAIT FOR PLAYER ONE PICK CHOICE WITH MOUSE DRAG
                        //IF MOVE POSSIBLE DRAW IT
                        currentPlayerMoves++ //IF THE MOUSE MOVE IS POSSIBLE /CLICKED ON THE RIGHT THINGS
                        if (currentPlayerMoves === 2) {
                            break;
                        }
                    }
                }
                //if second dice sport IS empty
                if (board.fields[23 + 1 - secondDice.number].length === 0 ||
                 board.fields[23 + 1 - secondDice.number][0].color !== currentActivePlayer.color) {
                    for (var i = 18; i <= 23; i += 1) {
                        if (i === (23 + 1 - secondDice.number)) {
                            continue;
                        }
                        if (i + secondDice.number <= 23) {
                            moveOptions++;
                        }
                    }
                    if (moveOptions === 0) {
                        currentPlayerMoves++;
                        if (currentPlayerMoves === 2) {
                            break;
                        }
                    }
                    else {
                        //SHOW WHICH MOVES ARE POSSIBLE,SINCE THERE ARE
                        //WAIT FOR PLAYER ONE PICK CHOICE WITH MOUSE DRAG
                        //IF MOVE POSSIBLE DRAW IT
                        currentPlayerMoves++ //IF THE MOUSE MOVE IS POSSIBLE /CLICKED ON THE RIGHT THINGS
                        if (currentPlayerMoves === 2) {
                            break;
                        }
                    }
                }

            }
                //if black player
            else {
                if (board.fields[0 - 1 + firstPlayer.number].length > 0 &&
                                 board.fields[0 - 1 + firstPlayer.number][0].color === currentActivePlayer.color) {
                    currentActivePlayer.currentCheckersCount--;
                    currentPlayerMoves++;
                    board.fields[0 - 1 + firstPlayer.number].pop();
                    if (currentPlayerMoves === 2) {
                        break;
                    }
                }
                //if second dice spot is not empty
                if (board.fields[0 - 1 + secondDice.number].length > 0 &&
                    board.fields[0 - 1 + secondDice.number][0].color === currentActivePlayer.color) {
                    currentActivePlayer.currentCheckersCount--;
                    currentPlayerMoves++;
                    board.fields[0 - 1 + secondDice.number].pop();
                    if (currentPlayerMoves === 2) {
                        break;
                    }
                }
                var moveOptions = 0;
                //if first dice spot IS empty
                //LOOKING FOR POSSIBLE SHUFFLE OPTIONS
                if (board.fields[0 - 1 + firstDice.number].length === 0 ||
                    board.fields[0 - 1 + firstDice.number][0].color !== currentActivePlayer.color) {
                    for (var i = 0; i <= 5; i += 1) {
                        if (i === (0 - 1 + firstDice.number)) {
                            continue;
                        }
                        if (i - firstDice.number >= 0) {
                            moveOptions++;
                        }
                    }
                    if (moveOptions === 0) {
                        currentPlayerMoves++;
                        if (currentPlayerMoves === 2) {
                            break;
                        }
                    }
                    else {
                        //SHOW WHICH MOVES ARE POSSIBLE,SINCE THERE ARE
                        //WAIT FOR PLAYER ONE PICK CHOICE WITH MOUSE DRAG
                        //IF MOVE POSSIBLE DRAW IT
                        currentPlayerMoves++ //IF THE MOUSE MOVE IS POSSIBLE /CLICKED ON THE RIGHT THINGS
                        if (currentPlayerMoves === 2) {
                            break;
                        }
                    }
                }
                //if second dice spot IS empty
                if (board.fields[0 - 1 + secondDice.number].length === 0 ||
                     board.fields[0 - 1 + secondDice.number][0].color !== currentActivePlayer.color) {
                    for (var i = 0; i <= 5; i += 1) {
                        if (i === (0 - 1 + secondDice.number)) {
                            continue;
                        }
                        if (i - firstDice.number >= 0) {
                            moveOptions++;
                        }
                    }
                    if (moveOptions === 0) {
                        currentPlayerMoves++;
                        if (currentPlayerMoves === 2) {
                            break;
                        }
                    }
                    else {
                        //SHOW WHICH MOVES ARE POSSIBLE,SINCE THERE ARE
                        //WAIT FOR PLAYER ONE PICK CHOICE WITH MOUSE DRAG
                        //IF MOVE POSSIBLE DRAW IT
                        currentPlayerMoves++ //IF THE MOUSE MOVE IS POSSIBLE /CLICKED ON THE RIGHT THINGS
                        if (currentPlayerMoves === 2) {
                            break;
                        }
                    }
                }



            }

            if (currentPlayerMoves === 2) {
                firstPlayerOnTurn = !firstPlayerOnTurn;
                play();
            }
            //JUST MOVE CHECKER


            //IF ANY POSSIBLE MOVES AVAILABLE  -->  CHECK FOR NEW CLICKS AND CATCH START POSITION , else change player
            //IF ANY POSSIBLE MOVES AVAILABLE  -->  CHECK IF NEW SET/CLICKED POSITION IS CORRECT AND MOVE PULL , else try again

            // DRAW
            // draws every time and if we have changes its ok
            draw();

            // CHANGE PLAYER
            firstPlayerOnTurn ? firstPlayerOnTurn = false : firstPlayerOnTurn = true;

            requestAnimationFrame(play);
        }
        play();

        function findPressedField(event) {
            var x = event.offsetX;
            var y = event.offsetY;
            if (((x < canvas.width - boardFrameOffset && x > boardFrameOffset + boardSide + boardBar) ||
                (x < boardFrameOffset + boardSide && x > boardFrameOffset)) &&
                (y < canvas.height - boardFrameOffset && y > boardFrameOffset)) { // ignoring every piece of the frame
                var i = 0,
                    len,
                    foundField,
                    upperSide = false;
                // determining in which quadrant are we exactly
                if (y < canvas.height / 2 && y > boardFrameOffset) {
                    i = 12; // last field of the upper side, last because if we take the first our condition in the for-loop will be achieved every time
                    upperSide = true;
                } else {
                    i = 0; // first field of the lower side
                }
                if (x < boardSide + boardFrameOffset && x > boardFrameOffset) { // left side of the board
                    if (i === 0) { // bottom left side
                        i = 6;
                    } else { // upper left side
                        i = 12;
                    }
                } else { // right side of the board
                    if (i === 0) { // bottom right side
                        i = 0;
                    } else { // upper left side
                        i = 18; // again last of the array
                    }
                }
                for (len = i + 6; i < len; i += 1) {
                    var currentField = board.fields[i];
                    if (upperSide) { /* its all because of the fields..
             the start position of the lower side is most-right and it starts from 0,
             while the start position of the upper side is the most-left which confuses the algorithm */
                        var previousField = board.fields[i - 1];
                        if (currentField.x > x) {
                            foundField = previousField;
                            break;
                        }
                    } else {
                        if (x > currentField.x) {
                            foundField = currentField;
                            break;
                        }
                    }
                }
                if (typeof foundField === 'undefined') { // when we are going out of the for-in and the condition for the upperSide is not met,
                    // because we take the previous field element we could not get to check the last one
                    foundField = board.fields[len - 1];
                }
                clickedField = foundField;
                console.log(clickedField); // testing purposes
            }
        }

        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height); // refresh canvas

            board.fields.forEach(function (field) {
                field.draw(); // redraw every field again
            });
        }
    }
}