// Handles dynamic rendering of UI elements: leaderboard/scores, music & skin selection, custom warnings
// Main point of connection between ui functions and main
// Builds on top of existing node structure from dom.js
// Eventual backend connection?
import { CONFIG } from "../config.js";
import { STATE, DEFAULT_STATE } from "../game/state.js";
import { uiElements, uiElementsHidable } from "../dom.js";
import { startGame, gameOver } from "../setup.js";
import { AUDIO } from "../audio.js";
import { initMusicScreen } from "./music.js";
import { initSkinScreen, SKINS_MAP, SPRITES_PATH } from "./skins.js";
import { clearData, storeUnlocks } from "../persistence.js";
import { kebabToCamel } from "../utils.js";

export const UI_DEFAULTS = {
    SCORE_WIDTH: 280,
    BUTTON_WIDTH: 20,
    SCORE_WIDTH_ADJUST: 5,

    SCOREBOARD_HEIGHT: 50,
    BORDER_PADDING: 30, // distance from borders for Grey & Red Asteroid generation
}

//Highscores menu
let scoreDisplayOpen = false; //to move the score button & display together

// AUDIO
function openAudioMenu() {
    uiElementsHidable.audioMenu.classList.toggle('hidden');
    AUDIO.playSFX('click');
}
function toggleSFX() {
    if (uiElements.sfxRange.value > 0) {
        uiElements.sfxRange.value = 0;
    }
    else if (uiElements.sfxRange.value == 0) {
        uiElements.sfxRange.value = 100;
        AUDIO.playSFX('click');
    }
}
function toggleMusic() {
    if (uiElements.musicRange.value > 0) {
        uiElements.musicRange.value = 0;
    }
    else if (uiElements.musicRange.value == 0) {
        uiElements.musicRange.value = 100;
        AUDIO.playSFX('click');
    }
}

function closeAll() {
    gameOver();
    //closes all UI
    for (let key in uiElementsHidable) {
        uiElementsHidable[key].classList.add('hidden');
    }

    AUDIO.randomizeMenuMusic();
}

// TODO: update ui.js to hide correct (not sure if this is old??)


//-------------------------HIGHSCORES----------------------------------
//SCORE RETRIEVAL TODO: refactor, global leaderboard
const GLOBAL_LB = [
    { name: "PLAYER1", score: 0 },
    { name: "PLAYER2", score: 0 },
    { name: "PLAYER3", score: 0 },
    { name: "PLAYER4", score: 0 },
    { name: "PLAYER5", score: 0 }
]

export function updateScoresHTML() {
    for (let i = 0; i < 10; i++) {
        if (!STATE.scores[i]) {
            STATE.scores[i] = 0;
        }
        if (document.querySelector('.score0')) {
            document.querySelector('.score' + i).innerHTML = STATE.scores[i].toString().padStart(3, "0");
        }
    }
}

function renderLocalLeaderboard() {
    const container = document.querySelector(".local-scores");
    container.innerHTML = "";

    STATE.scores
        .sort((a, b) => b - a)
        .forEach((player, index) => {
            const row = document.createElement("div");
            row.className = "player-card";

            row.innerHTML = `
                <div class="player-rank">${index + 1}</div>
                <div class="player-score score${index}">${player.toString().padStart(3, "0")}</div>
            `;

            container.appendChild(row);
        });
}

function renderGlobalLeaderboard() {
    const container = document.querySelector(".global-scores");
    container.innerHTML = "";

    const header = document.createElement("div");
    header.className = "player-card header-row";
    header.innerHTML = `
        <div class="player-rank">#</div>
        <div class="player-score">SCORE</div>
        <div class="player-name">NAME</div>
    `;
    container.appendChild(header);

    GLOBAL_LB
        .sort((a, b) => b.score - a.score)
        .forEach((player, index) => {
            const row = document.createElement("div");
            row.className = "player-card";

            row.innerHTML = `
                <div class="player-rank">${index + 1}</div>
                <div class="player-score">${player.score.toString().padStart(3, "0")}</div>
                <div class="player-name">${player.name}</div>
            `;

            container.appendChild(row);
        });
}

function toggleScores() {
    if (scoreDisplayOpen) {
        hideScoreDisplay();
    }
    else if (!scoreDisplayOpen) {
        showScoreDisplay();
    }
}
function hideScoreDisplay() {
    uiElements.scoreAnchor.style.left = `${canvas.width - UI_DEFAULTS.BUTTON_WIDTH - UI_DEFAULTS.SCORE_WIDTH_ADJUST}px`;
    scoreDisplayOpen = false;
    AUDIO.playSFX('click');
}
function showScoreDisplay() {
    const SCORE_X = canvas.width - UI_DEFAULTS.SCORE_WIDTH - UI_DEFAULTS.SCORE_WIDTH_ADJUST;

    uiElements.scoreAnchor.style.left = `${SCORE_X}px`;

    scoreDisplayOpen = true;
    AUDIO.playSFX('click');
}

