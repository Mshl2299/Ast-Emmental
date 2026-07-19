// Handles all read/write to local storage.
// This should be the only script where window.localStorage appears.
import { SPRITES_PATH, SKINS_MAP, BKG_PATH, BKG_SKINS_MAP } from "./ui/skins.js";
import { STATE, DEFAULT_STATE } from "./game/state.js";
import { AUDIO } from "./audio.js";
import { updateScoresHTML, updateUnlocks } from "./ui/ui.js";
import { uiElements } from "./dom.js";

// AUDIO
// Retrieve and apply audio settings from localStorage
// uiElements should contain: sfxRange, musicRange, sfxToggleButton, musicToggleButton
export function retrieveAudioSettings() {
    // SFX volume
    if (window.localStorage.getItem("sfxRange")) {
        uiElements.sfxRange.value = JSON.parse(window.localStorage.getItem("sfxRange"));
    } else {
        uiElements.sfxRange.value = "100";
        window.localStorage.setItem("sfxRange", JSON.stringify(uiElements.sfxRange.value));
    }

    // MUSIC volume
    if (window.localStorage.getItem("musicRange")) {
        uiElements.musicRange.value = JSON.parse(window.localStorage.getItem("musicRange"));
    } else {
        uiElements.musicRange.value = "50";
        window.localStorage.setItem("musicRange", JSON.stringify(uiElements.musicRange.value));
    }

    // BKG MUSIC
    if (!window.localStorage.getItem("bkgMusic")) {
        AUDIO.bkgMusic.src = "assets/audio/rainingBitsGundatsch.ogg";
        window.localStorage.setItem("bkgMusic", JSON.stringify(AUDIO.bkgMusic.src));
    } else {
        AUDIO.bkgMusic.src = JSON.parse(window.localStorage.getItem("bkgMusic"));
    }

    // MENU MUSIC
    if (!window.localStorage.getItem("menuMusic")) {
        AUDIO.randomizeMenuMusic();
        window.localStorage.setItem("menuMusic", JSON.stringify(AUDIO.menuMusic.src));
    } else {
        AUDIO.menuMusic.src = JSON.parse(window.localStorage.getItem("menuMusic"));
    }

    // Apply initial volumes and UI icons
    AUDIO.updateVolume(uiElements);
};

export function storeAudioSettings() {
    const sfxVal = Number(uiElements.sfxRange.value);
    const musicVal = Number(uiElements.musicRange.value);

    window.localStorage.setItem("sfxRange", JSON.stringify(String(sfxVal)));
    window.localStorage.setItem("musicRange", JSON.stringify(String(musicVal)));
}

// SCORES
// Retreives local leaderboard from localScores, fill with 0's
export function retrieveLocalScores() {
    if (window.localStorage.getItem('localScores')) {
        STATE.scores = JSON.parse(window.localStorage.getItem('localScores'));

        updateScoresHTML();

        console.log("Highscores retrieved. " + STATE.scores);
    }
}

export function storeLocalScores() {
    window.localStorage.setItem('localScores', JSON.stringify(STATE.scores));
}

// BKG 
export function resetBkgImg() {
    uiElements.backgroundImg.src = BKG_PATH + BKG_SKINS_MAP['blueSpace'].unlockedImage;
    window.localStorage.setItem('bkgImg', JSON.stringify('blueSpace'));
}

export function retrieveBackground() {
    if (window.localStorage.getItem('bkgImg')) {
        const id = JSON.parse(window.localStorage.getItem('bkgImg'));
        uiElements.backgroundImg.src = BKG_PATH + BKG_SKINS_MAP[id].unlockedImage;
    } else {
        resetBkgImg();
    }
}

// SHIP SPRITE
export function retrieveShipSkin() {
    const stored = window.localStorage.getItem('shipSkin');
    if (!stored) storeShipSkin('alpha');

    const shipSkin = JSON.parse(stored);
    STATE.ship.currentSkin = shipSkin;
    STATE.ship.image.src = SPRITES_PATH + SKINS_MAP[STATE.ship.currentSkin].spriteSheet;
}

// skinId: String; key of SKINS_MAP
export function storeShipSkin(skinId) {
    window.localStorage.setItem('shipSkin', JSON.stringify(skinId));
}


// TODO: default unlocks; baking thing with default unlocks
export function retrieveUnlocks() {
    const stored = window.localStorage.getItem('unlocks');
    if (!stored) return;
    STATE.unlocks = JSON.parse(stored);
}

// Clear everything in localStorage and reset global variables
export function clearData() {
    window.localStorage.clear();
    updateScoresHTML();

    Object.assign(STATE, DEFAULT_STATE);

    STATE.ship.resetSkin();
    resetBkgImg();

    updateUnlocks();
    
    AUDIO.playSFX('explosion');
    console.log("Data Successfully Cleared.");
    console.log(window.localStorage);
}


// bkgId: String; a key of BKG_SKINS_MAP
export function storeBackground(bkgId) {
    window.localStorage.setItem('bkgImg', JSON.stringify(bkgId));
}

// unlocks: String[]
export function storeUnlocks(unlocks) {
    window.localStorage.setItem('unlocks', JSON.stringify(unlocks));
}

// load from persisent data
export function retrieveAll() {
    retrieveLocalScores();
    retrieveShipSkin();
    retrieveBackground();
    retrieveAudioSettings();
    retrieveUnlocks();
}
