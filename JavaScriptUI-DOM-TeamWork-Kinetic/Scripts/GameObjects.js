
var GameObjects = ( function () {
    var Board,
        Piece,
        Player,
        BoardField,
        CONSTANTS = {

        };

    // pole ot igralnoto pole
    BoardField = ( function () {
        var boardField = Object.create( [] );

        Object.defineProperty( boardField, 'init', {
            value: function () {

                return this;
            }
        } );

        Object.defineProperty( boardField, 'add', {
            value: function ( piece ) {
                this.push( piece );

                return this;
            }
        } );

        return boardField;
    }() );

    // igralno pole
    Board = ( function () {
        var board = Object.create( [] );
        var bagOfpieces = [];
        var boardLength = 24;

        Object.defineProperty( board, 'init', {
            value: function ( players ) {
                var i;

                this._players = players;

                for ( i = 0; i < boardLength; i += 1 ) {
                    this.push( Object.create( BoardField ).init() );
                }

                // TODO: refactor
                // TODO: refactor  _pieces
                for ( var piecenumber = 0; piecenumber < 2; piecenumber += 1 ) {
                    var currentPiece = this._players[0]._pieces.pop();

                    this[0].push( currentPiece );
                }

                for ( var piecenumber = 0; piecenumber < 5; piecenumber += 1 ) {
                    var currentPiece = this._players[1]._pieces.pop();

                    this[5].push( currentPiece );
                }

                for ( var piecenumber = 0; piecenumber < 3; piecenumber += 1 ) {
                    var currentPiece = this._players[1]._pieces.pop();

                    this[7].push( currentPiece );
                }

                for ( var piecenumber = 0; piecenumber < 5; piecenumber += 1 ) {
                    var currentPiece = this._players[0]._pieces.pop();

                    this[11].push( currentPiece );
                }

                for ( var piecenumber = 0; piecenumber < 5; piecenumber += 1 ) {
                    var currentPiece = this._players[1]._pieces.pop();

                    this[12].push( currentPiece );
                }

                for ( var piecenumber = 0; piecenumber < 3; piecenumber += 1 ) {
                    var currentPiece = this._players[0]._pieces.pop();

                    this[16].push( currentPiece );
                }

                for ( var piecenumber = 0; piecenumber < 5; piecenumber += 1 ) {
                    var currentPiece = this._players[0]._pieces.pop();

                    this[18].push( currentPiece );
                }

                for ( var piecenumber = 0; piecenumber < 2; piecenumber += 1 ) {
                    var currentPiece = this._players[1]._pieces.pop();

                    this[23].push( currentPiece );
                }

                return this;
            }
        } );

        Object.defineProperty( board, 'addPiece', {
            value: function ( piece, nuberOfBoardfield ) {

                this[nuberOfBoardfield].push( piece );

                return this;
            }
        } );

        Object.defineProperty( board, 'removePiece', {
            value: function ( piece, nuberOfBoardfield ) {

                this[nuberOfBoardfield].pop();

                return this;
            }
        } );


        return board;
    }() );

    // igrach
    Player = ( function () {
        var player = Object.create( {} );
        var CONSTANTS_PLAYER = {
            TOTAL_NUMBER_OF_PIECES: 15,
            INIT_X: 0,
            INIT_Y: 0,
        }

        Object.defineProperty( player, 'init', {
            value: function ( name, color ) {
                this.name = name;
                this.color = color;
                this.isPlayerTurn = false;
                this._pieces = [];

                for ( i = 0; i < CONSTANTS_PLAYER.TOTAL_NUMBER_OF_PIECES; i += 1 ) {
                    this._pieces.push( Object.create( Piece ).init( color ) );
                }

                return this;
            }
        } );

        Object.defineProperty( player, 'addPiece', {
            value: function ( piece ) {
                this._pieces.push( piece );

                return this;
            }
        } );

        Object.defineProperty( player, 'removePiece', {
            value: function ( piece ) {
                this._pieces.pop();

                return this;
            }
        } );

        Object.defineProperty( player, 'name', {
            get: function () {
                return this._name;
            },
            set: function ( value ) {
                this._name = value;
            }
        } );

        Object.defineProperty( player, 'color', {
            get: function () {
                return this._color;
            },
            set: function ( value ) {
                this._color = value;
            }
        } );

        Object.defineProperty( player, 'isPlayerTurn', {
            get: function () {
                return this._isPlayerTurn;
            },
            set: function ( value ) {
                this._isPlayerTurn = value;
            }
        } );

        return player;
    }() );

    // pulowe
    Piece = ( function () {
        var piece = Object.create( {} );

        Object.defineProperty( piece, 'init', {
            value: function ( color ) {
                this.color = color;
                this.isChosen = false;

                return this;
            }
        } );

        Object.defineProperty( piece, 'color', {
            get: function () {
                return this._color;
            },
            set: function ( value ) {
                this._color = value;
            }
        } );

        Object.defineProperty( piece, 'isChosen', {
            get: function () {
                return this._isChosen;
            },
            set: function ( value ) {
                this._isChosen = value;
            }
        } );

        return piece;
    }() );


    return {
        Board: Board,
        Player: Player,
        Piece: Piece,
    }

}() )

