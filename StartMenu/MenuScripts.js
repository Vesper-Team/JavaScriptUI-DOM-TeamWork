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

function PiecesRolling() {
    var svg = document.getElementById('theSvg');
    var svgNms = 'http://www.w3.org/2000/svg';

    var outsideCircle = document.createElementNS('svgNms', 'circle');
    outsideCircle.setAttribute('cx', 20);
    outsideCircle.setAttribute('cy', 20);
    outsideCircle.setAttribute('r', 30);
    outsideCircle.setAttribute('stroke', 'grey');
    outsideCircle.setAttribute('fill', 'black');
    svg.appendChild(outsideCircle);

    var insideCircle = document.createElementNS('svgNms', 'circle');
    insideCircle.setAttribute('cx', 20);
    insideCircle.setAttribute('cy', 20);
    insideCircle.setAttribute('r', 15);
    insideCircle.setAttribute('stroke', 'grey');
    insideCircle.setAttribute('fill', 'black');
    svg.appendChild(insideCircle);

//    function animFrame() {
//        var cx = +insideCircle.getAttribute('cx'),
//                move = 1;
//        if (cx > svg.width || cx < 0) {
//            move *= -1;
//        }
//
//        insideCircle.setAttribute('cx', cx + move * 5);
//
//        var cx = +outsideCircle.getAttribute('cx'),
//                move = 1;
//        if (cx > svg.width || cx < 0) {
//            move *= -1;
//        }
//
//        outsideCircle.setAttribute('cx', cx + move * 5);
//
//        requestAnimationFrame(animFrame);
//    }

//    animFrame();
}


