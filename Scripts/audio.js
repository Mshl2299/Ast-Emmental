//Audio

let bkgMusic = new Audio();
let menuMusic = new Audio();
let menuMusicNumber = 0;

//Sound Effects & Elements
// TODO: convert to an object that stores all sounds
let clickSound = new Audio(); // click in menus
clickSound.src = "assets/audio/click.wav";
let lvlUpSound = new Audio(); // level up
lvlUpSound.src = "assets/audio/success.mp3";
let dingSound = new Audio(); // cheese regen
dingSound.src = "assets/audio/ding.wav";
let explSound = new Audio(); // explosion
explSound.src = "assets/audio/explosion.wav";

let popSoundVolume = 1;
function playPop() {
    const s = new Audio("assets/audio/pop.ogg");
    s.volume = popSoundVolume;
    s.play();
  }

//--------------------------------AUDIO SETTINGS----------------------------------
//SFX volume
if (window.localStorage.getItem('sfxRange')) {
    uiElements.sfxRange.value = JSON.parse(window.localStorage.getItem('sfxRange'));
} else {
    uiElements.sfxRange.value = "100";
    window.localStorage.setItem('sfxRange', JSON.stringify(uiElements.sfxRange.value));
}
//MUSIC volume
if (window.localStorage.getItem('musicRange')) {
    uiElements.musicRange.value = JSON.parse(window.localStorage.getItem('musicRange'));
} else {
    uiElements.musicRange.value = "50";
    window.localStorage.setItem('musicRange', JSON.stringify(uiElements.musicRange.value));
}
//BKG MUSIC
if (!window.localStorage.getItem('bkgMusic')) {
    bkgMusic.src = "assets/audio/rainingBitsGundatsch.ogg";
    window.localStorage.setItem('bkgMusic', JSON.stringify(bkgMusic.src));
} else {
    bkgMusic.src = JSON.parse(window.localStorage.getItem('bkgMusic'));
}
//MENU MUSIC
if (!window.localStorage.getItem('menuMusic')) {
    randomizeMenuMusic();
    window.localStorage.setItem('menuMusic', JSON.stringify(menuMusic.src));
} else {
    menuMusic.src = JSON.parse(window.localStorage.getItem('menuMusic'));
}
//--------------------------------MUSIC-------------------------
function changeBkgMusic(source) {
    bkgMusic.src = source;
    clickSound.play();
}
function changeMenuMusic(source) {
    menuMusic.pause(); // because menu music is played during switches
    menuMusic.src = source;
    menuMusic.play();
    clickSound.play();
}

function randomizeMenuMusic() {
    menuMusic.pause();
    menuMusicNumber = Math.floor((Math.random() * 4));
    switch (menuMusicNumber) {
        case 0:
            menuMusic.src = "assets/audio/menuDeepSeaUmplix.mp3";
            break;
        case 1:
            menuMusic.src = "assets/audio/menuMagicSpaceCodeManu.mp3";    
            break;
        case 2:
            menuMusic.src = "assets/audio/menuLSLBMorris.wav";
            break;
        case 3:
            menuMusic.src = "assets/audio/stageSelectJJunkala.wav";
            break;
    }
    menuMusic.play();
}

function updateVolume() { // !!! TODO
    //soundFX.volume = sfxRange.value / 100;
    popSoundVolume = uiElements.sfxRange.value / 100;
    dingSound.volume = uiElements.sfxRange.value / 100;
    bkgMusic.volume = uiElements.musicRange.value / 180;
    menuMusic.volume = uiElements.musicRange.value / 200;
    if (uiElements.sfxRange.value > 0) {
        uiElements.sfxButton.src = "assets/images/audioUnmuted.png";
    }
    else if (uiElements.sfxRange.value == 0) {
        uiElements.sfxButton.src = "assets/images/audioMuted.png";
    }
    if (uiElements.musicRange.value > 0) {
        uiElements.musicToggleButton.src = "assets/images/musicUnmuted.jpg";
    }
    else if (uiElements.musicRange.value == 0) {
        uiElements.musicToggleButton.src = "assets/images/musicMuted.png";
    }
    window.localStorage.setItem('sfxRange', JSON.stringify(uiElements.sfxRange.value));
    window.localStorage.setItem('musicRange', JSON.stringify(uiElements.musicRange.value));
}

