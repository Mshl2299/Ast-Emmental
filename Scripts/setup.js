//canvas
let canvasContainer = document.querySelector('.canvas-container');
let canvas = document.getElementById('canvas');
let ctx = canvas.getContext("2d");
canvas.width = 1000;
canvas.height = 700;

//general values
let sBHeight = 50; //scoreBoard Height
let padding = 30; //distance from borders for Grey & Red Asteroid generation
let tolerance = 60; //for cheese movement and range detection
let keys = []; 
//Scores
let score = 0;
let scoreAmt = 50; //easily adjust grey asteroid points
let scoreArray = [];
//levels & unlock detections
let level = 0;
let tripleDigit1 = false; //level-ups to store in localStorage for skin unlocks & sound effect
let tripleDigit2 = false;
let tripleDigit3 = false;
let legendaryScore = false;
let unlocks = [];

//RIGHT BUTTONS & SCREENS
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

//LEFT BUTTONS & SCREENS
//Device
let deviceButton = document.querySelector('.deviceButton');
let mobileCSS = document.querySelector('.mobileCSS');
let mobile = false;
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

//-------------------------------LOAD-IN-----------------------------------
//AUDIO RETRIEVAL
//SFX volume
if (window.localStorage.getItem('sFXRange')) {
    sFXRange.value = JSON.parse(window.localStorage.getItem('sFXRange'));
}
else {
    sFXRange.value = "100";
    window.localStorage.setItem('sFXRange', JSON.stringify(sFXRange.value));
}
//MUSIC volume
if (window.localStorage.getItem('musicRange')) {
    musicRange.value = JSON.parse(window.localStorage.getItem('musicRange'));
}
else {
    musicRange.value = "50";
    window.localStorage.setItem('musicRange', JSON.stringify(musicRange.value));
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
//--------------------------------SPRITES-------------------------------
//ship
let currentSpeed = 3; //speed variable that will change
let ship = {
    sprite: new Image(),
    frameX: 0,
    frameY: 0,
    width: 67,
    height: 66,
    x: canvas.width/2 - 33,
    y: canvas.height/2 - 33,
    speed: currentSpeed,
    direction: 1,
    immunity: false,
    exploded: false,
    explosionFrame: 1,
}
let explode1 = new Image();
explode1.src = "BlueExplosion/blue" + JSON.stringify(ship.explosionFrame) + ".png";
//SHIP SPRITE RETRIEVAL
let currentSkin = JSON.parse(window.localStorage.getItem('skinName'))
if (!currentSkin) {
    currentSkin = "Sprites/alphaSS1.png";
    window.localStorage.setItem('skinName', JSON.stringify(currentSkin));
}
if (JSON.parse(window.localStorage.getItem('unlocks'))) {
    unlocks = JSON.parse(window.localStorage.getItem('unlocks'));
    console.log("Unlocked Sprites retrieved.")
}
ship.sprite.src = currentSkin;

//ASTEROIDS
let ast = {
    name: "greyAst",
    sprite: new Image(),
    width: 48,
    height: 48,
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
    constructor(name, type, source, width, height, x, y, exist, moving, speedF, dirX, dirY) { //speedF = speed factor
        this.name = name;
        this.type = type;
        this.image = new Image();
        this.image.src = source;
        this.width = width;
        this.height = height;
        this.x = Math.random * (astRangeX) + padding;
        this.y = Math.random() * (astRangeY) + sBHeight + padding;
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
        detectBorderCollision(this);
    }
    drawAst(){
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
}
let redAst = new Asteroid("redAst", "enemy", "Sprites/redAsteroid.png", ast.width, ast.height, 0, 0, false, false, 1, -1, 1);
let redAst2 = new Asteroid("redAst2", "enemy", "Sprites/redAsteroid.png", ast.width*2, ast.height*2, 0, 0, false, false, 0.6, -1, -1);
let redAst3 = new Asteroid("redAst3", "enemy", "Sprites/redAsteroid.png", ast.width*3, ast.height*3, 0, 0, false, false, 0.3, 1, 1);
let redAst4 = new Asteroid("redAst4", "enemy", "Sprites/redAsteroid.png", ast.width*1.5, ast.height*1.5, 0, 0, false, false, 1.5, 1, -1); 
//Cheese & Slowdown
let cheese = new Asteroid("cheese", "friend", "Sprites/cheese.png", ast.width/2, ast.height/2, 0, 0, false);
let cheeseCDFrame = 1;
let cheeseCD = new Image();
cheeseCD.src = "Sprites/cheeseCooldown" + JSON.stringify(cheeseCDFrame) + ".png";
//slowDown effect
let slowDown = false;
let sDCount = 1;
let sDInterval;

//-------------------------------BACKGROUNDS-------------------------------
let backgroundAnimating = false;
let backgroundInterval;
class background {
    constructor(animated, source, name, ending, frame, totalFrames) {
        this.animated = animated;
        this.image = new Image();
        this.image.src = source;
        this.name = name;
        this.ending = ending;
        this.frame = frame;
        this.totalFrames = totalFrames;
    }
    drawBkg() {
        ctx.drawImage(this.image, 0, 0, canvas.width, canvas.height);
    }
    cycleBackgroundFrame() { //if background.animated = true;
        if (this.frame < this.totalFrames) {
            this.image.src = "Backgrounds/" + this.name + JSON.stringify(this.frame) + this.ending;
            this.frame ++;
        }
        else if (this.frame >= this.totalFrames) {
            this.frame = 1;
        }
    }
}
//non-animated
let blueSpace = new background(false, "Backgrounds/blueSpace.jpg");
let purpleSpace = new background(false, "Backgrounds/purpleSpace.jpg");
let JamesWebb = new background(false, "Backgrounds/JamesWebb.jpg");
let orbit = new background(false, "Backgrounds/Orbit.jpg");
let hatSpace = new background(false, "Backgrounds/hatSpace.png");
//animated 
let galaxyAnim = new background(true, "Backgrounds/galaxyAnim/galaxyAnim1.gif", "galaxyAnim/galaxyAnim", ".gif", 1, 150);
let purpleAnim = new background(true, "Backgrounds/purpleAnim/purpleAnim1.gif", "purpleAnim/purpleAnim", ".gif", 1, 30);
let blueNebula = new background(true, "Backgrounds/blueNebulaAnim/blueNebula1.gif", "blueNebulaAnim/blueNebula", ".gif", 1, 148);
let chosenBkg = blueSpace;

//start & end functions
function startGame() { //reset values
    score = 0;
    level = 0;
    playerControl = true; //maybe i can merge these two
    gameOverT = false;

    //Reset ship
    ship.sprite.src = currentSkin;
    ship.x = canvas.width/2 - ship.width/2;
    ship.y = canvas.height/2 - ship.height/2;
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
    playSoundFX("Audio/click.wav");
    menuMusicPaused = true;
    playBkgMusic();
    //generate Asteroid
    generateAsteroid(ast);
}

function gameOver() {
    playerControl = false;
    gameOverT = true;
    ship.exploded = true;
    backgroundMusicOn = false;
    menuMusicOn = false;
    playSoundFX("Audio/explosion.wav");
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