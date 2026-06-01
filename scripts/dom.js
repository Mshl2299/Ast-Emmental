// Handles UI element selection & DOM
import kebabToCamel from "./utils.js"

//canvas
// const canvasContainer = document.querySelector('.canvas-container');
const canvas = document.getElementById('canvas');
export const ctx = canvas.getContext("2d");
canvas.width = 1000;
canvas.height = 700;

ctx.imageSmoothingEnabled = false;
ctx.webkitImageSmoothingEnabled = false;
ctx.mozImageSmoothingEnabled = false;
ctx.msImageSmoothingEnabled = false;

// ALL UI ELEMENTS (listed by Class or by ID)
// Screens will be hidden on certain game events
const uiSelectors = [
    '.background-img',
    '.how-to-button',
    '.music-button',
    '.device-button',
    '.key-controls',
    '.skins-button',
    '.snake-skin',
    '.inverted-skin',
    '.asteroid-skin',
    '.audio-button',
    '.music-toggle-button',
    '.sfx-toggle-button',
    '.reset-data-button',
    '.close-button',
    '.start-button',
    '.left-hex-button',
    '.right-hex-button',
    '.score-display',
    '.score-anchor',
    '#sfx-range',
    '#music-range',
    '#final-score-display',
    '#leaderboard-submit',
];
const uiSelectorsHidable = [
    '.how-to-screen',
    '.skins-menu-screen',
    '.audio-menu',
    '.title-splash',
    '.game-over-screen',
    '.end-game-first-text',
]

export const uiElements = {};
export const uiElementsHidable = {};

uiSelectors.forEach(selector => {
    const className = selector.substring(1);
    const variableName = kebabToCamel(className);

    uiElements[variableName] = document.querySelector(selector);
});
uiSelectorsHidable.forEach(selector => {
    const className = selector.substring(1);
    const variableName = kebabToCamel(className);

    uiElementsHidable[variableName] = document.querySelector(selector);
}) // TODO: update ui.js to hide correct


// Persistence TODO: move to dedicated
//-------------------------------RETRIEVAL-----------------------------------
let bkgArray = [
    "blueSpace.jpg",
    "purpleSpace.jpg",
    "JamesWebb.jpg",
    "Orbit.jpg",
    "hatSpace.png",
    "galaxyAnim.gif",
    "purpleAnim.gif",
    "blueNebulaAnim.gif"
];
bkgArray.forEach(element => {
    window[element.slice(0, -4)] = "assets/backgrounds/" + element;
});

//BKG RETRIEVAL
if (window.localStorage.getItem('bkgImg')) {
    uiElements.backgroundImg.src = JSON.parse(window.localStorage.getItem('bkgImg'));
} else {
    uiElements.backgroundImg.src = blueSpace;
    window.localStorage.setItem('bkgImg', JSON.stringify(uiElements.backgroundImg.src));
}

document.querySelector("#score-form").addEventListener("submit", (e) => {
    e.preventDefault();
    uiElementsHidable.gameOverScreen.classList.add('hidden');
    // TODO: database connection
});