// Handles animation loop and Canvas helpers

function drawCircle(color, obj) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(obj.x + obj.radius, obj.y + obj.radius, obj.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
}

function drawScore() {
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
    ctx.fillText("SCORE = " + score, canvas.width / 2, sBHeight - (sBHeight / 5),);
}

export class AnimationLoop {
    startAnimating(fps) {
        this.fpsInterval = 1000 / this.fps;
        this.then = Date.now();
        animate();
    }

    animate() { //game update
        this.now = Date.now();
        this.elapsed = this.now - this.then;
        if (this.elapsed > fpsInterval) { //if proper time for framerate has passed
            then = now - (elapsed % fpsInterval); //reset timer
            ctx.clearRect(0, 0, canvas.width, canvas.height); //clear canvas to save memory

            //display explosion (called on gameOver()) or selected skin
            if (ship.exploded && uiElementsHidable.skinsMenuScreen.classList.contains('hidden')) { //required for UI to work when opening skin menu
                ship.image.src = "BlueExplosion/blue" + ship.explosionFrame.toString() + ".png";
                if (ship.image.height == 256) {
                    ship.draw(ship.image.src, 0, 0, 256, 256, ship.x - 50, ship.y - 50, ship.width + 100, ship.height + 100);
                }
                ship.cycleExplosionFrame();
            }
            else if (!uiElementsHidable.skinsMenuScreen.classList.contains('hidden')) {
                ship.speed = 0;
                ship.move();
                ship.image.src = currentSkin;
                ship.draw(ship.image.src, 67 * ship.frameX, 66 * ship.frameY, 67, 66, ship.x, ship.y, ship.width, ship.height);
            } else {
                ship.image.src = currentSkin;
                ship.draw(ship.image.src, 67 * ship.frameX, 66 * ship.frameY, 67, 66, ship.x, ship.y, ship.width, ship.height);
            }

            if (playerControl) {
                ship.move();
                handleAsteroids(); //grey, red, cheese & plasma asteroids
                detectAllCollisions();
                if (bkgMusic.ended) {
                    bkgMusic.play();
                }
            } else if (userInteracted && (menuMusic.ended || menuMusic.paused)) {
                menuMusic.play();
            }

            drawScore();
            updateVolume(); //sound effects & music volume
        }

        requestAnimationFrame(animate);
    }

}
