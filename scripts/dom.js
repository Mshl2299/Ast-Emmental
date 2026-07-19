// Handles UI element selection & DOM (Document Object Model)
// Static; all event listeners should be in ui.js
import { kebabToCamel } from "./utils.js";

//canvas
// const canvasContainer = document.querySelector('.canvas-container');
export const canvas = document.getElementById('canvas');
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
});

export function addUIElement(name, element) {
    uiElements[kebabToCamel(name)] = element;
}

export function addUIElementHidable(name, element) {
    uiElementsHidable[kebabToCamel(name)] = element;
}
