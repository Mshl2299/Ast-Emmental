//draw functions
function drawShip(img, sX, sY, sW, sH, dX, dY, dW, dH) {
    ctx.drawImage(img, sX, sY, sW, sH, dX, dY, dW, dH);
}
function drawAst(img, dX, dY, dW, dH) {
    ctx.drawImage(img, dX, dY, dW, dH);
}

//skin changes
function changeShipSkin(skinName) {
    if (window.localStorage.getItem('unlocks') && JSON.parse(window.localStorage.getItem('unlocks')).includes(skinName)) {
        currentSkin = skinName;
    } else if (defaultUnlocks.includes(skinName)) {
        currentSkin = skinName;
    }
    window.localStorage.setItem('skinName', JSON.stringify(currentSkin)); //JSON needs it to be a string, so this works by stringifying to ensure it's a string
    playSoundFX("Audio/click.wav");
}
function changeBkgSkin(bkgSkinName) {
    backgroundImg.src = bkgSkinName;
    window.localStorage.setItem('bkgImg', JSON.stringify(backgroundImg.src));
    playSoundFX("Audio/click.wav");
}
function updateUnlocks() {
    //check scores
    if (!unlocks.includes("Sprites/snakeSS1.png") && scoreArray[0] >= 100) {
        unlocks.push("Sprites/snakeSS1.png");
    }
    if (!unlocks.includes("Sprites/alphaInvertedSS1.png") && scoreArray[0] >= 150) {
        unlocks.push("Sprites/alphaInvertedSS1.png");
    }
    if (!unlocks.includes("Sprites/asteroidSS1.png") && scoreArray[0] >= 250) {
        unlocks.push("Sprites/asteroidSS1.png");
    }
    //update skins to be Unlocked or Greyed
    if (unlocks.includes("Sprites/snakeSS1.png")) {
        snakeSkin.classList.remove("greyed");
        snakeSkin.src = "Sprites/shipSnake.png"; //html image
        window.localStorage.setItem('unlocks', JSON.stringify(unlocks));
    }
    else {
        snakeSkin.classList.add("greyed");
        snakeSkin.src = "Sprites/shipSnakeLocked.png";
    }
    if (unlocks.includes("Sprites/alphaInvertedSS1.png")) {
        invertedSkin.classList.remove("greyed");
        invertedSkin.src = "Sprites/shipAlphaInverted.png";
        window.localStorage.setItem('unlocks', JSON.stringify(unlocks));
    }
    else {
        invertedSkin.classList.add("greyed");
        invertedSkin.src = "Sprites/shipAlphaInvertedLocked.png";
    }
    if (unlocks.includes("Sprites/asteroidSS1.png")) {
        asteroidSkin.classList.remove("greyed");
        asteroidSkin.src = "Sprites/asteroidSS1.png";
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
            scoreArray[i] = 0;
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
    now = Date.now();
    elapsed = now - then;
    if (elapsed > fpsInterval) { //if frame is at correct time, animate this
        then = now - (elapsed % fpsInterval); //reset timer first
        ctx.clearRect(0, 0, canvas.width, canvas.height); //clear canvas to save memory


        //which skin to display; exploded vs Skin selection
        if (gameOverT && skinsMenuScreen.classList.contains('hidden')) { //required for UI to work when opening skin menu
            explode1.src = "BlueExplosion/blue" + JSON.stringify(ship.explosionFrame) + ".png";
            cycleExplosionFrame();
            drawShip(explode1, 0, 0, 256, 256, ship.x - 50, ship.y - 50, ship.width + 100, ship.height + 100);
        }
        else {
            ship.sprite.src = currentSkin;
            drawShip(ship.sprite, 67 * ship.frameX, 66 * ship.frameY, 67, 66, ship.x, ship.y, ship.width, ship.height);
        }

        if (playerControl) {
            moveShip();
            drawAst(ast.sprite, ast.x, ast.y, ast.width, ast.height); //grey
            handleAsteroids(); //reds
            cheeseCD.src = "Sprites/cheeseCooldown" + JSON.stringify(cheeseCDFrame) + ".png";
            drawAst(cheeseCD, 920, 60, 64, 60);
            if (bkgMusic.ended) {
                bkgMusic.play();
            }
        } else if (menuMusic.ended || userInteracted) {
            menuMusic.play();
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
        if (!mobile) {
            ctx.font = "bold 38px impact";
        }
        else if (mobile) {
            ctx.font = "bold 19px impact";
        }
        ctx.fillStyle = "darkblue";
        ctx.textAlign = "center";
        ctx.fillText("SCORE = " + score, canvas.width / 2, sBHeight - (sBHeight / 5),);
    }


    updateVolume();
    requestAnimationFrame(animate);
}

startAnimating(60);

console.log("Load Complete: " + Math.round(performance.now()) + " ms");