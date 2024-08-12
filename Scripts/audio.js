//Audio

let bkgMusic = new Audio();
let menuMusic = new Audio();
let menuMusicNumber = 0;

//Sound Effects & Elements
let clickSound = new Audio(); // click in menus
clickSound.src = "Audio/click.wav";
let lvlUpSound = new Audio(); // level up
lvlUpSound.src = "Audio/success.mp3";
let dingSound = new Audio(); // cheese regen
dingSound.src = "Audio/ding.wav";
let popSound = new Audio(); // collects
popSound.src = "Audio/pop.ogg";
let explSound = new Audio(); // explosion
explSound.src = "Audio/explosion.wav";

//update: errors occuring when the same audio element is used to simultaneously make 2 sounds
//solution: make more audio elements for each unique sound
// function playSoundFX(source) {
//     soundFX.src = source;
//     soundFX.play().catch((e)=>{
//         console.log(e);
//      });
// }

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
    menuMusic.play();
}

function updateVolume() { //!!!
    //soundFX.volume = sFXRange.value / 100;
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

