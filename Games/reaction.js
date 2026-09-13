/* =========================================
   REACTION GAME - MEMBER 3
   Logic + Scoring + Local Storage
   ========================================= */

const reactionBox = document.getElementById("reaction-box");
const reactionText = document.getElementById("reaction-text");
const reactionResult = document.getElementById("reaction-result");
const startButton = document.getElementById("reaction-start");


/* =========================================
   GAME VARIABLES
   ========================================= */

let startTime = 0;
let waiting = false;
let gameRunning = false;
let timer = null;


/* =========================================
   START GAME
   ========================================= */

startButton.addEventListener("click", startGame);


function startGame() {

    clearTimeout(timer);

    gameRunning = true;
    waiting = true;
    startTime = 0;

    reactionBox.classList.remove("ready");

    reactionText.textContent = "WAIT...";

    reactionResult.textContent =
        "Wait for CLICK NOW!";

    startButton.disabled = true;


    /* Random delay: 2–5 seconds */

    const randomDelay =
        Math.floor(Math.random() * 3000) + 2000;


    timer = setTimeout(() => {

        waiting = false;

        reactionBox.classList.add("ready");

        reactionText.textContent =
            "CLICK NOW!";

        startTime = performance.now();

    }, randomDelay);

}


/* =========================================
   CALCULATE REACTION SCORE
   ========================================= */

function calculateReactionScore(reactionTime) {

    /*
       Faster reaction = higher score

       100 ms  → approximately 90–100
       500 ms  → 50
       1000 ms → 0
    */

    let score =
        Math.round(100 - (reactionTime / 10));


    /* Keep score between 0 and 100 */

    score =
        Math.max(0, Math.min(100, score));


    return score;

}


/* =========================================
   REACTION BOX CLICK
   ========================================= */

reactionBox.addEventListener("click", () => {

    if (!gameRunning) {
        return;
    }


    /* =====================================
       TOO EARLY
       ===================================== */

    if (waiting) {

        clearTimeout(timer);

        reactionText.textContent =
            "TOO SOON!";

        reactionResult.textContent =
            "You clicked before the signal. Try again!";

        gameRunning = false;

        startButton.disabled = false;

        startButton.textContent =
            "Try Again";

        return;
    }


    /* =====================================
       CALCULATE REACTION TIME
       ===================================== */

    const reactionTime =
        Math.round(
            performance.now() - startTime
        );


    /* Calculate /100 score */

    const reactionScore =
        calculateReactionScore(reactionTime);


    reactionText.textContent =
        "GREAT! ⚡";


    reactionResult.textContent =
        "Reaction Time: " +
        reactionTime +
        " ms | Score: " +
        reactionScore +
        "/100";


    reactionBox.classList.remove("ready");


    /* =====================================
       SAVE BEST REACTION TIME
       ===================================== */

    const oldBest =
        localStorage.getItem("reactionBest");


    if (
        oldBest === null ||
        reactionTime < Number(oldBest)
    ) {

        localStorage.setItem(
            "reactionBest",
            reactionTime
        );

    }


    /* =====================================
       SAVE BEST REACTION SCORE
       ===================================== */

    const oldBestScore =
        localStorage.getItem("reactionScore");


    if (
        oldBestScore === null ||
        reactionScore > Number(oldBestScore)
    ) {

        localStorage.setItem(
            "reactionScore",
            reactionScore
        );

    }


    /* =====================================
       SAVE LATEST RESULT
       ===================================== */

    localStorage.setItem(
        "reactionLastScore",
        reactionScore
    );

    localStorage.setItem(
        "reactionLastTime",
        reactionTime
    );


    /* =====================================
       END GAME
       ===================================== */

    gameRunning = false;

    startButton.disabled = false;

    startButton.textContent =
        "Play Again";

});