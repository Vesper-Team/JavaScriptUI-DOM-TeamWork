window.onload = toLoad();
document.getElementById('textPlay').style.position = 100;
function toLoad() {
    var svg = document.getElementById('theSvg');

    var outside1 = createOutsideChecker(-1*generateRandomNumber(), 20, 30, 'grey', 'black'); // updateVal = 6
    var inside1 = createInsideChecker(outside1.getAttribute('cx'), 20, 15, 'grey', 'black', 2);

    var outside2 = createOutsideChecker(-1*generateRandomNumber(), 80, 30, 'grey', 'white'); // updateVal = 4
    var inside2 = createInsideChecker(outside2.getAttribute('cx'), 80, 15, 'grey', 'white', 2);

    var outside3 = createOutsideChecker(-1*generateRandomNumber(), 140, 30, 'grey', 'black'); // updateVal = 8
    var inside3 = createInsideChecker(outside3.getAttribute('cx'), 140, 15, 'grey', 'black', 2);

    var outside4 = createOutsideChecker(-1*generateRandomNumber(), 200, 30, 'grey', 'white'); // updateVal = 6
    var inside4 = createInsideChecker(outside4.getAttribute('cx'), 200, 15, 'grey', 'white', 2);

    var outside5 = createOutsideChecker(-1*generateRandomNumber(), 272, 30, 'grey', 'black');
    var inside5 = createInsideChecker(outside5.getAttribute('cx'), 272, 15, 'grey', 'black', 2);

    var outside6 = createOutsideChecker(-1*generateRandomNumber(), 334, 30, 'grey', 'white');
    var inside6 = createInsideChecker(outside6.getAttribute('cx'), 334, 15, 'grey', 'white', 2);

    var outside7 = createOutsideChecker(-1*generateRandomNumber(), 396, 30, 'grey', 'black');
    var inside7 = createInsideChecker(outside7.getAttribute('cx'), 396, 15, 'grey', 'black', 2);

    var outside8 = createOutsideChecker(-1*generateRandomNumber(), 460, 30, 'grey', 'white');
    var inside8 = createInsideChecker(outside8.getAttribute('cx'), 460, 15, 'grey', 'white', 2);

    var outside9 = createOutsideChecker(-1*generateRandomNumber(), 520, 30, 'grey', 'black');
    var inside9 = createInsideChecker(outside9.getAttribute('cx'), 520, 15, 'grey', 'black', 2);

    function loop() {
        outside1 = updateChecker(outside1, 6);
        inside1 = updateChecker(inside1, 6);

        outside2 = updateChecker(outside2, 4);
        inside2 = updateChecker(inside2, 4);

        outside3 = updateChecker(outside3, 8);
        inside3 = updateChecker(inside3, 8);

        outside4 = updateChecker(outside4, 6);
        inside4 = updateChecker(inside4, 6);

        outside5 = updateChecker(outside5, 5);
        inside5 = updateChecker(inside5, 5);

        outside6 = updateChecker(outside6, 9);
        inside6 = updateChecker(inside6, 9);

        outside7 = updateChecker(outside7, 6);
        inside7 = updateChecker(inside7, 6);

        outside8 = updateChecker(outside8, 3);
        inside8 = updateChecker(inside8, 3);

        outside9 = updateChecker(outside9, 8);
        inside9 = updateChecker(inside9, 8);


        requestAnimationFrame(loop);
    }
    loop();

    function updateChecker(checker, moveIndex) {
        var checker = checker;
        var cx = +checker.getAttribute('cx');

        if(cx > +svg.getAttribute('width') - 25) {
            checker.firstAppearance = false;
        }
        if (cx > (+svg.getAttribute('width') - 25) || cx < 20 && !checker.firstAppearance) {
            checker.goingRight *= -1;
        }

        checker.setAttribute('cx', cx + checker.goingRight * moveIndex);

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
function startGame(href) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", href, false);
    xmlhttp.send();
    return xmlhttp.responseText;
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
}
