//keyboard
window.addEventListener("keydown", function (e) { //creates an array to detect keys
    keys[e.key] = true;
    //console.log(e.key);
});
window.addEventListener("keyup", function (e) { //deletes any keys in the array to save memory
    delete keys[e.key];
});
//mobile
mBUp.addEventListener("touchStart", function() {
    keys["w"] = true;
});
mBUp.addEventListener("touchEnd", function() {
    delete keys["w"];
});
mBLeft.addEventListener("touchStart", function() {
    keys["a"] = true;
});
mBLeft.addEventListener("touchEnd", function() {
    delete keys["a"];
});
mBDown.addEventListener("touchStart", function() {
    keys["s"] = true;
});
mBDown.addEventListener("touchEnd", function() {
    delete keys["s"];
});
mBRight.addEventListener("touchStart", function() {
    keys["d"] = true;
});
mBRight.addEventListener("touchEnd", function() {
    delete keys["d"];
});

function moveShip() { //keyboard controls WASD & arrow keys; also detects collision with frame border
    detectAllCollisions();
    //up
    if ((keys["w"] || keys["ArrowUp"]) && ship.y > sBHeight) { //sBHeight is scoreboard height
        ship.y -= ship.speed;
        ship.direction = 1;
        ship.frameX = 0;
        ship.frameY = 0;
    }
    //left
    if ((keys["a"] || keys["ArrowLeft"]) && ship.x > 0) {
        ship.x -= ship.speed;
        ship.direction = 4;
        ship.frameX = 3;
        ship.frameY = 0;
    }
    //down
    if ((keys["s"] || keys["ArrowDown"]) && ship.y < canvas.height - ship.height) {
        ship.y += ship.speed;
        ship.direction = 3;
        ship.frameX = 2;
        ship.frameY = 0;
    }
    //right
    if ((keys["d"] || keys["ArrowRight"]) && ship.x < canvas.width - ship.width) {
        ship.x += ship.speed;
        ship.direction = 2;
        ship.frameX = 1;
        ship.frameY = 0;
    }
    //diagonals; needed to change ship sprites
    //Top left
    if (((keys["w"] || keys["ArrowUp"]) && ship.y > sBHeight) && ((keys["a"] || keys["ArrowLeft"]) && ship.x > 0)) {
        ship.direction = 8;
        ship.frameX = 3;
        ship.frameY = 1;
    }
    //Top right
    if (((keys["w"] || keys["ArrowUp"]) && ship.y > sBHeight) && ((keys["d"] || keys["ArrowRight"]) && ship.x < canvas.width - ship.width)) {
        ship.direction = 5;
        ship.frameX = 0;
        ship.frameY = 1;
    }
    //Bottom left
    if (((keys["s"] || keys["ArrowDown"]) && ship.y < canvas.height - ship.height) && ((keys["a"] || keys["ArrowLeft"]) && ship.x > 0)) {
        ship.direction = 7;
        ship.frameX = 2;
        ship.frameY = 1;
    }
    //Bottom right
    if (((keys["s"] || keys["ArrowDown"]) && ship.y < canvas.height - ship.height) && ((keys["d"] || keys["ArrowRight"]) && ship.x < canvas.width - ship.width)) {
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
        ship.x = canvas.width / 2 - ship.width / 2;
        ship.y = canvas.height / 2 - ship.height / 2;
        clickSound.play();
    }
}
function openMusicMenu() {
    if (musicButton.classList.contains('greyed')) {
        showEndGameText();
    }
    else if (!musicButton.classList.contains('greyed')) {
        playerControl = false;
        musicScreen.classList.toggle('hidden');
        ship.x = canvas.width / 2 - ship.width / 2;
        ship.y = canvas.height / 2 - ship.height / 2;
        clickSound.play();
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
            canvas.width = 500;
            canvas.height = 350;
            sBHeight = 30;
            padding = 20;
            tolerance = 30;
            keysControl.classList.add('hidden');
            buttonControls.classList.remove('hidden');
            mobileControls.classList.remove('hidden');
            mobileCSS.setAttribute("href", "mobile.css");
            //sprites
            currentSpeed = 1.5;
            ship.x = canvas.width / 2 - 33,
            ship.y = canvas.height / 2 - 33,
            ship.width = 32;
            ship.height = 32;
            ast.speed = 0.5;
            ast.width = 24;
            ast.height = 24;
            astRangeY = (canvas.height - padding) - (sBHeight + padding) - ast.height; //max-min -height of asteroid so it doesn't clip off
            astRangeX = (canvas.width - padding) - padding - ast.width;
            redAst = new Asteroid("redAst", "enemy", "Sprites/redAsteroid.png", ast.width, ast.height, 0, 0, false, false, 1, -1, 1);
            redAst2 = new Asteroid("redAst2", "enemy", "Sprites/redAsteroid.png", ast.width * 2, ast.height * 2, 0, 0, false, false, 0.6, -1, -1);
            redAst3 = new Asteroid("redAst3", "enemy", "Sprites/redAsteroid.png", ast.width * 3, ast.height * 3, 0, 0, false, false, 0.3, 1, 1);
            redAst4 = new Asteroid("redAst4", "enemy", "Sprites/redAsteroid.png", ast.width * 1.5, ast.height * 1.5, 0, 0, false, false, 1.5, 1, -1);
            cheese = new Asteroid("cheese", "friend", "Sprites/cheese.png", ast.width / 2, ast.height / 2, 0, 0, false);
            mobile = true;
            if (userInteracted) {
                clickSound.play();
            }
        }
        else if (mobile) { //if switching to desktop
            deviceButton.src = "desktop.png";
            //canvas
            canvas.width = 1000;
            canvas.height = 700;
            sBHeight = 50;
            padding = 30;
            tolerance = 60;
            keysControl.classList.remove('hidden');
            buttonControls.classList.add('hidden');
            //mobileControls.classList.add('hidden');
            mobileCSS.setAttribute("href", "");
            //sprites
            ship.x = canvas.width / 2 - 33,
            ship.y = canvas.height / 2 - 33,
            ship.width = 64;
            ship.height = 64;
            ast.width = 48;
            ast.height = 48;
            astRangeY = (canvas.height - padding) - (sBHeight + padding) - ast.height; //max-min -height of asteroid so it doesn't clip off
            astRangeX = (canvas.width - padding) - padding - ast.width;
            redAst = new Asteroid("redAst", "enemy", "Sprites/redAsteroid.png", ast.width, ast.height, 0, 0, false, false, 1, -1, 1);
            redAst2 = new Asteroid("redAst2", "enemy", "Sprites/redAsteroid.png", ast.width * 2, ast.height * 2, 0, 0, false, false, 0.6, -1, -1);
            redAst3 = new Asteroid("redAst3", "enemy", "Sprites/redAsteroid.png", ast.width * 3, ast.height * 3, 0, 0, false, false, 0.3, 1, 1);
            redAst4 = new Asteroid("redAst4", "enemy", "Sprites/redAsteroid.png", ast.width * 1.5, ast.height * 1.5, 0, 0, false, false, 1.5, 1, -1);
            cheese = new Asteroid("cheese", "friend", "Sprites/cheese.png", ast.width / 2, ast.height / 2, 0, 0, false);
            mobile = false;
            clickSound.play();
        }
    }
}
// update: temp change to stop annoyance
// if (window.innerWidth <= 980) {
//     changeDevice();
// }

