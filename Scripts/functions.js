function givePlayerImmunity(duration) {
    ship.immunity = true;
    setTimeout(function () { ship.immunity = false }, duration);
}

function cycleExplosionFrame() {
    if (ship.exploded) {
        setInterval(function () {
            if (ship.explosionFrame < 10) {
                ship.explosionFrame ++;
            }
            else {
                ship.explosionFrame = 1;
            }
        }, 100)
        ship.exploded = false;
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
        explode1.src = "BlueExplosion/blue"+ JSON.stringify(ship.explosionFrame) + ".png";
        cycleExplosionFrame();
        drawShip(explode1, 0, 0, 256, 256, ship.x, ship.y, ship.width+10, ship.height+10);
    }
    else {
        shipSprite.src = currentSkin;
        drawShip(shipSprite, ship.width * ship.frameX, ship.height * ship.frameY, ship.width, ship.height, ship.x, ship.y, ship.width, ship.height);
    }
    
    if (playerControl) {
        detectSlowDown();
        moveShip();
        drawAst(astSprite, ast.x, ast.y, ast.width, ast.height);
        handleAsteroids();
    }
    detectAllCollisions();

    //Scoreboard rectangle (Drawn after everything so that it's always on top)
    ctx.fillStyle = "#cf8619"; //an orange colour to contrast the blue
    ctx.fillRect(0, 0, canvas.width, sBHeight);
    //Scoreboard border
    ctx.beginPath();
    ctx.strokeStyle = "rgb(0, 1, 86)";
    ctx.lineWidth = "5"; //same values as the canvas width & border
    ctx.rect(0, 0, canvas.width, sBHeight);
    ctx.stroke();
    //Score text
    ctx.font = "bold 40px monospace";
    ctx.fillStyle = "darkblue";
    ctx.textAlign = "center";
    ctx.fillText("SCORE=" + score, canvas.width / 2, 40,);

    requestAnimationFrame(animate);
}
animate();
