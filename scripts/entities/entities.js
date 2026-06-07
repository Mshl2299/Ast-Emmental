// Constructs and exports entities for game use

import { Ship } from "./ship.js";
import { CONFIG } from "../config.js";
import { DEFAULT_STATE } from '../game/state.js';

export const SPRITES_PATH = "assets/sprites/";
export const SKINS_MAP = {
    alpha: {
        unlockedImage: "shipAlpha.png",
        lockedImage: null,
        spriteSheet: "alphaSS1.png",
        isLocked: false,
        cssClass: "alpha-skin"
    },

    beta: {
        unlockedImage: "shipBeta.png",
        lockedImage: null,
        spriteSheet: "betaSS1.png",
        isLocked: false,
        cssClass: "beta-skin"
    },

    ufo: {
        unlockedImage: "shipUFO.png",
        lockedImage: null,
        spriteSheet: "ufoSS1.png",
        isLocked: false,
        cssClass: "ufo-skin"
    },

    snake: {
        unlockedImage: "shipSnake.png",
        lockedImage: "shipSnakeLocked.png",
        spriteSheet: "snakeSS1.png",
        isLocked: true,
        cssClass: "snake-skin"
    },

    inverted: {
        unlockedImage: "shipAlphaInverted.png",
        lockedImage: "shipAlphaInvertedLocked.png",
        spriteSheet: "alphaInvertedSS1.png",
        isLocked: true,
        cssClass: "inverted-skin"
    },

    asteroid: {
        unlockedImage: "Asteroid.png",
        lockedImage: "AsteroidLocked.png",
        spriteSheet: "asteroidSS1.png",
        isLocked: true,
        cssClass: "asteroid-skin"
    }
};

export const ship = new Ship({
    skinId: 'alpha',
    speed: DEFAULT_STATE.currentSpeed,
    showHitbox: CONFIG.showHitboxes,
    allSkinsUnlocked: CONFIG.unlockAll
});

// SHIP SPRITE RETRIEVAL
function retrieveShipSkin() {
    const stored = window.localStorage.getItem('shipSkin');
    if (!stored) window.localStorage.setItem('shipSkin', JSON.stringify(ship.currentSkin));;
    
    const shipSkin = JSON.parse(stored);
    ship.currentSkin = shipSkin;
    ship.image.src = SPRITES_PATH + SKINS_MAP[ship.currentSkin].spriteSheet;
}
retrieveShipSkin(); // TODO: move to main




export default { ship }