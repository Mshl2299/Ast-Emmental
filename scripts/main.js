// Main entry point to the game
import { CONFIG } from "./config.js";
import { DEFAULT_STATE, STATE } from "./game/state.js";
import { ship } from "./entities/entities.js";
import { retrieveAll } from "./persistence.js";
import { startAnimating } from "./functions.js";

function main() {
    STATE.ship = ship;
    retrieveAll();

    // check with configuration TODO
    if (CONFIG.scoreOverride) { // TODO: move to main
        STATE.scoreAmt = CONFIG.scoreOverride;
    }
    
    // orchestrate scripts

    // setup functions & initialize UI done in ui.js
    
    // start animation
    startAnimating(60);
    console.log("Load Complete: " + Math.round(performance.now()) + " ms");
}

main();