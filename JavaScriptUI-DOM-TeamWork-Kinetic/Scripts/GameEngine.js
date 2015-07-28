var GameEngine = ( function () {
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

        var board = GameObjects.Board.init(players);
        //console.log(board);

        GameDraw.background();

        lengthBoard = board.length;
        //console.log(lengthBoard)


        for (i = 1; i < lengthBoard - 1; i += 1) {
            lengthField = board[i].pieces.length;
        console.log(board[i])


            for (j = 0; j < lengthField; j += 1) {
                x = i;
                y = j;
                color = board[i].pieces[j].color;

                GameDraw.createCircle(x, y, color);
            }
        }

        GameDraw.playGround();
    }

    function update(){
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
    }

    return {
        start: start,
        update: update
    };
}());

function setAvailabilityOfFields () {
    for (i = 1; i < GameObjects.boardLength - 1; i += 1) {
        GameObjects.Board[i].availableForBlack === true;
        GameObjects.Board[i].availableForWhite === true;

        if (GameObjects.Board[i].pieces.length > 1 && GameObjects.Board[i].pieces[1].color === 'white') {
            GameObjects.Board[i].availableForBlack = false;
        }
        if (GameObjects.Board[i].pieces.length > 1 && GameObjects.Board[i].pieces[1].color === 'black') {
            GameObjects.Board[i].availableForWhite = false;
        }
    }
}
// All events will call GameEngine.Update() and GameDraw.Update().