
    var currentGuess;
    var answer = '';
    var guesses = "";
    var mGuessCount = 0;
    var numWords = new RegExp(/[0-9]/);
    var words = [];
    var ansPos;
    var requestURL = 'https://opentdb.com/api.php?amount=50&category=11&difficulty=medium&type=multiple';
    var request = new XMLHttpRequest();
    request.open('GET', requestURL);
    request.responseType = 'json';
    request.send();
    request.onload = function() {
        var filmQuiz = request.response;
        fillArray(filmQuiz, words);
    }
    var cState = "";
    var letters = /^[A-Za-z]+$/;

    function fillArray(jsonObj, array) {
        for(var i = 0; i < jsonObj.results.length; i++) {
            var entry = jsonObj.results[i].correct_answer;
            if(entry.length <= 12 && !numWords.test(entry)) {
                array.push(jsonObj.results[i].correct_answer);
            }
        }
    }
    
$(document).ready(function() {
    
    var startButton = $("#start");
    var currentState = $("#currentState");
    var missedGuesses = $("#missedGuesses");
    var image = $("#gallows");
    var rGuesses = $("#remaining-guesses");
    var mainC = $("#tracking");
    var doc = $(document);
    var wCount = $("#win-count");
    var lCount = $("#loss-count");
    
    
    var theme = new Audio("assets/sounds/theme.mp3");
    var gasp = new Audio("assets/sounds/gasp.wav");
    var applause = new Audio("assets/sounds/applause.mp3");
    
    console.log(theme);
    theme.play();
    
    startButton.on("click", function (event) {
        console.log(words);
        ansPos = Math.floor(Math.random() * words.length);
        answer = words[ansPos];
        console.log(answer);
        image.attr("src", "assets/images/gallowsInit.png");
        startButton.attr("hidden", "true");
        $("#vanish").attr("hidden", "true");
        $(".visOnStart").attr("hidden", false);
        for(var i = 0; i < answer.length; i++) {
            if(answer.charAt(i) == ' ') {
                cState += ' ';
                continue;
            }
            cState += '-';
        }
        currentState.text(cState);
        doc.on("keyup", function (event) {
            currentGuess = event.key;
            if(currentGuess.match(letters) && currentGuess.length === 1 && !isGuessed(currentGuess)) {
                findInWord(currentGuess.toLowerCase());
            }
        });
    });

    function endGame() {
        response = confirm("Play again?");
        if(response) {
            words.splice(ansPos, 1);
            currentState.empty();
            missedGuesses.empty();
            mainC.append(startButton);
            startButton.attr("hidden", false);
            mGuessCount = 0;
            answer = '';
            cState = '';
            guesses = '';
            rGuesses.text("7");
        }
    }

    function findInWord(guess) {
        for(var i = 0; i < answer.length; i++) {
            if(guess === answer.charAt(i).toLowerCase()) {
                applause.play();
                cState = cState.slice(0, i) + answer.charAt(i) + cState.slice(i + 1);
                guesses += guess;
                currentState.text(cState);
                isWin();
            }
        }

        if(!answer.toLowerCase().includes(guess)) {
            guesses += guess;
            gasp.play();
            missedGuesses.append($("<span class='badge badge-danger mr-1 ml-1'>" + guess + "</span>"));
            rGuesses.text(7 - ++mGuessCount);
            image.attr("src", "assets/images/gallows" + (-1 + mGuessCount) + ".png");
            isHung();
        }
    }

    
    function isGuessed(letter) {
        if(guesses.includes(letter)) {
            alert("You have already guessed this letter try again");
            return true;
        }
        else return false;
    }
    
    function isHung() {
        if(mGuessCount >= 7) {
            currentState.text(answer).append($("<h1 class='display-1'>You lost!</h1>"));
            doc.off("keyup");
            setTimeout(endGame, 100);
            var inc = parseInt(lCount.text()) + 1;
            lCount.text(inc);
        }
    }

    function isWin() {
        if(answer === cState) {
            currentState.append($("<h1 class='display-1'>You won!</h1>"));
            doc.off("keyup");
            setTimeout(endGame, 100);
            var inc = parseInt(wCount.text()) + 1;
            wCount.text(inc);
        }
    }
});