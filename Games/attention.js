/* =========================================
   ATTENTION GAME - MEMBER 3
   Logic + Scoring + Local Storage
   ========================================= */

const board = document.getElementById("attention-board");
const scoreDisplay = document.getElementById("score");
const timerDisplay = document.getElementById("timer");
const startBtn = document.getElementById("startBtn");


/* =========================================
   GAME VARIABLES
   ========================================= */

let score = 0;
let timeLeft = 30;
let timer;
let gameRunning = false;

let correctClicks = 0;
let wrongClicks = 0;


/* =========================================
   START GAME
   ========================================= */

function startGame() {

    score = 0;
    timeLeft = 30;

    correctClicks = 0;
    wrongClicks = 0;

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


/* =========================================
   CREATE SHAPES
   ========================================= */

function createShapes() {

    board.innerHTML = "";

    const normalShape = "🔵";
    const differentShape = "🟢";

    const differentPosition =
        Math.floor(Math.random() * 12);


    for (let i = 0; i < 12; i++) {

        const shape = document.createElement("button");

        shape.classList.add("attention-shape");


        /* Different shape */

        if (i === differentPosition) {

            shape.textContent = differentShape;

            shape.addEventListener("click", () => {

                if (!gameRunning) {
                    return;
                }

                score++;

                correctClicks++;

                scoreDisplay.textContent = score;

                createShapes();

            });

        }


        /* Normal shape */

        else {

            shape.textContent = normalShape;

            shape.addEventListener("click", () => {

                if (!gameRunning) {
                    return;
                }

                score--;

                wrongClicks++;

                scoreDisplay.textContent = score;

            });

        }


        board.appendChild(shape);

    }

}


/* =========================================
   CALCULATE ATTENTION SCORE
   ========================================= */

function calculateAttentionScore() {

    const totalClicks =
        correctClicks + wrongClicks;


    if (totalClicks === 0) {
        return 0;
    }


    /* Accuracy */

    const accuracy =
        (correctClicks / totalClicks) * 100;


    /* Activity */

    const activityScore =
        Math.min(correctClicks * 2, 100);


    /* Final score */

    let finalScore =
        Math.round(
            (accuracy + activityScore) / 2
        );


    /* Keep score between 0 and 100 */

    finalScore =
        Math.max(0, Math.min(100, finalScore));


    return finalScore;

}


/* =========================================
   END GAME
   ========================================= */

function endGame() {

    gameRunning = false;

    clearInterval(timer);


    /* Calculate final score */

    const attentionScore =
        calculateAttentionScore();


    /* Save best raw score */

    const oldBest =
        localStorage.getItem("attentionBest");


    if (
        oldBest === null ||
        score > Number(oldBest)
    ) {

        localStorage.setItem(
            "attentionBest",
            score
        );

    }


    /* Save best attention score */

    const oldBestScore =
        localStorage.getItem("attentionScore");


    if (
        oldBestScore === null ||
        attentionScore > Number(oldBestScore)
    ) {

        localStorage.setItem(
            "attentionScore",
            attentionScore
        );

    }


    /* Save latest result */

    localStorage.setItem(
        "attentionLastScore",
        attentionScore
    );

    localStorage.setItem(
        "attentionRawScore",
        score
    );

    localStorage.setItem(
        "attentionCorrect",
        correctClicks
    );

    localStorage.setItem(
        "attentionWrong",
        wrongClicks
    );


    /* Show result */

    board.innerHTML = `
        <div class="game-over">

            <h2>⏰ Time's Up!</h2>

            <p>
                Your final score is:
                <b>${score}</b>
            </p>

            <p>
                Attention Score:
                <b>${attentionScore}/100</b>
            </p>

            <p>
                Correct:
                <b>${correctClicks}</b>
            </p>

            <p>
                Wrong:
                <b>${wrongClicks}</b>
            </p>

        </div>
    `;


    startBtn.disabled = false;

    startBtn.textContent = "Play Again";

}


/* =========================================
   START BUTTON
   ========================================= */

startBtn.addEventListener(
    "click",
    startGame
);