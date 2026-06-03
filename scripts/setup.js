/*
Starting constants
Selectors & References to HTML w/ Screens & Buttons
Backgrounds
Retrieval
Sprites
Start game & Game over
*/
import { CONFIG } from "./config.js";
import { STATE, DEFAULT_STATE } from "./game/state.js";
import { keys } from "./game/input.js";
import { ctx, uiElements, uiElementsHidable } from "./dom.js";
import { UI_DEFAULTS, SPRITES_PATH, SKINS_MAP, updateScoresHTML, updateUnlocks } from "./ui.js";
import { AUDIO } from "./audio.js";
import { detectBorderCollision } from "./functions.js";

function drawCircle(color, obj) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(obj.x + obj.radius, obj.y + obj.radius, obj.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
}
//-------------------------------SPRITES & OBJECTS----------------------------
// SHIP

export let ship = {
    image: new Image(),
    width: 64,
    height: 64,
    x: canvas.width / 2 - 33,
    y: canvas.height / 2 - 33,
    frameX: 0,
    frameY: 0,
    spriteWidth: 67,
    spriteHeight: 66,
    radius: 64 / 2,
    speed: null,
    direction: null,
    immunity: false,
    exploding: false,
    explosionInterval: null,
    explosionFrame: 1,
    currentSkin: null, // stores a skinId
    draw(sX, sY, sW, sH, dX, dY, dW, dH) {
        if (CONFIG.showDebug) { drawCircle("rgb(255,255,255,0.5)", this); };
        ctx.drawImage(this.image, sX, sY, sW, sH, dX, dY, dW, dH);
    },
    resetDimensions() {
        this.width = 64;
        this.height = 64;
        this.spriteWidth = 67;
        this.spriteHeight = 66;

        this.frameX = 0;
        this.frameY = 0;
    },
    resetExplosion() {
        clearInterval(this.explosionInterval);
        this.explosionInterval = null;
    },
    reset() {
        this.resetDimensions();

        this.x = canvas.width / 2 - this.width / 2;
        this.y = canvas.height / 2 - this.height / 2;
        this.resetExplosion();
    },
    resetSkin() {
        this.changeSkin('alpha');
    },
    displayOnSide() {
        this.resetDimensions();
        this.x = 100; //move ship to side to see skins
        this.y = canvas.height / 2 - this.height / 2;
        this.resetExplosion();
    },
    setImmune(duration) {
        this.immunity = true; setTimeout(() => {
            this.immunity = false;
        }, duration);
    },

    // Takes a string skinId (key of SKINS_MAP) like 'alpha' and sets the current Skin
    changeSkin(skinId) { // TODO: load entire state rather than individual parts
        if (!window.localStorage.getItem('unlocks')) return;
        if (JSON.parse(window.localStorage.getItem('unlocks')).includes(skinId) ||
            DEFAULT_STATE.unlocks.includes(skinId) || CONFIG.unlockAll) {
            this.currentSkin = skinId;
        }
        window.localStorage.setItem('shipSkin', JSON.stringify(this.currentSkin)); // TODO: move out
        AUDIO.playSFX('click');
    },
    upPressed() { return ((keys["w"] || keys["ArrowUp"]) && this.y > UI_DEFAULTS.SCOREBOARD_HEIGHT); },
    downPressed() { return ((keys["s"] || keys["ArrowDown"]) && this.y < canvas.height - this.height); },
    leftPressed() { return ((keys["a"] || keys["ArrowLeft"]) && this.x > 0); },
    rightPressed() { return ((keys["d"] || keys["ArrowRight"]) && this.x < canvas.width - this.width); },
    move() {
        if (this.upPressed()) { //up, left right center
            if (this.leftPressed()) {
                ship.y -= ship.speed / Math.sqrt(2);
                ship.x -= ship.speed / Math.sqrt(2);
                ship.frameX = 3;
                ship.frameY = 1;
            } else if (this.rightPressed()) {
                ship.y -= ship.speed / Math.sqrt(2);
                ship.x += ship.speed / Math.sqrt(2);
                ship.frameX = 0;
                ship.frameY = 1;
            } else {
                ship.y -= ship.speed;
                ship.frameX = 0;
                ship.frameY = 0;
            }
        } else if (this.downPressed()) { //down, left right center
            if (this.leftPressed()) {
                ship.y += ship.speed / Math.sqrt(2);
                ship.x -= ship.speed / Math.sqrt(2);
                ship.frameX = 2;
                ship.frameY = 1;
            } else if (this.rightPressed()) {
                ship.y += ship.speed / Math.sqrt(2);
                ship.x += ship.speed / Math.sqrt(2);
                ship.frameX = 1;
                ship.frameY = 1;
            } else {
                ship.y += ship.speed;
                ship.frameX = 2;
                ship.frameY = 0;
            }
        } else if (this.leftPressed()) { //left
            ship.x -= ship.speed;
            ship.frameX = 3;
            ship.frameY = 0;
        } else if (this.rightPressed()) { //right
            ship.x += ship.speed;
            ship.frameX = 1;
            ship.frameY = 0;
        }
    },
    startExplosion() {
        this.image.src = "assets/sprites/BlueExplosionSS.png";
        this.width = 256;
        this.height = 256;
        this.spriteWidth = 259;
        this.spriteHeight = 258;

        this.frameX = 0;
        this.frameY = 0;

        this.exploding = true;

        if (!this.explosionInterval) {
            this.explosionInterval = setInterval(() => {
                this.explosionFrame++;
                if (this.explosionFrame >= 10) {
                    this.explosionFrame = 0;
                }

                this.frameX = this.explosionFrame % 5;
                this.frameY = Math.floor(this.explosionFrame / 5);
            }, 100);
        }
    },
}

