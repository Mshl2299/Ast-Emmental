// Runtime state variables & State retrieval
// import { STATE } from "./game/state.js";

// TODO: bake default skins using SKINS_MAP so you don't need to store values in DEFAULT_STATE
export const DEFAULT_STATE = {
    score: 0,
    scoreAmt: 1,
    level: 0,
    currentSpeed: 3,
    unlocks: ['alpha', 'beta', 'ufo'],
    scores: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
}

export const STATE = {
    score: 0,
    scoreAmt: 1,
    level: 0,
    currentSpeed: 3, // speed variable that will change TODO: base speed

    userInteracted: false, // audio autoplay
    playerControl: false, // player control & menu control

    unlocks: [], // to be overriden
    scores: [], // to be overriden

    // instances
    ship: null, // TODO: set with entities/ship.js
    drawAstArray: [],
    enemyAstArray: [],

    // timers / intervals / cooldowns
    sDCount: 1,
    sDInterval: null,      // slowdown cooldown interval id

    // misc runtime flags
    playerImmune: false,
};

// TODO: call in main
export function retrieveUnlocks() {
    const stored = window.localStorage.getItem('unlocks');
    if (!stored) return;
    STATE.unlocks = JSON.parse(stored);
    console.log("Unlocked Sprites retrieved.")
}