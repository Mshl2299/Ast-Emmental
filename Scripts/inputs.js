window.addEventListener("keydown", function (e) { //creates an array to detect keys
    keys[e.key] = true;
    //console.log(e.key);
});
window.addEventListener("keyup", function (e) { //deletes any keys in the array to save memory
    delete keys[e.key];
});

let speedMultiplier = 1.2;

function moveShip() { //keyboard controls WASD & arrow keys; also detects collision with frame border
    if (keys["w"] && ship.y > sBHeight || keys["ArrowUp"] && ship.y > sBHeight) { //sBHeight is scoreboard height
        ship.y -= ship.speed * speedMultiplier;
        ship.direction = 1;
        ship.frameX = 0;
        ship.frameY = 0;
    }
    if (keys["a"] && ship.x > 0 || keys["ArrowLeft"] && ship.x > 0) {
        ship.x -= ship.speed * speedMultiplier;
        ship.direction = 4;
        ship.frameX = 3;
        ship.frameY = 0;
    }
    if (keys["s"] && ship.y < canvas.height - ship.height || keys["ArrowDown"] && ship.y < canvas.height - ship.height) {
        ship.y += ship.speed * speedMultiplier;
        ship.direction = 3;
        ship.frameX = 2;
        ship.frameY = 0;
    }
    if (keys["d"] && ship.x < canvas.width - ship.width || keys["ArrowRight"] && ship.x < canvas.width - ship.width) {
        ship.x += ship.speed * speedMultiplier;
        ship.direction = 2;
        ship.frameX = 1;
        ship.frameY = 0;
    }
    //diagonals
    if ((keys["w"] && ship.y > sBHeight || keys["ArrowUp"] && ship.y > sBHeight) && (keys["a"] && ship.x > 0 || keys["ArrowLeft"] && ship.x > 0)) {
        ship.y -= ship.speed / 16 * speedMultiplier;
        ship.x -= ship.speed / 16 * speedMultiplier;
        ship.direction = 8;
        ship.frameX = 3;
        ship.frameY = 1;
    }
    if ((keys["w"] && ship.y > sBHeight || keys["ArrowUp"] && ship.y > sBHeight) && (keys["d"] && ship.x < canvas.width - ship.width || keys["ArrowRight"] && ship.x < canvas.width - ship.width)) {
        ship.y -= ship.speed / 16 * speedMultiplier;
        ship.x += ship.speed / 16 * speedMultiplier;
        ship.direction = 5;
        ship.frameX = 0;
        ship.frameY = 1;
    }
    if ((keys["s"] && ship.y < canvas.height - ship.height || keys["ArrowDown"] && ship.y < canvas.height - ship.height) && (keys["a"] && ship.x > 0 || keys["ArrowLeft"] && ship.x > 0)) {
        ship.y += ship.speed / 16 * speedMultiplier;
        ship.x -= ship.speed / 16 * speedMultiplier;
        ship.direction = 7;
        ship.frameX = 2;
        ship.frameY = 1;
    }
    if ((keys["s"] && ship.y < canvas.height - ship.height || keys["ArrowDown"] && ship.y < canvas.height - ship.height) && (keys["d"] && ship.x < canvas.width - ship.width || keys["ArrowRight"] && ship.x < canvas.width - ship.width)) {
        ship.y += ship.speed / 16 * speedMultiplier;
        ship.x += ship.speed / 16 * speedMultiplier;
        ship.direction = 6;
        ship.frameX = 1;
        ship.frameY = 1;
    }
}

function toggleAudio() {
    if (bkgMusic.volume > 0) {
        bkgMusic.volume = 0;
        soundFX.volume = 0;
        popSound.volume = 0;
        muteIcon.src = "Audio/audioMuted.png";
    }   
    else if (bkgMusic.volume == 0) {
        bkgMusic.volume = 0.2;
        soundFX.volume = 1;
        popSound.volume = 1;
        muteIcon.src = "Audio/audioUnmuted.png";
        playSoundFX("Audio/click.wav");
    }   
}
function openSkinsMenu() {
    playerControl = false; //stops collisions
    skinsMenuScreen.classList.toggle('hidden'); //toggles skin selection screen
    ship.x = 100; //move the ship into view to see skin changes real time
    ship.y = 310;
    ship.frameX = 0;
    ship.frameY =0;
    playSoundFX("Audio/click.wav");
    playMenuMusic();
}

function openHowTo() {
    playerControl = false;
    howToScreen.classList.toggle('hidden'); //toggles how to screen
    ship.x = 460;
    ship.y = 310;
    playSoundFX("Audio/click.wav");
    playMenuMusic();
}

function openMusicMenu() {
    playerControl = false;
    musicScreen.classList.toggle('hidden');
    ship.x = 460;
    ship.y = 310;
    playSoundFX("Audio/click.wav");
    playMenuMusic();
}

function closeAll() {
    skinsMenuScreen.classList.add('hidden'); //closes all UI
    howToScreen.classList.add('hidden');
    gameOverScreen.classList.add('hidden');
    musicScreen.classList.add('hidden');
    ship.x = 460;
    ship.y = 310;
    playSoundFX("Audio/click.wav");
    playMenuMusic();
}

startButton.addEventListener('click', startGame);
muteButton.addEventListener('click', toggleAudio);
skinsButton.addEventListener('click', openSkinsMenu);
howToButton.addEventListener('click', openHowTo);
musicButton.addEventListener('click', openMusicMenu)
closeButton.addEventListener('click', closeAll);
