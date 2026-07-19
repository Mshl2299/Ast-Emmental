// Loaded last. Utility and Animation
import { CONFIG } from "./config.js";
import { STATE } from "./game/state.js";
import { ctx, canvas, uiElementsHidable } from "./dom.js";
import { SKINS_MAP } from "./entities/entities.js";
import { gameOver } from "./setup.js";
import { UI_DEFAULTS } from "./ui.js";
import { AUDIO } from "./audio.js";
import { changeLevelUp } from "./levels.js";

function detectCircleCollision(player, obstacle, tolerance) {
    if (STATE.playerControl && !STATE.ship.immunity) {
        const dX = (player.x + player.radius) - (obstacle.x + obstacle.radius);
        const dY = (player.y + player.radius) - (obstacle.y + obstacle.radius);
        const distanceToPlayer = Math.sqrt(dX ** 2 + dY ** 2) - tolerance;
        // pythagoras: (player centerX - obstacle centerX)^2 + (player centerY - obstacle centerY)^2
        if (distanceToPlayer <= player.radius + obstacle.radius) {
            return true;
        }
        return false;
    }
}

export function detectBorderCollision(obj) {
    if (obj.x < 1 - obj.size) { // passing left border
        obj.x = canvas.width;
    }
    if (obj.x > canvas.width) { // passing right border
        obj.x = 1 - obj.size;
    }
    if (obj.y < 1 - obj.size) { // passing top border
        obj.y = canvas.height;
    }
    if (obj.y > canvas.height) { // passing bottom border
        obj.y = 1 - obj.size;
    }
}


// Move towards or away the player given tolerance, object and speed
// Positive speed is away, negative speed is towards
export function moveInRange(tolerance, obstacle, speed) {
    const dX = (STATE.ship.x + STATE.ship.radius) - (obstacle.x + obstacle.radius);
    const dY = (STATE.ship.y + STATE.ship.radius) - (obstacle.y + obstacle.radius);
    
    if (dX > tolerance / 4) { obstacle.x -=  speed; }
    else if (dX < -tolerance / 4) { obstacle.x +=  speed; }
    if (dY > tolerance / 4) { obstacle.y -=  speed; }
    else if (dY < -tolerance / 4) { obstacle.y +=  speed; }
}

function detectAllCollisions() {
    // enemies trigger gameover
    Object.values(STATE.asteroids.enemy).forEach(asteroid => {
        if (asteroid.exist && asteroid.moving && detectCircleCollision(STATE.ship, asteroid, -CONFIG.breathingRoom)) {
            gameOver();
        } else if (asteroid.exist && asteroid.moving && detectCircleCollision(STATE.asteroids.friend.greyAst, asteroid, 0)) {
            AUDIO.playSFX('pop');
            STATE.asteroids.friend.greyAst.generate();
        }
    })
    // friends give points
    if (STATE.asteroids.friend.greyAst.exist && detectCircleCollision(STATE.ship, STATE.asteroids.friend.greyAst, 0)) {
        STATE.score += STATE.scoreAmt; // TODO: refactor
        changeLevelUp();
        AUDIO.playSFX('pop');
        
        STATE.asteroids.friend.greyAst.generate();
        STATE.ship.setImmune(300);
    }
    if (STATE.asteroids.friend.cheese.exist && detectCircleCollision(STATE.ship, STATE.asteroids.friend.cheese, 0)) {
        STATE.score += STATE.scoreAmt * 5;
        changeLevelUp();
        AUDIO.playSFX('pop');
        STATE.asteroids.friend.cheese.exist = false;
        
        STATE.sDCount = 1;
        STATE.ship.speed = STATE.currentSpeed * (STATE.sDCount / 7);

        clearInterval(STATE.sDInterval);
        STATE.sDInterval = setInterval(sDCounter, 1000);
    }
}

// Slow down effect & cheese regeneration
function sDCounter() {
    if (STATE.sDCount > 2) {
        STATE.sDCount = 4;
        STATE.ship.speed = STATE.currentSpeed;
        clearInterval(STATE.sDInterval);
        STATE.asteroids.friend.cheese.generate();
        AUDIO.playSFX('ding');
    } else if (STATE.sDCount <= 5) {
        //update speed
        STATE.sDCount += 1;
        STATE.ship.speed = STATE.currentSpeed * (STATE.sDCount / 7);
    }
}

