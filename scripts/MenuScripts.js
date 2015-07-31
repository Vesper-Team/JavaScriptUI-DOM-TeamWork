var mustSlowCircles = false,
    gameExited = false,
    playButton = false,
    goingRight = false,
    menusAreOut = false,
    mustRemoveMenus = false,
    namesAreSet = false,
    playerOneNameScreenOver = false,
    playerOneName,
    playerTwoName;

window.onload = toLoad();

function toLoad() {
    var svg = document.getElementById('theSvg'),
        svgNms = 'http://www.w3.org/2000/svg',
        outside1 = createChecker(generateRandomNegativeNumber(), 20, 25, 'black', 6),
        outside2 = createChecker(generateRandomNegativeNumber(), 80, 25, 'white', 4),
        outside3 = createChecker(generateRandomNegativeNumber(), 140, 25, 'black', 8),
        outside4 = createChecker(generateRandomNegativeNumber(), 200, 25, 'white', 6),
        outside5 = createChecker(generateRandomNegativeNumber(), 272, 25, 'black', 5),
        outside6 = createChecker(generateRandomNegativeNumber(), 334, 25, 'white', 9),
        outside7 = createChecker(generateRandomNegativeNumber(), 396, 25, 'black', 6),
        outside8 = createChecker(generateRandomNegativeNumber(), 460, 25, 'white', 3),
        outside9 = createChecker(generateRandomNegativeNumber(), 520, 25, 'black', 8),
        outside10 = createChecker(generateRandomNegativeNumber(), 600, 25, 'white', 7);

    function loopRollingCircles() {
        if (mustSlowCircles) {
            outside1.speed -= 1;
            outside2.speed -= 1;
            outside3.speed -= 1;
            outside4.speed -= 1;
            outside5.speed -= 1;
            outside6.speed -= 1;
            outside7.speed -= 1;
            outside8.speed -= 1;
            outside9.speed -= 1;
            outside10.speed -= 1;
        }
        if (playButton) {
            if (areSpeedsZero()) {
                goingRight = true;
            }
            if (goingRight) { // going fast right
                outside1.speed += 1;
                outside2.speed += 1;
                outside3.speed += 1;
                outside4.speed += 1;
                outside5.speed += 1;
                outside6.speed += 1;
                outside7.speed += 1;
                outside8.speed += 1;
                outside9.speed += 1;
                outside10.speed += 1;
            } else { // slow them down
                outside1.speed -= 1;
                outside2.speed -= 1;
                outside3.speed -= 1;
                outside4.speed -= 1;
                outside5.speed -= 1;
                outside6.speed -= 1;
                outside7.speed -= 1;
                outside8.speed -= 1;
                outside9.speed -= 1;
                outside10.speed -= 1;
            }
            // after menus fade
            if (allCirclesAreOut()) {
                if (mustRemoveMenus) {
                    $('.button').animate({opacity: "0"}, 1000);
                    setTimeout(function () {
                        document.getElementById("textPlay").style.display = "none";
                        document.getElementById("textHelp").style.display = "none";
                        document.getElementById("textExit").style.display = "none";
                    }, 1100);
                    setTimeout(firstNameAnimation, 1200);
                    return;
                }
            }
        }

        outside1 = updateChecker(outside1);

        outside2 = updateChecker(outside2);

        outside3 = updateChecker(outside3);

        outside4 = updateChecker(outside4);

        outside5 = updateChecker(outside5);

        outside6 = updateChecker(outside6);

        outside7 = updateChecker(outside7);

        outside8 = updateChecker(outside8);

        outside9 = updateChecker(outside9);

        outside10 = updateChecker(outside10);

        if (areSpeedsZero() && !goingRight && !playButton) { // speedOfCircle9 is the greatest speed - 9 so we stop the animation
            gameExited = true;
            return;
        }
        mustSlowCircles = false;
        requestAnimationFrame(loopRollingCircles);
    }

    loopRollingCircles();

    function allCirclesAreOut() {
        return +outside1.getAttribute('cx') > +svg.getAttribute('width') + 25 &&
            +outside2.getAttribute('cx') > +svg.getAttribute('width') + 25 &&
            +outside3.getAttribute('cx') > +svg.getAttribute('width') + 25 &&
            +outside4.getAttribute('cx') > +svg.getAttribute('width') + 25 &&
            +outside5.getAttribute('cx') > +svg.getAttribute('width') + 25 &&
            +outside6.getAttribute('cx') > +svg.getAttribute('width') + 25 &&
            +outside7.getAttribute('cx') > +svg.getAttribute('width') + 25 &&
            +outside8.getAttribute('cx') > +svg.getAttribute('width') + 25 &&
            +outside9.getAttribute('cx') > +svg.getAttribute('width') + 25 &&
            +outside10.getAttribute('cx') > +svg.getAttribute('width') + 25;
    }

    function boardScreen() {
        document.getElementById('secondPlayerText').style.display = 'none';
        document.getElementById('secondPlayer-name').style.display = 'none';
        document.getElementById('proceedButton').style.display = 'none';

        // arranging the board
        $('#boardImage').css('opacity', 0);
        document.getElementById("boardImage").style.visibility = "visible";
        $('#boardImage').animate({opacity: "1"}, 5000);
        setTimeout(setupCheckersOnBoard, 3200);
    }

    function firstNameAnimation() {
        $('#proceedButton').css('opacity', 0);
        $('#firstPlayerText').css('opacity', 0);
        $('#firstPlayer-name').css('opacity', 0);

        document.getElementById('firstPlayer-name').style.display = 'inline';
        document.getElementById('firstPlayerText').style.display = 'inline';
        document.getElementById('proceedButton').style.display = 'inline';
        $('input[type=text]').animate({opacity: 1}, 200);
        $('#firstPlayerText').animate({opacity: "1"}, 200);
        $('#proceedButton').animate({opacity: "1"}, 200);
        document.getElementById('proceedButton').addEventListener('mouseover', function () {
            this.style.opacity = 0.5;
        });
        document.getElementById('proceedButton').addEventListener('mouseout', function () {
            this.style.opacity = 1;
        });
        waitForName();
    }

    function secondNameAnimation() {
        document.getElementById('firstPlayer-name').style.display = 'none';
        document.getElementById('firstPlayerText').style.display = 'none';

        $('#secondPlayerText').css('opacity', 0);
        document.getElementById('secondPlayerText').style.display = 'inline';
        document.getElementById('secondPlayer-name').style.display = 'inline';

        $('#secondPlayerText').animate({opacity: "1"}, 200);
        $('#proceedButton').animate({opacity: "1"}, 200);
        $('input[type=text]').animate({opacity: 1}, 200);
        document.getElementById('proceedButton').addEventListener('mouseover', function () {
            this.style.opacity = 0.5;
        });
        document.getElementById('proceedButton').addEventListener('mouseout', function () {
            this.style.opacity = 1;
        });
        waitForName()
    }

    function waitForName() {
        if (playerOneName && !playerOneNameScreenOver) {
            $('#firstPlayerText').animate({opacity: "0"}, 200);
            $('input[type=text]').animate({opacity: 0}, 200);
            $('#proceedButton').animate({opacity: "0"}, 200);
            //document.getElementById('firstPlayer-name').style.display = 'none';
            playerOneNameScreenOver = true;
            setTimeout(secondNameAnimation, 250);
            return;
        } else if (playerTwoName) {
            $('#secondPlayerText').animate({opacity: "0"}, 200);
            $('#proceedButton').animate({opacity: "0"}, 200);
            $('input[type=text]').animate({opacity: 0}, 200);
            setTimeout(boardScreen, 210);
            GameEngine.start(playerOneName, playerTwoName);
            return;
        }
        requestAnimationFrame(waitForName);
    }

    function areSpeedsZero() {
        return outside1.speed <= 0 &&
            outside2.speed <= 0 &&
            outside3.speed <= 0 &&
            outside4.speed <= 0 &&
            outside5.speed <= 0 &&
            outside6.speed <= 0 &&
            outside7.speed <= 0 &&
            outside8.speed <= 0 &&
            outside9.speed <= 0 &&
            outside10.speed <= 0;
    }

    function updateChecker(checker) {
        var checker = checker;
        var cx = +checker.getAttribute('cx');

        if (cx > +svg.getAttribute('width') - 25) {
            checker.firstAppearance = false;
        }
        if (cx > (+svg.getAttribute('width') - 25) || cx < 20 && !checker.firstAppearance && !goingRight) {
            checker.goingRight *= -1;
        }
        if (goingRight) {
            checker.goingRight = 1;
        }
        if (checker.speed > 0) {
            checker.setAttribute('cx', cx + checker.goingRight * checker.speed);
        }
        return checker;
    }

    function createChecker(cx, cy, r, fill, speed) {
        var outsideCircle = document.createElementNS(svgNms, 'circle');
        var args = Array.prototype.slice.call(arguments);
        outsideCircle.setAttribute('cx', cx);
        outsideCircle.setAttribute('cy', cy);
        outsideCircle.setAttribute('r', r);
        outsideCircle.setAttribute('stroke-width', 2);
        if (fill === 'black') {
            outsideCircle.setAttribute('stroke', 'white');
            outsideCircle.setAttribute('fill', 'url(#blackCircleGradient)');
        } else {
            outsideCircle.setAttribute('stroke', 'black');
            outsideCircle.setAttribute('fill', 'url(#whiteCircleGradient)');
        }
        if (args.length === 5) {
            outsideCircle.goingRight = 1;
            outsideCircle.firstAppearance = true;
            outsideCircle.speed = speed;
        } else {
            outsideCircle.col = args[4];
            outsideCircle.row = args[5];
            outsideCircle.arrived = false;
            outsideCircle.startedRolling = false;
        }
        svg.appendChild(outsideCircle);
        return outsideCircle;
    }

    function generateRandomNegativeNumber() {
        var number = -Math.floor(Math.random() * 1000);
        while (number > -150) {
            number = -Math.floor(Math.random() * 1000);
        }
        return number;
    }

    function setupCheckersOnBoard() {
        //black player checkers
        var black1 = createChecker((+svg.getAttribute('width')) + 26, 265, 25, 'black', 61, 265),
            black2 = createChecker((+svg.getAttribute('width')) + 26, 213, 25, 'black', 61, 213),
            black3 = createChecker((+svg.getAttribute('width')) + 26, 161, 25, 'black', 61, 161),
            black4 = createChecker((+svg.getAttribute('width')) + 26, 109, 25, 'black', 61, 109),
            black5 = createChecker((+svg.getAttribute('width')) + 26, 57, 25, 'black', 61, 57),

            black6 = createChecker((+svg.getAttribute('width')) + 26, 459, 25, 'black', 301, 459),
            black7 = createChecker((+svg.getAttribute('width')) + 26, 511, 25, 'black', 301, 511),
            black8 = createChecker((+svg.getAttribute('width')) + 26, 563, 25, 'black', 301, 563),

            black9 = createChecker((+svg.getAttribute('width')) + 26, 563, 25, 'black', 460, 563),
            black10 = createChecker((+svg.getAttribute('width')) + 26, 511, 25, 'black', 460, 511),
            black11 = createChecker((+svg.getAttribute('width')) + 26, 459, 25, 'black', 460, 459),
            black12 = createChecker((+svg.getAttribute('width')) + 26, 407, 25, 'black', 460, 407),
            black13 = createChecker((+svg.getAttribute('width')) + 26, 355, 25, 'black', 460, 355),

            black14 = createChecker((+svg.getAttribute('width')) + 26, 57, 25, 'black', 760, 57),
            black15 = createChecker((+svg.getAttribute('width')) + 26, 109, 25, 'black', 760, 109);
        // white player checkers
        var white1 = createChecker((+svg.getAttribute('width')) + 26, 563, 25, 'white', 61, 563),
            white2 = createChecker((+svg.getAttribute('width')) + 26, 511, 25, 'white', 61, 511),
            white3 = createChecker((+svg.getAttribute('width')) + 26, 459, 25, 'white', 61, 459),
            white4 = createChecker((+svg.getAttribute('width')) + 26, 407, 25, 'white', 61, 407),
            white5 = createChecker((+svg.getAttribute('width')) + 26, 355, 25, 'white', 61, 355),

            white6 = createChecker((+svg.getAttribute('width')) + 26, 57, 25, 'white', 301, 57),
            white7 = createChecker((+svg.getAttribute('width')) + 26, 109, 25, 'white', 301, 109),
            white8 = createChecker((+svg.getAttribute('width')) + 26, 161, 25, 'white', 301, 161),

            white9 = createChecker((+svg.getAttribute('width')) + 26, 265, 25, 'white', 460, 265),
            white10 = createChecker((+svg.getAttribute('width')) + 26, 213, 25, 'white', 460, 213),
            white11 = createChecker((+svg.getAttribute('width')) + 26, 161, 25, 'white', 460, 161),
            white12 = createChecker((+svg.getAttribute('width')) + 26, 109, 25, 'white', 460, 109),
            white13 = createChecker((+svg.getAttribute('width')) + 26, 57, 25, 'white', 460, 57),

            white14 = createChecker((+svg.getAttribute('width')) + 26, 511, 25, 'white', 760, 511),
            white15 = createChecker((+svg.getAttribute('width')) + 26, 563, 25, 'white', 760, 563);

        var now,
            then,
            anotherCheckerStarted;

        function drawSetup() {
            now = new Date().getTime();
            if (now - then >= 1) {
                anotherCheckerStarted = false;
            }
            if (white1.startedRolling || !white1.arrived) {
                white1 = updatePosition(white1);
                if (+white1.getAttribute('cx') <= window.outerWidth / 2) {
                    anotherCheckerStarted = false;
                } else {
                    anotherCheckerStarted = true;
                }
            }
            white2 = shouldUpdate(white2);
            white3 = shouldUpdate(white3);
            white4 = shouldUpdate(white4);
            white5 = shouldUpdate(white5);
            black1 = shouldUpdate(black1);
            black2 = shouldUpdate(black2);
            black3 = shouldUpdate(black3);
            black4 = shouldUpdate(black4);
            black5 = shouldUpdate(black5);
            white6 = shouldUpdate(white6);
            white7 = shouldUpdate(white7);
            white8 = shouldUpdate(white8);
            black6 = shouldUpdate(black6);
            black7 = shouldUpdate(black7);
            black8 = shouldUpdate(black8);
            black9 = shouldUpdate(black9);
            black10 = shouldUpdate(black10);
            black11 = shouldUpdate(black11);
            black12 = shouldUpdate(black12);
            black13 = shouldUpdate(black13);
            white9 = shouldUpdate(white9);
            white10 = shouldUpdate(white10);
            white11 = shouldUpdate(white11);
            white12 = shouldUpdate(white12);
            white13 = shouldUpdate(white13);
            black14 = shouldUpdate(black14);
            black15 = shouldUpdate(black15);
            white14 = shouldUpdate(white14);
            white15 = shouldUpdate(white15);

            if (shouldStopBoardSetupAnimation()) {
                $('#kinetic-container').css('opacity', 0);
                document.getElementById("kinetic-container").style.visibility = "visible";
                document.getElementById("kinetic-container").style.display = 'inline';
                $('#kinetic-container').animate({opacity: "1"}, 1500);
                setTimeout(function () {
                    document.getElementById("theSvg").style.visibility = "hidden";
                    document.getElementById('theSvg').style.display = 'none';
                }, 1500);
                return;
            }

            requestAnimationFrame(drawSetup);
        }

        function shouldUpdate(checker) {
            if (checker.startedRolling || !checker.arrived && !anotherCheckerStarted) {
                checker = updatePosition(checker);
                if (+checker.getAttribute('cx') <= window.outerWidth / 2) {
                    anotherCheckerStarted = false;
                } else {
                    anotherCheckerStarted = true;
                }
            }
            return checker;
        }

        function updatePosition(checker) {
            var checker = checker;
            var cx = +checker.getAttribute('cx');
            if (checker.col <= cx) {
                checker.startedRolling = true;
                if (checker.col + 60 >= cx) {
                    checker.setAttribute('cx', cx - 1);
                } else {
                    checker.setAttribute('cx', cx - 55);
                }
            } else {
                checker.arrived = true;
                checker.startedRolling = false;
            }
            then = new Date().getTime();
            return checker;
        }

        function shouldStopBoardSetupAnimation() {
            return white1.arrived &&
                white2.arrived &&
                white3.arrived &&
                white4.arrived &&
                white5.arrived &&
                white6.arrived &&
                white7.arrived &&
                white8.arrived &&
                white9.arrived &&
                white10.arrived &&
                white11.arrived &&
                white12.arrived &&
                white13.arrived &&
                white14.arrived &&
                white15.arrived &&
                black1.arrived &&
                black2.arrived &&
                black3.arrived &&
                black4.arrived &&
                black5.arrived &&
                black6.arrived &&
                black7.arrived &&
                black8.arrived &&
                black9.arrived &&
                black10.arrived &&
                black11.arrived &&
                black12.arrived &&
                black13.arrived &&
                black14.arrived &&
                black15.arrived;
        }

        drawSetup();
    }
}

