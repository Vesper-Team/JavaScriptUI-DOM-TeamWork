// CONSTANTS

// GAME ELEMENTS - canvas, ctx, keystate
var canvas,
    ctx,
    keystate;

// DEFINING GAME OBJECTS - player, checker(backgammon ???), dice, board(not if it is just a background) ...

// function newGame() or main()
// create initiate and append game canvas
// keep track of keyboard presses
// init() - INITIATE GAME OBJECTS;
// loop() - GAME LOOP FUNCTION, STARTS THE ANIMATION;
function newGame() {
    canvas = document.getElementById('board-canvas');
    ctx = canvas.getContext('2d');
    canvas.addEventListener('click', showXY);

    function showXY(event) {
        var x = event.offsetX;
        var y = event.offsetY;
        if (y < canvas.height / 2) {
            y = 0;
        } else {
            y = canvas.height / 2;
        }

        x = Math.floor(x / 10);
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

// function update()
// calls game objects .update()

// function draw ()
// calls game objects .draw()

// main();
window.onload = newGame();