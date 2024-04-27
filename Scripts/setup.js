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
let tolerance = 60; //for cheese movement and range detection
//Scores
let score = 0;
let scoreAmt = 5; //easily adjust grey asteroid points
let scoreArray = [];
//levels & unlock detections
let level = 0;
let tripleDigit1 = false; //level-ups to store in localStorage for skin unlocks & sound effect
let tripleDigit2 = false;
let tripleDigit3 = false;
let legendaryScore = false;
let unlocks = [];
let defaultUnlocks = ['Sprites/alphaSS1.png', 'Sprites/betaSS1.png', 'Sprites/ufoSS1.png']

//-------------------------------BUTTONS & SCREENS-------------------------------
//RIGHT SIDE
//how-to
let howToButton = document.querySelector('.howToButton');
let howToScreen = document.querySelector('.howToScreen');
//music selection
let musicButton = document.querySelector('.musicButton');
let musicScreen = document.querySelector('.musicScreen');
let musicPage1 = document.querySelector('.musicPage1');
let musicPage2 = document.querySelector('.musicPage2');
let musicPage3 = document.querySelector('.musicPage3');
let prevPageButton = document.querySelector('.prevPageButton');
let nextPageButton = document.querySelector('.nextPageButton');

//LEFT SIDE
//Device Button & Controls
let deviceButton = document.querySelector('.deviceButton');
let mobileCSS = document.querySelector('.mobileCSS');
let mobile = false;
let keysControl = document.querySelector('.keyControls');
let keys = [];
let buttonControls = document.querySelector('.buttonControls');
let mobileControls = document.querySelector('.mobileControls');
let mBUp = document.querySelector('.mBUp');
let mBRight = document.querySelector('.mBRight');
let mBLeft = document.querySelector('.mBLeft');
let mBDown = document.querySelector('.mBDown');
//skin menu
let skinsButton = document.querySelector('.skinsButton');
let skinsMenuScreen = document.querySelector('.skinsMenuScreen');
//unlockable skins
let snakeSkin = document.querySelector('.snakeSkin');
let invertedSkin = document.querySelector('.invertedSkin');
let asteroidSkin = document.querySelector('.asteroidSkin');
//audio & audio menu
let audioButton = document.querySelector('.audioButton');
let audioMenu = document.querySelector('.audioMenu');
let sFXButton = document.querySelector('.sFXButton');
let sFXRange = document.getElementById('sFXRange');
let musicToggleButton = document.querySelector('.musicToggleButton');
let musicRange = document.getElementById('musicRange');
//Close all
let closeButton = document.querySelector('.closeButton');

//OTHER BUTTONS & SCREENS
let startButton = document.querySelector('.startButton');
let startScreen = document.querySelector('.startScreen');
let gameOverScreen = document.querySelector('.gameOverScreen');
//style elements
let paragraphs = document.getElementsByTagName('p');
//'end the current game first!' Flashing text
let endGameText = document.querySelector('.endGameText');
let eGTCount = 0;
let eGTInterval;
//Highscores menu
let rightButton = document.querySelector('.rightButton');
rightButton.style.left = "98%";
let scoreDisplay = document.querySelector('.scoreDisplay');
scoreDisplay.style.left = "100%";
let scoreDisplayOpen = false;
//Booleans
let userInteracted = false; //chrome update for bkg music
let playerControl = false; //for player control & menu control
let gameOverT = false; //needs changes
let firstDeath = false; //for Explosion to begin cycling; needs changes

//-------------------------------BACKGROUNDS-------------------------------
let backgroundImg = document.querySelector('.background-img');
let blueSpace = "Backgrounds/blueSpace.jpg";
let purpleSpace = "Backgrounds/purpleSpace.jpg";
let JamesWebb = "Backgrounds/JamesWebb.jpg";
let orbit = "Backgrounds/Orbit.jpg";
let hatSpace = "Backgrounds/hatSpace.png";
let galaxyAnim = "Backgrounds/galaxyAnim.gif";
let purpleAnim = "Backgrounds/purpleAnim.gif";
let blueNebula = "Backgrounds/blueNebulaAnim.gif";

