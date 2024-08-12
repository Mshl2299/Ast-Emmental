/*
Starting constants
Selectors & References to HTML w/ Screens & Buttons
Backgrounds
Retrieval
Sprites
Start game & Game over
*/

//canvas
const canvasContainer = document.querySelector('.canvas-container');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext("2d");
canvas.width = 1000;
canvas.height = 700;

//general values
let sBHeight = 50; //scoreBoard Height
let padding = 30; //distance from borders for Grey & Red Asteroid generation
let tolerance = 80; //for cheese movement and range detection
//Scores
let score = 0;
let scoreAmt = 1; //easily adjust grey asteroid points
let scoreArray = [];
//levels & unlock detections
let level = 0;
let hasUnlockedSnake = false; //level-ups to store in localStorage for skin unlocks & sound effect
let hasUnlockedInverted = false;
let hasUnlockedAsteroid = false;
let legendaryScore = false;
let unlocks = [];
let defaultUnlocks = ['Sprites/alphaSS1.png', 'Sprites/betaSS1.png', 'Sprites/ufoSS1.png'];

//-------------------------------BUTTONS & SCREENS-------------------------------
//ALL UI ELEMENTS (listed by Class or by ID)
let uIButtonsByClassList = ['.howToButton', '.musicButton',
    '.deviceButton', '.keyControls', '.skinsButton', '.snakeSkin', '.invertedSkin', '.asteroidSkin', '.audioButton', '.musicToggleButton', '.sFXButton', '.closeButton',
    '.startButton', '.leftHexButton', '.rightHexButton', '.scoreDisplay', '.backgroundImg'];
let uIScreensByClassList = ['.howToScreen', '.skinsMenuScreen', '.audioMenu', '.startScreen', '.gameOverScreen', '.endGameFirstText'];
// '.musicScreen',
let uIScreensByClass = [];
uIButtonsByClassList.forEach(element => {
    window[element.substring(1)] = document.querySelector(element);
}); //links all UI elements to JS file by class
uIScreensByClassList.forEach(element => {
    window[element.substring(1)] = document.querySelector(element);
    uIScreensByClass.push(window[element.substring(1)]);
});

let uIElementsByID = ['sFXRange', 'musicRange'];
uIElementsByID.forEach(element => {
    window[element] = document.getElementById(element);
});

let keys = [];
//style elements
//'end the current game first!' Flashing text
let eGTCount = 0;
let eGTInterval;
//Highscores menu
rightHexButton.style.left = "98%";
scoreDisplay.style.left = "100%";
let scoreDisplayOpen = false; //to move the score button & display together
//Booleans
let userInteracted = false; //chrome update for bkg music
let playerControl = false; //for player control & menu control

//-------------------------------BACKGROUNDS-------------------------------
let bkgArray = ["blueSpace.jpg", "purpleSpace.jpg", "JamesWebb.jpg", "Orbit.jpg", "hatSpace.png",
    "galaxyAnim.gif", "purpleAnim.gif", "blueNebulaAnim.gif"];
bkgArray.forEach(element => {
    window[element.slice(0, -4)] = "Backgrounds/" + element;
});

//-------------------------------RETRIEVAL-----------------------------------
//BKG RETRIEVAL
if (window.localStorage.getItem('bkgImg')) {
    backgroundImg.src = JSON.parse(window.localStorage.getItem('bkgImg'));
} else {
    backgroundImg.src = blueSpace;
    window.localStorage.setItem('bkgImg', JSON.stringify(backgroundImg.src));
}
//SCORE RETRIEVAL
//window.localStorage.setItem('scoreArray','[1,2,3,4,5]'); //debug
if (window.localStorage.getItem('scoreArray')) {
    scoreArray = JSON.parse(window.localStorage.getItem('scoreArray'));
    for (i = 0; i < 5; ++i) {
        if (!scoreArray[i] || scoreArray[i] == 0) {
            scoreArray[i] = "000";
        }
        document.querySelector('.score' + i).innerHTML = scoreArray[i];
    }
    console.log("Highscores retrieved. " + window.localStorage.getItem('scoreArray'));
}

