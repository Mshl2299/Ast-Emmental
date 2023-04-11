window.addEventListener("keydown", function (e) { //creates an array to detect keys
    keys[e.key] = true;
    //console.log(e.key);
});
window.addEventListener("keyup", function (e) { //deletes any keys in the array to save memory
    delete keys[e.key];
});

function moveShip() { //keyboard controls WASD & arrow keys; also detects collision with frame border
    detectAllCollisions();
    if (keys["w"] && ship.y > sBHeight || keys["ArrowUp"] && ship.y > sBHeight) { //sBHeight is scoreboard height
        ship.y -= ship.speed;
        ship.direction = 1;
        ship.frameX = 0;
        ship.frameY = 0;
    }
    if (keys["a"] && ship.x > 0 || keys["ArrowLeft"] && ship.x > 0) {
        ship.x -= ship.speed;
        ship.direction = 4;
        ship.frameX = 3;
        ship.frameY = 0;
    }
    if (keys["s"] && ship.y < canvas.height - ship.height || keys["ArrowDown"] && ship.y < canvas.height - ship.height) {
        ship.y += ship.speed;
        ship.direction = 3;
        ship.frameX = 2;
        ship.frameY = 0;
    }
    if (keys["d"] && ship.x < canvas.width - ship.width || keys["ArrowRight"] && ship.x < canvas.width - ship.width) {
        ship.x += ship.speed;
        ship.direction = 2;
        ship.frameX = 1;
        ship.frameY = 0;
    }
    //diagonals
    if ((keys["w"] && ship.y > sBHeight || keys["ArrowUp"] && ship.y > sBHeight) && (keys["a"] && ship.x > 0 || keys["ArrowLeft"] && ship.x > 0)) {
        ship.y -= ship.speed / 16;
        ship.x -= ship.speed / 16;
        ship.direction = 8;
        ship.frameX = 3;
        ship.frameY = 1;
    }
    if ((keys["w"] && ship.y > sBHeight || keys["ArrowUp"] && ship.y > sBHeight) && (keys["d"] && ship.x < canvas.width - ship.width || keys["ArrowRight"] && ship.x < canvas.width - ship.width)) {
        ship.y -= ship.speed / 16;
        ship.x += ship.speed / 16;
        ship.direction = 5;
        ship.frameX = 0;
        ship.frameY = 1;
    }
    if ((keys["s"] && ship.y < canvas.height - ship.height || keys["ArrowDown"] && ship.y < canvas.height - ship.height) && (keys["a"] && ship.x > 0 || keys["ArrowLeft"] && ship.x > 0)) {
        ship.y += ship.speed / 16;
        ship.x -= ship.speed / 16;
        ship.direction = 7;
        ship.frameX = 2;
        ship.frameY = 1;
    }
    if ((keys["s"] && ship.y < canvas.height - ship.height || keys["ArrowDown"] && ship.y < canvas.height - ship.height) && (keys["d"] && ship.x < canvas.width - ship.width || keys["ArrowRight"] && ship.x < canvas.width - ship.width)) {
        ship.y += ship.speed / 16;
        ship.x += ship.speed / 16;
        ship.direction = 6;
        ship.frameX = 1;
        ship.frameY = 1;
    }
}

//------------------------------LEFT SIDE--------------------------------
function openHowTo() {
    if (howToButton.classList.contains('greyed')) {
        showEndGameText();
    }
    else if (!howToButton.classList.contains('greyed')) {
        playerControl = false;
        howToScreen.classList.toggle('hidden'); //toggles how to screen
        ship.x = canvas.width/2 - ship.width/2;
        ship.y = canvas.height/2 - ship.height/2;
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
        ship.x = canvas.width/2 - ship.width/2;
        ship.y = canvas.height/2 - ship.height/2;
        playSoundFX("Audio/click.wav");
        playMenuMusic();
    }
}