// SHIP SPRITE RETRIEVAL
function retrieveShipSkin() {
    if (!ship.currentSkin) {
        ship.currentSkin = JSON.parse(window.localStorage.getItem('shipSkin'));

        if (!ship.currentSkin) {
            ship.currentSkin = 'alpha';
            window.localStorage.setItem('shipSkin', JSON.stringify(ship.currentSkin));
        }
        if (JSON.parse(window.localStorage.getItem('unlocks'))) {
            STATE.unlocks = JSON.parse(window.localStorage.getItem('unlocks'));
            console.log("Unlocked Sprites retrieved.")
        }
        ship.image.src = "assets/sprites/" + SKINS_MAP[ship.currentSkin].spriteSheet;
    }
}
retrieveShipSkin(); // TODO: move to main

const AST_CONFIG = {
    baseWidth: 48,
    baseHeight: 48,
    astGenRangeY: null,
    astGenRangeX: null,
    auraFct: 1.8,
}
//max - min - height of asteroid so it doesn't clip off
AST_CONFIG.astGenRangeY = (canvas.height - UI_DEFAULTS.BORDER_PADDING) - (UI_DEFAULTS.SCOREBOARD_HEIGHT + UI_DEFAULTS.BORDER_PADDING) - AST_CONFIG.baseHeight;
AST_CONFIG.astGenRangeX = (canvas.width - UI_DEFAULTS.BORDER_PADDING) - UI_DEFAULTS.BORDER_PADDING - AST_CONFIG.baseWidth;
// ASTEROIDS
class Asteroid {
    constructor(source, width, height, exist, speed, dirX, dirY, genTime, isEnemy) {
        this.image = new Image();
        this.image.src = source;
        this.width = width;
        this.height = height;
        this.x = null; //defined by other functions that generate
        this.y = null;
        this.radius = width / 2;

        this.exist = exist;
        this.moving;
        this.speed = speed;
        this.xF = Math.random() * this.speed; //x multiplication factor; random to create new vectors
        this.yF = Math.random() * this.speed; //(vector = new diagonal angles)
        this.dirX = dirX;
        this.dirY = dirY;

        this.genTime = genTime;
        this.genCount = 0;
        this.moveInterval;

        this.isEnemy = isEnemy;
    }
    spawn() { //first time generated
        if (!this.exist) {
            this.generate();
            AUDIO.playSFX('lvlUp');
        }
    }
    generate() {
        this.x = Math.random() * (AST_CONFIG.astGenRangeX) + UI_DEFAULTS.BORDER_PADDING;
        this.y = Math.random() * (AST_CONFIG.astGenRangeY) + UI_DEFAULTS.SCOREBOARD_HEIGHT + UI_DEFAULTS.BORDER_PADDING;

        this.genCount = 0;
        this.moving = false;
        this.exist = true;
    }
    update() {
        ctx.save(); //save all other canvas elements
        //first do the alpha change & spawning given genTime
        if (this.genCount < this.genTime) {
            ctx.globalAlpha = Math.round((this.genCount / this.genTime) * 10) / 10;
            this.genCount += 1;
        } else if (this.genCount >= this.genTime) { //then move on subsequent updates
            this.moving = true;
            this.move();
        }
        this.draw();
        ctx.restore(); //restore all other canvas elements
    }
    move() {
        this.x += this.speed * this.xF * this.dirX;
        this.y += this.speed * this.yF * this.dirY;
        detectBorderCollision(this); //collision with edge of screen
    }
    draw() {
        if (this.isEnemy) {
            let auraRadius = this.radius * AST_CONFIG.auraFct;
            let auraX = this.x - (auraRadius - this.radius);
            let auraY = this.y - (auraRadius - this.radius);
            drawCircle("rgba(255, 0, 0, 0.05)", { x: auraX, y: auraY, radius: auraRadius });
        }
        if (CONFIG.showDebug) { drawCircle('red', this); };
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
}
export let greyAst = new Asteroid("assets/sprites/Asteroid.png", AST_CONFIG.baseWidth, AST_CONFIG.baseHeight, false, 0, 0, 0, 30)
// Red Enemies TODO: Factory pattern?
let redAst = new Asteroid("assets/sprites/redAsteroid.png", AST_CONFIG.baseWidth, AST_CONFIG.baseHeight, false, 2, -1, 1, 50, true);
let redAst2 = new Asteroid("assets/sprites/redAsteroid.png", AST_CONFIG.baseWidth * 2, AST_CONFIG.baseHeight * 2, false, 1.5, -1, -1, 50, true);
let redAst3 = new Asteroid("assets/sprites/redAsteroid.png", AST_CONFIG.baseWidth * 3, AST_CONFIG.baseHeight * 3, false, 1, 1, 1, 100, true);
let redAst4 = new Asteroid("assets/sprites/redAsteroid.png", AST_CONFIG.baseWidth * 1.5, AST_CONFIG.baseHeight * 1.5, false, 3, 1, -1, 100, true);
export let ASTEROIDS = {
    redAst: redAst,
    redAst2: redAst2,
    redAst3: redAst3,
    redAst4: redAst4,
}
// Yellow Slowdown High Reward
export let cheese = new Asteroid("assets/sprites/cheese.png", AST_CONFIG.baseWidth / 2, AST_CONFIG.baseHeight / 2, false, 0, 0, 0, 30);

// Blue Powerup !!! TODO
//let plasma = new Asteroid("assets/sprites/cheese.png", astWidth / 3, astHeight / 3, false);
// shield effect

export let drawAstArray = [greyAst, redAst, redAst2, redAst3, redAst4, cheese];
export let enemyAstArray = [redAst, redAst2, redAst3, redAst4];

// Adds a new score to STATE.scores and updates localStorage
function handleScore(newScore) {
    STATE.scores.push(newScore);
    uiElements.finalScoreDisplay.innerHTML = newScore;

    STATE.scores.sort((a, b) => b - a)
    while (STATE.scores.length > 10) {
        STATE.scores.pop();
    }

    updateScoresHTML();
    window.localStorage.setItem('localScores', JSON.stringify(STATE.scores));

    updateUnlocks();
}

if (CONFIG.scoreOverride) { // TODO: move to main
    STATE.scoreAmt = CONFIG.scoreOverride;
}

//start & end functions
function startGame() { //reset values
    STATE.score = 0;
    CONFIG.playerControl = true;

    //Reset ship
    ship.image.src = SPRITES_PATH + SKINS_MAP[ship.currentSkin].spriteSheet;
    ship.reset();
    if (CONFIG.superspeed) {
        STATE.currentSpeed = 20;
    } else {
        STATE.currentSpeed = DEFAULT_STATE.currentSpeed;
    }
    ship.speed = STATE.currentSpeed;
    ship.immunity = false;
    ship.exploding = false;

    //reset levelup changes
    STATE.drawAstArray.forEach(asteroid => {
        asteroid.exist = false;
    })

    //hide ui
    uiElements.startButton.classList.add('hidden');
    uiElementsHidable.titleSplash.classList.add('hidden');
    uiElementsHidable.gameOverScreen.classList.add('hidden');
    //grey out buttons
    uiElements.howToButton.classList.add('greyed');
    uiElements.musicButton.classList.add('greyed');
    uiElements.skinsButton.classList.add('greyed');
    uiElements.resetDataButton.classList.add('greyed');
    //deviceButton.classList.add('greyed');
    //start the music
    AUDIO.switchToBkg();
    //generate Asteroid
    greyAst.generate();
}


export function gameOver() {
    CONFIG.playerControl = false;

    if (!ship.exploding) {
        ship.startExplosion();
    }
    AUDIO.playSFX('explosion');

    AUDIO.switchToMenu();

    clearInterval(STATE.sDInterval);
    STATE.sDCount = 1;
    handleScore(STATE.score);
    //display UI
    uiElements.startButton.classList.remove('hidden');
    uiElementsHidable.gameOverScreen.classList.remove('hidden');
    //allow button presses
    uiElements.howToButton.classList.remove('greyed');
    uiElements.musicButton.classList.remove('greyed');
    uiElements.skinsButton.classList.remove('greyed');
    uiElements.resetDataButton.classList.remove('greyed');
    //deviceButton.classList.remove('greyed');
}

// TODO: move to inputs/handlers
uiElements.startButton.addEventListener('click', startGame);

export default { drawAstArray }