//-------------------------OTHER-------------------------------
//'end the current game first!' Flashing text
let eGTCount = 0;
let eGTInterval;
// TODO: refactor into a custom Display Alert
function showEndGameFirstText() {
    clearInterval(eGTInterval);
    eGTCount = 0;
    eGTFlash();
    eGTInterval = setInterval(eGTFlash, 600);
}
function eGTFlash() {
    if (eGTCount > 3) {
        clearInterval(eGTInterval);
        uiElementsHidable.endGameFirstText.classList.add('hidden');
    }
    else if (eGTCount % 2 == 0) {
        uiElementsHidable.endGameFirstText.classList.remove('hidden');
        eGTCount += 1;
    }
    else if (eGTCount % 2 != 0) {
        uiElementsHidable.endGameFirstText.classList.add('hidden');
        eGTCount += 1;
    }
}

// ------------------------
function openMenu(button, screen) {
    if (button.classList.contains('greyed')) {
        showEndGameFirstText();
    }
    else if (!button.classList.contains('greyed')) {
        if (screen.classList.contains('skins-menu-screen') && screen.classList.contains('hidden')) {
            STATE.ship.displayOnSide();
            STATE.ship.exploding = false;

            updateUnlocks();
        } else if (!screen.classList.contains('hidden')) {
            STATE.ship.reset();
        }
        screen.classList.toggle('hidden');
        AUDIO.playSFX('click');
    }
}

// Update skins to be Unlocked or Greyed
// TODO: backing default unlocks
export function updateSkinUnlocks() {
    storeUnlocks(DEFAULT_STATE.unlocks);

    Object.keys(SKINS_MAP).forEach((id) => {
        const obj = SKINS_MAP[id];
        if (!obj.lockedImage) return;

        const elem = uiElements[kebabToCamel(obj.cssClass)];
        if (STATE.unlocks.includes(id)) {
            elem.classList.remove("greyed");
            elem.src = SPRITES_PATH + SKINS_MAP[id].unlockedImage;
            storeUnlocks(STATE.unlocks);
        } else {
            elem.classList.add("greyed");
            elem.src = SPRITES_PATH + SKINS_MAP[id].lockedImage;
        }
    });
}

export function updateUnlocks() {
    let highestScore = STATE.scores[0];
    if (CONFIG.unlockAll) {
        highestScore = 1000000;
    } else if (!CONFIG.unlockAll) {
        STATE.unlocks = DEFAULT_STATE.unlocks;
    }

    if (!STATE.unlocks.includes("snake") && highestScore >= 100) {
        STATE.unlocks.push("snake");
    }
    if (!STATE.unlocks.includes("inverted") && highestScore >= 150) {
        STATE.unlocks.push("inverted");
    }
    if (!STATE.unlocks.includes("asteroid") && highestScore >= 250) {
        STATE.unlocks.push("asteroid");
    }
    updateSkinUnlocks();
}

function onFirstInteraction() {
    if (!AUDIO.triedPlayingMenu) {
        AUDIO.menuMusic.play().catch(() => console.log("error playing menu music"));
        AUDIO.triedPlayingMenu = true;
    }
    STATE.userInteracted = true;

    document.removeEventListener('click', onFirstInteraction);
}

document.querySelector("#score-form").addEventListener("submit", (e) => {
    e.preventDefault();
    uiElementsHidable.gameOverScreen.classList.add('hidden');
    AUDIO.playSFX('click');
    // TODO: database connection
});



// All initialization & Event Listeners
initMusicScreen();
initSkinScreen();

renderLocalLeaderboard();
renderGlobalLeaderboard();

uiElements.startButton.addEventListener('click', startGame);

uiElements.sfxToggleButton.addEventListener('click', toggleSFX);
uiElements.musicToggleButton.addEventListener('click', toggleMusic);

uiElements.resetDataButton.addEventListener('click', () => {
    if (uiElements.resetDataButton.classList.contains('greyed')) {
        showEndGameFirstText();
    } else if (!uiElements.resetDataButton.classList.contains('greyed')) {
        clearData();
    }
});

uiElements.howToButton.addEventListener('click', () => openMenu(uiElements.howToButton, uiElementsHidable.howToScreen));
uiElements.closeButton.addEventListener('click', closeAll);

uiElements.musicButton.addEventListener('click', () => openMenu(uiElements.musicButton, uiElementsHidable.musicMenuScreen));
uiElements.skinsButton.addEventListener('click', () => openMenu(uiElements.skinsButton, uiElementsHidable.skinsMenuScreen));
uiElements.audioButton.addEventListener('click', openAudioMenu);
//deviceButton.addEventListener('click', changeDevice);

uiElements.scoreAnchor.addEventListener('click', toggleScores);

document.addEventListener('click', onFirstInteraction);