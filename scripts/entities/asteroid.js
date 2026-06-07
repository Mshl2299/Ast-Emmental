// Represents an Asteroid, including movement and rendering logic

// TODO: decouple more
import { canvas, ctx } from "../dom.js";
import { detectBorderCollision } from "../functions.js";
import { drawCircle } from "../utils.js";
import { AUDIO } from "../audio.js";
import { SPRITES_PATH } from "./entities.js";
import { UI_DEFAULTS } from "../ui.js";
import { CONFIG } from "../config.js";

export const AST_CONFIG = {
    baseSize: 48,
    auraFct: 1.8,
    _astGenRangeX: null,
    _astGenRangeY: null,
    getGRX() {
        if (this._astGenRangeX == null) {
            this._astGenRangeX =
                (canvas.width - UI_DEFAULTS.BORDER_PADDING) - UI_DEFAULTS.BORDER_PADDING - this.baseSize;
        }
        return this._astGenRangeX;
    },
    getGRY() {
        if (this._astGenRangeY == null) {
            this._astGenRangeY =
                (canvas.height - UI_DEFAULTS.BORDER_PADDING) - (UI_DEFAULTS.SCOREBOARD_HEIGHT + UI_DEFAULTS.BORDER_PADDING) - this.baseSize;
        }
        return this._astGenRangeY;
    }
}

// TODO: consider abstract class & factory pattern
// TODO: take inventory of what variables are actually needed
class Asteroid {
    constructor({
        type, sizeFct, speed, dirX = null, dirY = null, spawnTime, isEnemy = false
    } = {}) {
        this.setImage(type);

        this.size = AST_CONFIG.baseSize * sizeFct;
        this.radius = this.size / 2;

        this.x = null;
        this.y = null;

        this.exist = false;
        this.moving = false;
        this.speed = speed;
        this.xF = Math.random() * this.speed;
        this.yF = Math.random() * this.speed;
        this.dirX = dirX;
        this.dirY = dirY;

        this.spawnTime = spawnTime;
        this.genCount = 0;
        this.moveInterval;
        this.isEnemy = isEnemy;
    }

    setImage(type) {
        this.image = new Image();
        switch (type) {
            case 'blue': // TODO
                break;
            case 'yellow':
                this.image.src = SPRITES_PATH + "cheese.png";
                break;
            case 'red':
                this.image.src = SPRITES_PATH + "redAsteroid.png";
                break;
            default:
                this.image.src = SPRITES_PATH + "Asteroid.png";
        }
    }

    // Called upon the first time an asteroid is generated.
    spawn() {
        if (!this.exist) {
            this.generate();
            AUDIO.playSFX('lvlUp');
        }
    }

    generate() {
        this.x = Math.random() * (AST_CONFIG.getGRX()) + UI_DEFAULTS.BORDER_PADDING;
        this.y = Math.random() * (AST_CONFIG.getGRY()) + UI_DEFAULTS.SCOREBOARD_HEIGHT + UI_DEFAULTS.BORDER_PADDING;

        this.genCount = 0;
        this.moving = false;
        this.exist = true;
    }

    update() {
        ctx.save(); //save all other canvas elements
        // first do the alpha change & spawning given spawnTime
        if (this.genCount < this.spawnTime) {
            ctx.globalAlpha = Math.round((this.genCount / this.spawnTime) * 10) / 10;
            this.genCount += 1;
        } else if (this.genCount >= this.spawnTime) { //then move on subsequent updates
            this.moving = true;
            this.move();
        }
        this.draw();
        ctx.restore(); //restore all other canvas elements
    }

    move() {
        this.x += this.speed * this.xF * this.dirX;
        this.y += this.speed * this.yF * this.dirY;
        detectBorderCollision(this);
    }

    draw() {
        if (this.isEnemy) {
            let auraRadius = this.radius * AST_CONFIG.auraFct;
            let auraX = this.x - (auraRadius - this.radius);
            let auraY = this.y - (auraRadius - this.radius);
            drawCircle("rgba(255, 0, 0, 0.05)", { x: auraX, y: auraY, radius: auraRadius });
        }
        if (CONFIG.showHitboxes) { drawCircle('red', this); };

        ctx.drawImage(this.image, this.x, this.y, this.size, this.size);
    }
}


class Cheese extends Asteroid {
    // Teleport to the middle of the screen if running off screen
    detectBorderCollision() {
        if (this.x < 0 || this.x > canvas.width || this.y < UI_DEFAULTS.SCOREBOARD_HEIGHT || this.y > canvas.height) {
            this.x = 460;
            this.y = 310;
        }
    }

}


export { Asteroid, Cheese }