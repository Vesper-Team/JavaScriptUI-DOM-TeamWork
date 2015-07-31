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

    stage = new Kinetic.Stage({
        container: 'kinetic-container',
        width: 1359,
        height: 639
    });

    backgroundLayer = new Kinetic.Layer();
    playGroundLayer = new Kinetic.Layer();
    positionLayer = new Kinetic.Layer();
    diceLayer = new Kinetic.Layer();
    playersNamesLayer = new Kinetic.Layer();

    width = stage.getWidth();
    height = stage.getHeight();

    function transformPositionFromBoardCanvasToBoardData(objX, objY) {
        var x,
            y;

        if (objY < 310) {
            if (objX < 810) {
                x = Math.round(objX / CONSTANTS.OBJ_SIZE_X) + 12;
            } else {
                x = 25;
            }
        } else {
            if (objX < 810) {
                x = 13 - Math.round(objX / CONSTANTS.OBJ_SIZE_X);
            } else {
                x = 0;
            }
        }

        return {
            x: x,
        }
    }

    function transformPositionFromBoardDataToBoardCanvas(objX, objY) {
        var x,
            y,
            middleBoard = 0;

        if (objX === 0 || objX === 25) {
            outOfGamePosition = 50;
        }

        if (objX < 7 || ( 12 < objX && 18 < objX )) {
            middleBoard = 39;
        }

        if (objX === 25) {
            x = CONSTANTS.TOP_START_POS_X + ( ( objX - 13 ) * CONSTANTS.OBJ_SIZE_X )
                + middleBoard + outOfGamePosition;
            y = CONSTANTS.TOP_START_POS_Y;
        } else if (13 <= objX && objX < 25) {
            x = CONSTANTS.TOP_START_POS_X + ( ( objX - 13 ) * CONSTANTS.OBJ_SIZE_X ) + middleBoard;
            y = CONSTANTS.TOP_START_POS_Y + ( objY * CONSTANTS.OBJ_SIZE_Y );
        } else if (1 <= objX && objX < 13) {
            x = CONSTANTS.BOTTOM_START_POS_X + ( ( 12 - objX ) * CONSTANTS.OBJ_SIZE_X ) + middleBoard;
            y = CONSTANTS.BOTTOM_START_POS_Y - ( objY * CONSTANTS.OBJ_SIZE_Y );
        } else if (objX === 0) {
            x = CONSTANTS.BOTTOM_START_POS_X + ( ( 12 - objX ) * CONSTANTS.OBJ_SIZE_X )
                + middleBoard + outOfGamePosition;
            y = CONSTANTS.BOTTOM_START_POS_Y;
        }

        return {
            x: x,
            y: y,
        }
    };

    function createPlayersNames(player) {
        var calculateX = function () {
            var startX = 1000,
                endX = 1200;
            len = player.name.length;
            return startX + (endX - startX) / 2 - len / 2 * 64;
        };
        var posX = calculateX(),
            posY,
            strokeColor;

        if (player.color === 'white') {
            posY = 100;
            strokeColor = 'black';
        } else {
            posY = 470;
            strokeColor = 'white';
        }

        var text = new Kinetic.Text({
            x: posX,
            y: posY,
            text: player.name,
            fontSize: 64,
            fontStyle: 'bold',
            fontFamily: 'fantasy',
            width: 400,
            fill: player.color,
            stroke: strokeColor,
            strokeWidth: 4,
            align: 'left',
            shadowOffsetX: 10,
            shadowOffsetY: 10,
        });

        playersNamesLayer.add(text);
    };

    function initBackground() {
        var imageObjBackground = new Image();
        var imageObjBoard = new Image();

        imageObjBackground.onload = function () {
            var imageBackground = new Kinetic.Image({
                x: 0,
                y: 0,
                image: imageObjBackground,
                width: width,
                height: height
            });

            backgroundLayer.add(imageBackground);
            imageBackground.setZIndex(0);

            stage.add(backgroundLayer);
            backgroundLayer.setZIndex(0);
        };

        imageObjBoard.onload = function () {
            var imageBoard = new Kinetic.Image({
                x: 10,
                y: 10,
                image: imageObjBoard,
                width: 800,
                height: 600,
                shadowOffsetX: 20,
                shadowOffsetY: 20,
                shadowBlur: 30,
            });

            backgroundLayer.add(imageBoard);

            stage.add(backgroundLayer);
            backgroundLayer.setZIndex(0);
        };


        imageObjBackground.src = 'Images/wood_background_BlackNWhite_1920x1080.jpg';
        imageObjBoard.src = 'Images/Board800x600.jpg';
    };

    function createCircle(x, y, color, isChosen) {
        var radius,
            pos,
            posX,
            posY,
            strokeColor,
            strokeWidth,
            numberOfPieces = y + 1,
            innerColor = 'gray';

        if (y > 4) {
            y = 0;
        }
        if (x === 0 || x === 25) {
            numberOfPieces = y + 5;
        }

        radius = CONSTANTS.CIRCLE_RADIUS;
        pos = transformPositionFromBoardDataToBoardCanvas(x, y);
        posX = Math.floor(pos.x + ( CONSTANTS.OBJ_SIZE_X / 2 ));
        posY = Math.floor(pos.y + ( CONSTANTS.OBJ_SIZE_Y / 2 ));

        if (isChosen) {
            strokeColor = 'limegreen';
            innerColor = 'limegreen';
            strokeWidth = 2;
        } else if (color === 'black') {
            strokeColor = 'white';
            strokeWidth = 2;
        } else if (color === 'white') {
            strokeColor = 'black';
            strokeWidth = 2;

        }

        var circle = new Kinetic.Circle({
            x: posX,
            y: posY,
            radius: radius,
            stroke: strokeColor,
            strokeWidth: strokeWidth,
            fillRadialGradientStartRadius: 0,
            fillRadialGradientEndRadius: radius,
            fillRadialGradientColorStops: [0, innerColor, 1, color],
        });

        var text = new Kinetic.Text({
            x: pos.x,
            y: posY - 9,
            text: numberOfPieces - 4,
            fontSize: 18,
            fontFamily: 'Calibri',
            width: CONSTANTS.OBJ_SIZE_X,
            fill: strokeColor,
            align: 'center'
        });

        playGroundLayer.add(circle);

        if (numberOfPieces > 5 || x === 0 || x === 25) {
            playGroundLayer.add(text);
        }
    };

    function createCirclePositionForOutGamePieces(x, y, color) {
        var radius,
            pos,
            posX,
            posY;

        radius = CONSTANTS.CIRCLE_RADIUS;
        pos = transformPositionFromBoardDataToBoardCanvas(x, y);
        posX = Math.floor(pos.x + ( CONSTANTS.OBJ_SIZE_X / 2 ));
        posY = Math.floor(pos.y + ( CONSTANTS.OBJ_SIZE_Y / 2 ));

        var circle = new Kinetic.Circle({
            x: posX,
            y: posY,
            radius: radius,
            stroke: color,
        });

        backgroundLayer.add(circle);
    };

    function createRectangleListener(x, y) {
        var pos,
            posX,
            posY,
            posYTop,
            posYBottom,
            height;

        pos = transformPositionFromBoardDataToBoardCanvas(x, y);
        posX = Math.floor(pos.x);
        posYTop = Math.floor(pos.y);
        posYBottom = Math.floor(pos.y + CONSTANTS.OBJ_SIZE_Y);

        if (x > 12) {
            posY = posYTop;
            height = x === 25 ? 1 : 5;
        } else {
            posY = posYBottom;
            height = x === 0 ? -1 : -5;
        }

        var rect = new Kinetic.Rect({
            x: posX,
            y: posY,
            width: CONSTANTS.OBJ_SIZE_X,
            height: ( CONSTANTS.OBJ_SIZE_Y * height ),
            //fill:'yellow',
        });

        positionLayer.add(rect);

        rect.addEventListener('click', function () {
            var pos = transformPositionFromBoardCanvasToBoardData(rect.getAbsolutePosition().x,
                rect.getAbsolutePosition().y);

            playGroundLayer.destroyChildren();

            GameEngine.update(pos.x);
        });
    };

    function createDicesButton(d1Number, d2Number) {
        var diceOne = new Image(),
            diceTwo = new Image();
        var dices = GameEngine.dices(),
            diceOneNumber = d1Number || 6,
            diceTwoNumber = d2Number || 6;

        diceOne.onload = function () {
            var diceImage = new Kinetic.Image({
                x: 960,
                y: 280,
                image: diceOne,
                width: 64,
                height: 64,
                shadowOffsetX: 10,
                shadowOffsetY: 10,
            });

            diceLayer.add(diceImage);
            stage.add(diceLayer);

            diceImage.addEventListener('click', function () {
                if (dices.numbers.length !== 0 && !dices.numbers['mustThrowAgain']) {
                    return;
                }
                if (dices.numbers['mustThrowAgain']) {
                    dices.clearNumbers();
                    dices.numbers['mustThrowAgain'] = false;
                }
                GameEngine.clickedToRollDices();
                displayRollingDices();
                if (diceLayer.children[0].attrs.x === 960) {
                    diceLayer.children[0].attrs.number = dices.numbers[0];
                    diceLayer.children[1].attrs.number = dices.numbers[1];
                } else {
                    diceLayer.children[1].attrs.number = dices.numbers[0];
                    diceLayer.children[0].attrs.number = dices.numbers[1];
                }
                diceOne.src = 'Images/dieWhite' + dices.numbers[0] + '.png';
                diceTwo.src = 'Images/dieWhite' + dices.numbers[1] + '.png';
                if (dices.numbers[0] === dices.numbers[1] && !dices.numbers['mustThrowAgain']) {
                    addAnotherPairOfDices();
                }
            });
        };

        diceTwo.onload = function () {
            var diceImage = new Kinetic.Image({
                x: 1030,
                y: 280,
                image: diceTwo,
                width: 64,
                height: 64,
                shadowOffsetX: 10,
                shadowOffsetY: 10,
            });

            diceLayer.add(diceImage);
            stage.add(diceLayer);

            diceImage.addEventListener('click', function () {
                if (dices.numbers.length !== 0 && !dices.numbers['mustThrowAgain']) { // dices.numbers[2] whether the player
                    // should trow his first dices
                    return;
                }
                if (dices.numbers['mustThrowAgain']) {
                    dices.clearNumbers();
                    dices.numbers['mustThrowAgain'] = false;
                }
                document.getElementById('dices').style.display = 'inline';
                GameEngine.clickedToRollDices();
                displayRollingDices();
                if (diceLayer.children[0].attrs.x === 960) {
                    diceLayer.children[0].attrs.number = dices.numbers[0];
                    diceLayer.children[1].attrs.number = dices.numbers[1];
                } else {
                    diceLayer.children[1].attrs.number = dices.numbers[0];
                    diceLayer.children[0].attrs.number = dices.numbers[1];
                }
                diceOne.src = 'Images/dieWhite' + dices.numbers[0] + '.png';
                diceTwo.src = 'Images/dieWhite' + dices.numbers[1] + '.png';
                if (dices.numbers[0] === dices.numbers[1] && !dices.numbers['mustThrowAgain']) {
                    addAnotherPairOfDices();
                }
            });
        };

        diceOne.src = 'Images/dieWhite' + diceOneNumber + '.png';
        diceTwo.src = 'Images/dieWhite' + diceTwoNumber + '.png';

        function addAnotherPairOfDices() {
            setTimeout(function () {
                $('#dice3').css('opacity', 0);
                $('#dice4').css('opacity', 0);
                document.getElementById('pair').style.display = 'inline';
                document.getElementById('dice3').style.display = 'inline';
                document.getElementById('dice4').style.display = 'inline';
                $('#dice3').attr('src', 'Images/dieWhite' + dices.numbers[0] + '.png');
                $('#dice4').attr('src', 'Images/dieWhite' + dices.numbers[0] + '.png');
                $('#dice3').animate({opacity: 1}, 100);
                $('#dice4').animate({opacity: 1}, 200);
            }, 710);
        }

        function displayRollingDices() {
            document.getElementById('dices').style.display = 'inline';

            setTimeout(function () {
                $('#dice1').attr('src', 'Images/dieWhite1.png');
            }, 50);
            setTimeout(function () {
                $('#dice1').attr('src', 'Images/dieWhite2.png');
            }, 150);
            setTimeout(function () {
                $('#dice1').attr('src', 'Images/dieWhite3.png');
            }, 250);
            setTimeout(function () {
                $('#dice1').attr('src', 'Images/dieWhite4.png');
            }, 350);
            setTimeout(function () {
                $('#dice1').attr('src', 'Images/dieWhite5.png');
            }, 450);
            setTimeout(function () {
                $('#dice1').attr('src', 'Images/dieWhite6.png');
            }, 550);

            setTimeout(function () {
                $('#dice2').attr('src', 'Images/dieWhite1.png');
            }, 100);
            setTimeout(function () {
                $('#dice2').attr('src', 'Images/dieWhite2.png');
            }, 220);
            setTimeout(function () {
                $('#dice2').attr('src', 'Images/dieWhite3.png');
            }, 340);
            setTimeout(function () {
                $('#dice2').attr('src', 'Images/dieWhite4.png');
            }, 460);
            setTimeout(function () {
                $('#dice2').attr('src', 'Images/dieWhite5.png');
            }, 580);
            setTimeout(function () {
                $('#dice2').attr('src', 'Images/dieWhite6.png');
            }, 700);

            setTimeout(function () {
                document.getElementById('dices').style.display = 'none';
            }, 710)
        }
    }

    function initGame(board, players) {
        var x,
            len;

        initBackground();

        len = board.length;
        for (x = 0; x < len; x += 1) {
            if (x < 13) {
                createRectangleListener(x, 0);
            } else {
                createRectangleListener(x, 0);
            }
        }

        createCirclePositionForOutGamePieces(25, 0, 'yellow');
        createCirclePositionForOutGamePieces(0, 0, 'yellow');

        createPlayersNames(players[0]);
        createPlayersNames(players[1]);

        updatePlayGround(board);
        createDicesButton();

        stage.add(playersNamesLayer);
        stage.add(positionLayer);
        stage.add(playGroundLayer);

        playGroundLayer.setZIndex(10);
        positionLayer.setZIndex(10);

        window.addEventListener("keyup", function (e) {
            if (e.keyCode == 27) {
                board.forEach(function (gameField) {
                    var currentGameField = gameField;
                    currentGameField.pieces.forEach(function (piece) {
                        piece.isChosen = false;
                    })
                });
                updatePlayGround(board);
            }
        });
    }

    function updatePlayGround(board) {
        var x,
            y,
            lengthBoard,
            lengthField,
            currentPiece;

        lengthBoard = board.length;

        for (x = 0; x < lengthBoard; x += 1) {
            lengthField = board[x].pieces.length;

            for (y = 0; y < lengthField; y += 1) {
                currentPiece = board[x].pieces[y];
                createCircle(x, y, currentPiece.color, currentPiece.isChosen);
            }
        }

        playGroundLayer.draw();
    }

    function updateDices() {
        var dices = GameEngine.dices(),
            firstDice,
            secondDice;
        if (diceLayer.children[0].attrs.x === 960) {
            firstDice = diceLayer.children[0];
            secondDice = diceLayer.children[1];
        } else {
            firstDice = diceLayer.children[1];
            secondDice = diceLayer.children[0];
        }
        if (dices.numbers[0] === dices.numbers[1] && dices.numbers.length > 0) {
            if (dices.numbers.length === 3) {
                $('#dice4').animate({opacity: 0}, 140);
                setTimeout(function () {
                    document.getElementById('dice4').style.display = 'none';
                }, 150);
            } else if (dices.numbers.length === 2) {
                $('#dice3').animate({opacity: 0}, 140);
                setTimeout(function () {
                    document.getElementById('dice3').style.display = 'none';
                }, 150);
            }
        } else if (dices.numbers.length === 1) {
            diceLayer.destroyChildren();
            if (dices.numbers[0] === firstDice.attrs.number) {
                secondDice.attrs.opacity = 0.5;
            } else {
                firstDice.attrs.opacity = 0.5;
            }
            diceLayer.add(firstDice);
            diceLayer.add(secondDice);
            diceLayer.draw();
        } else if (dices.numbers.length === 0) {
            diceLayer.destroyChildren();
            if (document.getElementById('dice4').style.display = 'inline') {
                $('#dice4').animate({opacity: 0}, 140);
                setTimeout(function () {
                    document.getElementById('dice4').style.display = 'none';
                }, 150);
                $('#dice3').animate({opacity: 0}, 140);
                setTimeout(function () {
                    document.getElementById('dice3').style.display = 'none';
                }, 150);
            }
            createDicesButton(firstDice.attrs.number, secondDice.attrs.number);
        }
    }

    function updatePlayerNames(currentPlayer) {
        if (currentPlayer.color === 'white') {
            playersNamesLayer.children[0].attrs.fill = 'blue';
            playersNamesLayer.children[1].attrs.fill = 'black';
        } else {
            playersNamesLayer.children[0].attrs.fill = 'white';
            playersNamesLayer.children[1].attrs.fill = 'blue';
        }
        setTimeout(function () {
            playersNamesLayer.draw();
        }, 720);
    }

    return {
        initGame: initGame,
        updatePlayGround: updatePlayGround,
        updateDices: updateDices,
        updatePlayerNames: updatePlayerNames,
    }
}() );