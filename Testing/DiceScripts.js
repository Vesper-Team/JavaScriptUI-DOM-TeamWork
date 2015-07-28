window.onload = startUp;

var tm1 = 1,
    tm2 = 2,
    tm3 = 3,
    tm4 = 4,
    tm5 = 5,
    tm6 = 6,
    tm7 = 7,
    tm8 = 8,
    tm9 = 9,
    tm10 = 10,
    tm11 = 11,
    tm12 = 12,
    firstDiceResult,
    secondDiceResult;

function startUp() {
    var firstDice = setInterval(drawDices1, 600),
        secondDice = setInterval(drawDices2, 750);

    stopDices(firstDice, secondDice);
}

function drawDices1() {
    tm1 = setTimeout(function () {
        $('#dice1').attr('src', 'dieWhite1.png');
    }, 50);
    tm2 = setTimeout(function () {
        $('#dice1').attr('src', 'dieWhite2.png');
    }, 150);
    tm3 = setTimeout(function () {
        $('#dice1').attr('src', 'dieWhite3.png');
    }, 250);
    tm4 = setTimeout(function () {
        $('#dice1').attr('src', 'dieWhite4.png');
    }, 350);
    tm5 = setTimeout(function () {
        $('#dice1').attr('src', 'dieWhite5.png');
    }, 450);
    tm6 = setTimeout(function () {
        $('#dice1').attr('src', 'dieWhite6.png');
    }, 550);
}

function drawDices2() {
    tm7 = setTimeout(function () {
        $('#dice2').attr('src', 'dieWhite1.png');
    }, 100);
    tm8 = setTimeout(function () {
        $('#dice2').attr('src', 'dieWhite2.png');
    }, 220);
    tm9 = setTimeout(function () {
        $('#dice2').attr('src', 'dieWhite3.png');
    }, 340);
    tm10 = setTimeout(function () {
        $('#dice2').attr('src', 'dieWhite4.png');
    }, 460);
    tm11 = setTimeout(function () {
        $('#dice2').attr('src', 'dieWhite5.png');
    }, 580);
    tm12 = setTimeout(function () {
        $('#dice2').attr('src', 'dieWhite6.png');
    }, 700);
}


function stopDices(timer1, timer2) {
    $('#dice1').on("click", function () {
        clearInterval(timer1);
        stopTimeout(tm1);
        stopTimeout(tm2);
        stopTimeout(tm3);
        stopTimeout(tm4);
        stopTimeout(tm5);
        stopTimeout(tm6);
        clearInterval(timer2);
        stopTimeout(tm7);
        stopTimeout(tm8);
        stopTimeout(tm9);
        stopTimeout(tm10);
        stopTimeout(tm11);
        stopTimeout(tm12);
        return getDicesResults();
    });

    $('#dice2').on("click", function () {
        clearInterval(timer1);
        stopTimeout(tm1);
        stopTimeout(tm2);
        stopTimeout(tm3);
        stopTimeout(tm4);
        stopTimeout(tm5);
        stopTimeout(tm6);
        clearInterval(timer2);
        stopTimeout(tm7);
        stopTimeout(tm8);
        stopTimeout(tm9);
        stopTimeout(tm10);
        stopTimeout(tm11);
        stopTimeout(tm12);
        return getDicesResults();
    });
}

function stopTimeout(currentTimeout) {
    clearTimeout(currentTimeout);
}

function getDicesResults() {
    var results = [],
        $first = $('#dice1').attr('src'),
        $second = $('#dice2').attr('src');

    switch ($first) {
        case 'dieWhite1.png':
            results[0] = 1;
            break;
        case 'dieWhite2.png':
            results[0] = 2;
            break;
        case 'dieWhite3.png':
            results[0] = 3;
            break;
        case 'dieWhite4.png':
            results[0] = 4;
            break;
        case 'dieWhite5.png':
            results[0] = 5;
            break;
        case 'dieWhite6.png':
            results[0] = 6;
            break;
        default:
            throw new Error('Invalid first dice result!');
    }

    switch ($second) {
        case 'dieWhite1.png':
            results[1] = 1;
            break;
        case 'dieWhite2.png':
            results[1] = 2;
            break;
        case 'dieWhite3.png':
            results[1] = 3;
            break;
        case 'dieWhite4.png':
            results[1] = 4;
            break;
        case 'dieWhite5.png':
            results[1] = 5;
            break;
        case 'dieWhite6.png':
            results[1] = 6;
            break;
        default:
            throw new Error('Invalid second dice result!');
    }

    console.log(results[0] + ' ' + results[1]);

    return results;
}









