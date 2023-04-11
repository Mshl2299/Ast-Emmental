//Audio
let currentMusic; //buffer value for music
let backgroundMusicOn = false;
let menuMusicOn = false;
let menuMusicPaused = false;

//New sounds; no sources since they need to be set every time apparently
let soundFX = new Audio();
let dingSound = new Audio();
let popSound = new Audio();

function playSoundFX(source) {
    soundFX.src = source;
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
bkgMusic.addEventListener('playing', function() {
    backgroundMusicOn = true;
})
bkgMusic.addEventListener('ended', function() {
    backgroundMusicOn = false;
})

function playBkgMusic() {
    if (!currentMusic) {
        currentMusic = "Audio/pbondoerJourney.mp3";
    }
    bkgMusic.src = currentMusic;
    if (!backgroundMusicOn) {
        bkgMusic.play();
    }
}
function changeBkgMusic(source) {
    currentMusic = source;
    playSoundFX("Audio/click.wav");
}

//menu music
let menuMusic = new Audio();
menuMusic.addEventListener('playing', function() {
    menuMusicOn = true;
})
menuMusic.addEventListener('ended', function() {
    menuMusicOn = false;
})
menuMusic.addEventListener('pause', function() {
    menuMusicPaused = true;
})
function playMenuMusic() {
    if (!menuMusic.src) {
        menuMusic.src = "Audio/deep_sea.mp3";
    }
    if (userInteracted && (!menuMusicOn || menuMusicPaused)) {
        menuMusic.play();
    }
}
//menu music start thing to make chrome happy
document.body.addEventListener('click', function () {
    userInteracted = true;
})
