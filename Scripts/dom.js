// Handles DOM selectors and UI element wiring
// Replace uiElements
// Handle UI creation


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
    '.sfx-button',
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

const uiElements = {};
const uiElementsHidable = {};

function kebabToCamel(str) { // TODO: utility .js script
    return str.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
}

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