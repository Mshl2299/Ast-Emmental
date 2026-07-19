// Constructs and exports entities for game use

import { Ship } from "./ship.js";
import { Asteroid, Cheese } from "./asteroid.js";
import { CONFIG } from "../config.js";
import { DEFAULT_STATE, STATE } from '../game/state.js';

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
const AST_DATA = {
    greyAst: {
        type: 'gray',
        sizeFct: 1,
        speed: null,
        spawnTime: 30,
    },
    cheese: {
        type: 'yellow',
        sizeFct: 0.5,
        speed: null,
        spawnTime: 30,
    },
    plasma: {
        type: 'blue',
        sizeFct: 0.3,
        speed: null,
        spawnTime: 30,
    },
    redAst1: {
        type: 'red',
        sizeFct: 1,
        speed: 2,
        dirX: -1,
        dirY: 1,
        spawnTime: 50,
        isEnemy: true,
    },
    redAst2: {
        type: 'red',
        sizeFct: 2,
        speed: 1.5,
        dirX: -1,
        dirY: -1,
        spawnTime: 50,
        isEnemy: true,
    },
    redAst3: {
        type: 'red',
        sizeFct: 3,
        speed: 1,
        dirX: 1,
        dirY: 1,
        spawnTime: 100,
        isEnemy: true,
    },
    redAst4: {
        type: 'red',
        sizeFct: 1.5,
        speed: 3,
        dirX: 1,
        dirY: -1,
        spawnTime: 100,
        isEnemy: true,
    }
}

const ship = new Ship({
    skinId: 'alpha',
    speed: DEFAULT_STATE.currentSpeed,
    showHitbox: CONFIG.showHitboxes,
    allSkinsUnlocked: CONFIG.unlockAll
});

var astObs = {
    greyAst: new Asteroid(AST_DATA.greyAst),
    cheese: new Cheese(AST_DATA.cheese),
    // plasma: new Asteroid(AST_DATA.plasma),
    redAst1: new Asteroid(AST_DATA.redAst1),
    redAst2: new Asteroid(AST_DATA.redAst2),
    redAst3: new Asteroid(AST_DATA.redAst3),
    redAst4: new Asteroid(AST_DATA.redAst4)
};

STATE.ship = ship;

Object.keys(AST_DATA).forEach(key => {
    if (AST_DATA[key].isEnemy) {
        STATE.asteroids.enemy[key] = astObs[key];
    } else {
        STATE.asteroids.friend[key] = astObs[key];
    }
});

// SHIP SPRITE RETRIEVAL
function retrieveShipSkin() {
    const stored = window.localStorage.getItem('shipSkin');
    if (!stored) window.localStorage.setItem('shipSkin', JSON.stringify(STATE.ship.currentSkin));;

    const shipSkin = JSON.parse(stored);
    STATE.ship.currentSkin = shipSkin;
    STATE.ship.image.src = SPRITES_PATH + SKINS_MAP[STATE.ship.currentSkin].spriteSheet;
}
retrieveShipSkin(); // TODO: move to main