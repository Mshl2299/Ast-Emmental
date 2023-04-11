//Audio
let currentMusic; //buffer var for music
let backgroundMusicOn = false;
let menuMusicOn = false;
let menuMusicPaused = false;

//New sounds; no sources since they need to be set every time apparently
let soundFX = new Audio();
let dingSound = new Audio();
let popSound = new Audio();

function playSoundFX(source) {
    soundFX.src = source; //source being changed too often; interrupting audio loading
    soundFX.play();
}
function playDingSound() {
    dingSound.src = "Audio/ding.wav";
    dingSound.play();
}
function playPopSound() {
    popSound.src = "Audio/pop.ogg"; //need to reset the audio source everytime
    popSound.play();
}

//background music
let bkgMusic = new Audio();
bkgMusic.addEventListener('playing', function () {
    backgroundMusicOn = true;
})
bkgMusic.addEventListener('ended', function () {
    if (bkgMusic.src == "http://127.0.0.1:5500/Audio/NESBossIntroSketchyLogic.wav") {
        currentMusic = "Audio/NESBossMainSketchyLogic.wav";
        bkgMusic.src = currentMusic;
    }
    bkgMusic.play();
})

let introPlayed = false;
function playBkgMusic() {
    if (!currentMusic) {
        currentMusic = "Audio/rainingBitsGundatsch.ogg";
    }
    bkgMusic.src = currentMusic;
}

function changeBkgMusic(source) {
    currentMusic = source;
    playSoundFX("Audio/click.wav");
}

//menu music
let menuMusic = new Audio();
let menuMusicNumber = 0;
menuMusic.addEventListener('playing', function () {
    menuMusicOn = true;
})
menuMusic.addEventListener('ended', function () {
    menuMusicOn = false;
})
menuMusic.addEventListener('pause', function () {
    menuMusicPaused = true;
})

function randomizeMenuMusic() {
    menuMusic.pause();
    menuMusicNumber = Math.floor((Math.random() * 3) + 1);
    switch (menuMusicNumber) {
        case 1:
            menuMusic.src = "Audio/menuDeepSeaUmplix.mp3";
            break;
        case 2:
            menuMusic.src = "Audio/menuMagicSpaceCodeManu.mp3";    
            break;
        case 3:
            menuMusic.src = "Audio/menuLSLBMorris.wav";
            break;
    }
    if (userInteracted) {
        menuMusic.play();
    }
}

function changeMenuMusic(source) {
    menuMusic.pause();
    menuMusic.src = source;
    menuMusic.play();
    playSoundFX("Audio/click.wav");
}

function playMenuMusic() {
    if (!menuMusic.src) {
        randomizeMenuMusic();
    }
    if (userInteracted && (!menuMusicOn || menuMusicPaused)) {
        menuMusic.play();
    }
}

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

//menu music start thing to make chrome happy
document.body.addEventListener('click', function () {
    userInteracted = true;
})
