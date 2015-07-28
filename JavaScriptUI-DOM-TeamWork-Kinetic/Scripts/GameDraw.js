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

    function getPosition( objX, objY ) {
        var x,
            y,
            middleBoard = 0,
            outOfGamePosition_X = 0,
            outOfGamePosition_Y = 0;

        if ( objX === 0 || objX === 25 ) {
            outOfGamePosition = 50;
        }

        if ( objX < 7 || ( 12 < objX && 18 < objX ) ) {
            middleBoard = 39;
        }

        if ( objX === 25 ) {
            x = CONSTANTS.TOP_START_POS_X + ( ( objX - 13 ) * CONSTANTS.OBJ_SIZE_X )
                + middleBoard + outOfGamePosition;
            y = CONSTANTS.TOP_START_POS_Y + ( outOfGamePosition_Y * CONSTANTS.OBJ_SIZE_Y );
        } else if ( 13 <= objX && objX < 25 ) {
        }else if ( 13 <= objX && objX < 25 ) {
            x = CONSTANTS.TOP_START_POS_X + ( ( objX - 13 ) * CONSTANTS.OBJ_SIZE_X ) + middleBoard;
            y = CONSTANTS.TOP_START_POS_Y + ( objY * CONSTANTS.OBJ_SIZE_Y );
        } else if ( 1 <= objX && objX < 13 ) {
            x = CONSTANTS.BOTTOM_START_POS_X + ( ( 12 - objX ) * CONSTANTS.OBJ_SIZE_X ) + middleBoard;
            y = CONSTANTS.BOTTOM_START_POS_Y - ( objY * CONSTANTS.OBJ_SIZE_Y );
        } else if ( objX === 0 ) {
        } else if ( objX === 0) {
            x = CONSTANTS.BOTTOM_START_POS_X + ( ( 12 - objX ) * CONSTANTS.OBJ_SIZE_X )
                + middleBoard + outOfGamePosition;
            y = CONSTANTS.BOTTOM_START_POS_Y - ( outOfGamePosition_Y * CONSTANTS.OBJ_SIZE_Y );
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

    function createCircle( x, y, color ) {
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
        pos = getPosition( x, y );
        posX = Math.floor( pos.x + ( CONSTANTS.OBJ_SIZE_X / 2 ) );
        posY = Math.floor( pos.y + ( CONSTANTS.OBJ_SIZE_Y / 2 ) );
        posY = Math.floor( pos.y + ( CONSTANTS.OBJ_SIZE_Y / 2 ) );              

        if ( color === 'white' ) {
            strokeColor = 'black';
        } else if ( color === 'black' ) {
            strokeColor = 'white';
        } else {
            strokeColor = 'purple';
        }

        var circle = new Kinetic.Circle( {
            x: posX,
            y: posY,
            radius: radius,
            stroke: strokeColor,
            stroke: strokeColor,            
            fillRadialGradientStartRadius: 0,
            fillRadialGradientEndRadius: radius,
            fillRadialGradientColorStops: [0, 'gray', 1, color],
        } );

        var text = new Kinetic.Text({
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

        if ( nuberOfPieces > 5 || x === 0 || x === 25) {
            playGroundLayer.add( text );
        }
    };

    function createRectangleListener( x, y ) {

        var pos = getPosition( x, y );
        var posX = Math.floor( pos.x );
        var posY = Math.floor( pos.y );

        var rect = new Kinetic.Rect( {
            x: posX,
            y: posY,
            width: CONSTANTS.OBJ_SIZE_X,
            height: ( CONSTANTS.OBJ_SIZE_Y * 5 ),
        } );

        positionLayer.add( rect );

        rect.addEventListener( 'click', function () {
            playGroundLayer.destroyChildren();
            GameEngine.test( rect.getAbsolutePosition().x, rect.getAbsolutePosition().y );
        } );
    }; 

    function initGame( board ) {

        initBackground();

        updatePlayGround (board);
        // for (x = 0; x < lengthBoard; x += 1) {
        //     lengthField = board[x].pieces.length;

        //     for (y = 0; y < lengthField; y += 1) {
        //         color = board[x].pieces[y].color;

        //         GameDraw.createCircle(x, y, color);
        //     }

        //     // if (x < 13 ) {
        //     //     GameDraw.createRectangleListener( x, 4 );
        //     // } else {
        //     //     GameDraw.createRectangleListener( x, 0 );
        //     // }
        // }

        stage.add( positionLayer );
        stage.add( playGroundLayer );

        playGroundLayer.setZIndex( 10 );
        positionLayer.setZIndex( 10 );
    };


    function updatePlayGround( board ) {
        var x,
            y,
            lengthBoard = board.length,
            lengthField;

        
        for (x = 0; x < lengthBoard; x += 1) {
            lengthField = board[x].pieces.length;

            for (y = 0; y < lengthField; y += 1) {
                color = board[x].pieces[y].color;

                createCircle(x, y, color);
            }
        }
                
        playGroundLayer.draw();
    }

    // return {
    //     background: background,
    //     playGround: playGround,
    //     createCircle: createCircle,
    //     createRectangleListener: createRectangleListener,


    return {        
        initGame: initGame,        
        updatePlayGround: updatePlayGround,
        //renderBoard: renderBoard,
    }
}() );

/// <reference path="lib/kinetic.js" />
/// <reference path="lib/jquery-2.1.4.js" />
/// <reference path="GameEngine.js" />

// var GameDraw = ( function () {

//     var backgroundLayer,
//         playGroundLayer,
//         stage,
//         width,
//         height,
//         CONSTANTS = {
//             CIRCLE_RADIUS: 25,
//             OBJ_SIZE_X: 60,
//             OBJ_SIZE_Y: 52,
//             TOP_START_POS_X: 30,
//             TOP_START_POS_Y: 31,
//             BOTTOM_START_POS_X: 30,
//             BOTTOM_START_POS_Y: 537,
//         };

//     stage = new Kinetic.Stage( {
//         container: 'kinetic-container',
//         width: 1359,
//         height: 639
//     } );

//     backgroundLayer = new Kinetic.Layer();
//     playGroundLayer = new Kinetic.Layer();
//     positionLayer = new Kinetic.Layer();

//     width = stage.getWidth();
//     height = stage.getHeight();

//     function getPosition( objX, objY ) {
//         var x,
//             y,
//             middleBoard = 0,
//             outOfGamePosition_X = 0,
//             outOfGamePosition_Y = 0;

//         if ( objX === 0 || objX === 25 ) {
//             outOfGamePosition = 50;
//         }

//         if ( objX < 7 || ( 12 < objX && 18 < objX ) ) {
//             middleBoard = 39;
//         }

//         if ( objX === 25 ) {
//             x = CONSTANTS.TOP_START_POS_X + ( ( objX - 13 ) * CONSTANTS.OBJ_SIZE_X )
//                 + middleBoard + outOfGamePosition;
//             y = CONSTANTS.TOP_START_POS_Y + ( outOfGamePosition_Y * CONSTANTS.OBJ_SIZE_Y );
//         } else if ( 13 <= objX && objX < 25 ) {
//             x = CONSTANTS.TOP_START_POS_X + ( ( objX - 13 ) * CONSTANTS.OBJ_SIZE_X ) + middleBoard;
//             y = CONSTANTS.TOP_START_POS_Y + ( objY * CONSTANTS.OBJ_SIZE_Y );
//         } else if ( 1 <= objX && objX < 13 ) {
//             x = CONSTANTS.BOTTOM_START_POS_X + ( ( 12 - objX ) * CONSTANTS.OBJ_SIZE_X ) + middleBoard;
//             y = CONSTANTS.BOTTOM_START_POS_Y - ( objY * CONSTANTS.OBJ_SIZE_Y );
//         } else if ( objX === 0 ) {
//             x = CONSTANTS.BOTTOM_START_POS_X + ( ( 12 - objX ) * CONSTANTS.OBJ_SIZE_X )
//                 + middleBoard + outOfGamePosition;
//             y = CONSTANTS.BOTTOM_START_POS_Y - ( outOfGamePosition_Y * CONSTANTS.OBJ_SIZE_Y );
//         }

//         return {
//             x: x,
//             y: y,
//         }
//     };

//     function background() {
//         var imageObjBackground = new Image();
//         var imageObjBoard = new Image();        

//         imageObjBackground.onload = function () {
//             var imageBackground = new Kinetic.Image( {
//                 x: 0,
//                 y: 0,
//                 image: imageObjBackground,
//                 width: width,
//                 height: height
//             } );

//             backgroundLayer.add( imageBackground );
//             imageBackground.setZIndex( 0 );

//             stage.add( backgroundLayer );
//             backgroundLayer.setZIndex( 0 );
//         };

//         imageObjBoard.onload = function () {
//             var imageBoard = new Kinetic.Image( {
//                 x: 10,
//                 y: 10,
//                 image: imageObjBoard,
//                 width: 800,
//                 height: 600,
//                 shadowOffsetX: 20,
//                 shadowOffsetY: 20,
//                 shadowBlur: 30,
//             } );

//             backgroundLayer.add( imageBoard );

//             stage.add( backgroundLayer );
//             backgroundLayer.setZIndex( 0 );
//         };
            
        
//         imageObjBackground.src = 'Images/wood_background_BlackNWhite_1920x1080.jpg';
//         imageObjBoard.src = 'Images/Board800x600.png';
//     };

//     function createCircle( x, y, color ) {
//         var radius,
//             pos,
//             posX,
//             posY,
//             strokeColor,
//             nuberOfPieces = y + 1;

//         if ( y > 4 ) {
//             y = 0;
//         }

//         radius = CONSTANTS.CIRCLE_RADIUS;
//         pos = getPosition( x, y );
//         posX = Math.floor( pos.x + ( CONSTANTS.OBJ_SIZE_X / 2 ) );
//         posY = Math.floor( pos.y + ( CONSTANTS.OBJ_SIZE_Y / 2 ) );

//         if ( color === 'white' ) {
//             strokeColor = 'black';
//         } else if ( color === 'black' ) {
//             strokeColor = 'white';
//         } else {
//             strokeColor = 'purple';
//         }

//         var circle = new Kinetic.Circle( {
//             x: posX,
//             y: posY,
//             radius: radius,
//             stroke: strokeColor,
//             fillRadialGradientStartRadius: 0,
//             fillRadialGradientEndRadius: radius,
//             fillRadialGradientColorStops: [0, 'gray', 1, color],
//         } );

//         var text = new Kinetic.Text( {
//             x: pos.x,
//             y: posY - 9,
//             text: nuberOfPieces,
//             fontSize: 18,
//             fontFamily: 'Calibri',
//             width: CONSTANTS.OBJ_SIZE_X,
//             fill: strokeColor,
//             align: 'center'
//         } );

//         playGroundLayer.add( circle );

//         if ( nuberOfPieces > 5 || x === 0 || x === 25 ) {
//             playGroundLayer.add( text );
//         }
//     };

//     function createRectangleListener( x, y ) {
//         // we might just give to the boardFields X and Y and attach listener to every one of them
//         // those another 26 objects are just not needed
//         var pos = getPosition( x, y );
//         var posX = Math.floor( pos.x );
//         var posY = Math.floor( pos.y );

//         var rect = new Kinetic.Rect( {
//             x: posX,
//             y: posY,
//             width: CONSTANTS.OBJ_SIZE_X,
//             height: ( CONSTANTS.OBJ_SIZE_Y * 5 ),
//         } );

//         positionLayer.add( rect );

//         rect.addEventListener( 'click', function () {
//             playGroundLayer.destroyChildren();
//             GameEngine.test( rect.getAbsolutePosition().x, rect.getAbsolutePosition().y );
//         } );
//     };        

//     function playGround() {
//         stage.add( positionLayer );
//         stage.add( playGroundLayer );

//         playGroundLayer.setZIndex( 10 );
//         positionLayer.setZIndex( 10 );
//     };

//     function updatePlayGround() {
//         playGroundLayer.draw();
//     }

//     return {
//         background: background,
//         playGround: playGround,
//         createCircle: createCircle,
//         createRectangleListener: createRectangleListener,
//         updatePlayGround: updatePlayGround,
//     }
// }() );

