let canvas = document.getElementById('canvas');
let ctx = canvas.getContext("2d");
//buttons
let startButton = document.querySelector('.startButton');
let howToButton = document.querySelector('.howToButton');
let musicButton = document.querySelector('.musicButton');
let skinsButton = document.querySelector('.skinsButton');
let muteButton = document.querySelector('.muteButton');
let closeButton = document.querySelector('.closeButton');
//screens
let gameOverScreen = document.querySelector('.gameOverScreen');
gameOverScreen.classList.add('hidden');
let skinsMenuScreen = document.querySelector('.skinsMenuScreen');
skinsMenuScreen.classList.add('hidden');
let howToScreen = document.querySelector('.howToScreen');
howToScreen.classList.add('hidden');
let musicScreen = document.querySelector('.musicScreen');
musicScreen.classList.add('hidden');
//mute icon
let muteIcon = document.querySelector('.muteIcon');

canvas.height = 700;
canvas.width = 1000;
let sBHeight = 50; //scoreboard height
let padding = 10;
let tolerance = 50;
let score = 0;
let playerControl = false;
let gameOverT = false;
let backgroundMusicOn = false;
let menuMusicOn = false;
let menuMusicPaused = false;
let slowDown = false;
let keys = [];
let currentSpeed = 1.5;

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
    width: 48,
    height: 48,
    exist: false, //also, same size as normal asteroid
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
}

let astRangeY = (canvas.height - padding) - (sBHeight + padding) - ast.height; //max-min -height of asteroid so it doesn't clip off
let astRangeX = (canvas.width - padding) - padding - ast.width;

let currentSkin = JSON.parse(window.localStorage.getItem('skinName'));;
if (!currentSkin) {
    currentSkin = "Sprites/alphaSS1.png";
    window.localStorage.setItem('skinName', JSON.stringify(currentSkin));
}
let currentMusic;

//Images
let shipSprite = new Image();
shipSprite.src = currentSkin;
let background = new Image();
background.src = "Backgrounds/bkg.jpg";
let astSprite = new Image();
astSprite.src = "Sprites/Asteroid.png";
let redAstSprite = new Image();
redAstSprite.src = "Sprites/redAsteroid.png";
let cheeseSprite = new Image();
cheeseSprite.src = "Sprites/cheese.png";
let explode1 = new Image();

//defining drawing functions to update ship & asteroids
function drawShip(img, sX, sY, sW, sH, dX, dY, dW, dH) {
    ctx.drawImage(img, sX, sY, sW, sH, dX, dY, dW, dH);
}
function drawAst(img, dX, dY, dW, dH) {
    ctx.drawImage(img, dX, dY, dW, dH);
}

//Audio
let soundFX = new Audio();
let bkgMusic = new Audio();
bkgMusic.volume = 0.3;
bkgMusic.src = currentMusic;
let popSound = new Audio();
let menuMusic = new Audio();
menuMusic.volume = 0.3;

bkgMusic.addEventListener('playing', function() {
    backgroundMusicOn = true;
})
bkgMusic.addEventListener('ended', function() {
    backgroundMusicOn = false;
})

menuMusic.addEventListener('playing', function() {
    menuMusicOn = true;
})
menuMusic.addEventListener('ended', function() {
    menuMusicOn = false;
})
menuMusic.addEventListener('pause', function() {
    menuMusicPaused = true;
})

function playSoundFX(source) {
    soundFX.src = source;
    soundFX.play();
}

function playPopSound() {
    popSound.src = "Audio/pop.ogg"; //need to reset the audio source everytime
    popSound.play();
}

function changeBkgMusic(source) {
    currentMusic = source;
    playSoundFX("Audio/click.wav");
}

function playBkgMusic() {
    if (!currentMusic) {
        currentMusic = "Audio/pbondoerJourney.mp3";
    }
    bkgMusic.src = currentMusic;
    if (!backgroundMusicOn) {
        bkgMusic.play();
    }
}

function playMenuMusic() {
    if (!menuMusic.src) {
        menuMusic.src = "Audio/BrandonMorrisLSL.wav";
    }
    if (!menuMusicOn || menuMusicPaused) {
        menuMusic.play();
    }
}

function changeShipSkin(skinName) {
    currentSkin = skinName;
    window.localStorage.setItem('skinName', JSON.stringify(currentSkin)); //unfortunately I do not fully understand JSON
    playSoundFX("Audio/click.wav");
}

function changeBkgSkin(bkgSkinName) {
    background.src = bkgSkinName;
    playSoundFX("Audio/click.wav");
}

function startGame() {
    score = 0;
    playerControl = true;
    gameOverT = false;
    redAst.exist = false; //reset existence
    redAst2.exist = false;
    redAst3.exist = false;
    redAst4.exist = false;
    cheese.exist = false;
    immunity = false;

    shipSprite.src = currentSkin; //reset skin from explosion
    ship.x = 460; //tp to center
    ship.y = 310;
    currentSpeed = 1.5; //reset speed
    
    ast.x = Math.random() * (astRangeX) + padding; //generate asteroid coordinates
    ast.y = Math.random() * (astRangeY) + sBHeight + padding;
    
    startButton.classList.add('hidden'); //hide ui
    gameOverScreen.classList.add('hidden');
    skinsButton.classList.add('greyed'); //grey out buttons
    howToButton.classList.add('greyed');
    closeButton.classList.add('greyed');
    musicButton.classList.add('greyed');

    playSoundFX("Audio/click.wav");
    playBkgMusic();
}

function gameOver() {
    playerControl = false;
    gameOverT = true;
    ship.exploded = true;
    backgroundMusicOn = false;
    playSoundFX("Audio/explosion.wav");
    startButton.classList.remove('hidden'); //display ui
    gameOverScreen.classList.remove('hidden');
    skinsButton.classList.remove('greyed'); //allow button presses
    howToButton.classList.remove('greyed');
    closeButton.classList.remove('greyed');
    musicButton.classList.remove('greyed');
}