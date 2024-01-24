//Audio

let bkgMusic = new Audio();
let menuMusic = new Audio();
let menuMusicNumber = 0;

//Sound Effects & Elements
let soundFX = new Audio(); // misc
let dingSound = new Audio(); // level ups
dingSound.src = "Audio/ding.wav";
let popSound = new Audio(); // collects
popSound.src = "Audio/pop.ogg";

function playSoundFX(source) {
    soundFX.src = source;
    soundFX.play();
}
//--------------------------------LOAD-IN----------------------------------
//SFX volume
if (window.localStorage.getItem('sFXRange')) {
    sFXRange.value = JSON.parse(window.localStorage.getItem('sFXRange'));
} else {
    sFXRange.value = "100";
    window.localStorage.setItem('sFXRange', JSON.stringify(sFXRange.value));
}
//MUSIC volume
if (window.localStorage.getItem('musicRange')) {
    musicRange.value = JSON.parse(window.localStorage.getItem('musicRange'));
} else {
    musicRange.value = "50";
    window.localStorage.setItem('musicRange', JSON.stringify(musicRange.value));
}
//BKG MUSIC
if (!window.localStorage.getItem('bkgMusic')) {
    bkgMusic.src = "Audio/rainingBitsGundatsch.ogg";
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
    playSoundFX("Audio/click.wav");
}
function changeMenuMusic(source) {
    menuMusic.pause(); // because menu music is played during switches
    menuMusic.src = source;
    menuMusic.play();
    playSoundFX("Audio/click.wav");
}

function randomizeMenuMusic() {
    menuMusicNumber = Math.floor((Math.random() * 4));
    switch (menuMusicNumber) {
        case 0:
            menuMusic.src = "Audio/menuDeepSeaUmplix.mp3";
            break;
        case 1:
            menuMusic.src = "Audio/menuMagicSpaceCodeManu.mp3";    
            break;
        case 2:
            menuMusic.src = "Audio/menuLSLBMorris.wav";
            break;
        case 3:
            menuMusic.src = "Audio/stageSelectJJunkala.wav";
            break;
    }
}

//navigation
function prevMusicPage() {
    //if on page 1 go to page 3
    if (!musicPage1.classList.contains("hidden")) {
        musicPage1.classList.add("hidden");
        musicPage3.classList.remove("hidden");
    }
    //if on page 2 go to page 1
    else if (!musicPage2.classList.contains("hidden")) {
        musicPage2.classList.add("hidden");
        musicPage1.classList.remove("hidden");
    }
    //if on page 3 go to page 2
    else if (!musicPage3.classList.contains("hidden")) {
        musicPage3.classList.add("hidden");
        musicPage2.classList.remove("hidden");
    }
    playSoundFX("Audio/click.wav");
}
function nextMusicPage() {
    //if on page 1 go to page 2
    if (!musicPage1.classList.contains("hidden")) {
        musicPage1.classList.add("hidden");
        musicPage2.classList.remove("hidden");
    }
    //if on page 2 go to page 3
    else if (!musicPage2.classList.contains("hidden")) {
        musicPage2.classList.add("hidden");
        musicPage3.classList.remove("hidden");
    }
    //if on page 3 go to page 1
    else if (!musicPage3.classList.contains("hidden")) {
        musicPage3.classList.add("hidden");
        musicPage1.classList.remove("hidden");
    }
    playSoundFX("Audio/click.wav");
}

function updateVolume() {
    soundFX.volume = sFXRange.value / 100;
    popSound.volume = sFXRange.value / 100;
    dingSound.volume = sFXRange.value / 100;
    bkgMusic.volume = musicRange.value / 180;
    menuMusic.volume = musicRange.value / 200;
    if (sFXRange.value > 0) {
        sFXButton.src = "Audio/audioUnmuted.png";
    }
    else if (sFXRange.value == 0) {
        sFXButton.src = "Audio/audioMuted.png";
    }
    if (musicRange.value > 0) {
        musicToggleButton.src = "Audio/musicUnmuted.jpg";
    }
    else if (musicRange.value == 0) {
        musicToggleButton.src = "Audio/musicMuted.png";
    }
    window.localStorage.setItem('sFXRange', JSON.stringify(sFXRange.value));
    window.localStorage.setItem('musicRange', JSON.stringify(musicRange.value));
}

