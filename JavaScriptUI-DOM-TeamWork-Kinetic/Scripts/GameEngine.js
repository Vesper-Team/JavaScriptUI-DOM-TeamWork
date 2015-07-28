/// <reference path="GameDraw.js" />
/// <reference path="GameObjects.js" />

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
        players.push( Object.create( GameObjects.Player ).init( 'First', 'white' ) );
        players.push( Object.create( GameObjects.Player ).init( 'Second', 'black' ) );

        //TODO check 
        board = GameObjects.Board.init( players );

        // dices.rollDices() ; dices.usedNumber(number) ; dices.clearNumbers()
        dices = GameObjects.Dices.init();

        // TESTING Dices:
        //dices.rollDices();
        //console.log('dices.rollDices() - [' + dices.numbers + ']');
        //console.log('dices.removeNumber(' + dices.numbers[0] + ') - ');
        //dices.usedNumber(dices.numbers[0]);
        //console.log(dices.numbers);
        //console.log('dices.clearNumbers() - ');
        //dices.clearNumbers();
        //console.log(dices.numbers);
        // END OF TEST;

        GameDraw.initGame( board );
    }
    
    function updatePlayGround() {
        GameDraw.updatePlayGround();
    }


    function update() {

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


    /////////////
    function test( x, y ) {
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
}() );


// // All events will call GameEngine.Update() and GameDraw.Update().