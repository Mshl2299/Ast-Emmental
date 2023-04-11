//canvas
let canvas = document.getElementById('canvas');
let ctx = canvas.getContext("2d");
canvas.height = 700;
canvas.width = 1000;

//buttons & respective screens
let startButton = document.querySelector('.startButton');
let closeButton = document.querySelector('.closeButton');
let gameOverScreen = document.querySelector('.gameOverScreen');
gameOverScreen.classList.add('hidden');

let endGameText = document.querySelector('.endGameText');
endGameText.classList.add('hidden');

let howToButton = document.querySelector('.howToButton');
let howToScreen = document.querySelector('.howToScreen');
howToScreen.classList.add('hidden');

let musicButton = document.querySelector('.musicButton');
let musicScreen = document.querySelector('.musicScreen');
musicScreen.classList.add('hidden');

let skinsButton = document.querySelector('.skinsButton');
let skinsMenuScreen = document.querySelector('.skinsMenuScreen');
skinsMenuScreen.classList.add('hidden');

let audioButton = document.querySelector('.audioButton');
let audioMenu = document.querySelector('.audioMenu');
audioMenu.classList.add('hidden');
let sFXButton = document.querySelector('.sFXButton');
let musicToggleButton = document.querySelector('.musicToggleButton');
let sFXRange = document.getElementById('sFXRange');
let musicRange = document.getElementById('musicRange');

let rightButton = document.querySelector('.rightButton');
rightButton.style.left = "98%";
let scoreDisplay = document.querySelector('.scoreDisplay');
let scoreArray = [];
if (JSON.parse(window.localStorage.getItem('scoreArray'))) {
    scoreArray = JSON.parse(window.localStorage.getItem('scoreArray'));
    for (i = 0; i < 5; ++i) {
        if (!scoreArray[i]) {
            scoreArray[i] = "000";
        }
        document.querySelector('.score' + i).innerHTML = scoreArray[i];
    }
    console.log("Highscores retrieved");
}
scoreDisplay.style.left = "100%";
let scoreDisplayOpen = false;
//let rightMenu = document.querySelector('.rightMenu');

//other values
let score = 0;
let sBHeight = 50;
let padding = 10; //distance from borders
let tolerance = 60; //for cheese movement and range detection
let keys = []; //for sensing inputs

let eGTCount = 0; //text that pops up when player clicks on greyed box
let eGTInterval;

//slowDown effect
let slowDown = false;
let sDTime = 1;
let sDInterval;
let currentSpeed = 1.5; //speed variable that will change

//to resolve some issues
let playerControl = false;
let gameOverT = false;
let userInteracted = false;
let firstDeath = false;

//ship and asteroid objects
let ship = {
    frameX: 0,
    frameY: 0,
    width: 67,
    height: 66,
    speed: currentSpeed,
    direction: 1,
    immunity: false,
    x: 460,
    y: 310,
    exploded: false,
    explosionFrame: 1,
}
let ast = {
    width: 48,
    height: 48,
    x: 0,
    y: 0,
    exist: false,
    speed: 0.3,
}
let redAst = {
    x: 0,
    y: 0,
    width: 48, //same as normal asteroid
    height: 48,
    exist: false,
}
let redAst2 = {
    x: 0,
    y: 0,
    width: 96, //x2
    height: 96,
    exist: false,
}
let redAst3 = {
    x: 0,
    y: 0,
    width: 144, //x3
    height: 144,
    exist: false,
}
let redAst4 = {
    x: 0,
    y: 0,
    width: 72, //x1.5
    height: 72,
    exist: false,
}
let cheese = {
    x: 0,
    y: 0,
    width: 24, //x0.5
    height: 24,
    exist: false,
    CDframe: 1,
}

let astRangeY = (canvas.height - padding) - (sBHeight + padding) - ast.height; //max-min -height of asteroid so it doesn't clip off
let astRangeX = (canvas.width - padding) - padding - ast.width;

