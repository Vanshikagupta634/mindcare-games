const reactionBox = document.getElementById("reaction-box");
const reactionText = document.getElementById("reaction-text");
const reactionResult = document.getElementById("reaction-result");
const startButton = document.getElementById("reaction-start");

let startTime = 0;
let waiting = false;
let gameRunning = false;
let timer = null;

startButton.addEventListener("click", startGame);

function startGame() {
    clearTimeout(timer);

    gameRunning = true;
    waiting = true;

    reactionBox.classList.remove("ready");
    reactionText.textContent = "WAIT...";
    reactionResult.textContent = "Wait for CLICK NOW!";

    startButton.disabled = true;

    const randomDelay = Math.floor(Math.random() * 3000) + 2000;

    timer = setTimeout(() => {
        waiting = false;

        reactionBox.classList.add("ready");
        reactionText.textContent = "CLICK NOW!";

        startTime = performance.now();
    }, randomDelay);
}

reactionBox.addEventListener("click", () => {

    if (!gameRunning) {
        return;
    }

    if (waiting) {
        clearTimeout(timer);

        reactionText.textContent = "TOO SOON!";
        reactionResult.textContent =
            "You clicked before the signal. Try again!";

        gameRunning = false;
        startButton.disabled = false;
        startButton.textContent = "Try Again";

        return;
    }

    const reactionTime =
        Math.round(performance.now() - startTime);

    reactionText.textContent = "GREAT! ⚡";

    reactionResult.textContent =
        "Your reaction time: " + reactionTime + " ms";

    reactionBox.classList.remove("ready");

    // Save the best reaction time
    const oldBest = localStorage.getItem("reactionBest");

    if (oldBest === null || reactionTime < Number(oldBest)) {
        localStorage.setItem("reactionBest", reactionTime);
    }

    gameRunning = false;
    startButton.disabled = false;
    startButton.textContent = "Play Again";
});