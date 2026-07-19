import { STATE, DEFAULT_STATE } from "./game/state.js";
import { AUDIO } from "./audio.js";

// Score thresholds
let phases = [5, 10, 15, 25, 50, 75, 100, 150, 250, 500, 1000];
// Maximum speeds
let speeds = [DEFAULT_STATE.speed, 4, 5, 6, 7, 8, 9, 10, 11, 12];

const GAME_PHASES_CONFIG = [
    {
        scoreThreshold: 5,
        speed: 4,
        action: () => STATE.asteroids.enemy.redAst1.spawn()
    },
    {
        scoreThreshold: 10,
        speed: 5,
        action: () => STATE.asteroids.enemy.redAst2.spawn()
    },
    {
        scoreThreshold: 15,
        speed: 6,
        action: () => STATE.asteroids.enemy.redAst3.spawn()
    },
    {
        scoreThreshold: 25,
        speed: 7,
        action: () => {
            runWhenNotSlowed(() => {
                STATE.asteroids.friend.cheese.spawn();
            });
        }
    },
    {
        scoreThreshold: 50,
        speed: 8,
        action: () => {
            runWhenNotSlowed(() => {
                STATE.asteroids.enemy.redAst4.spawn();
            });
        }
    },
    {
        scoreThreshold: 75,
        speed: 9,
        action: () => {
            if (!STATE.sDInterval && !STATE.unlocks.includes("snake")) {
                STATE.unlocks.push("snake");
                AUDIO.playSFX("lvlUp");
            }
        }
    },
    {
        scoreThreshold: 100,
        speed: 10,
        action: () => {
            if (!STATE.sDInterval && !STATE.unlocks.includes("inverted")) {
                STATE.unlocks.push("inverted");
                AUDIO.playSFX("lvlUp");
            }
        }
    },
    {
        scoreThreshold: 150,
        speed: 11,
        action: () => {
            if (!STATE.sDInterval && !STATE.unlocks.includes("asteroid")) {
                STATE.unlocks.push("asteroid");
                AUDIO.playSFX("lvlUp");
            }
        }
    },
    {
        scoreThreshold: 250,
        speed: 12,
        action: () => {
            if (!STATE.sDInterval) {
                AUDIO.playSFX("lvlUp");
            }
        }
    },
    {
        scoreThreshold: 500,
        speedMultiplier: 1.1,
        action: () => {
            if (!STATE.sDInterval) {
                updateStateAndShipSpeed(STATE.currentSpeed * 1.1);
                AUDIO.playSFX("lvlUp");
            }
        }
    }
];

// Waits for slowdown to end before running callback, using another interval
function runWhenNotSlowed(callback) {
    if (!STATE.sDInterval) {
        callback();
        return;
    }

    const wait = setInterval(() => {
        if (!STATE.sDInterval) {
            clearInterval(wait);
            callback();
        }
    }, 100);
}

function updateStateAndShipSpeed(speed) {
    STATE.currentSpeed = speed;
    STATE.ship.speed = STATE.currentSpeed;
}

// Takes in a GAME_PHASES_CONFIG phase object and updates level phase
function updateLevelUp(phase) {
    const { speed, action } = phase;

    if (speed !== undefined) {
        if (STATE.sDInterval) {
            STATE.currentSpeed = speed; // don't update speed immediately
        } else if (STATE.currentSpeed < speed) {
            updateStateAndShipSpeed(speed);
        }
    }

    if (typeof action === "function") {
        action();
    }
}

// Checks for next game phase threshold and update accordingly
// Calls most recent phase again
export function changeLevelUp() {
    for (const phase of GAME_PHASES_CONFIG) {
        if (STATE.score >= phase.scoreThreshold) {
            updateLevelUp(phase);
        } else {
            break;
        }
    }
}