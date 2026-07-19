// Constructs and exports entities for game use

import { Ship } from "./ship.js";
import { Asteroid, Cheese } from "./asteroid.js";
import { CONFIG } from "../config.js";
import { DEFAULT_STATE, STATE } from '../game/state.js';

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

export const ship = new Ship({
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

Object.keys(AST_DATA).forEach(key => {
    if (AST_DATA[key].isEnemy) {
        STATE.asteroids.enemy[key] = astObs[key];
    } else {
        STATE.asteroids.friend[key] = astObs[key];
    }
});
