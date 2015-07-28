/// <reference path="lib/kinetic.js" />
/// <reference path="lib/jquery-2.1.4.js" />
/// <reference path="GameEngine.js" />

var GameDraw = ( function () {

    var backgroundLayer,
        playGroundLayer,
        stage,
        width,
        height,
        CONSTANTS = {
            CIRCLE_RADIUS: 25,
            OBJ_SIZE_X: 60,
            OBJ_SIZE_Y: 52,
            TOP_START_POS_X: 30,
            TOP_START_POS_Y: 31,
            BOTTOM_START_POS_X: 30,
            BOTTOM_START_POS_Y: 537,
        };

    stage = new Kinetic.Stage( {
        container: 'kinetic-container',
        width: 1359,
        height: 639
    } );

    backgroundLayer = new Kinetic.Layer();
    playGroundLayer = new Kinetic.Layer();
    positionLayer = new Kinetic.Layer();

    width = stage.getWidth();
    height = stage.getHeight();
    
     function transformPositionFromBoardCanvasToBoardData( objX, objY ) {
        var x,
            y;            

        if ( objY < 310 ) {
            x = Math.round( objX / CONSTANTS.OBJ_SIZE_X ) + 12;
        } else {
            x = 13 - Math.round( objX / CONSTANTS.OBJ_SIZE_X );
        }

        return {
            x: x,
        }
    }

    function transformPositionFromBoardDataToBoardCanvas( objX, objY ) {
        var x,
            y,
            middleBoard = 0;

        if ( objX === 0 || objX === 25 ) {
            outOfGamePosition = 50;
        }

        if ( objX < 7 || ( 12 < objX && 18 < objX ) ) {
            middleBoard = 39;
        }

        if ( objX === 25 ) {
            x = CONSTANTS.TOP_START_POS_X + ( ( objX - 13 ) * CONSTANTS.OBJ_SIZE_X )
                + middleBoard + outOfGamePosition;
            y = CONSTANTS.TOP_START_POS_Y + ( objY * CONSTANTS.OBJ_SIZE_Y );
        } else if ( 13 <= objX && objX < 25 ) {
            x = CONSTANTS.TOP_START_POS_X + ( ( objX - 13 ) * CONSTANTS.OBJ_SIZE_X ) + middleBoard;
            y = CONSTANTS.TOP_START_POS_Y + ( objY * CONSTANTS.OBJ_SIZE_Y );
        } else if ( 1 <= objX && objX < 13 ) {
            x = CONSTANTS.BOTTOM_START_POS_X + ( ( 12 - objX ) * CONSTANTS.OBJ_SIZE_X ) + middleBoard;
            y = CONSTANTS.BOTTOM_START_POS_Y - ( objY * CONSTANTS.OBJ_SIZE_Y );
        } else if ( objX === 0 ) {
            x = CONSTANTS.BOTTOM_START_POS_X + ( ( 12 - objX ) * CONSTANTS.OBJ_SIZE_X )
                + middleBoard + outOfGamePosition;
            y = CONSTANTS.BOTTOM_START_POS_Y - ( objY * CONSTANTS.OBJ_SIZE_Y );
        }

        return {
            x: x,
            y: y,
        }
    };

    function initBackground() {
        var imageObjBackground = new Image();
        var imageObjBoard = new Image();

        imageObjBackground.onload = function () {
            var imageBackground = new Kinetic.Image( {
                x: 0,
                y: 0,
                image: imageObjBackground,
                width: width,
                height: height
            } );

            backgroundLayer.add( imageBackground );
            imageBackground.setZIndex( 0 );

            stage.add( backgroundLayer );
            backgroundLayer.setZIndex( 0 );
        };

        imageObjBoard.onload = function () {
            var imageBoard = new Kinetic.Image( {
                x: 10,
                y: 10,
                image: imageObjBoard,
                width: 800,
                height: 600,
                shadowOffsetX: 20,
                shadowOffsetY: 20,
                shadowBlur: 30,
            } );

            backgroundLayer.add( imageBoard );

            stage.add( backgroundLayer );
            backgroundLayer.setZIndex( 0 );
        };


        imageObjBackground.src = 'Images/wood_background_BlackNWhite_1920x1080.jpg';
        imageObjBoard.src = 'Images/Board800x600.png';
    };

    function createCircle( x, y, color, isChosen) {
        var radius,
            pos,
            posX,
            posY,
            strokeColor,
            nuberOfPieces = y + 1;

        if ( y > 4 ) {
            y = 0;
        }

        radius = CONSTANTS.CIRCLE_RADIUS;
        pos = transformPositionFromBoardDataToBoardCanvas( x, y );
        posX = Math.floor( pos.x + ( CONSTANTS.OBJ_SIZE_X / 2 ) );
        posY = Math.floor( pos.y + ( CONSTANTS.OBJ_SIZE_Y / 2 ) );

        if ( color === 'white' ) {
            strokeColor = 'black';
        } else if ( color === 'black' ) {
            strokeColor = 'white';
        } else if ( isChosen ) {
            strokeColor = 'yellowgreen';
        }

        var circle = new Kinetic.Circle( {
            x: posX,
            y: posY,
            radius: radius,
            stroke: strokeColor,
            fillRadialGradientStartRadius: 0,
            fillRadialGradientEndRadius: radius,
            fillRadialGradientColorStops: [0, 'gray', 1, color],
        } );

        var text = new Kinetic.Text( {
            x: pos.x,
            y: posY - 9,
            text: nuberOfPieces,
            fontSize: 18,
            fontFamily: 'Calibri',
            width: CONSTANTS.OBJ_SIZE_X,
            fill: strokeColor,
            align: 'center'
        } );

        playGroundLayer.add( circle );

        if ( nuberOfPieces > 5 || x === 0 || x === 25 ) {
            playGroundLayer.add( text );
        }
    };

    function createRectangleListener( x, y ) {

        var pos = transformPositionFromBoardDataToBoardCanvas( x, y );
        var posX = Math.floor( pos.x );
        var posY = Math.floor( pos.y );
        var height = x < 13 ? ( -CONSTANTS.OBJ_SIZE_Y ) : CONSTANTS.OBJ_SIZE_Y;

        var rect = new Kinetic.Rect( {
            x: posX,
            y: posY,
            width: CONSTANTS.OBJ_SIZE_X,
            height: ( height * 5 ),
           // fill:'yellow',
        } );

        positionLayer.add( rect );

        rect.addEventListener( 'click', function () {
            var x,
                y,
                pos;

            pos = transformPositionFromBoardCanvasToBoardData( rect.getAbsolutePosition().x,
                rect.getAbsolutePosition().y );

            playGroundLayer.destroyChildren();

            GameEngine.update( pos.x );
        } );
    };

    function initGame( board ) {

        initBackground();

        //for ( var x = 0, len = board.length; x < len; x += 1 ) {
        //    if ( x < 13 ) {
        //        createRectangleListener( x, -1 );
        //    } else {
        //        createRectangleListener( x, 0 );
        //    }
        //}

        updatePlayGround( board );

        stage.add( positionLayer );
        stage.add( playGroundLayer );

        playGroundLayer.setZIndex( 10 );
        positionLayer.setZIndex( 10 );
    };


    function updatePlayGround( board ) {
        var x,
            y,
            lengthBoard,
            lengthField,
            currentPiece;

        lengthBoard = board.length;

        for ( x = 0; x < lengthBoard; x += 1 ) {
            lengthField = board[x].pieces.length;

            for ( y = 0; y < lengthField; y += 1 ) {
                currentPiece = board[x].pieces[y];
                createCircle( x, y, currentPiece.color, currentPiece.isChosen);
            }
        }

        playGroundLayer.draw();
    }

    return {
        initGame: initGame,
        updatePlayGround: updatePlayGround,
        //renderBoard: renderBoard,
    }
}() );
