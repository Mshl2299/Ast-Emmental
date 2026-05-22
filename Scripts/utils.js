// Small helpers & storage

// TODO: apply helpers
export function getJSON(key, fallback) {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
}
export function setJSON(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}


// SHIP SPRITE RETRIEVAL TODO: move to function and call once
let currentSkin = JSON.parse(window.localStorage.getItem('skinName'))
if (!currentSkin) {
    currentSkin = "Sprites/alphaSS1.png";
    window.localStorage.setItem('skinName', JSON.stringify(currentSkin));
}
if (JSON.parse(window.localStorage.getItem('unlocks'))) {
    unlocks = JSON.parse(window.localStorage.getItem('unlocks'));
    console.log("Unlocked Sprites retrieved.")
}
ship.image.src = currentSkin;


function changeBkgSkin(bkgSkinName) {
    uiElements.backgroundImg.src = bkgSkinName;
    window.localStorage.setItem('bkgImg', JSON.stringify(uiElements.backgroundImg.src));
    clickSound.play();
}

//slowDown effect
function sDCounter() {
    if (sDCount > 2) { //break out of loop FIRST
        sDCount = 4; // cheeseCD image
        ship.speed = currentSpeed; // speed
        clearInterval(sDInterval); // interval
        cheese.generate(); // cheese
        dingSound.play();
    } else if (sDCount <= 5) {
        //update speed
        sDCount += 1;
        ship.speed = currentSpeed * (sDCount / 7);
    }
}

//-------------------------------BACKGROUNDS-------------------------------
let bkgArray = [
    "blueSpace.jpg",
    "purpleSpace.jpg",
    "JamesWebb.jpg",
    "Orbit.jpg",
    "hatSpace.png",
    "galaxyAnim.gif",
    "purpleAnim.gif",
    "blueNebulaAnim.gif"
];
bkgArray.forEach(element => {
    window[element.slice(0, -4)] = "Backgrounds/" + element;
});

// Persistence
//-------------------------------RETRIEVAL-----------------------------------
//BKG RETRIEVAL
if (window.localStorage.getItem('bkgImg')) {
    uiElements.backgroundImg.src = JSON.parse(window.localStorage.getItem('bkgImg'));
} else {
    uiElements.backgroundImg.src = blueSpace;
    window.localStorage.setItem('bkgImg', JSON.stringify(uiElements.backgroundImg.src));
}


// Scores
function initLocalScores() {
    localScores = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
}

function updateScoresHTML() {
    for (i = 0; i < 10; i++) {
        if (!localScores[i]) {
            localScores[i] = 0;
        }
        if (document.querySelector('.score0')) {
            document.querySelector('.score' + i).innerHTML = localScores[i].toString().padStart(3, "0");
        }
    }
}

// Retreives local leaderboard from localScores, fill with 0's
function retrieveLocalScores() {
    if (window.localStorage.getItem('localScores')) {
        localScores = JSON.parse(window.localStorage.getItem('localScores'));

        updateScoresHTML();

        console.log("Highscores retrieved. " + window.localStorage.getItem('localScores'));
    }
}

// Adds a new score to localScores and updates localStorage
function handleScore(newScore) {
    localScores.push(newScore);
    uiElements.finalScoreDisplay.innerHTML = newScore;

    localScores.sort((a, b) => b - a)
    while (localScores.length > 10) {
        localScores.pop();
    }

    updateScoresHTML();
    window.localStorage.setItem('localScores', JSON.stringify(localScores));

    updateUnlocks();
}

document.querySelector("#score-form").addEventListener("submit", (e) => {
    e.preventDefault();
    uiElementsHidable.gameOverScreen.classList.add('hidden');
    // TODO: database connection
});