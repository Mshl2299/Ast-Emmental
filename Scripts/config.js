// Handles constants, game settings & persisted keys
// levels.js handles unlocks

//canvas
const canvasContainer = document.querySelector('.canvas-container');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext("2d");
canvas.width = 1000;
canvas.height = 700;

ctx.imageSmoothingEnabled = false;
ctx.webkitImageSmoothingEnabled = false;
ctx.mozImageSmoothingEnabled = false;
ctx.msImageSmoothingEnabled = false;

//general values
let sBHeight = 50; //scoreBoard Height
let padding = 30; //distance from borders for Grey & Red Asteroid generation
let tolerance = 80; //for cheese movement and range detection
let auraFct = 1.8;
let showDebug = false;
//levels & unlock detections
let level = 0;
let hasUnlockedSnake = false; //level-ups to store in localStorage for skin unlocks & sound effect
let hasUnlockedInverted = false;
let hasUnlockedAsteroid = false;
let legendaryScore = false;
let unlocks = [];
let defaultUnlocks = ['Sprites/alphaSS1.png', 'Sprites/betaSS1.png', 'Sprites/ufoSS1.png'];

//-------------------------------BUTTONS & SCREENS-------------------------------
const SCORE_WIDTH = 280;
const BUTTON_WIDTH = 20;
const SCORE_WIDTH_ADJUST = 5;

let keys = [];
//style elements
//'end the current game first!' Flashing text
let eGTCount = 0;
let eGTInterval;
//Highscores menu
let scoreDisplayOpen = false; //to move the score button & display together
//Booleans
let userInteracted = false; //chrome update for bkg music
let playerControl = false; //for player control & menu control

//Scores
let score = 0;
let scoreAmt = 5;
let localScores;