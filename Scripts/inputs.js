window.addEventListener("keydown", function (e) { //creates an array to detect keys
    keys[e.key] = true;
    //console.log(e.key);
});
window.addEventListener("keyup", function (e) { //deletes any keys in the array to save memory
    delete keys[e.key];
});

let speedModifier = 2;
function moveShip() { //keyboard controls WASD & arrow keys; also detects collision with frame border
    if (keys["w"] && ship.y > sBHeight || keys["ArrowUp"] && ship.y > sBHeight) { //sBHeight is scoreboard height
        ship.y -= ship.speed * speedModifier;
        ship.direction = 1;
        ship.frameX = 0;
        ship.frameY = 0;
    }
    if (keys["a"] && ship.x > 0 || keys["ArrowLeft"] && ship.x > 0) {
        ship.x -= ship.speed * speedModifier;
        ship.direction = 4;
        ship.frameX = 3;
        ship.frameY = 0;
    }
    if (keys["s"] && ship.y < canvas.height - ship.height || keys["ArrowDown"] && ship.y < canvas.height - ship.height) {
        ship.y += ship.speed * speedModifier;
        ship.direction = 3;
        ship.frameX = 2;
        ship.frameY = 0;
    }
    if (keys["d"] && ship.x < canvas.width - ship.width || keys["ArrowRight"] && ship.x < canvas.width - ship.width) {
        ship.x += ship.speed * speedModifier;
        ship.direction = 2;
        ship.frameX = 1;
        ship.frameY = 0;
    }
    //diagonals
    if ((keys["w"] && ship.y > sBHeight || keys["ArrowUp"] && ship.y > sBHeight) && (keys["a"] && ship.x > 0 || keys["ArrowLeft"] && ship.x > 0)) {
        ship.y -= ship.speed / 16 * speedModifier;
        ship.x -= ship.speed / 16 * speedModifier;
        ship.direction = 8;
        ship.frameX = 3;
        ship.frameY = 1;
    }
    if ((keys["w"] && ship.y > sBHeight || keys["ArrowUp"] && ship.y > sBHeight) && (keys["d"] && ship.x < canvas.width - ship.width || keys["ArrowRight"] && ship.x < canvas.width - ship.width)) {
        ship.y -= ship.speed / 16 * speedModifier;
        ship.x += ship.speed / 16 * speedModifier;
        ship.direction = 5;
        ship.frameX = 0;
        ship.frameY = 1;
    }
    if ((keys["s"] && ship.y < canvas.height - ship.height || keys["ArrowDown"] && ship.y < canvas.height - ship.height) && (keys["a"] && ship.x > 0 || keys["ArrowLeft"] && ship.x > 0)) {
        ship.y += ship.speed / 16 * speedModifier;
        ship.x -= ship.speed / 16 * speedModifier;
        ship.direction = 7;
        ship.frameX = 2;
        ship.frameY = 1;
    }
    if ((keys["s"] && ship.y < canvas.height - ship.height || keys["ArrowDown"] && ship.y < canvas.height - ship.height) && (keys["d"] && ship.x < canvas.width - ship.width || keys["ArrowRight"] && ship.x < canvas.width - ship.width)) {
        ship.y += ship.speed / 16 * speedModifier;
        ship.x += ship.speed / 16 * speedModifier;
        ship.direction = 6;
        ship.frameX = 1;
        ship.frameY = 1;
    }
}

function closeAll() {
    gameOver();
    skinsMenuScreen.classList.add('hidden'); //closes all UI
    howToScreen.classList.add('hidden');
    gameOverScreen.classList.add('hidden');
    musicScreen.classList.add('hidden');
    ship.x = 460;
    ship.y = 310;
    playMenuMusic();
}

function showEndGameText() {
    clearInterval(eGTInterval);
    eGTCount = 0;
    eGTFlash();
    eGTInterval = setInterval(eGTFlash, 600);
}
function eGTFlash() {
    if (eGTCount > 3) {
        clearInterval(eGTInterval);
        endGameText.classList.add('hidden');
    }
    else if (eGTCount % 2 == 0) {
        endGameText.classList.remove('hidden');
        eGTCount += 1;
    }
    else if (eGTCount % 2 != 0) {
        endGameText.classList.add('hidden');
        eGTCount += 1;
    }
}

function openHowTo() {
    if (howToButton.classList.contains('greyed')) {
        showEndGameText();
    }
    else if (!howToButton.classList.contains('greyed')) {
        playerControl = false;
        howToScreen.classList.toggle('hidden'); //toggles how to screen
        ship.x = 460;
        ship.y = 310;
        playSoundFX("Audio/click.wav");
        playMenuMusic();
    }
}
function openSkinsMenu() {
    if (skinsButton.classList.contains('greyed')) {
        showEndGameText();
    }
    else if (!skinsButton.classList.contains('greyed')) {
        playerControl = false; //stops collisions
        skinsMenuScreen.classList.toggle('hidden'); //toggles skin selection screen
        ship.x = 100; //move the ship into view to see skin changes real time
        ship.y = 310;
        ship.frameX = 0;
        ship.frameY = 0;
        playSoundFX("Audio/click.wav");
        playMenuMusic();
    }
}
function openMusicMenu() {
    if (musicButton.classList.contains('greyed')) {
        showEndGameText();
    }
    else if (!musicButton.classList.contains('greyed')) {
        playerControl = false;
        musicScreen.classList.toggle('hidden');
        ship.x = 460;
        ship.y = 310;
        playSoundFX("Audio/click.wav");
        playMenuMusic();
    }
}

//Audio menu
function openAudioMenu() {
    audioMenu.classList.toggle('hidden');
    playSoundFX("Audio/click.wav");
}
function toggleSFX() {
    if (sFXRange.value > 0) {
        sFXRange.value = 0;
    }
    else if (sFXRange.value == 0) {
        sFXRange.value = 100;
        playSoundFX("Audio/click.wav");
    }
}
function toggleMusic() {
    if (musicRange.value > 0) {
        musicRange.value = 0;
    }
    else if (musicRange.value == 0) {
        musicRange.value = 100;
        playSoundFX("Audio/click.wav");
    }
}

//scores display
function toggleScores() {
    if (scoreDisplayOpen) {
        rightButton.style.left = "98%";
        scoreDisplay.style.left = "100%";
        scoreDisplayOpen = false;
    }
    else if (!scoreDisplayOpen) {
        rightButton.style.left = "78.8%";
        scoreDisplay.style.left = "80%";
        scoreDisplayOpen = true;
    }
}

startButton.addEventListener('click', startGame);
closeButton.addEventListener('click', closeAll);

howToButton.addEventListener('click', openHowTo);
skinsButton.addEventListener('click', openSkinsMenu);
musicButton.addEventListener('click', openMusicMenu);

audioButton.addEventListener('click', openAudioMenu);
rightButton.addEventListener('click', toggleScores);
scoreDisplay.addEventListener('click', toggleScores);

