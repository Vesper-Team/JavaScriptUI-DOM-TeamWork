// CONSTANTS
var fieldWidth = 54, // pixels
    boardBar = 70, // the thing between the board sides in pixels
    boardFrameOffset = 18, // the offset in the corners between the board itself and the frame in pixels
    checkerHeight = 42, // the height of the checker after being fully drawn in pixels
    checkerRadius = 21, // full width = 44; outer stroke 1px
    checkerInnerCircleRadius = 10;

// GAME ELEMENTS - canvas, ctx, keystate
var canvas,
    ctx,
    keystate;

// DEFINING GAME OBJECTS - player, checker(backgammon ???), dice, board(not if it is just a background) ...
var player = (function() {
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
        takeChecker: function(){
            // TODO: Validate depending on call.
            this.currentCheckersCount -= 1;
        }
    };

    Object.defineProperty(player, 'name', {
        get:function(){
            return this._name;
        },
        set:function(value){
            //TODO: Validate
            this._name = value;
        }
    });

    Object.defineProperty(player, 'currentCheckersCount',{
       get:function(){
           return this._currentCheckersCount;
       },
        set: function(value){
            //TODO: Validate
            this._currentCheckersCount = value;
        }
    });

    Object.defineProperty(player, 'color', {
        get: function(){
            return this._color;
        },
        set: function(value){
            // TODO: Validate
            this._color = value;
        }
    });

    Object.defineProperty(player, 'hasHitChecker', {
        get: function(){
            return this._hasHitChecker;
        },
        set: function(value){
            // TODO: Validate
            this._hasHitChecker = value;
        }
    });

    Object.defineProperty(player, 'hitCheckersCount', {
        get: function(){
            return this._hitCheckersCount;
        },
        set: function(value){
            // TODO: Validate
            this._hitCheckersCount = value;
        }
    });

    Object.defineProperty(player, 'canTakeChecker', {
        get: function(){
            return this._canTakeChecker;
        },
        set: function(value){
            // TODO: Validate
            this._canTakeChecker = value;
        }
    });

    return player;
}());

var field = function () { // the board is filled with 24 fields
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
            // count checkers, if more than 5 draw stacked
            var count = this.checkers.length,
                i,
                fieldCenter = this.x + (fieldWidth / 2); // x coordinate for the checker center
            for (i = 0; i < count; i += 1) {
                if (i > 4) {
                    // draw stacked - could be function but..
                    /* ctx.save();
                     ctx.fillStyle = 'red';
                     ctx.font = "12px Verdana";
                     ctx.fillText('x' + i-4, this.x + fieldWidth / 2, this.y + checkerHeight / 2)
                     ctx.restore();
                     */
                } else {
                    checker.draw(fieldCenter, this.y + i * checkerHeight);
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
        init: function (x, y, color) {
            this.x = x;
            this.y = y;
            this.color = color; // can be only 'black' or 'white'
            return this;
        },
        draw: function () {
            ctx.save();
            if (this.color === 'black') {
                ctx.strokeStyle = 'white';
            }
            // outer circle
            ctx.beginPath();
            ctx.fillStyle = this.color;
            ctx.lineWidth = 1;
            ctx.arc(this.x, this.y, checkerRadius, 0, 2 * Math.PI);
            ctx.fill();
            ctx.stroke();

            // inner circle
            ctx.beginPath();
            ctx.strokeStyle = '#808080';
            ctx.lineWidth = 2;
            ctx.arc(this.x, this.y, checkerInnerCircleRadius, 0, 2 * Math.PI);
            ctx.stroke();

            ctx.restore();
        }
    };

    Object.defineProperty(checker, 'x', {
        get: function () {
            return this._x;
        },
        set: function (value) {
            this._x = value;
        }
    });

    Object.defineProperty(checker, 'y', {
        get: function () {
            return this._y;
        },
        set: function (value) {
            this._y = value;
        }
    });

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
    var gameboard = {
        init: function () {
            this.fields = [];
            for (var i = 0; i < 24; i += 1) {
                this.fields[i]
            }
            return this;
        },
        addField: function (value) {
            this.fields.push(value);
        }
    };

    return gameboard;
}();

// function newGame() or main()
// create initiate and append game canvas
// keep track of keyboard presses
// init() - INITIATE GAME OBJECTS;
// loop() - GAME LOOP FUNCTION, STARTS THE ANIMATION;
function newGame() {
    canvas = document.getElementById('board-canvas');
    ctx = canvas.getContext('2d');
    canvas.addEventListener('click', showXY);

    init();

    function showXY(event) {
        var x = event.offsetX;
        var y = event.offsetY;
        var i = 0,
            len,
            foundField;
        if (y < canvas.height / 2) {
            i = 12; // first field of the upper side
        } else {
            i = 0; // first field of the lower side
        }
        if (x < 324 + boardFrameOffset && x > boardFrameOffset) { // left side of the board
            if (i === 0) { // bottom left side
                i = 6;
            } else { // upper left side
                i = 12;
            }
        } else { // right side of the board
            if (i === 0) { // bottom right side
                i = 0;
            } else { // upper left side
                i = 18;
            }
        }
        for (len = i + 6; i < len; i += 1) {
            var currentField = board.fields[i];
            if(x > currentField.x) {
                foundField = currentField;
                break;
            }
        }
        ctx.beginPath();
        ctx.fillStyle = 'blue';
        ctx.fillRect(x * 10, y, 60, canvas.height / 2);
        ctx.closePath();
    }
}


// function loop()
// update()
// draw()
// requestAnimationFrame

// function init()
// initiate game objects and set start positions
function init() {

}


// function update()
// calls game objects .update()

// function draw ()
// calls game objects .draw()

// main();
window.onload = newGame();