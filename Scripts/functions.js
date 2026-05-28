// Loaded last. Utility and Animation
// Collision detection; first "if" is for x-values/domain, second "if" is for y-values/range
var distanceToPlayer, dX, dY;

function detectCircleCollision(player, obstacle, tolerance) {
    if (playerControl && !ship.immunity) {
        dX = (player.x + player.radius) - (obstacle.x + obstacle.radius);
        dY = (player.y + player.radius) - (obstacle.y + obstacle.radius);
        distanceToPlayer = Math.sqrt(dX ** 2 + dY ** 2) - tolerance;
        //pythagoras: (player centerX - obstacle centerX)^2 + (player centerY - obstacle centerY)^2
        if (distanceToPlayer <= player.radius + obstacle.radius) {
            return true;
        }
        return false;
    }
}

function detectBorderCollision(obj) {
    if (obj.x < 1 - obj.width) { // passing left border
        obj.x = canvas.width;
    }
    if (obj.x > canvas.width) { // passing right border
        obj.x = 1 - obj.width;
    }
    if (obj.y < 1 - obj.height) { // passing top border
        obj.y = canvas.height;
    }
    if (obj.y > canvas.height) { // passing bottom border
        obj.y = 1 - obj.height;
    }
}
function detectCheeseBorderCol() { //teleports to middle of screen
    if (cheese.x < 0 || cheese.x > canvas.width || cheese.y < sBHeight || cheese.y > canvas.height) {
        cheese.x = 460;
        cheese.y = 310;
    }
}

function detectAllCollisions() {
    //reds; gameover 
    enemyAstArray.forEach(asteroid => {
        if (asteroid.exist && asteroid.moving && detectCircleCollision(ship, asteroid, -ship.breathingRoom)) {
            gameOver();
        } else if (asteroid.exist && asteroid.moving && detectCircleCollision(greyAst, asteroid, 0)) {
            playPop();
            greyAst.generate();
        }
    })
    //collectibles
    if (greyAst.exist && detectCircleCollision(ship, greyAst, 0)) {
        score += scoreAmt;
        changeLevelUp();
        playPop();

        greyAst.generate();
        ship.setImmune(300);
    }
    if (cheese.exist && detectCircleCollision(ship, cheese, 0)) {
        score += scoreAmt * 5;
        changeLevelUp();
        playPop();
        cheese.exist = false;

        sDCount = 1;
        ship.speed = currentSpeed * (sDCount / 7);
        clearInterval(sDInterval);
        sDInterval = setInterval(sDCounter, 1000);
    }
}



function changeBkgSkin(bkgSkinName) {
    uiElements.backgroundImg.src = bkgSkinName;
    window.localStorage.setItem('bkgImg', JSON.stringify(uiElements.backgroundImg.src));
    clickSound.play();
}
//slowDown effect
function sDCounter() {
    if (sDCount > 2) { //break out of loop FIRST
        sDCount = 4; // cheeseCD image
        ship.speed = currentSpeed; // speed
        clearInterval(sDInterval); // interval
        cheese.generate(); // cheese
        dingSound.play();
    } else if (sDCount <= 5) {
        //update speed
        sDCount += 1;
        ship.speed = currentSpeed * (sDCount / 7);
    }
}

//animation
//draw functions
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


let now, then, elapsed, fpsInterval, startTime;
function startAnimating(fps) {
    fpsInterval = 1000 / fps;
    then = Date.now();
    animate();
}
function animate() { //game update
    now = Date.now();
    elapsed = now - then;
    if (elapsed > fpsInterval) { //if proper time for framerate has passed
        then = now - (elapsed % fpsInterval); //reset timer
        ctx.clearRect(0, 0, canvas.width, canvas.height); //clear canvas to save memory

        //display explosion (called on gameOver()) or selected skin
        if (ship.exploding && uiElementsHidable.skinsMenuScreen.classList.contains('hidden')) { //required for UI to work when opening skin menu
            ship.draw(ship.spriteWidth * ship.frameX, ship.spriteHeight * ship.frameY, ship.spriteWidth, ship.spriteHeight, ship.x - 96, ship.y - 96, ship.width, ship.height);
        }
        else if (!uiElementsHidable.skinsMenuScreen.classList.contains('hidden')) {
            ship.speed = 0;
            ship.move();
            ship.image.src = currentSkin;
            ship.draw(ship.spriteWidth * ship.frameX, ship.spriteHeight * ship.frameY, ship.spriteWidth, ship.spriteHeight, ship.x, ship.y, ship.width, ship.height);
        } else {
            ship.image.src = currentSkin;
            ship.draw(ship.spriteWidth * ship.frameX, ship.spriteHeight * ship.frameY, ship.spriteWidth, ship.spriteHeight, ship.x, ship.y, ship.width, ship.height);
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

startAnimating(60);

console.log("Load Complete: " + Math.round(performance.now()) + " ms");