function play() {
    playButton = true;
    var removeMenusInterval = setInterval(function () {
        if (menusAreOut) {
            stopInterval(removeMenusInterval);
        }
        mustRemoveMenus = true;
    }, 500);
}

function getHelp() {
    window.open('Help.html');
}

function exitGame() {
    $('.button').animate({opacity: "0"}, 1000);
    setTimeout(function () {
        document.getElementById("textPlay").style.visibility = "hidden";
        document.getElementById("textHelp").style.visibility = "hidden";
        document.getElementById("textExit").style.visibility = "hidden";
    }, 1000);
    setTimeout(function () {
        document.getElementById("textGoodbye").innerHTML = "Goodbye!";
        document.getElementById("textThanks").innerHTML = "Thanks for playing.";
    }, 1200);
    var gameExitInterval = setInterval(function () {
        if (gameExited) {
            stopInterval(gameExitInterval);
        }
        mustSlowCircles = true;
    }, 250);
}

function setName() {
    var name;
    if (playerOneName) {
        name = $('#secondPlayer-name').val();
        playerTwoName = name;
        namesAreSet = true;
    } else {
        name = $('#firstPlayer-name').val();
        playerOneName = name;
        playerOneNameSet = true;
    }
}

function stopInterval(interval) {
    clearInterval(interval);
}
