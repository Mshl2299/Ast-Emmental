// Runtime state variables & State retrieval
// import { STATE } from "./game/state.js";

// TODO: bake default skin unlocks using SKINS_MAP so you don't need to store values in DEFAULT_STATE
// Values that override on data reset
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
    currentSpeed: 3, // speed variable that will change TODO: base speed

    userInteracted: false, // audio autoplay
    playerControl: false, // player control & menu control

    unlocks: [], // to be overriden
    scores: [], // to be overriden

    // instances
    ship: null,
    asteroids: { friend: {}, enemy: {} },

    // timers / intervals / cooldowns
    sDCount: 1,
    sDInterval: null, // slowdown cooldown interval id

    // misc runtime flags
    playerImmune: false, // TODO: use? remove?
};

// Resets the state to be ready for new game start
// Ship image resets done separately
export function resetStartState() {
    STATE.score = 0;

    //reset levelup changes
    Object.keys(STATE.asteroids).forEach(category => {
        Object.values(STATE.asteroids[category]).forEach(asteroid => {
            if (asteroid) {
                asteroid.exist = false;
            }
        });
    });

    STATE.currentSpeed = DEFAULT_STATE.currentSpeed;
    STATE.ship.speed = STATE.currentSpeed;
    STATE.ship.immunity = false;
    STATE.ship.exploding = false;
}