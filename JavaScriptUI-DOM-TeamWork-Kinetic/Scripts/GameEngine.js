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
        board = GameObjects.Board.init(players);
        
        var dices = [];
        dices.push(Object.create(GameObjects.Dice).init());
        dices.push(Object.create(GameObjects.Dice).init());

        GameDraw.initGame (board);
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
        function updatePlayGround() {        
        GameDraw.updatePlayGround();
    }

    function test(x, y) {
        //alert( x + ' ' + y );

        board.movePiece( 6, 7 );

        updatePlayGround();
    }
    /////////////

    return {
        start: start,
        update: update,
        test: test,
    };
}());

function setAvailabilityOfFields (board) {
    for (i = 1; i < board.length - 1; i += 1) {
        board[i].availableForBlack === true;
        board[i].availableForWhite === true;

        if (board[i].pieces.length > 1 && board[i].pieces[1].color === 'white') {
            board[i].availableForBlack = false;
        }
        if (board[i].pieces.length > 1 && board[i].pieces[1].color === 'black') {
            board[i].availableForWhite = false;
        }
        
        console.log(board[i])
    }
}
// All events will call GameEngine.Update() and GameDraw.Update().