//--------------------------RIGHT SIDE------------------------------------
function changeDevice() {
    if (deviceButton.classList.contains('greyed')) {
        showEndGameText();
    }
    else if (!deviceButton.classList.contains('greyed')) {
        if (!mobile) { //if switching to mobile
            deviceButton.src = "mobile.png";
            //canvas & css
            canvas.width = 600;
            canvas.height = 420; 
            mobileCSS.setAttribute("href", "mobile.css");
            //sprites
            ship.x = canvas.width/2 - 33,
            ship.y = canvas.height/2 - 33,
            mobile = true;
            playSoundFX("Audio/click.wav");
        }
        else if (mobile) { //if switching to desktop
            deviceButton.src = "desktop.png";
            //canvas
            canvas.width = 1000;
            canvas.height = 700;
            mobileCSS.setAttribute("href", "");
            //sprites
            ship.x = canvas.width/2 - 33,
            ship.y = canvas.height/2 - 33,
            mobile = false;
            playSoundFX("Audio/click.wav");
        }
    }
}
function openSkinsMenu() {
    if (skinsButton.classList.contains('greyed')) {
        showEndGameText();
    }
    else if (!skinsButton.classList.contains('greyed')) {
        playerControl = false;
        if (skinsMenuScreen.classList.contains('hidden')) {
            ship.x = 100; //move ship to side to see skins
            ship.y = canvas.height/2 - ship.height/2;
            ship.frameX = 0;
            ship.frameY = 0;
        }
        if (!skinsMenuScreen.classList.contains('hidden')) {
            ship.x = canvas.width/2 - ship.width/2;
            ship.y = canvas.height/2 - ship.height/2;
            ship.frameX = 0;
            ship.frameY = 0;
        }        
        skinsMenuScreen.classList.toggle('hidden');
        playSoundFX("Audio/click.wav");
        playMenuMusic();
    }
    updateUnlocks();
}
function openAudioMenu() {
    audioMenu.classList.toggle('hidden');
    playSoundFX("Audio/click.wav");
    //testing spot
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
function clearData() {
    window.localStorage.clear();
    scoreArray = [];
    unlocks = [];
    handleScore(0);
    playSoundFX('Audio/explosion.wav');
    console.log("Data Successfully Cleared.");
    console.log(window.localStorage);
}
function closeAll() {
    gameOver();
    //closes all UI
    gameOverScreen.classList.add('hidden');
    howToScreen.classList.add('hidden');
    musicScreen.classList.add('hidden');
    audioMenu.classList.add('hidden');
    skinsMenuScreen.classList.add('hidden'); 
    ship.x = canvas.width/2 - ship.width/2;
    ship.y = canvas.height/2 - ship.height/2;
    randomizeMenuMusic();
    playMenuMusic();
}

//-------------------------HIGHSCORES----------------------------------
function toggleScores() {
    if (scoreDisplayOpen) {
        rightButton.style.left = "98%";
        scoreDisplay.style.left = "100%";
        scoreDisplayOpen = false;
        playSoundFX("Audio/click.wav");
    }
    else if (!scoreDisplayOpen) {
        rightButton.style.left = "78.8%";
        scoreDisplay.style.left = "80%";
        scoreDisplayOpen = true;
        playSoundFX("Audio/click.wav");
    }
}
//-------------------------OTHER-------------------------------
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

startButton.addEventListener('click', startGame);
closeButton.addEventListener('click', closeAll);

howToButton.addEventListener('click', openHowTo);
musicButton.addEventListener('click', openMusicMenu);
prevPageButton.addEventListener('click', prevMusicPage);
nextPageButton.addEventListener('click', nextMusicPage);

deviceButton.addEventListener('click', changeDevice);
skinsButton.addEventListener('click', openSkinsMenu);
audioButton.addEventListener('click', openAudioMenu);

rightButton.addEventListener('click', toggleScores);
scoreDisplay.addEventListener('click', toggleScores);