// Represents a Player Ship, including movement and rendering logic

// TODO: decouple more
import { canvas, ctx } from "../dom.js";
import { UI_DEFAULTS } from "../ui.js";
import { AUDIO } from "../audio.js";
import { keys } from "../game/input.js"
import { drawCircle } from "../utils.js";
import { SPRITES_PATH, SKINS_MAP } from "./entities.js";

const EXPLOSION_PATH = "assets/sprites/BlueExplosionSS.png";

const SHIP_CONFIG = {
    baseWidth: 64,
    baseHeight: 64,
    ssWidth: 67,
    ssHeight: 66,
}

class Ship {
    // Construct a Ship object given parameters as JSON, centered on the canvas.
    // Requires valid skinId (key of SKINS_MAP) and speed
    constructor({
        skinId, speed,
        width = SHIP_CONFIG.baseWidth, height = SHIP_CONFIG.baseHeight,
        spriteWidth = SHIP_CONFIG.ssWidth, spriteHeight = SHIP_CONFIG.ssHeight,
        showHitbox = false, allSkinsUnlocked = false,
    } = {}) {
        this.currentSkin = skinId;
        this.image = new Image();
        this.image.src = SPRITES_PATH + SKINS_MAP[skinId].spriteSheet;

        this.width = width;
        this.height = height;
        this.spriteWidth = spriteWidth;
        this.spriteHeight = spriteHeight;

        this.x = canvas.width / 2 - this.width / 2;
        this.y = canvas.height / 2 - this.height / 2;
        this.radius = this.width / 2;

        this.speed = speed;
        this.showHitbox = showHitbox;
        this.allSkinsUnlocked = allSkinsUnlocked;

        this.frameX = 0;
        this.frameY = 0;
        this.immunity = false;
        this.exploding = false;
        this.explosionInterval = null;
        this.explosionFrame = 1;
    }

    // Sets current skin given string (key of SKINS_MAP, ie 'alpha') if unlocked or config allows
    // and updates actual ship image
    // TODO: Move to unified retireval/decouple from window.localStorage and AUDIO
    changeSkin(skinId) {
        const stored = window.localStorage.getItem('unlocks');
        if (!stored) return;
        const unlocked = JSON.parse(stored);

        if (unlocked.includes(skinId) || this.allSkinsUnlocked) {
            this.currentSkin = skinId;
            this.image.src = SPRITES_PATH + SKINS_MAP[this.currentSkin].spriteSheet;
            window.localStorage.setItem('shipSkin', JSON.stringify(this.currentSkin));
            AUDIO.playSFX('click');
        }
    }

    // Prevents ship from triggering collisions with anything for duration ms
    setImmune(duration) {
        this.immunity = true;
        setTimeout(() => { this.immunity = false; }, duration);
    }

    // Renders the ship on the canvas, given source and destination parameters.
    draw(sX, sY, sW, sH, dX, dY, dW, dH) {
        if (this.showHitbox) drawCircle('rgb(255,255,255,0.5)', this);
        ctx.drawImage(this.image, sX, sY, sW, sH, dX, dY, dW, dH);
    }

    resetDimensions() {
        this.width = 64;
        this.height = 64;
        this.spriteWidth = 67;
        this.spriteHeight = 66;
        this.frameX = 0;
        this.frameY = 0;
    }

    resetExplosion() {
        if (this.explosionInterval) {
            clearInterval(this.explosionInterval);
            this.explosionInterval = null;
        }
    }

    reset() {
        this.resetDimensions();
        this.x = canvas.width / 2 - this.width / 2;
        this.y = canvas.height / 2 - this.height / 2;
        this.resetExplosion();
    }

    resetSkin() {
        this.changeSkin('alpha');
    }

    // Moves the ship to the left of the canvas to see skin changes real-time
    displayOnSide() {
        this.resetDimensions();
        this.x = 100;
        this.y = canvas.height / 2 - this.height / 2;
        this.resetExplosion();
    }

    upPressed() { return ((keys['w'] || keys['ArrowUp']) && this.y > UI_DEFAULTS.SCOREBOARD_HEIGHT); }
    downPressed() { return ((keys['s'] || keys['ArrowDown']) && this.y < canvas.height - this.height); }
    leftPressed() { return ((keys['a'] || keys['ArrowLeft']) && this.x > 0); }
    rightPressed() { return ((keys['d'] || keys['ArrowRight']) && this.x < canvas.width - this.width); }

    // Moves (x,y) position of ship and changes sprite to rotate
    move() {
        const s = this.speed;
        const diag = s / Math.sqrt(2);

        if (this.upPressed()) {
            if (this.leftPressed()) {           // UP LEFT
                this.x -= diag; this.y -= diag;
                this.frameX = 3; this.frameY = 1;
            } else if (this.rightPressed()) {   // UP RIGHT
                this.x += diag; this.y -= diag;
                this.frameX = 0; this.frameY = 1;
            } else {                            // UP
                this.y -= s;
                this.frameX = 0; this.frameY = 0;
            }
        } else if (this.downPressed()) {
            if (this.leftPressed()) {           // DOWN LEFT
                this.x -= diag; this.y += diag;
                this.frameX = 2; this.frameY = 1;
            } else if (this.rightPressed()) {   // DOWN RIGHT
                this.x += diag; this.y += diag;
                this.frameX = 1; this.frameY = 1;
            } else {                            // DOWN
                this.y += s;
                this.frameX = 2; this.frameY = 0;
            }
        } else if (this.leftPressed()) {
            this.x -= s;
            this.frameX = 3; this.frameY = 0;
        } else if (this.rightPressed()) {
            this.x += s;
            this.frameX = 1; this.frameY = 0;
        }
    }

    // Changes ship sprite to an explosion and sets interval to auto cycle frames.
    startExplosion() {
        this.image.src = EXPLOSION_PATH;
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
                if (this.explosionFrame >= 10) this.explosionFrame = 0;

                this.frameX = this.explosionFrame % 5;
                this.frameY = Math.floor(this.explosionFrame / 5);
            }, 100);
        }
    }
}

export { Ship };