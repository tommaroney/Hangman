    var theme = new Audio("assets/sounds/theme.mp3");
    theme.preload = ""
    var gasp = new Audio("assets/sounds/gasp.wav");
    var applause = new Audio("assets/sounds/applause.mp3");
    var endAudio = new Audio("assets/sounds/endGame.mp3");

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
    // var letters = ;

    function fillArray(jsonObj, array) {
        for(var i = 0; i < jsonObj.results.length; i++) {
            var entry = jsonObj.results[i].correct_answer;
            if(entry.length <= 12 && !numWords.test(entry)) {
                array.push(jsonObj.results[i].correct_answer);
            }
        }
    }
    
this.onload = function() {
    
    var startButton = document.getElementById("start");
    var currentState = document.getElementById("currentState");
    var missedGuesses = document.getElementById("missedGuesses");
    var image = document.getElementById("gallows");
    var rGuesses = document.getElementById("remaining-guesses");
    var mainC = document.getElementById("tracking");
    var wCount = document.getElementById("win-count");
    var lCount = document.getElementById("loss-count");

    // setTimeout(function() {theme.play()}, 300);
    theme.play();

    startButton.onclick = function (event) {
        theme.pause();
        answer = words[Math.floor(Math.random() * words.length)];
        image.src = "assets/images/gallowsInit.png";
        startButton.hidden = true;
        let gone = document.getElementById("vanish")
        gone.hidden = true;
        let seen = document.getElementsByClassName("visOnStart");
        for(let i = 0; i < seen.length; i++) {
            seen[i].hidden = false;
        }
        for(var i = 0; i < answer.length; i++) {
            if(answer.charAt(i) == ' ') {
                cState += ' ';
                continue;
            }
            cState += '-';
        }
        currentState.innerText = cState;
        document.onkeyup = function (event) {
            currentGuess = event.key;
            if(currentGuess.match(/^[A-Za-z]+$/) && currentGuess.length === 1 && !isGuessed(currentGuess)) {
                findInWord(currentGuess.toLowerCase());
            }
        }
    }

    function endGame() {
        endAudio.play();
        response = confirm("Play again?");
        if(response) {
            endAudio.load();
            endAudio.pause();
            theme.load();
            theme.play();
            words.splice(ansPos, 1);
            currentState.innerHTML = '';
            missedGuesses.innerHTML = '';
            mainC.appendChild(startButton);
            startButton.hidden = false;
            mGuessCount = 0;
            answer = '';
            cState = '';
            guesses = '';
            rGuesses.innerText = "7";
        }
    }

    function findInWord(guess) {
        for(var i = 0; i < answer.length; i++) {
            if(guess === answer.charAt(i).toLowerCase()) {
                applause.play();
                cState = cState.slice(0, i) + answer.charAt(i) + cState.slice(i + 1);
                guesses += guess;
                currentState.innerText = cState;
                isWin();
            }
        }

        if(!answer.toLowerCase().includes(guess)) {
            guesses += guess;
            gasp.play();
            let newGuess = document.createElement("span");
            newGuess.classList = 'badge badge-danger mr-1 ml-1';
            newGuess.innerText = guess;
            missedGuesses.appendChild(newGuess);
            rGuesses.innerText = (7 - ++mGuessCount);
            image.src = ("assets/images/gallows" + (-1 + mGuessCount) + ".png");
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
            currentState.innerText = answer;
            let lostElem = document.createElement("h1");
            lostElem.classList ='display-1';
            lostElem.innerText = "You lost!";
            currentState.appendChild(lostElem);
            document.onkeyup = function() {};
            setTimeout(endGame, 100);
            var inc = parseInt(lCount.innerText) + 1;
            lCount.innerText = inc;
        }
    }

    function isWin() {
        if(answer === cState) {
            let wonElem = document.createElement("h1");
            wonElem.class ='display-1';
            wonElem.innerText = "You won!";
            currentState.append(wonElem);
            document.onkeyup = function() {};
            setTimeout(endGame, 100);
            var inc = parseInt(wCount.innerText) + 1;
            wCount.innerText = inc;
        }
    }
}