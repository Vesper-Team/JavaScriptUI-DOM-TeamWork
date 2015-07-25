/// <reference path="GameObjects.js" />
/// <reference path="GameDraw.js" />

( function () {
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

    var board = GameObjects.Board.init( players );

    GameDraw.background();

    lengthBoard = board.length;

    for ( i = 0; i < lengthBoard; i += 1 ) {
        lengthField = board[i].length;

        for ( j = 0; j < lengthField; j += 1 ) {
            x = i;
            y = j;
            color = board[i][j].color;

            GameDraw.createCircle( x, y, color );
        }
    }

    GameDraw.playGround();

    console.log( 'test' );
}() )