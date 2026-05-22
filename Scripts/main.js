// Main entry point, orchestrate modules & initialization
import { ui } from './dom.js';
import { AudioManager } from './audio.js';
import { Input } from './game/input.js';
import { Ship } from './entities/ship.js';
import { AsteroidManager } from './entities/entities.js';
import { Levels } from './game/levels.js';
import { Physics } from './game/physics.js';
import { AnimationLoop } from './game/anim.js';
import { config, DEFAULTS } from './config.js';
import { getJSON, setJSON } from './utils.js';

// import * as asteroid from "./entities/asteroid.js";
// import * as ship from "./entities/ship.js";
// import * as entities from "./entities/entities.js";
// import * as anim from "./game/anim.js";
// import * as input from "./game/input.js";
// import * as levels from "./game/levels.js";
// import * as physics from "./game/physics.js";
// import * as assets from "./assets.js";
// import * as audio from "./audio.js";
// import * as CONFIG from "./config.js";
// import * as dom from "./dom.js";
// import * as ui from "./ui.js";
// import * as utils from "./utils.js";

//start & end functions
function startGame() { //reset values
    score = 0;
    playerControl = true;

    //Reset ship
    ship.image.src = currentSkin;
    ship.resetPos();
    currentSpeed = 20;
    ship.speed = currentSpeed;
    ship.immunity = false;
    ship.exploded = false;

    //reset levelup changes
    drawAstArray.forEach(asteroid => {
        asteroid.exist = false;
    })
    hasUnlockedSnake = false; //!!!
    hasUnlockedInverted = false;
    hasUnlockedAsteroid = false;
    legendaryScore = false;

    //hide ui
    uiElements.startButton.classList.add('hidden');
    uiElementsHidable.titleSplash.classList.add('hidden');
    uiElementsHidable.gameOverScreen.classList.add('hidden');
    //grey out buttons
    uiElements.howToButton.classList.add('greyed');
    uiElements.musicButton.classList.add('greyed');
    uiElements.skinsButton.classList.add('greyed');
    //deviceButton.classList.add('greyed');
    //start the music
    menuMusic.pause();
    bkgMusic.play();
    //generate Asteroid
    greyAst.generate();
}

function gameOver() {
    playerControl = false;
    ship.exploded = true;
    explSound.play();

    bkgMusic.pause();
    menuMusic.play();

    clearInterval(sDInterval);
    sDCount = 1;
    handleScore(score);
    //display UI
    uiElements.startButton.classList.remove('hidden');
    uiElementsHidable.gameOverScreen.classList.remove('hidden');
    //allow button presses
    uiElements.howToButton.classList.remove('greyed');
    uiElements.musicButton.classList.remove('greyed');
    uiElements.skinsButton.classList.remove('greyed');
    //deviceButton.classList.remove('greyed');
}

initLocalScores();

startAnimating(60);

console.log("Load Complete: " + Math.round(performance.now()) + " ms");