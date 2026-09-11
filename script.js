/* =========================================
   MEMORY GAME
   ========================================= */

const board = document.getElementById("memory-board");

const movesDisplay = document.getElementById("moves");
const pairsDisplay = document.getElementById("pairs");

const winMessage = document.getElementById("win-message");
const finalMoves = document.getElementById("final-moves");

const restartBtn = document.getElementById("restartBtn");


/* =========================================
   CARD SYMBOLS
   ========================================= */

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


/* =========================================
   GAME VARIABLES
   ========================================= */

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

    movesDisplay.textContent = moves;
    pairsDisplay.textContent = pairs;

    winMessage.style.display = "none";


    /* Shuffle cards */

    const shuffledCards = [...cardSymbols];

    shuffledCards.sort(() => Math.random() - 0.5);


    /* Create cards */

    shuffledCards.forEach((symbol) => {

        const card = document.createElement("button");

        card.classList.add("card");

        card.dataset.symbol = symbol;

        card.textContent = "?";

        card.addEventListener("click", () => {

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


    /* Show card */

    card.classList.add("flipped");

    card.textContent = card.dataset.symbol;


    /* First card */

    if (firstCard === null) {

        firstCard = card;

        return;
    }


    /* Second card */

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

        setTimeout(() => {

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
   CHECK WIN
   ========================================= */

function checkWin() {
    if (pairs === cardSymbols.length / 2) {

        finalMoves.textContent = moves;
        winMessage.style.display = "block";

        // Get previous best score
        const oldBest = localStorage.getItem("memoryBest");

        // Save the new best score
        if (oldBest === null || moves < Number(oldBest)) {
            localStorage.setItem("memoryBest", moves);
        }
    }
}


/* =========================================
   RESTART GAME
   ========================================= */

restartBtn.addEventListener("click", startGame);


/* =========================================
   START AUTOMATICALLY
   ========================================= */

startGame();