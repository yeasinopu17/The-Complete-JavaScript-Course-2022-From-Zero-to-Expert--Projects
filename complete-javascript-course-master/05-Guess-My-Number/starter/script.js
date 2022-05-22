'use strict';

let secretNumber = Math.trunc(Math.random() * 20) + 1;
let score = 20;
let highscore = 0;
console.log('Secret Number :' + secretNumber);

const scoreHandler = () => {
    score > 0 ? score-- : 0;
    document.querySelector('.score').textContent = score;
};

const displayMessage = (message) => {
    document.querySelector('.message').textContent = message;
};

document.querySelector('.check').addEventListener('click', () => {
    const guess = Number(document.querySelector('.guess').value);

    // when invalid input
    if (!guess) {
        displayMessage('Invalid Number ⛔');
        // when wins
    } else if (guess === secretNumber) {
        displayMessage('🎉🎈 Correct Number...');
        document.querySelector('body').style.backgroundColor = '#60b347';
        document.querySelector('.number').style.width = '30rem';
        document.querySelector('.number').textContent = secretNumber;

        //highscore scetion
        if (score > highscore) {
            highscore = score;
            document.querySelector('.highscore').textContent = highscore;
        }

        // when guess is worng
    } else if (guess !== secretNumber) {
        if (score > 1) {
            displayMessage(guess > secretNumber ? '📈 Too High' : '📉 Too Low');
            scoreHandler();
        } else {
            displayMessage('💥 You lost the game!');
            scoreHandler();
        }
    }
});

const resetHandler = () => {
    score = 20;
    secretNumber = Math.trunc(Math.random() * 20) + 1;
    console.log('Secret Number :' + secretNumber);

    displayMessage('Start guessing...');
    document.querySelector('.score').textContent = score;
    document.querySelector('.number').textContent = '?';
    document.querySelector('.guess').value = '';

    document.querySelector('body').style.backgroundColor = '#222';
    document.querySelector('.number').style.width = '15rem';
};

document.querySelector('.again').addEventListener('click', resetHandler);
