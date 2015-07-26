var mustSlowCircles = false,
    gameExited = false,
    playButton = false,
    goingRight = false,
    menusAreOut = false,
    mustRemoveMenus = false;

window.onload = toLoad();

function toLoad() {
    var svg = document.getElementById('theSvg'),

        outside1 = createOutsideChecker(-1 * generateRandomNumber(), 20, 30, 'grey', 'black'), // updateVal = 6
        inside1 = createInsideChecker(outside1.getAttribute('cx'), 20, 15, 'grey', 'black', 2),
        speedOfChecker1 = 6,

        outside2 = createOutsideChecker(-1 * generateRandomNumber(), 80, 30, 'grey', 'white'), // updateVal = 4
        inside2 = createInsideChecker(outside2.getAttribute('cx'), 80, 15, 'grey', 'white', 2),
        speedOfChecker2 = 4,

        outside3 = createOutsideChecker(-1 * generateRandomNumber(), 140, 30, 'grey', 'black'), // updateVal = 8
        inside3 = createInsideChecker(outside3.getAttribute('cx'), 140, 15, 'grey', 'black', 2),
        speedOfChecker3 = 8,

        outside4 = createOutsideChecker(-1 * generateRandomNumber(), 200, 30, 'grey', 'white'), // updateVal = 6
        inside4 = createInsideChecker(outside4.getAttribute('cx'), 200, 15, 'grey', 'white', 2),
        speedOfChecker4 = 6,

        outside5 = createOutsideChecker(-1 * generateRandomNumber(), 272, 30, 'grey', 'black'),
        inside5 = createInsideChecker(outside5.getAttribute('cx'), 272, 15, 'grey', 'black', 2),
        speedOfChecker5 = 5,

        outside6 = createOutsideChecker(-1 * generateRandomNumber(), 334, 30, 'grey', 'white'),
        inside6 = createInsideChecker(outside6.getAttribute('cx'), 334, 15, 'grey', 'white', 2),
        speedOfChecker6 = 9,

        outside7 = createOutsideChecker(-1 * generateRandomNumber(), 396, 30, 'grey', 'black'),
        inside7 = createInsideChecker(outside7.getAttribute('cx'), 396, 15, 'grey', 'black', 2),
        speedOfChecker7 = 6,

        outside8 = createOutsideChecker(-1 * generateRandomNumber(), 460, 30, 'grey', 'white'),
        inside8 = createInsideChecker(outside8.getAttribute('cx'), 460, 15, 'grey', 'white', 2),
        speedOfChecker8 = 3,

        outside9 = createOutsideChecker(-1 * generateRandomNumber(), 520, 30, 'grey', 'black'),
        inside9 = createInsideChecker(outside9.getAttribute('cx'), 520, 15, 'grey', 'black', 2),
        speedOfChecker9 = 8,

        outside10 = createOutsideChecker(-1 * generateRandomNumber(), 600, 30, 'grey', 'white'),
        inside10 = createInsideChecker(outside10.getAttribute('cx'), 600, 15, 'grey', 'white', 2),
        speedOfChecker10 = 7;


    function loopRollingCircles() {
        if (mustSlowCircles) {
            speedOfChecker1 -= 1;
            speedOfChecker2 -= 1;
            speedOfChecker3 -= 1;
            speedOfChecker4 -= 1;
            speedOfChecker5 -= 1;
            speedOfChecker6 -= 1;
            speedOfChecker7 -= 1;
            speedOfChecker8 -= 1;
            speedOfChecker9 -= 1;
            speedOfChecker10 -= 1;
        }
        if (playButton) {
            if (areSpeedsZero()) {
                goingRight = true;
            }
            if (goingRight) { // going fast right
                speedOfChecker1 += 1;
                speedOfChecker2 += 1;
                speedOfChecker3 += 1;
                speedOfChecker4 += 1;
                speedOfChecker5 += 1;
                speedOfChecker6 += 1;
                speedOfChecker7 += 1;
                speedOfChecker8 += 1;
                speedOfChecker9 += 1;
                speedOfChecker10 += 1;
            } else { // slow them down
                speedOfChecker1 -= 1;
                speedOfChecker2 -= 1;
                speedOfChecker3 -= 1;
                speedOfChecker4 -= 1;
                speedOfChecker5 -= 1;
                speedOfChecker6 -= 1;
                speedOfChecker7 -= 1;
                speedOfChecker8 -= 1;
                speedOfChecker9 -= 1;
                speedOfChecker10 -= 1;
            }
            if (allCirclesAreOut()) {
                if(mustRemoveMenus) {
                    $('.button').animate({opacity: "0.0001"}, 800);
                    menusAreOut = true;
                    return;
                }
                mustRemoveMenus = true;
            }
        }

        outside1 = updateChecker(outside1, speedOfChecker1);
        inside1 = updateChecker(inside1, speedOfChecker1);

        outside2 = updateChecker(outside2, speedOfChecker2);
        inside2 = updateChecker(inside2, speedOfChecker2);

        outside3 = updateChecker(outside3, speedOfChecker3);
        inside3 = updateChecker(inside3, speedOfChecker3);

        outside4 = updateChecker(outside4, speedOfChecker4);
        inside4 = updateChecker(inside4, speedOfChecker4);

        outside5 = updateChecker(outside5, speedOfChecker5);
        inside5 = updateChecker(inside5, speedOfChecker5);

        outside6 = updateChecker(outside6, speedOfChecker6);
        inside6 = updateChecker(inside6, speedOfChecker6);

        outside7 = updateChecker(outside7, speedOfChecker7);
        inside7 = updateChecker(inside7, speedOfChecker7);

        outside8 = updateChecker(outside8, speedOfChecker8);
        inside8 = updateChecker(inside8, speedOfChecker8);

        outside9 = updateChecker(outside9, speedOfChecker9);
        inside9 = updateChecker(inside9, speedOfChecker9);

        outside10 = updateChecker(outside10, speedOfChecker10);
        inside10 = updateChecker(inside10, speedOfChecker10);

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
            +inside1.getAttribute('cx') > +svg.getAttribute('width') + 25 &&
            +inside2.getAttribute('cx') > +svg.getAttribute('width') + 25 &&
            +inside3.getAttribute('cx') > +svg.getAttribute('width') + 25 &&
            +inside4.getAttribute('cx') > +svg.getAttribute('width') + 25 &&
            +inside5.getAttribute('cx') > +svg.getAttribute('width') + 25 &&
            +inside6.getAttribute('cx') > +svg.getAttribute('width') + 25 &&
            +inside7.getAttribute('cx') > +svg.getAttribute('width') + 25 &&
            +inside8.getAttribute('cx') > +svg.getAttribute('width') + 25 &&
            +inside9.getAttribute('cx') > +svg.getAttribute('width') + 25 &&
            +inside10.getAttribute('cx') > +svg.getAttribute('width') + 25;
    }

    function areSpeedsZero() {
        return speedOfChecker1 <= 0 &&
            speedOfChecker2 <= 0 &&
            speedOfChecker3 <= 0 &&
            speedOfChecker4 <= 0 &&
            speedOfChecker5 <= 0 &&
            speedOfChecker6 <= 0 &&
            speedOfChecker7 <= 0 &&
            speedOfChecker8 <= 0 &&
            speedOfChecker9 <= 0 &&
            speedOfChecker10 <= 0;
    }

    function updateChecker(checker, moveIndex) {
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


        if (moveIndex > 0) {
            checker.setAttribute('cx', cx + checker.goingRight * moveIndex);
        }
        return checker;
    }

    function createOutsideChecker(cx, cy, r, stroke, fill) {
        var svg = document.getElementById('theSvg');
        var svgNms = 'http://www.w3.org/2000/svg';

        var outsideCircle = document.createElementNS(svgNms, 'circle');
        outsideCircle.setAttribute('cx', cx);
        outsideCircle.setAttribute('cy', cy);
        outsideCircle.setAttribute('r', r);
        outsideCircle.setAttribute('stroke', stroke);
        outsideCircle.setAttribute('fill', fill);
        svg.appendChild(outsideCircle);
        outsideCircle.goingRight = 1;
        outsideCircle.firstAppearance = true;
        return outsideCircle;
    }

    function createInsideChecker(cx, cy, r, stroke, fill, strokeWidth) {
        var svg = document.getElementById('theSvg');
        var svgNms = 'http://www.w3.org/2000/svg';

        var insideCircle = document.createElementNS(svgNms, 'circle');
        insideCircle.setAttribute('cx', cx);
        insideCircle.setAttribute('cy', cy);
        insideCircle.setAttribute('r', r);
        insideCircle.setAttribute('stroke', stroke);
        insideCircle.setAttribute('fill', fill);
        insideCircle.setAttribute('stroke-width', strokeWidth);
        svg.appendChild(insideCircle);
        insideCircle.goingRight = 1;
        insideCircle.firstAppearance = true;
        return insideCircle;
    }

    function generateRandomNumber() {
        return Math.floor(Math.random() * 1000);
    }
}

function play() {
    //var xmlhttp = new XMLHttpRequest();
    //xmlhttp.open("GET", href, false);
    //xmlhttp.send();
    //return xmlhttp.responseText;
    playButton = true;
    var removeMenusInterval = setInterval(function() {
        if(menusAreOut) {
            stopInterval(removeMenusInterval);
        }
        mustRemoveMenus = true;
    }, 500);

}

function getHelp() {
    //document.getElementById("theSvg").innerHTML='<object type="text/html" data="Images/read.txt" ></object>';
}

function exitGame() {
    document.getElementById("textGoodbye").innerHTML = "Goodbye!";
    document.getElementById("textThanks").innerHTML = "Thanks for playing.";
    document.getElementById("textPlay").style.visibility = "hidden";
    document.getElementById("textHelp").style.visibility = "hidden";
    document.getElementById("textExit").style.visibility = "hidden";
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
