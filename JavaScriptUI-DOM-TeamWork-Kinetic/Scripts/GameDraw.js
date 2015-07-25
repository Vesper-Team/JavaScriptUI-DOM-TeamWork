/// <reference path="lib/kinetic-v4.4.3.js" />

var GameDraw = ( function () {

    var backgroundLayer,
        playGroundLayer,
        stage,
        width,
        height,
        CONSTANTS = {
            OBJ_SIZE_X: 60,
            OBJ_SIZE_Y: 52,
            TOP_START_POS_X: 21,
            TOP_START_POS_Y: 22,
            BOTTOM_START_POS_X: 21,
            BOTTOM_START_POS_Y: ( 600 - 73 ),
        };

    stage = new Kinetic.Stage( {
        container: 'kinetic-container',
        width: 800,
        height: 600,
    } );

    backgroundLayer = new Kinetic.Layer();
    playGroundLayer = new Kinetic.Layer();

    width = stage.getWidth();
    height = stage.getHeight();

    function getPosition( objX, objY ) {
        var x,
            y,
            middleBoard = 0;

        if ( 6 > objX || ( 11 < objX && objX < 17 ) ) {
            middleBoard = 39;
        }

        if ( 12 <= objX && objX < 24 ) {
            x = CONSTANTS.TOP_START_POS_X + ( ( 23 - objX ) * CONSTANTS.OBJ_SIZE_X ) + middleBoard;
            y = CONSTANTS.TOP_START_POS_Y + ( objY * CONSTANTS.OBJ_SIZE_Y );
        } else if ( 0 <= objX && objX < 12 ) {
            x = CONSTANTS.BOTTOM_START_POS_X + ( ( 11 - objX ) * CONSTANTS.OBJ_SIZE_X ) + middleBoard;
            y = CONSTANTS.BOTTOM_START_POS_Y - ( objY * CONSTANTS.OBJ_SIZE_Y );
        }

        return {
            x: x,
            y: y,
        }
    };

    function createCircle( x, y, color ) {
        var radius = 25;
        var pos = getPosition( x, y );
        var posX = Math.floor( pos.x + ( CONSTANTS.OBJ_SIZE_X / 2 ) );
        var posY = Math.floor( pos.y + ( CONSTANTS.OBJ_SIZE_Y / 2 ) );
        var strokeColor;

        if ( color === 'white' ) {
            strokeColor = 'black';
        } else {
            strokeColor = 'white';
        }

        var circle = new Kinetic.Circle( {
            x: posX,
            y: posY,
            radius: radius,
            //fill: color,
            stroke: strokeColor,
            draggable: true,
            fillRadialGradientStartRadius: 0,
            fillRadialGradientEndRadius: radius,
            fillRadialGradientColorStops: [0, 'gray', 1, color],
            
            /*inner: new Kinetic.Circle( {
            	x: posX,
            	y: posY,
            	radius: 10,
            	fill: color,
            	stroke: 'gray',
            	strokeWidth: 2,
            }),*/
          
        } );        

        playGroundLayer.add( circle);

    };

    function createRectangle( x, y, color ) {

        var pos = getPosition( x, y );
        var posX = Math.floor( pos.x );
        var posY = Math.floor( pos.y );

        var rect = new Kinetic.Rect( {
            x: posX,
            y: posY,
            width: CONSTANTS.OBJ_SIZE_X,
            height: CONSTANTS.OBJ_SIZE_Y,
            fill: color,
            draggable: true,
        } );

        playGroundLayer.add( rect );
    };

    function background() {
        var imageObj = new Image();
        imageObj.onload = function () {
            var image = new Kinetic.Image( {
                x: 0,
                y: 0,
                image: imageObj,
                width: 800,
                height: 600
            } );

            backgroundLayer.add( image );

            stage.add( backgroundLayer );
            backgroundLayer.setZIndex( 0 );
        };

        imageObj.src = 'Images/niceTry_Board.jpg';
    };

    function playGround() {
        stage.add( playGroundLayer );
        playGroundLayer.setZIndex( 10 );
    };

    return {
        background: background,
        playGround: playGround,
        createCircle: createCircle,
        createRectangle: createRectangle,
    }
}() );