//-------------------------------LOAD-IN-----------------------------------
//BKG RETRIEVAL
if (window.localStorage.getItem('bkgImg')) {
    backgroundImg.src = JSON.parse(window.localStorage.getItem('bkgImg'));
} else {
    backgroundImg.src = blueSpace;
    window.localStorage.setItem('bkgImg', JSON.stringify(backgroundImg.src));
}
//SCORE RETRIEVAL
if (window.localStorage.getItem('scoreArray')) {
    scoreArray = JSON.parse(window.localStorage.getItem('scoreArray'));
    for (i = 0; i < 5; ++i) {
        if (!scoreArray[i]) {
            scoreArray[i] = "000";
        }
        document.querySelector('.score' + i).innerHTML = scoreArray[i];
    }
    console.log("Highscores retrieved.");
    console.log(window.localStorage.getItem('scoreArray'));
}

//MENU MUSIC
//--------------------------------SPRITES-------------------------------
// SHIP
let currentSpeed = 3; //speed variable that will change
class Player {
    constructor(source, width, height, x, y, frameX, frameY, speed, dir, imm, exp, expFrame) { //speedF = speed factor
        this.image = new Image();
        this.image.src = source;
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
        this.frameX = frameX;
        this.frameY = frameY;
        this.radius = width / 2;
        this.speed = speed;
        this.direction = dir;
        this.immunity = imm;
        this.exploded = exp;
        this.explosionFrame = expFrame;
    }
    move() {
        this.x += ast.speed * this.xF * this.dirX;
        this.y += ast.speed * this.yF * this.dirY;
        detectBorderCollision(this); //collision with edge of screen
    }
    draw(img, sX, sY, sW, sH, dX, dY, dW, dH) {
        this.image.src=img;
        //drawCircle("white", this);
        ctx.drawImage(this.image, sX, sY, sW, sH, dX, dY, dW, dH);
    }
    resetPos() {
        this.x = canvas.width/2-33;
        this.y = canvas.width/2-33;
    }
}
let ship = new Player("Sprites/shipAlpha.png", 67, 66, canvas.width/2-33, canvas.height/2-33, 0, 0, currentSpeed, 1, false, false, 1);
// update: moved to constructor
// let ship = {
//     sprite: new Image(),
//     frameX: 0,
//     frameY: 0,
//     width: 67,
//     height: 66,
//     radius: 32,
//     x: canvas.width / 2 - 33,
//     y: canvas.height / 2 - 33,
//     speed: currentSpeed,
//     direction: 1,
//     immunity: false,
//     exploded: false,
//     explosionFrame: 1,
// }
let explode1 = new Image();
explode1.src = "BlueExplosion/blue" + JSON.stringify(ship.explosionFrame) + ".png";

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
let ast = {
    name: "greyAst",
    sprite: new Image(),
    width: 48,
    height: 48,
    radius: 24,
    x: 0,
    y: 0,
    exist: false,
    speed: 1,
    moving: false,
}
ast.sprite.src = "Sprites/Asteroid.png";
let astRangeY = (canvas.height - padding) - (sBHeight + padding) - ast.height; //max-min -height of asteroid so it doesn't clip off
let astRangeX = (canvas.width - padding) - padding - ast.width;
class Asteroid {
    constructor(name, type, source, width, height, exist, moving, speedF, dirX, dirY) { //speedF = speed factor
        this.name = name;
        this.type = type;
        this.image = new Image();
        this.image.src = source;
        this.width = width;
        this.height = height;
        // may cause glitches so they are set to null
        // this.x = Math.random() * (astRangeX) + padding;
        // this.y = Math.random() * (astRangeY) + sBHeight + padding;
        this.x = null;
        this.y = null;
        this.radius = width / 2;
        this.exist = exist;
        this.moving = moving;
        this.xF = Math.random() * speedF; //x multiplication factor; random to create new vectors
        this.yF = Math.random() * speedF; //(vector = new diagonal angles)
        this.dirX = dirX;
        this.dirY = dirY;
        this.moveInterval;
    }
    move() {
        this.x += ast.speed * this.xF * this.dirX;
        this.y += ast.speed * this.yF * this.dirY;
        detectBorderCollision(this); //collision with edge of screen
    }
    drawAst() {
        //drawCircle("red", this);
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
}
// Red Enemies
let redAst = new Asteroid("redAst", "enemy", "Sprites/redAsteroid.png", ast.width, ast.height, false, false, 1, -1, 1);
let redAst2 = new Asteroid("redAst2", "enemy", "Sprites/redAsteroid.png", ast.width * 2, ast.height * 2, false, false, 0.6, -1, -1);
let redAst3 = new Asteroid("redAst3", "enemy", "Sprites/redAsteroid.png", ast.width * 3, ast.height * 3, false, false, 0.3, 1, 1);
let redAst4 = new Asteroid("redAst4", "enemy", "Sprites/redAsteroid.png", ast.width * 1.5, ast.height * 1.5, false, false, 1.5, 1, -1);
// Yellow Slowdown High Reward
let cheese = new Asteroid("cheese", "friend", "Sprites/cheese.png", ast.width / 2, ast.height / 2, 0, 0, false);
// slowDown effect
let cheeseCDFrame = 1;
let cheeseCD = new Image();
cheeseCD.src = "Sprites/cheeseCooldown" + JSON.stringify(cheeseCDFrame) + ".png";
let slowDown = false;
let sDCount = 1;
let sDInterval;
// Blue Powerup !!!
let plasma = new Asteroid("plasma", "friend", "Sprites/cheese.png", ast.width / 3, ast.height / 3, 0, 0, false, false, 1, Math.random() * 2 - 1, Math.random() * 2 - 1);
// shield effect
let shieldImg = new Image();

//start & end functions
function startGame() { //reset values
    score = 0;
    level = 0;
    playerControl = true; //maybe i can merge these two
    gameOverT = false;

    //Reset ship
    ship.image.src = currentSkin;
    ship.x = canvas.width / 2 - ship.width / 2;
    ship.y = canvas.height / 2 - ship.height / 2;
    currentSpeed = 3;
    ship.speed = currentSpeed;
    ship.immunity = false;
    slowDown = false;
    clearInterval(sDInterval);

    //reset levelup changes
    ast.speed = 1;
    redAst.exist = false;
    redAst2.exist = false;
    redAst3.exist = false;
    redAst4.exist = false;
    cheese.exist = false;
    tripleDigit1 = false;
    tripleDigit2 = false;
    tripleDigit3 = false;
    legendaryScore = false;

    //hide ui
    startButton.classList.add('hidden');
    startScreen.classList.add('hidden');
    gameOverScreen.classList.add('hidden');
    //grey out buttons
    howToButton.classList.add('greyed');
    musicButton.classList.add('greyed');
    deviceButton.classList.add('greyed');
    skinsButton.classList.add('greyed');
    //start the music!
    menuMusic.pause();
    bkgMusic.play();
    //generate Asteroid
    generateAsteroid(ast);
}

function gameOver() {
    playerControl = false;
    gameOverT = true;
    ship.exploded = true;
    bkgMusic.pause();
    menuMusic.play();
    explSound.play();
    clearInterval(sDInterval);
    handleScore(score);
    //display UI
    startButton.classList.remove('hidden');
    gameOverScreen.classList.remove('hidden');
    //allow button presses
    howToButton.classList.remove('greyed');
    musicButton.classList.remove('greyed');
    deviceButton.classList.remove('greyed');
    skinsButton.classList.remove('greyed');
}

document.addEventListener('click', function () {
    userInteracted = true;
})