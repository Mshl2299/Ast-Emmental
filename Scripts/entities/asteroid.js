// Contains Asteroid-related data & logic

// ASTEROIDS
let astWidth = 48;
let astHeight = 48;
let astRangeY = (canvas.height - padding) - (sBHeight + padding) - astHeight; //max-min -height of asteroid so it doesn't clip off
let astRangeX = (canvas.width - padding) - padding - astWidth;
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
            lvlUpSound.play();
        }
    }
    generate() {
        this.x = Math.random() * (astRangeX) + padding;
        this.y = Math.random() * (astRangeY) + sBHeight + padding;
        ship.getImmunity(300);

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
            let auraRadius = this.radius * auraFct;
            let auraX = this.x - (auraRadius - this.radius);
            let auraY = this.y - (auraRadius - this.radius);
            drawCircle("rgba(255, 0, 0, 0.05)", { x: auraX, y: auraY, radius: auraRadius });
        }
        if (showDebug) { drawCircle('red', this); };
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
}


let greyAst = new Asteroid("Sprites/Asteroid.png", astWidth, astHeight, false, 0, 0, 0, 30)
// Red Enemies TODO: Factory pattern?
let redAst = new Asteroid("Sprites/redAsteroid.png", astWidth, astHeight, false, 2, -1, 1, 50, true);
let redAst2 = new Asteroid("Sprites/redAsteroid.png", astWidth * 2, astHeight * 2, false, 1.5, -1, -1, 50, true);
let redAst3 = new Asteroid("Sprites/redAsteroid.png", astWidth * 3, astHeight * 3, false, 1, 1, 1, 100, true);
let redAst4 = new Asteroid("Sprites/redAsteroid.png", astWidth * 1.5, astHeight * 1.5, false, 3, 1, -1, 100, true);
// Yellow Slowdown High Reward
let cheese = new Asteroid("Sprites/cheese.png", astWidth / 2, astHeight / 2, false, 0, 0, 0, 30);
// slowDown effect
let cheeseCD = new Image();
let cheeseCDx = 900;
let cheeseCDy = 80;
let sDCount = 1;
let sDInterval;
cheeseCD.src = "Sprites/cheeseCooldown" + JSON.stringify(sDCount) + ".png";
// Blue Powerup !!!
//let plasma = new Asteroid("Sprites/cheese.png", astWidth / 3, astHeight / 3, false);
// shield effect

let drawAstArray = [greyAst, redAst, redAst2, redAst3, redAst4, cheese];
let enemyAstArray = [redAst, redAst2, redAst3, redAst4];