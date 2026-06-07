import { STATE, DEFAULT_STATE } from "./game/state.js";
import { AUDIO } from "./audio.js";

//Changes to ship & asteroids as score increases
let phases = [5, 10, 15, 25, 50, 75, 100, 150, 250, 500, 1000];
let speeds = [DEFAULT_STATE.speed, 4, 5, 6, 7, 8, 9, 10, 11, 12];

const GAME_PHASES_CONFIG = [
    { scoreThresh: phases[0], newSpeed: speeds[1], action: () => STATE.asteroids.redAst1.spawn() },   // 5+
    { scoreThresh: phases[1], newSpeed: speeds[2], action: () => STATE.asteroids.redAst2.spawn() },  // 10+
    { scoreThresh: phases[2], newSpeed: speeds[3], action: () => STATE.asteroids.redAst3.spawn() },  // 15+
    { // 25+
        scoreThresh: phases[3],
        newSpeed: speeds[4],
        action: () => { if (!STATE.sDInterval) STATE.asteroids.cheese.spawn(); }
    },
    { // 50+
        scoreThresh: phases[4],
        newSpeed: speeds[5],
        action: () => { if (!STATE.sDInterval) STATE.asteroids.redAst4.spawn(); }
    },
    { // 75+
        scoreThresh: phases[5],
        newSpeed: speeds[6],
        action: () => {
            if (!STATE.sDInterval && !STATE.unlocks.includes('snake')) {
                STATE.unlocks.push('snake');
                AUDIO.playSFX('lvlUp');
            }
        }
    },
    { // 100+
        scoreThresh: phases[6],
        newSpeed: speeds[7],
        action: () => {
            if (!STATE.sDInterval && !STATE.unlocks.includes('inverted')) {
                STATE.unlocks.push('inverted');
                AUDIO.playSFX('lvlUp');
            }
        }
    },
    { // 150+
        scoreThresh: phases[7],
        newSpeed: speeds[8],
        action: () => {
            if (!STATE.sDInterval && !STATE.unlocks.includes('asteroid')) {
                STATE.unlocks.push('asteroid');
                AUDIO.playSFX('lvlUp');
            }
        }
    },
    { // 250+
        scoreThresh: phases[8],
        newSpeed: speeds[9],
        action: () => {
            if (!STATE.sDInterval) {
                AUDIO.playSFX('lvlUp');
            }
        }
    },
    { // 500+
        scoreThresh: phases[9],
        // every collection onwards will multiply speed by 110%
        action: () => {
            if (!STATE.sDInterval) {
                updateStateAndShipSpeed(STATE.currentSpeed * 1.1);
                AUDIO.playSFX('lvlUp');
            }
            console.log('game breaking score');
        }
    }
];

function updateStateAndShipSpeed(speed) {
    STATE.currentSpeed = speed;
    STATE.ship.speed = STATE.currentSpeed;
}

// Advances game phase based on STATE.score
export function changeLevelUp() {
    for (let i = 0; i < GAME_PHASES_CONFIG.length; i++) {
        const config = GAME_PHASES_CONFIG[i];

        if (STATE.score >= config.scoreThresh) {
            const newSpeed = config.newSpeed;
            if (STATE.sDInterval) {
                STATE.currentSpeed = newSpeed;
            } else {
                if (newSpeed && (STATE.currentSpeed < newSpeed)) {
                    updateStateAndShipSpeed(newSpeed);
                }
            }
            if (typeof config.action === 'function') config.action();
        }
    }
}