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

let greyAst = new Asteroid(AST_DATA.greyAst);
let cheese = new Cheese(AST_DATA.cheese);
// let plasma = new Asteroid(AST_DATA.plasma);
let redAst1 = new Asteroid(AST_DATA.redAst1);
let redAst2 = new Asteroid(AST_DATA.redAst2);
let redAst3 = new Asteroid(AST_DATA.redAst3);
let redAst4 = new Asteroid(AST_DATA.redAst4);

STATE.ship = ship;
STATE.asteroids = {
    greyAst: greyAst,
    cheese: cheese,
    redAst1: redAst1,
    redAst2: redAst2,
    redAst3: redAst3,
    redAst4: redAst4
};

Object.keys(AST_DATA).forEach(key => {
    if (AST_DATA[key].isEnemy) {
        STATE.enemyAsteroids.push(STATE.asteroids[key]);
    }
});

// export let greyAst = new Asteroid("assets/sprites/Asteroid.png", AST_CONFIG.baseWidth, AST_CONFIG.baseHeight, 0, 0, 0, 30)

// let redAst = new Asteroid("assets/sprites/redAsteroid.png", AST_CONFIG.baseWidth, AST_CONFIG.baseHeight, 2, -1, 1, 50, true);
// let redAst2 = new Asteroid("assets/sprites/redAsteroid.png", AST_CONFIG.baseWidth * 2, AST_CONFIG.baseHeight * 2, 1.5, -1, -1, 50, true);
// let redAst3 = new Asteroid("assets/sprites/redAsteroid.png", AST_CONFIG.baseWidth * 3, AST_CONFIG.baseHeight * 3, 1, 1, 1, 100, true);
// let redAst4 = new Asteroid("assets/sprites/redAsteroid.png", AST_CONFIG.baseWidth * 1.5, AST_CONFIG.baseHeight * 1.5, 3, 1, -1, 100, true);
// Yellow Slowdown High Reward
// export let cheese = new Asteroid("assets/sprites/cheese.png", AST_CONFIG.baseWidth / 2, AST_CONFIG.baseHeight / 2, 0, 0, 0, 30);

// Blue Powerup !!! TODO
//let plasma = new Asteroid("assets/sprites/cheese.png", astWidth / 3, astHeight / 3, false);
// shield effect

// SHIP SPRITE RETRIEVAL
function retrieveShipSkin() {
    const stored = window.localStorage.getItem('shipSkin');
    if (!stored) window.localStorage.setItem('shipSkin', JSON.stringify(STATE.ship.currentSkin));;

    const shipSkin = JSON.parse(stored);
    STATE.ship.currentSkin = shipSkin;
    STATE.ship.image.src = SPRITES_PATH + SKINS_MAP[STATE.ship.currentSkin].spriteSheet;
}
retrieveShipSkin(); // TODO: move to main