//-------------------------------SPRITES & OBJECTS----------------------------
// SHIP
let currentSpeed = 3; //speed variable that will change
let ship = {
    image: new Image(),
    width: 67,
    height: 66,
    x: canvas.width / 2 - 33,
    y: canvas.height / 2 - 33,
    frameX: 0,
    frameY: 0,
    radius: 67 / 2,
    speed: currentSpeed,
    direction: "",
    immunity: false,
    breathingRoom: 5,
    exploded: false,
    explosionInterval: null,
    explosionFrame: 1,
    draw(img, sX, sY, sW, sH, dX, dY, dW, dH) {
        this.image.src = img;
        //drawCircle("white", this); //debug
        ctx.drawImage(this.image, sX, sY, sW, sH, dX, dY, dW, dH);
    },
    resetPos() { ship.x = canvas.width / 2 - ship.width / 2; ship.y = canvas.height / 2 - ship.height / 2; },
    getImmunity(duration) { ship.immunity = true; setTimeout(function () { ship.immunity = false }, duration); },
    changeSkin(skinName) {
        if (window.localStorage.getItem('unlocks') && JSON.parse(window.localStorage.getItem('unlocks')).includes(skinName)) {
            currentSkin = skinName;
        } else if (defaultUnlocks.includes(skinName)) {
            currentSkin = skinName;
        }
        window.localStorage.setItem('skinName', JSON.stringify(currentSkin));
        clickSound.play();
    },
    upPressed() { return ((keys["w"] || keys["ArrowUp"]) && ship.y > sBHeight); },
    downPressed() { return ((keys["s"] || keys["ArrowDown"]) && ship.y < canvas.height - ship.height); },
    leftPressed() { return ((keys["a"] || keys["ArrowLeft"]) && ship.x > 0); },
    rightPressed() { return ((keys["d"] || keys["ArrowRight"]) && ship.x < canvas.width - ship.width); },
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
    cycleExplosionFrame() {
        if (!ship.explosionInterval) {
            ship.explosionInterval = setInterval(function () {
                if (ship.explosionFrame < 10) {
                    ship.explosionFrame++;
                }
                else {
                    ship.explosionFrame = 1;
                }
            }, 100);
        }
    }
}

// SHIP SPRITE RETRIEVAL (has to be below)
let currentSkin = JSON.parse(window.localStorage.getItem('skinName'))
if (!currentSkin) {
    currentSkin = "Sprites/alphaSS1.png";
    window.localStorage.setItem('skinName', JSON.stringify(currentSkin));
}
if (JSON.parse(window.localStorage.getItem('unlocks'))) {
    unlocks = JSON.parse(window.localStorage.getItem('unlocks'));
    console.log("Unlocked Sprites retrieved.")
}
ship.image.src = currentSkin;

// ASTEROIDS
let astWidth = 48;
let astHeight = 48;
let astRangeY = (canvas.height - padding) - (sBHeight + padding) - astHeight; //max-min -height of asteroid so it doesn't clip off
let astRangeX = (canvas.width - padding) - padding - astWidth;
class Asteroid {
    constructor(source, width, height, exist, speed, dirX, dirY, genTime) {
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
        //drawCircle('red',this); //debug
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
}
let greyAst = new Asteroid("Sprites/Asteroid.png", astWidth, astHeight, false, 0, 0, 0, 30)
// Red Enemies
let redAst = new Asteroid("Sprites/redAsteroid.png", astWidth, astHeight, false, 2, -1, 1, 50);
let redAst2 = new Asteroid("Sprites/redAsteroid.png", astWidth * 2, astHeight * 2, false, 1.5, -1, -1, 50);
let redAst3 = new Asteroid("Sprites/redAsteroid.png", astWidth * 3, astHeight * 3, false, 1, 1, 1, 100);
let redAst4 = new Asteroid("Sprites/redAsteroid.png", astWidth * 1.5, astHeight * 1.5, false, 3, 1, -1, 100);
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

//start & end functions
function startGame() { //reset values
    score = 0;
    playerControl = true;

    //Reset ship
    ship.image.src = currentSkin;
    ship.resetPos();
    currentSpeed = 3;
    ship.speed = currentSpeed;
    ship.immunity = false;
    ship.exploded = false;

    //reset levelup changes
    drawAstArray.forEach(asteroid => {
        asteroid.exist = false;
    })
    hasUnlockedSnake = false; //!!!
    hasUnlockedInverted = false;
    hasUnlockedAsteroid = false;
    legendaryScore = false;

    //hide ui
    startButton.classList.add('hidden');
    startScreen.classList.add('hidden');
    gameOverScreen.classList.add('hidden');
    //grey out buttons
    howToButton.classList.add('greyed');
    musicButton.classList.add('greyed');
    skinsButton.classList.add('greyed');
    //deviceButton.classList.add('greyed');
    //start the music
    menuMusic.pause();
    bkgMusic.play();
    //generate Asteroid
    greyAst.generate();
}

function gameOver() {
    playerControl = false;
    ship.exploded = true;
    explSound.play();

    bkgMusic.pause();
    menuMusic.play();

    clearInterval(sDInterval);
    sDCount = 1;
    handleScore(score);
    //display UI
    startButton.classList.remove('hidden');
    gameOverScreen.classList.remove('hidden');
    //allow button presses
    howToButton.classList.remove('greyed');
    musicButton.classList.remove('greyed');
    skinsButton.classList.remove('greyed');
    //deviceButton.classList.remove('greyed');
}
