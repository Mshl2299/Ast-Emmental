import { STATE } from "./game/state.js";
import { ship, cheese, ASTEROIDS } from "./setup.js";
import { AUDIO } from "./audio.js";

//Changes to ship & asteroids as score increases
let phases = [5, 10, 15, 25, 50, 75, 100, 150, 250, 500, 1000];
let speeds = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

export function changeLevelUp() {
    if (STATE.score < phases[0]) { // <5
        if (STATE.currentSpeed < speeds[0]) { STATE.currentSpeed = speeds[0]; ship.speed = STATE.currentSpeed; }
    }
    if ((phases[0] <= STATE.score)) { // 5+
        if (STATE.currentSpeed < speeds[1]) { STATE.currentSpeed = speeds[1]; ship.speed = STATE.currentSpeed; }
        ASTEROIDS.redAst.spawn();
    }
    if ((phases[1] <= STATE.score)) { // 10+
        if (STATE.currentSpeed < speeds[2]) { STATE.currentSpeed = speeds[2]; ship.speed = STATE.currentSpeed; }
        ASTEROIDS.redAst2.spawn();
    }
    if ((phases[2] <= STATE.score)) { //15+
        if (STATE.currentSpeed < speeds[3]) { STATE.currentSpeed = speeds[3]; ship.speed = STATE.currentSpeed; }
        ASTEROIDS.redAst3.spawn();
    }
    if ((phases[3] <= STATE.score)) { //25+
        if (!STATE.sDInterval) {
            if (STATE.currentSpeed < speeds[4]) { STATE.currentSpeed = speeds[4]; ship.speed = STATE.currentSpeed; }
            cheese.spawn();
        }
    }
    if ((phases[4] <= STATE.score)) { // 50+
        if (!STATE.sDInterval && STATE.currentSpeed < speeds[5]) { STATE.currentSpeed = speeds[5]; ship.speed = STATE.currentSpeed; }
        ASTEROIDS.redAst4.spawn();
    }
    if ((phases[5] <= STATE.score)) { // 75+
        if (!STATE.sDInterval && STATE.currentSpeed < speeds[6]) { STATE.currentSpeed = speeds[6]; ship.speed = STATE.currentSpeed; }
        if (!hasUnlockedSnake) {
            unlocks = ["snake"];
            hasUnlockedSnake = true;
            AUDIO.playSFX('lvlUp');
        }
    }
    if ((phases[6] <= STATE.score)) { // 100+
        if (!STATE.sDInterval && STATE.currentSpeed < speeds[7]) { STATE.currentSpeed = speeds[7]; ship.speed = STATE.currentSpeed; }
        if (!hasUnlockedInverted) {
            unlocks = ["snake", "inverted"];
            hasUnlockedInverted = true;
            AUDIO.playSFX('lvlUp');
        }
    }
    if ((phases[7] <= STATE.score)) { // 150+
        if (!STATE.sDInterval && STATE.currentSpeed < speeds[8]) { STATE.currentSpeed = speeds[8]; ship.speed = STATE.currentSpeed; }
        if (!hasUnlockedAsteroid) {
            unlocks = ["snake", "inverted", "asteroid"];
            hasUnlockedAsteroid = true;
            AUDIO.playSFX('lvlUp');
        }
    }
    if ((phases[8] <= STATE.score)) { // 250+
        if (!STATE.sDInterval && STATE.currentSpeed < speeds[9]) { STATE.currentSpeed = speeds[9]; ship.speed = STATE.currentSpeed; }
        if (!legendaryScore) {
            legendaryScore = true;
            AUDIO.playSFX('lvlUp');
        }
    }
    if (phases[9] <= STATE.score) { // 500+
        if (!STATE.sDInterval) {
            STATE.currentSpeed *= 1.1;
            ship.speed = STATE.currentSpeed;
        } //every collection onwards will multiply speed by 110%
        AUDIO.playSFX('lvlUp');
        console.log("game breaking score");
    }
}

export let cheeseTolerance = 80; //for cheese movement and range detection
function moveToAway(player, obstacle, speedFactor) {
    // positive speedFactor is away, negative speedFactor is towards
    dX = (player.x + player.radius) - (obstacle.x + obstacle.radius);
    dY = (player.y + player.radius) - (obstacle.y + obstacle.radius);
    //ship is on right
    if (dX > cheeseTolerance / 4) { obstacle.x -= player.speed * speedFactor; }
    //ship is on left
    else if (dX < -cheeseTolerance / 4) { obstacle.x += player.speed * speedFactor; }
    //ship is below
    if (dY > cheeseTolerance / 4) { obstacle.y -= player.speed * speedFactor; }
    //ship is above
    else if (dY < -cheeseTolerance / 4) { obstacle.y += player.speed * speedFactor; }
    detectCheeseBorderCol();
}

