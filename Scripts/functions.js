//draw functions
function drawShip(img, sX, sY, sW, sH, dX, dY, dW, dH) {
    ctx.drawImage(img, sX, sY, sW, sH, dX, dY, dW, dH);
}
function drawAst(img, dX, dY, dW, dH) {
    ctx.drawImage(img, dX, dY, dW, dH);
}

//skin changes
function changeShipSkin(skinName) {
    currentSkin = skinName;
    window.localStorage.setItem('skinName', JSON.stringify(currentSkin)); //JSON needs it to be a string, so this works by stringifying to ensure it's a string
    playSoundFX("Audio/click.wav");
}
function changeBkgSkin(bkgSkinName) {
    chosenBkg = bkgSkinName;
    backgroundAnimating = false;
    clearInterval(backgroundInterval);
    playSoundFX("Audio/click.wav");
}
function updateUnlocks() {
    //check scores
    if (!unlocks.includes("snake") && scoreArray[0] >= 100) {
        unlocks.push("snake");
    }
    if (!unlocks.includes("inverted") && scoreArray[0] >= 150) {
        unlocks.push("inverted");
    }
    if (!unlocks.includes("asteroid") && scoreArray[0] >= 250) {
        unlocks.push("asteroid");
    }
    //update skins to be Unlocked or Greyed
    if (unlocks.includes("snake")) {
        snakeSkin.classList.remove("greyed");
        snakeSkin.src = "Sprites/shipSnake.png";
        window.localStorage.setItem('unlocks', JSON.stringify(unlocks));
    } 
    else {
        snakeSkin.classList.add("greyed");
        snakeSkin.src = "Sprites/shipSnakeLocked.png";
    }
    if (unlocks.includes("inverted")) {
        invertedSkin.classList.remove("greyed");
        invertedSkin.src = "Sprites/shipAlphaInverted.png";
        window.localStorage.setItem('unlocks', JSON.stringify(unlocks));
    }
    else {
        invertedSkin.classList.add("greyed");
        invertedSkin.src = "Sprites/shipAlphaInvertedLocked.png";
    }
    if (unlocks.includes("asteroid")) {
        asteroidSkin.classList.remove("greyed");
        asteroidSkin.src = "Sprites/Asteroid.png";
        window.localStorage.setItem('unlocks', JSON.stringify(unlocks));
    }
    else {
        asteroidSkin.classList.add("greyed");
        asteroidSkin.src = "Sprites/AsteroidLocked.png";
    }
}

//score sorting
function handleScore(newScore) {
    scoreArray.push(newScore); //add new score in
    document.getElementById("finalScoreDisplay").innerHTML = score; //displays "Final Score:"
    scoreArray.sort(function (a, b) { return b - a }); //sort array
    for (i = 0; i < 5; ++i) {
        if (!scoreArray[i]) {
            scoreArray[i] = 000;
        }
        document.querySelector('.score' + i).innerHTML = scoreArray[i]; //reset each of the scores in the score screen
    }
    window.localStorage.setItem('scoreArray', JSON.stringify(scoreArray));
    while (scoreArray.length > 5) {
        scoreArray.pop();
        window.localStorage.setItem('scoreArray', JSON.stringify(scoreArray));
    }
    updateUnlocks();
}

function givePlayerImmunity(duration) {
    ship.immunity = true;
    setTimeout(function () { ship.immunity = false }, duration);
}

function openLink() {
    window.open('https://www.youtube.com/watch?v=N-xQnS2v_Og');
}

function cycleExplosionFrame() {
    if (ship.exploded && !firstDeath) {
        setInterval(function () {
            if (ship.explosionFrame < 10) {
                ship.explosionFrame++;
            }
            else {
                ship.explosionFrame = 1;
            }
        }, 100);
        ship.exploded = false;
        firstDeath = true;
    }
    else if (ship.exploded && firstDeath) {
        ship.exploded = false;
    }
}

//animation
let now, then, elapsed, fpsInterval, startTime;
function startAnimating(fps) {
    fpsInterval = 1000 / fps;
    then = Date.now();
    animate();
}
function animate() {
    requestAnimationFrame(animate);
    now = Date.now();
    elapsed = now - then;
    if (elapsed > fpsInterval) { //if frame is at correct time, animate this
        then = now - (elapsed % fpsInterval); //reset timer first
        ctx.clearRect(0, 0, canvas.width, canvas.height); //clear canvas to save memory
        if (chosenBkg.animated) {
            if (!backgroundAnimating) {
                backgroundInterval = setInterval(() => chosenBkg.cycleBackgroundFrame(), (1/60)*3000);
                backgroundAnimating = true;
            }
        }
        chosenBkg.drawBkg(); //often lags; flashing

        //which skin to display; exploded vs Skin selection
        if (gameOverT && skinsMenuScreen.classList.contains('hidden')) { //required for UI to work when opening skin menu
            explode1.src = "BlueExplosion/blue" + JSON.stringify(ship.explosionFrame) + ".png";
            cycleExplosionFrame();
            drawShip(explode1, 0, 0, 256, 256, ship.x-50, ship.y-50, ship.width+100, ship.height+100);
        }
        else {
            ship.sprite.src = currentSkin;
            drawShip(ship.sprite, ship.width * ship.frameX, ship.height * ship.frameY, ship.width, ship.height, ship.x, ship.y, ship.width, ship.height);
        }

        if (playerControl) {
            moveShip();
            drawAst(ast.sprite, ast.x, ast.y, ast.width, ast.height); //grey
            handleAsteroids(); //reds
            cheeseCD.src = "Sprites/cheeseCooldown" + JSON.stringify(cheeseCDFrame) + ".png";
            drawAst(cheeseCD, 920, 60, 64, 60);
        }

        //Scoreboard rectangle (Drawn after everything so that it's always on top)
        ctx.fillStyle = "#cf8619"; //an orange colour to contrast the blue
        ctx.fillRect(0, 0, canvas.width, sBHeight);

        //Scoreboard border (so there is a nice blue border)
        ctx.beginPath();
        ctx.strokeStyle = "rgb(0, 1, 86)";
        ctx.lineWidth = "5"; //same values as the canvas width & border
        ctx.rect(0, 0, canvas.width, sBHeight);
        ctx.stroke();

        //Score text ("SCORE=___")
        ctx.font = "bold 38px impact";
        ctx.fillStyle = "darkblue";
        ctx.textAlign = "center";
        ctx.fillText("SCORE = " + score, canvas.width / 2, 40,);
    }

    if (!backgroundMusicOn && playerControl) {
        bkgMusic.play();
    }
    else if (!menuMusicOn) {
        playMenuMusic();
    }
    else if (menuMusicOn && playerControl) {
        menuMusic.pause();
    }
    else if (gameOverT) {
        bkgMusic.pause();
    }
    updateVolume();
}

startAnimating(60);

console.log("Load Complete: " + Math.round(performance.now()) + " ms");