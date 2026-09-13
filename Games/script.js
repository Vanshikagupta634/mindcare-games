/* =========================================
   MEMORY GAME - MEMBER 3
   Logic + Scoring + Local Storage
   ========================================= */

const board = document.getElementById("memory-board");
const movesDisplay = document.getElementById("moves");
const pairsDisplay = document.getElementById("pairs");
const winMessage = document.getElementById("win-message");
const finalMoves = document.getElementById("final-moves");
const restartBtn = document.getElementById("restartBtn");


const cardSymbols = [
    "🍎", "🍎",
    "🍌", "🍌",
    "🍇", "🍇",
    "🍊", "🍊",
    "🍉", "🍉",
    "🍓", "🍓",
    "🥝", "🥝",
    "🍍", "🍍"
];


let firstCard = null;
let secondCard = null;
let lockBoard = false;

let moves = 0;
let pairs = 0;


/* =========================================
   START GAME
   ========================================= */

function startGame() {

    board.innerHTML = "";

    firstCard = null;
    secondCard = null;

    lockBoard = false;

    moves = 0;
    pairs = 0;

    movesDisplay.textContent = "0";
    pairsDisplay.textContent = "0";

    winMessage.style.display = "none";


    const shuffledCards = [...cardSymbols];

    shuffledCards.sort(() => Math.random() - 0.5);


    shuffledCards.forEach(function(symbol) {

        const card = document.createElement("button");

        card.classList.add("card");

        card.dataset.symbol = symbol;

        card.textContent = "?";

        card.addEventListener("click", function() {

            flipCard(card);

        });

        board.appendChild(card);

    });

}


/* =========================================
   FLIP CARD
   ========================================= */

function flipCard(card) {

    if (lockBoard) {
        return;
    }

    if (card === firstCard) {
        return;
    }

    if (card.classList.contains("matched")) {
        return;
    }


    card.classList.add("flipped");

    card.textContent = card.dataset.symbol;


    if (firstCard === null) {

        firstCard = card;

        return;
    }


    secondCard = card;

    moves++;

    movesDisplay.textContent = moves;

    checkMatch();

}


/* =========================================
   CHECK MATCH
   ========================================= */

function checkMatch() {

    const isMatch =
        firstCard.dataset.symbol === secondCard.dataset.symbol;


    if (isMatch) {

        firstCard.classList.add("matched");

        secondCard.classList.add("matched");

        pairs++;

        pairsDisplay.textContent = pairs;

        resetTurn();

        checkWin();

    } else {

        lockBoard = true;

        setTimeout(function() {

            firstCard.classList.remove("flipped");

            secondCard.classList.remove("flipped");

            firstCard.textContent = "?";

            secondCard.textContent = "?";

            resetTurn();

        }, 900);

    }

}


/* =========================================
   RESET TURN
   ========================================= */

function resetTurn() {

    firstCard = null;
    secondCard = null;
    lockBoard = false;

}


/* =========================================
   CALCULATE SCORE
   ========================================= */

function calculateMemoryScore() {

    const perfectMoves = cardSymbols.length / 2;

    let score = Math.round(
        (perfectMoves / moves) * 100
    );

    if (score > 100) {
        score = 100;
    }

    if (score < 0) {
        score = 0;
    }

    return score;

}


/* =========================================
   CHECK WIN
   ========================================= */

function checkWin() {

    if (pairs !== cardSymbols.length / 2) {
        return;
    }


    const memoryScore = calculateMemoryScore();


    finalMoves.textContent = moves;

    winMessage.style.display = "block";


    /* Remove old score message */

    const oldScore = document.getElementById("memory-score-text");

    if (oldScore) {
        oldScore.remove();
    }


    /* Create score message */

    const scoreText = document.createElement("p");

    scoreText.id = "memory-score-text";

    scoreText.innerHTML =
        "Memory Score: <b>" + memoryScore + "/100</b>";


    winMessage.appendChild(scoreText);


    /* Save best score */

    const oldBestScore =
        localStorage.getItem("memoryScore");


    if (
        oldBestScore === null ||
        memoryScore > Number(oldBestScore)
    ) {

        localStorage.setItem(
            "memoryScore",
            memoryScore
        );

    }


    /* Save best moves */

    const oldBestMoves =
        localStorage.getItem("memoryBest");


    if (
        oldBestMoves === null ||
        moves < Number(oldBestMoves)
    ) {

        localStorage.setItem(
            "memoryBest",
            moves
        );

    }


    /* Save latest result */

    localStorage.setItem(
        "memoryLastScore",
        memoryScore
    );
    sendScoreToPython("Memory", memoryScore);

    localStorage.setItem(
        "memoryLastMoves",
        moves
    );

}


/* =========================================
   RESTART BUTTON
   ========================================= */

restartBtn.addEventListener(
    "click",
    startGame
);


/* =========================================
   START GAME
   ========================================= */
// ---------------- SEND SCORE TO PYTHON ----------------

function sendScoreToPython(game, score) {

    fetch("http://127.0.0.1:8765/save-score", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            game: game,
            score: score
        })

    })
    .then(response => {
        console.log("Score sent to Python:", game, score);
    })
    .catch(error => {
        console.log("Python score server not available:", error);
    });
}