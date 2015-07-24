// CONSTANTS
var fieldWidth = 54, // the width of every of the 24 fields
    offsetBetweenFields = 5, // between small field(white) and big field(dark)
    boardSide = 324, // the width of one side of the board
    boardBar = 34, // the thing between the board sides in pixels
    boardFrameOffset = 18, // the offset in the corners between the board itself and the frame in pixels
    checkerHeight = 42, // the height of the checker after being fully drawn in pixels
    checkerRadius = 21, // full width = 44; outer stroke 1px
    checkerInnerCircleRadius = 10;

// GAME ELEMENTS - canvas, ctx, keystate
var canvas,
    ctx,
    clickedField;

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

var field = function () { /* the board is filled with 24 fields,
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
                    ctx.fillText('x' + (i - 3), (this.x-6) + fieldWidth / 2, this.y + checkerRadius + 4);
                    // x2 for the 6th checker because it represents how many checkers are stacked
                    // 6 and 4 are just a magic numbers to position the text in the center of the checker, because the text has also its own offset
                    ctx.restore();
                } else {
                    if (this.y < canvas.height / 2) { // if field is in the upper half of the board, should stack them up to bottom
                        fieldCenter = this.x + (fieldWidth / 2); // x coordinate for the checker center
                        this.checkers[i].draw(fieldCenter, this.y + i * checkerHeight + checkerRadius);
                    } else { // when the field is in the lower part, should stack them from bottom to up
                        fieldCenter = this.x + (fieldWidth / 2); // x coordinate for the checker center
                        this.checkers[i].draw(fieldCenter, this.y - i * checkerHeight + checkerRadius)
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
}();

var checker = function () {
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
}();

var board = function () {
    var bottomSideAllSet = false, // flag to indicate that we must start with a field having 5 checkers in it(the 12th field)
    // at bottom we start with  12. 5 3 5 2 .23
    // at top we start with     11. 5 3 5 2 .0
        patternToPutColors = []; // colors are inverted in the opposite sides of the field, sorry it truly looks ugly..
    patternToPutColors[0] = 1;
    patternToPutColors[5] = 0;
    patternToPutColors[7] = 0;
    patternToPutColors[11] = 1;

    var gameboard = {
        init: function () {
            this.fields = [];
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
}();

// function newGame() or main()
// create initiate and append game canvas
// keep track of keyboard presses
// INITIATE GAME OBJECTS;
// GAME LOOP, STARTS THE ANIMATION;

function newGame() {
    canvas = document.getElementById('board-canvas');
    ctx = canvas.getContext('2d');
    canvas.addEventListener('click', findPressedField);

    // INIT GAME OBJECTS, SETS UP GAME
    board.init();


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
                var currentField = gameBoard.fields[i];
                if (upperSide) { /* its all because of the fields..
                 the start position of the lower side is most-right and it starts from 0,
                 while the start position of the upper side is the most-left which confuses the algorithm */
                    var previousField = gameBoard.fields[i - 1];
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
                foundField = gameBoard.fields[len - 1];
            }
            clickedField = foundField;
            console.log(clickedField); // testing purposes
        }
    }
}
newGame();

function play() {
    // GAME LOOP
    // game logic, updating the fields, players turns, dices etc. Update update update
    // change fields depending on how the player interact(key presses)

    // calls function update()

    // draws every time and if we have changes its ok
        draw();
        requestAnimationFrame(play);
}
play();

// function update()
// maybe it should listen for the clickedField


function draw() {
    board.fields.forEach(function (field) {
        field.draw(); // we redraw every field again
    });
}

window.onload = newGame();