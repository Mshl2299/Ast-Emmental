/*
Starting constants
Selectors & References to HTML w/ Screens & Buttons
Backgrounds
Retrieval
Sprites
Start game & Game over
*/
import { CONFIG } from "./config.js";
import { STATE, resetStartState } from "./game/state.js";
import { uiElements, uiElementsHidable } from "./dom.js";
import { updateScoresHTML, updateUnlocks } from "./ui/ui.js";
import { SPRITES_PATH, SKINS_MAP } from "./ui/skins.js";
import { AUDIO } from "./audio.js";
import { storeLocalScores } from "./persistence.js";

//-------------------------------SPRITES & OBJECTS----------------------------

// Adds a new score to STATE.scores and updates localStorage
function handleScore(newScore) {
    STATE.scores.push(newScore);
    uiElements.finalScoreDisplay.innerHTML = newScore;

    STATE.scores.sort((a, b) => b - a)
    while (STATE.scores.length > 10) {
        STATE.scores.pop();
    }

    updateScoresHTML();
    storeLocalScores();

    updateUnlocks();
}

//start & end functions
export function startGame() { //reset values
    if (!STATE.userInteracted) {
        return
    };
    resetStartState();
    
    //Reset ship
    STATE.ship.image.src = SPRITES_PATH + SKINS_MAP[STATE.ship.currentSkin].spriteSheet;
    STATE.ship.reset();

    if (CONFIG.superspeed) {
        STATE.currentSpeed = 20;
    }
    
    //hide ui
    uiElements.startButton.classList.add('hidden');
    uiElementsHidable.titleSplash.classList.add('hidden');
    uiElementsHidable.gameOverScreen.classList.add('hidden');
    //grey out buttons
    uiElements.howToButton.classList.add('greyed');
    uiElements.musicButton.classList.add('greyed');
    uiElements.skinsButton.classList.add('greyed');
    uiElements.resetDataButton.classList.add('greyed');
    //deviceButton.classList.add('greyed');

    AUDIO.switchToBkg();
    STATE.asteroids.friend.greyAst.generate();
    STATE.playerControl = true;
}


export function gameOver() {
    STATE.playerControl = false;

    if (!STATE.ship.exploding) {
        STATE.ship.startExplosion();
    }
    AUDIO.playSFX('explosion');

    AUDIO.switchToMenu();

    clearInterval(STATE.sDInterval);
    STATE.sDInterval = null;
    STATE.sDCount = 1;
    handleScore(STATE.score);
    //display UI
    uiElements.startButton.classList.remove('hidden');
    uiElementsHidable.gameOverScreen.classList.remove('hidden');
    //allow button presses
    uiElements.howToButton.classList.remove('greyed');
    uiElements.musicButton.classList.remove('greyed');
    uiElements.skinsButton.classList.remove('greyed');
    uiElements.resetDataButton.classList.remove('greyed');
    //deviceButton.classList.remove('greyed');
}
