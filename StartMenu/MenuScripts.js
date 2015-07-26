var mustSlowCircles = false,
    gameExited = false,
    playButton = false,
    goingRight = false,
    menusAreOut = false,
    mustRemoveMenus = false;

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
                    $('#boardImage').css('opacity', 0);
                    document.getElementById("boardImage").style.visibility = "visible";
                    $('#boardImage').animate({opacity: "1"}, 5000);
                    setTimeout(function () {
                        document.getElementById("textPlay").style.visibility = "hidden";
                        document.getElementById("textHelp").style.visibility = "hidden";
                        document.getElementById("textExit").style.visibility = "hidden";
                    }, 2000);
                    setTimeout(setupCheckersOnBoard, 3200);
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
            +outside9.getAttribute('cx') > +svg.getAttribute('width') + 25;
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
        if (number > -60) {
            generateRandomNegativeNumber();
        }
        return number;
    }

    function setupCheckersOnBoard() {
        // TODO: EDIT LAST PARAMS OF CREATE CHECKER - represent COL,ROW
        // when editing them must replace the Y parameter(the second one) with the same ROW number

        //black player checkers
        var black1 = createChecker((+svg.getAttribute('width')) + 26, 263, 25, 'black', 58, 263),
            black2 = createChecker((+svg.getAttribute('width')) + 26, 214, 25, 'black', 58, 214),
            black3 = createChecker((+svg.getAttribute('width')) + 26, 159, 25, 'black', 58, 159),
            black4 = createChecker((+svg.getAttribute('width')) + 26, 107, 25, 'black', 58, 107),
            black5 = createChecker((+svg.getAttribute('width')) + 26, 56, 25, 'black', 58, 56),

            black6 = createChecker((+svg.getAttribute('width')) + 26, 456, 25, 'black', 298, 456),
            black7 = createChecker((+svg.getAttribute('width')) + 26, 512, 25, 'black', 298, 512),
            black8 = createChecker((+svg.getAttribute('width')) + 26, 562, 25, 'black', 298, 562),
            black9 = createChecker((+svg.getAttribute('width')) + 26, 562, 25, 'black', 458, 562),
            black10 = createChecker((+svg.getAttribute('width')) + 26, 512, 25, 'black', 458, 512),
            black11 = createChecker((+svg.getAttribute('width')) + 26, 456, 25, 'black', 458, 456),
            black12 = createChecker((+svg.getAttribute('width')) + 26, 407, 25, 'black', 458, 407),
            black13 = createChecker((+svg.getAttribute('width')) + 26, 353, 25, 'black', 458, 353),
            black14 = createChecker((+svg.getAttribute('width')) + 26, 56, 25, 'black', 759, 56),
            black15 = createChecker((+svg.getAttribute('width')) + 26, 108, 25, 'black', 759, 108);
        // white player checkers
        var white1 = createChecker((+svg.getAttribute('width')) + 26, 561, 25, 'white', 58, 562),
            white2 = createChecker((+svg.getAttribute('width')) + 26, 512, 25, 'white', 58, 512),
            white3 = createChecker((+svg.getAttribute('width')) + 26, 456, 25, 'white', 58, 456),
            white4 = createChecker((+svg.getAttribute('width')) + 26, 407, 25, 'white', 58, 407),
            white5 = createChecker((+svg.getAttribute('width')) + 26, 353, 25, 'white', 58, 353),
            white6 = createChecker((+svg.getAttribute('width')) + 26, 58, 25, 'white', 298, 58),
            white7 = createChecker((+svg.getAttribute('width')) + 26, 108, 25, 'white', 298, 108),
            white8 = createChecker((+svg.getAttribute('width')) + 26, 159, 25, 'white', 298, 159),
            white9 = createChecker((+svg.getAttribute('width')) + 26, 263, 25, 'white', 458, 263),
            white10 = createChecker((+svg.getAttribute('width')) + 26, 214, 25, 'white', 458, 214),
            white11 = createChecker((+svg.getAttribute('width')) + 26, 159, 25, 'white', 458, 159),
            white12 = createChecker((+svg.getAttribute('width')) + 26, 108, 25, 'white', 458, 108),
            white13 = createChecker((+svg.getAttribute('width')) + 26, 56, 25, 'white', 458, 56),
            white14 = createChecker((+svg.getAttribute('width')) + 26, 512, 25, 'white', 759, 512),
            white15 = createChecker((+svg.getAttribute('width')) + 26, 562, 25, 'white', 759, 562);

        var now,
            then,
            anotherCheckerStarted;

        function drawSetup() {
            now = new Date().getTime();
            if (now - then >= 80) {
                anotherCheckerStarted = false;
            }
            if (white1.startedRolling || !white1.arrived) {
                white1 = updatePosition(white1);
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
            requestAnimationFrame(drawSetup);
        }

        function shouldUpdate(checker) {
            if (checker.startedRolling || !checker.arrived && !anotherCheckerStarted) {
                checker = updatePosition(checker);
                anotherCheckerStarted = true;
            }
            return checker;
        }

        function updatePosition(checker) {
            var checker = checker;
            var cx = +checker.getAttribute('cx');
            if (checker.col + 25 <= cx) {
                checker.startedRolling = true;
                checker.setAttribute('cx', cx - 45);
            } else {
                checker.arrived = true;
                checker.startedRolling = false;
            }
            then = new Date().getTime();
            return checker;
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
    //document.getElementById("theSvg").innerHTML='<object type="text/html" data="Images/read.txt" ></object>';
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

function stopInterval(interval) {
    clearInterval(interval);
}
