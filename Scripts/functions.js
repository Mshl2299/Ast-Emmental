function givePlayerImmunity(duration) {
    ship.immunity = true;
    setTimeout(function () { ship.immunity = false }, duration);
}

function cycleExplosionFrame() {
    if (ship.exploded && !firstDeath) {
        setInterval(function () {
            if (ship.explosionFrame < 10) {
                ship.explosionFrame ++;
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

function updateVolume() {
    soundFX.volume = sFXRange.value / 100;
    popSound.volume = sFXRange.value / 100;
    bkgMusic.volume = musicRange.value / 180;
    menuMusic.volume = musicRange.value / 100;
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
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); //clear canvas to save memory
    ctx.drawImage(background, 0, sBHeight, canvas.width, canvas.height); //background; goes first since everything else will be drawn on top

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

    if (gameOverT && skinsMenuScreen.classList.contains('hidden')) { //required for UI to work when opening skin menu
        explode1.src = "BlueExplosion/blue" + JSON.stringify(ship.explosionFrame) + ".png";
        cycleExplosionFrame();
        drawShip(explode1, 0, 0, 256, 256, ship.x, ship.y, ship.width + 10, ship.height + 10);
    }
    else {
        shipSprite.src = currentSkin;
        drawShip(shipSprite, ship.width * ship.frameX, ship.height * ship.frameY, ship.width, ship.height, ship.x, ship.y, ship.width, ship.height);
    }

    if (playerControl) {
        moveShip();
        drawAst(astSprite, ast.x, ast.y, ast.width, ast.height);
        handleAsteroids();
        cheeseCD.src = "Sprites/cheeseCooldown" + JSON.stringify(cheese.CDframe) + ".png";
        drawAst(cheeseCD, 920, 60, 64, 60);
    }
    detectAllCollisions();

    updateVolume();

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
    ctx.font = "bold 40px monospace";
    ctx.fillStyle = "darkblue";
    ctx.textAlign = "center";
    ctx.fillText("SCORE=" + score, canvas.width / 2, 40,);

    requestAnimationFrame(animate);
}
animate();

console.log("Load Complete: " + Math.round(performance.now()) + " ms");