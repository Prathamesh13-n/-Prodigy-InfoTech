
let startTime = 0;
let elapsedTime = 0;
let timerInterval = null;
let running = false;
let lapNumber = 1;

const display = document.getElementById("timeDisplay");
const lapList = document.getElementById("lapList");

function updateDisplay() {
    let currentTime = Date.now() - startTime + elapsedTime;

    let hours = Math.floor(currentTime / 3600000);
    let minutes = Math.floor((currentTime % 3600000) / 60000);
    let seconds = Math.floor((currentTime % 60000) / 1000);
    let milliseconds = currentTime % 1000;

    display.textContent =
        String(hours).padStart(2, '0') + ":" +
        String(minutes).padStart(2, '0') + ":" +
        String(seconds).padStart(2, '0') + ":" +
        String(milliseconds).padStart(3, '0');
}

function startTimer() {
    if (!running) {
        startTime = Date.now();
        timerInterval = setInterval(updateDisplay, 10);
        running = true;
    }
}

function pauseTimer() {
    if (running) {
        clearInterval(timerInterval);
        elapsedTime += Date.now() - startTime;
        running = false;
    }
}

function resetTimer() {
    clearInterval(timerInterval);
    running = false;
    startTime = 0;
    elapsedTime = 0;
    lapNumber = 1;
    display.textContent = "00:00:00:000";
    lapList.innerHTML = "";
}

function recordLap() {
    if (running) {
        let lapItem = document.createElement("li");
        lapItem.textContent = "Lap " + lapNumber + " - " + display.textContent;
        lapList.prepend(lapItem);
        lapNumber++;
    }
}

document.addEventListener("keydown", function (event) {
    if (event.code === "Space") {
        event.preventDefault();

        if (running) {
            pauseTimer();
        } else {
            startTimer();
        }
    }

    if (event.key.toLowerCase() === "r") {
        resetTimer();
    }

    if (event.key.toLowerCase() === "l") {
        recordLap();
    }
});