// slowDown effect
let cheeseCD = new Image();
cheeseCD.src = "assets/sprites/cheeseCooldown" + JSON.stringify(STATE.sDCount) + ".png";
let cheeseCDx = 900;
let cheeseCDy = 80;
export let cheeseTolerance = 80; //for cheese movement and range detection

function handleAsteroids() { // moving & drawing asteroids as score goes up, every frame
    Object.keys(STATE.asteroids).forEach(category => {
        Object.values(STATE.asteroids[category]).forEach(asteroid => {
            if (asteroid && asteroid.exist) {
                asteroid.update();
            }
        });
    });

    if (STATE.asteroids.friend.cheese.exist) {
        if (detectCircleCollision(STATE.ship, STATE.asteroids.friend.cheese, cheeseTolerance)) {
            moveInRange(cheeseTolerance, STATE.asteroids.friend.cheese, STATE.ship.speed * 0.2);
            STATE.asteroids.friend.cheese.detectBorderCollision();
        }
    }
    cheeseCD.src = "assets/sprites/cheeseCooldown" + JSON.stringify(STATE.sDCount) + ".png"; // TODO: sprite sheet
    ctx.drawImage(cheeseCD, cheeseCDx, cheeseCDy);

}

// animation
// draw functions

function drawScore() {
    // Scoreboard rectangle (Drawn after everything so that it's always on top)
    ctx.fillStyle = "#cf8619"; //an orange colour to contrast the blue
    ctx.fillRect(0, 0, canvas.width, UI_DEFAULTS.SCOREBOARD_HEIGHT);
    // Scoreboard border (so there is a nice blue border)
    ctx.beginPath();
    ctx.strokeStyle = "rgb(0, 1, 86)";
    ctx.lineWidth = "5"; //same values as the canvas width & border
    ctx.rect(0, 0, canvas.width, UI_DEFAULTS.SCOREBOARD_HEIGHT);
    ctx.stroke();

    // Score text ("SCORE=___")
    ctx.font = "bold 38px impact";
    ctx.fillStyle = "darkblue";
    ctx.textAlign = "center";
    ctx.fillText("SCORE = " + STATE.score, canvas.width / 2, UI_DEFAULTS.SCOREBOARD_HEIGHT - (UI_DEFAULTS.SCOREBOARD_HEIGHT / 5),);
}


let now, then, elapsed, fpsInterval, startTime;
function startAnimating(fps) {
    fpsInterval = 1000 / fps;
    then = Date.now();
    animate();
}
function animate() { //game update
    now = Date.now();
    elapsed = now - then;
    if (elapsed > fpsInterval) { //if proper time for framerate has passed
        then = now - (elapsed % fpsInterval); //reset timer
        ctx.clearRect(0, 0, canvas.width, canvas.height); //clear canvas to save memory

        // display explosion (called on gameOver()) or selected skin (allowing rotation)
        if (STATE.ship.exploding && uiElementsHidable.skinsMenuScreen.classList.contains('hidden')) { // required for UI to work when opening skin menu
            // TODO: make a built-in draw function for ship explosion
            STATE.ship.draw(STATE.ship.spriteWidth * STATE.ship.frameX, STATE.ship.spriteHeight * STATE.ship.frameY, STATE.ship.spriteWidth, STATE.ship.spriteHeight, STATE.ship.x - 96, STATE.ship.y - 96, STATE.ship.width, STATE.ship.height);
        } else {
            if (!uiElementsHidable.skinsMenuScreen.classList.contains('hidden')) { // allow rotation in Skins menu
                STATE.ship.speed = 0;
                STATE.ship.move();
            }
            STATE.ship.draw(STATE.ship.spriteWidth * STATE.ship.frameX, STATE.ship.spriteHeight * STATE.ship.frameY, STATE.ship.spriteWidth, STATE.ship.spriteHeight, STATE.ship.x, STATE.ship.y, STATE.ship.width, STATE.ship.height);
        }

        if (STATE.playerControl) {
            STATE.ship.move();
            handleAsteroids(); // grey, red, cheese & plasma asteroids
            detectAllCollisions();
        }

        drawScore();
        AUDIO.updateVolume(); // sound effects & music volume
    }

    requestAnimationFrame(animate);
}



startAnimating(60);


console.log("Load Complete: " + Math.round(performance.now()) + " ms");