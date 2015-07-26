window.addEventListener('load', toLoad(), false);

function toLoad() {
    var svg = document.getElementById('theSvg');

    var moveInside1 = 1,
        moveOutside1 = 1;
    var outside1 = createOutsideChecker(28, 24, 30, 'grey', 'black');
    var inside1 = createInsideChecker(28, 24, 15, 'grey', 'black', 2);
    function animFrame1() {
        var cxInside = +inside1.getAttribute('cx'),
            cxOutside = +outside1.getAttribute('cx');

        if (cxInside > (+svg.getAttribute('width') - 25) || cxInside < 20) {
            moveInside1 *= -1;
        }

        inside1.setAttribute('cx', cxInside + moveInside1 * 6);

        if (cxOutside > (+svg.getAttribute('width') - 25) || cxOutside < 20) {
            moveOutside1 *= -1;
        }

        outside1.setAttribute('cx', cxOutside + moveOutside1 * 6);

        window.requestAnimationFrame(animFrame1);
    }
    animFrame1();

    var moveInside2 = 1,
        moveOutside2 = 1;
    var outside2 = createOutsideChecker(28, 86, 30, 'grey', 'white');
    var inside2 = createInsideChecker(28, 86, 15, 'grey', 'white', 2);
    function animFrame2() {
        var cxInside = +inside2.getAttribute('cx'),
            cxOutside = +outside2.getAttribute('cx');

        if (cxInside > (+svg.getAttribute('width') - 25) || cxInside < 20) {
            moveInside2 *= -1;
        }

        inside2.setAttribute('cx', cxInside + moveInside2 * 4);

        if (cxOutside > (+svg.getAttribute('width') - 25) || cxOutside < 20) {
            moveOutside2 *= -1;
        }

        outside2.setAttribute('cx', cxOutside + moveOutside2 * 4);

        window.requestAnimationFrame(animFrame2);
    }
    animFrame2();

    var moveInside3 = 1,
        moveOutside3 = 1;
    var outside3 = createOutsideChecker(28, 150, 30, 'grey', 'black');
    var inside3 = createInsideChecker(28, 150, 15, 'grey', 'black', 2);
    function animFrame3() {
        var cxInside = +inside3.getAttribute('cx'),
            cxOutside = +outside3.getAttribute('cx');

        if (cxInside > (+svg.getAttribute('width') - 25) || cxInside < 20) {
            moveInside3 *= -1;
        }

        inside3.setAttribute('cx', cxInside + moveInside3 * 8);

        if (cxOutside > (+svg.getAttribute('width') - 25) || cxOutside < 20) {
            moveOutside3 *= -1;
        }

        outside3.setAttribute('cx', cxOutside + moveOutside3 * 8);

        window.requestAnimationFrame(animFrame3);
    }
    animFrame3();

    var moveInside4 = 1,
        moveOutside4 = 1;
    var outside4 = createOutsideChecker(28, 210, 30, 'grey', 'white');
    var inside4 = createInsideChecker(28, 210, 15, 'grey', 'white', 2);
    function animFrame4() {
        var cxInside = +inside4.getAttribute('cx'),
            cxOutside = +outside4.getAttribute('cx');

        if (cxInside > (+svg.getAttribute('width') - 25) || cxInside < 20) {
            moveInside4 *= -1;
        }

        inside4.setAttribute('cx', cxInside + moveInside4 * 7);

        if (cxOutside > (+svg.getAttribute('width') - 25) || cxOutside < 20) {
            moveOutside4 *= -1;
        }

        outside4.setAttribute('cx', cxOutside + moveOutside4 * 7);

        window.requestAnimationFrame(animFrame4);
    }
    animFrame4();

    var moveInside5 = 1,
        moveOutside5 = 1;
    var outside5 = createOutsideChecker(28, 272, 30, 'grey', 'black');
    var inside5 = createInsideChecker(28, 272, 15, 'grey', 'black', 2);
    function animFrame5() {
        var cxInside = +inside5.getAttribute('cx'),
            cxOutside = +outside5.getAttribute('cx');

        if (cxInside > (+svg.getAttribute('width') - 25) || cxInside < 20) {
            moveInside5 *= -1;
        }

        inside5.setAttribute('cx', cxInside + moveInside5 * 5);

        if (cxOutside > (+svg.getAttribute('width') - 25) || cxOutside < 20) {
            moveOutside5 *= -1;
        }

        outside5.setAttribute('cx', cxOutside + moveOutside5 * 5);

        window.requestAnimationFrame(animFrame5);
    }
    animFrame5();

    var moveInside6 = 1,
        moveOutside6 = 1;
    var outside6 = createOutsideChecker(28, 334, 30, 'grey', 'white');
    var inside6 = createInsideChecker(28, 334, 15, 'grey', 'white', 2);
    function animFrame6() {
        var cxInside = +inside6.getAttribute('cx'),
            cxOutside = +outside6.getAttribute('cx');

        if (cxInside > (+svg.getAttribute('width') - 25) || cxInside < 20) {
            moveInside6 *= -1;
        }

        inside6.setAttribute('cx', cxInside + moveInside6 * 9);

        if (cxOutside > (+svg.getAttribute('width') - 25) || cxOutside < 20) {
            moveOutside6 *= -1;
        }

        outside6.setAttribute('cx', cxOutside + moveOutside6 * 9);

        window.requestAnimationFrame(animFrame6);
    }
    animFrame6();

    var moveInside7 = 1,
        moveOutside7 = 1;
    var outside7 = createOutsideChecker(28, 396, 30, 'grey', 'black');
    var inside7 = createInsideChecker(28, 396, 15, 'grey', 'black', 2);
    function animFrame7() {
        var cxInside = +inside7.getAttribute('cx'),
            cxOutside = +outside7.getAttribute('cx');

        if (cxInside > (+svg.getAttribute('width') - 25) || cxInside < 20) {
            moveInside7 *= -1;
        }

        inside7.setAttribute('cx', cxInside + moveInside7 * 6);

        if (cxOutside > (+svg.getAttribute('width') - 25) || cxOutside < 20) {
            moveOutside7 *= -1;
        }

        outside7.setAttribute('cx', cxOutside + moveOutside7 * 6);

        window.requestAnimationFrame(animFrame7);
    }
    animFrame7();

    var moveInside8 = 1,
        moveOutside8 = 1;
    var outside8 = createOutsideChecker(28, 460, 30, 'grey', 'white');
    var inside8 = createInsideChecker(28, 460, 15, 'grey', 'white', 2);
    function animFrame8() {
        var cxInside = +inside8.getAttribute('cx'),
            cxOutside = +outside8.getAttribute('cx');

        if (cxInside > (+svg.getAttribute('width') - 25) || cxInside < 20) {
            moveInside8 *= -1;
        }

        inside8.setAttribute('cx', cxInside + moveInside8 * 3);

        if (cxOutside > (+svg.getAttribute('width') - 25) || cxOutside < 20) {
            moveOutside8 *= -1;
        }

        outside8.setAttribute('cx', cxOutside + moveOutside8 * 3);

        window.requestAnimationFrame(animFrame8);
    }
    animFrame8();

    var moveInside9 = 1,
        moveOutside9 = 1;
    var outside9 = createOutsideChecker(28, 520, 30, 'grey', 'black');
    var inside9 = createInsideChecker(28, 520, 15, 'grey', 'black', 2);
    function animFrame9() {
        var cxInside = +inside9.getAttribute('cx'),
            cxOutside = +outside9.getAttribute('cx');

        if (cxInside > (+svg.getAttribute('width') - 25) || cxInside < 20) {
            moveInside9 *= -1;
        }

        inside9.setAttribute('cx', cxInside + moveInside9 * 8);

        if (cxOutside > (+svg.getAttribute('width') - 25) || cxOutside < 20) {
            moveOutside9 *= -1;
        }

        outside9.setAttribute('cx', cxOutside + moveOutside9 * 8);

        window.requestAnimationFrame(animFrame9);
    }
    animFrame9();
}


