const alphabet = 'abcdefghijklmnopqrstuvwxyz';
let currentIndex = 0;
const completedLevels = [];
let timerValue = 90;
let timerInterval;
let score = 0;
let timerStarted = false;

let highScore = parseInt(localStorage.getItem('highScore')) || 0;
document.getElementById('highScore').textContent = `High Score: ${highScore}`;

window.onload = enter.disabled = true; songInput.disabled = true;

function startTimer() {
    enter.disabled = false;
    songInput.disabled = false;
    timerInterval = setInterval(function() {
        timerValue--;
        const minutes = Math.floor(timerValue / 60);
        const seconds = timerValue % 60;
        document.getElementById('timer').textContent = `Time remaining: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

        if (timerValue <= 0) {
            clearInterval(timerInterval);
            endGame();
        }
    }, 1000);

}

async function checkSong() {
    const input = document.getElementById('songInput').value.trim();
    const currentLetter = alphabet[currentIndex];


    if (input.toLowerCase() === currentLetter) {
        document.getElementById('result').textContent = 'Please enter the full song title for the letter ' + currentLetter.toUpperCase() + '.';
        return;
    }

    if (input.toLowerCase().startsWith(currentLetter)) {
        try {
            const { song, artist } = await getSongInfo(input);

            if (song && artist && song.toLowerCase().startsWith(currentLetter)) {
                completedLevels.push({ letter: currentLetter.toUpperCase(), song, artist });
                displayCompletedLevels();

                document.getElementById('result').textContent = 'Correct!';
                currentIndex++;
                score += 100;

                if (score > highScore) {
                    highScore = score;
                    localStorage.setItem('highScore', highScore);
                    document.getElementById('highScore').textContent = `High Score: ${highScore}`;
                }

                if (currentIndex === alphabet.length) {
                    clearInterval(timerInterval);
                    document.getElementById('result').textContent = 'Congratulations! You completed the game.';
                    document.getElementById('songInput').disabled = true;
                    document.querySelector('button').disabled = true;
                } else {
                    document.getElementById('songInput').value = '';
                    document.getElementById('currentLetter').textContent = `Current Letter: ${alphabet[currentIndex].toUpperCase()}`;
                    document.getElementById('score').textContent = `Score: ${score}`;
                }
            } else {
                document.getElementById('result').textContent = 'Song not found or invalid artist. Try again with a valid song starting with the letter ' + currentLetter.toUpperCase() + '.';
            }
        } catch (error) {
            console.error(error);
        }
    } else {
        document.getElementById('result').textContent = 'Incorrect. Try again with a song starting with the letter ' + currentLetter.toUpperCase() + '.';
    }
}

function handleKeyUp(event) {
    if (event.key === 'Enter') {
        checkSong();
    }
}

function getSongInfo(song) {
    const apiKey = 'ab88f596b1ccc6e9e110b3a72603f7a0'; 
    const apiUrl = `https://ws.audioscrobbler.com/2.0/?method=track.search&track=${encodeURIComponent(song)}&api_key=${apiKey}&format=json`;

    return fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const track = data.results.trackmatches.track[0];

            if (track) {
                return { song: track.name, artist: track.artist };
            } else {
                return { song: null, artist: null };
            }
        })
        .catch(error => {
            console.error('Error getting song info:', error);
            return { song: null, artist: null };
        });
}

function endGame() {
    document.getElementById('result').textContent = 'Time is up! Game over.';
    document.getElementById('songInput').disabled = true;
    document.getElementById("enter").disabled = true;
}

function displayCompletedLevels() {
    const completedLevelsContainer = document.getElementById('completedLevels');
    completedLevelsContainer.innerHTML = '<p>Completed Levels:</p>';

    for (let i = completedLevels.length - 1; i >= 0; i--) {
        const level = completedLevels[i];
        completedLevelsContainer.innerHTML += `<p>${level.letter} - ${level.song} by ${level.artist}</p>`;
    }
}

document.getElementById('timer').textContent = `Time remaining: 1:30`;
document.getElementById('currentLetter').textContent = `Current Letter: ${alphabet[currentIndex].toUpperCase()}`;



function startGame() {
    document.getElementById('startButton').style.display = 'none';
    document.getElementById('main').style.display = 'block';

    startTimer();
}

function restartGame() {
    currentIndex = 0;
    completedLevels.length = 0;
    score = 0;
    timerValue = 90;
    document.getElementById('songInput').value = '';
    document.getElementById('currentLetter').textContent = `Current Letter: ${alphabet[currentIndex].toUpperCase()}`;
    document.getElementById('score').textContent = `Score: ${score}`;
    document.getElementById('result').textContent = '';
    document.getElementById('completedLevels').innerHTML = '';
    document.getElementById('restartBtn').style.display = 'none';

    startTimer();
}


function endGame() {
    document.getElementById('result').textContent = 'Time is up! Game over.';
    document.getElementById('songInput').disabled = true;
    document.getElementById('enter').disabled = true;
    document.getElementById('restartBtn').style.display = 'block';
}