//Sprite images
let currentSkin = JSON.parse(window.localStorage.getItem('skinName'));
if (!currentSkin) {
    currentSkin = "Sprites/alphaSS1.png";
    window.localStorage.setItem('skinName', currentSkin);
}
let shipSprite = new Image();
shipSprite.src = currentSkin;
let astSprite = new Image();
astSprite.src = "Sprites/Asteroid.png";
let redAstSprite = new Image();
redAstSprite.src = "Sprites/redAsteroid.png";
let cheeseSprite = new Image();
cheeseSprite.src = "Sprites/cheese.png";
let explode1 = new Image();
explode1.src = "BlueExplosion/blue" + JSON.stringify(ship.explosionFrame) + ".png";

//UI
let background = new Image();
background.src = "Backgrounds/blueSpace.jpg";
let cheeseCD = new Image();
cheeseCD.src = "Sprites/cheeseCooldown" + JSON.stringify(cheese.CDframe) + ".png";

//draw functions
function drawShip(img, sX, sY, sW, sH, dX, dY, dW, dH) {
    ctx.drawImage(img, sX, sY, sW, sH, dX, dY, dW, dH);
}
function drawAst(img, dX, dY, dW, dH) {
    ctx.drawImage(img, dX, dY, dW, dH);
}

//skin changes
function changeShipSkin(skinName, skinNum) {
    currentSkin = skinName;
    window.localStorage.setItem('skinName', JSON.stringify(currentSkin)); //unfortunately I do not fully understand JSON
    playSoundFX("Audio/click.wav");
}
function changeBkgSkin(bkgSkinName) {
    background.src = bkgSkinName;
    playSoundFX("Audio/click.wav");
}

//score sorting
function handleScore(newScore) {
    scoreArray.push(newScore);
    scoreArray.sort(function (a, b) { return b - a });
    for (i = 0; i < 5; ++i) {
        if (!scoreArray[i]) {
            scoreArray[i] = 000;
        }
        document.querySelector('.score' + i).innerHTML = scoreArray[i];
    }
    window.localStorage.setItem('scoreArray', JSON.stringify(scoreArray));
    while (scoreArray.length > 5) {
        scoreArray.pop();
        console.log(scoreArray);
    }
}

//start & end functions
function startGame() { //reset values
    score = 0;
    playerControl = true; //maybe i can merge these two
    gameOverT = false;

    //Reset ship
    shipSprite.src = currentSkin;
    ship.x = 460;
    ship.y = 310;
    currentSpeed = 1.5;
    ship.speed = currentSpeed;
    ship.immunity = false;
    slowDown = false;
    clearInterval(sDInterval);

    //reset levelup changes
    redAst.exist = false;
    redAst2.exist = false;
    redAst3.exist = false;
    redAst4.exist = false;
    cheese.exist = false;

    //randomize asteroid location
    ast.x = Math.random() * (astRangeX) + padding; //generate asteroid coordinates
    ast.y = Math.random() * (astRangeY) + sBHeight + padding;

    //hide ui
    startButton.classList.add('hidden');
    gameOverScreen.classList.add('hidden');

    //grey out buttons
    skinsButton.classList.add('greyed');
    howToButton.classList.add('greyed');
    musicButton.classList.add('greyed');

    //start the music!
    playSoundFX("Audio/click.wav");
    playBkgMusic();
}

function gameOver() {
    playerControl = false;
    gameOverT = true;
    ship.exploded = true;
    backgroundMusicOn = false;
    playSoundFX("Audio/explosion.wav");
    clearInterval(sDInterval);
    handleScore(score);
    startButton.classList.remove('hidden'); //display ui
    gameOverScreen.classList.remove('hidden');
    skinsButton.classList.remove('greyed'); //allow button presses
    howToButton.classList.remove('greyed');
    musicButton.classList.remove('greyed');
}