function createOutsideChecker(cx, cy, r, stroke, fill) {
    var svg = document.getElementById('theSvg');
    var svgNms = 'http://www.w3.org/2000/svg';

    var outsideCircle1 = document.createElementNS(svgNms, 'circle');
    outsideCircle1.setAttribute('cx', cx);
    outsideCircle1.setAttribute('cy', cy);
    outsideCircle1.setAttribute('r', r);
    outsideCircle1.setAttribute('stroke', stroke);
    outsideCircle1.setAttribute('fill', fill);
    svg.appendChild(outsideCircle1);

    return outsideCircle1;
}

function createInsideChecker(cx, cy, r, stroke, fill, strokeWidth) {
    var svg = document.getElementById('theSvg');
    var svgNms = 'http://www.w3.org/2000/svg';

    var outsideCircle1 = document.createElementNS(svgNms, 'circle');
    outsideCircle1.setAttribute('cx', cx);
    outsideCircle1.setAttribute('cy', cy);
    outsideCircle1.setAttribute('r', r);
    outsideCircle1.setAttribute('stroke', stroke);
    outsideCircle1.setAttribute('fill', fill);
    outsideCircle1.setAttribute('stroke-width', strokeWidth);
    svg.appendChild(outsideCircle1);

    return outsideCircle1;
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

