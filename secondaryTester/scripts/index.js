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
        var selectedArrayPosition = 0;
        if (y > 19 && y < 515 && ((x > 19 && x < 345) || (x > 375 && x < 700))) {

            if (y < canvas.height / 2) {
                y = 19;
                selectedArrayPosition = 12;
            } else {
                y = canvas.height / 2;
                selectedArrayPosition = 11;
            }
            if (x > 19 && x < 345) {
                x = Math.floor((x - 19) / 54);
                if (selectedArrayPosition == 12) {
                    selectedArrayPosition += x;
                }
                else {
                    selectedArrayPosition -= x;
                }
                x = (x * 54) + 19;

            }
            if (x > 375 && x < 700) {
                x = Math.floor((x - 375) / 54);
                if (selectedArrayPosition == 12) {
                    selectedArrayPosition += (6 + x);
                }
                else {
                    selectedArrayPosition -= (6 + x);
                }
                x = (x * 54) + 375;

            }
            ctx.beginPath();
            ctx.strokeStyle = 'red';
            ctx.strokeRect(x, y, 54, (canvas.height / 2) - 19);
            ctx.closePath();
            ctx.stroke();

            alert("Selected element of the array : " + selectedArrayPosition);
        }
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