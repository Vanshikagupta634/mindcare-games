const board = document.getElementById("attention-board");
const scoreDisplay = document.getElementById("score");
const timerDisplay = document.getElementById("timer");
const startBtn = document.getElementById("startBtn");

let score = 0;
let timeLeft = 30;
let timer;
let gameRunning = false;

function startGame() {
    score = 0;
    timeLeft = 30;
    gameRunning = true;

    scoreDisplay.textContent = score;
    timerDisplay.textContent = timeLeft;

    startBtn.disabled = true;
    startBtn.textContent = "Game Running...";

    createShapes();

    clearInterval(timer);

    timer = setInterval(() => {
        timeLeft--;

        timerDisplay.textContent = timeLeft;

        if (timeLeft <= 0) {
            endGame();
        }
    }, 1000);
}

function createShapes() {
    board.innerHTML = "";

    const normalShape = "🔵";
    const differentShape = "🟢";

    const differentPosition = Math.floor(Math.random() * 12);

    for (let i = 0; i < 12; i++) {

        const shape = document.createElement("button");

        shape.classList.add("attention-shape");

        if (i === differentPosition) {

            shape.textContent = differentShape;

            shape.addEventListener("click", () => {

                if (!gameRunning) {
                    return;
                }

                score++;

                scoreDisplay.textContent = score;

                createShapes();
            });

        } else {

            shape.textContent = normalShape;

            shape.addEventListener("click", () => {

                if (!gameRunning) {
                    return;
                }

                score--;

                scoreDisplay.textContent = score;
            });
        }

        board.appendChild(shape);
    }
}

function endGame() {

    gameRunning = false;

    clearInterval(timer);

    // Save best score
    const oldBest = localStorage.getItem("attentionBest");

    if (oldBest === null || score > Number(oldBest)) {
        localStorage.setItem("attentionBest", score);
    }

    board.innerHTML = `
        <div class="game-over">
            <h2>⏰ Time's Up!</h2>
            <p>Your final score is: <b>${score}</b></p>
        </div>
    `;

    startBtn.disabled = false;
    startBtn.textContent = "Play Again";
}

startBtn.addEventListener("click", startGame);