function openSkinsMenu() {
    if (skinsButton.classList.contains('greyed')) {
        showEndGameText();
    }
    else if (!skinsButton.classList.contains('greyed')) {
        playerControl = false;
        if (skinsMenuScreen.classList.contains('hidden')) {
            ship.x = 100; //move ship to side to see skins
            ship.y = canvas.height / 2 - ship.height / 2;
            ship.frameX = 0;
            ship.frameY = 0;
        }
        if (!skinsMenuScreen.classList.contains('hidden')) {
            ship.x = canvas.width / 2 - ship.width / 2;
            ship.y = canvas.height / 2 - ship.height / 2;
            ship.frameX = 0;
            ship.frameY = 0;
        }
        skinsMenuScreen.classList.toggle('hidden');
        clickSound.play();
    }
    updateUnlocks();
}
function openAudioMenu() {
    audioMenu.classList.toggle('hidden');
    clickSound.play();
    //testing spot
}
function toggleSFX() {
    if (sFXRange.value > 0) {
        sFXRange.value = 0;
    }
    else if (sFXRange.value == 0) {
        sFXRange.value = 100;
        clickSound.play();
    }
}
function toggleMusic() {
    if (musicRange.value > 0) {
        musicRange.value = 0;
    }
    else if (musicRange.value == 0) {
        musicRange.value = 100;
        clickSound.play();
    }
}
function clearData() {
    window.localStorage.clear();
    scoreArray = [];
    unlocks = [];
    changeShipSkin('Sprites/alphaSS1.png')
    handleScore(0);
    explSound.play();
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
    menuMusic.pause();
    randomizeMenuMusic();
    menuMusic.play();
}

//-------------------------HIGHSCORES----------------------------------
function toggleScores() {
    if (scoreDisplayOpen) {
        rightButton.style.left = "98%";
        scoreDisplay.style.left = "100%";
        scoreDisplayOpen = false;
        clickSound.play();
    }
    else if (!scoreDisplayOpen) {
        rightButton.style.left = "78.8%";
        scoreDisplay.style.left = "80%";
        scoreDisplayOpen = true;
        clickSound.play();
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
startButton.addEventListener('touchstart', startGame);
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