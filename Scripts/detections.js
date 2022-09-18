//collision detection; first "if" is for x-values/domain, second "if" is for y-values/range
function detectCollision(player, obstacle) {
    if (playerControl && !ship.immunity) {
        if (player.x > obstacle.x + obstacle.width ||
            player.x + player.width < obstacle.x ||
            player.y > obstacle.y + obstacle.height ||
            player.y + player.height < obstacle.y) {
            return false;
        }
        return true; //use "detectCollision" in an if statement
    }
}

function detectRangeCollision(player, obstacle) {
    if (playerControl && !ship.immunity) {
        if (player.x > obstacle.x + obstacle.width + tolerance ||
            player.x + player.width + tolerance < obstacle.x ||
            player.y > obstacle.y + obstacle.height + tolerance ||
            player.y + player.height + tolerance < obstacle.y) {
            return false;
        }
        return true; 
    }
}

function detectAllCollisions() {
    if (detectCollision(ship, ast)) {
        ast.x = Math.random() * (astRangeX) + padding;
        ast.y = Math.random() * (astRangeY) + sBHeight + padding;
        while (detectRangeCollision(ship, ast)) {
            ast.x = Math.random() * (astRangeX) + padding;
            ast.y = Math.random() * (astRangeY) + sBHeight + padding;
            console.log("grey asteroid regenerated");
        }
        givePlayerImmunity(500);
        score += 10;
        playPopSound();
        detectLevelUp();
    }
    if ((redAst.exist && detectCollision(ship, redAst))) {
        gameOver();
    }
    if ((redAst2.exist && detectCollision(ship, redAst2))) {
        gameOver();
    }
    if ((redAst3.exist && detectCollision(ship, redAst3))) {
        gameOver();
    }
    if ((redAst4.exist && detectCollision(ship, redAst4))) {
        gameOver();
    }
    if (cheese.exist && detectCollision(ship, cheese)) {
        slowDown = true;
        cheese.CDframe = 1;
        startSD();
        score += 5;
        playPopSound();
        detectLevelUp();
        cheese.x = Math.random() * (astRangeX) + padding; //regenerate cheese coordinates
        cheese.y = Math.random() * (astRangeY) + sBHeight + padding;
    }
}

//slowDown effect
function startSD() {
    cheese.exist = false;
    sDTime = 1;
    ship.speed = currentSpeed * (sDTime / 10);
    sDInterval = setInterval(sDTimer, 1000);
}

function sDTimer() {
    if (sDTime > 4) {
        clearInterval(sDInterval);
        ship.speed = currentSpeed;
        cheese.CDframe = 4;
        cheese.exist = true;
        slowDown = false;
        playDingSound();
    }
    else if (sDTime <= 6) {
        cheese.exist = false;
        sDTime += 2;
        ship.speed = currentSpeed * (sDTime / 10);
        cheese.CDframe += 1;
        if (cheese.CDframe > 4) {
            cheese.CDframe = 1;
        }
    }
}

//Changes to ship & asteroids as score increases
function detectLevelUp() {
    if (score >= 0 && score < 5) {
        currentSpeed = 1.5;
    }
    if (score >= 5 && score < 10) {
        currentSpeed = 1.8;
        if (!redAst.exist) {
            redAst.x = Math.random() * (astRangeX) + padding;
            redAst.y = Math.random() * (astRangeY) + sBHeight + padding;
            while (detectRangeCollision(ship, redAst)) {
                redAst.x = Math.random() * (astRangeX) + padding;
                redAst.y = Math.random() * (astRangeY) + sBHeight + padding;
                console.log("red asteroid 1 regenerated");
            }
            givePlayerImmunity(500);
            playSoundFX("Audio/success.mp3");
            redAst.exist = true;
        }
    }
    if (score >= 10 && score < 20) {
        currentSpeed = 2;
        if (!redAst2.exist) {
            redAst2.x = Math.random() * (astRangeX) + padding;
            redAst2.y = Math.random() * (astRangeY) + sBHeight + padding;
            while (detectRangeCollision(ship, redAst2)) {
                redAst2.x = Math.random() * (astRangeX) + padding;
                redAst2.y = Math.random() * (astRangeY) + sBHeight + padding;
                console.log("red asteroid 2 regenerated");
            }
            givePlayerImmunity(500);
            playSoundFX("Audio/success.mp3");
            redAst2.exist = true;
        }
    }
    if (score >= 20 && score < 30) {
        currentSpeed = 2.2;
        ast.speed = 0.4;
        if (!redAst3.exist) {
            redAst3.x = Math.random() * (astRangeX) + padding;
            redAst3.y = Math.random() * (astRangeY) + sBHeight + padding;
            while (detectRangeCollision(ship, redAst3)) {
                redAst3.x = Math.random() * (astRangeX) + padding;
                redAst3.y = Math.random() * (astRangeY) + sBHeight + padding;
                console.log("red asteroid 3 regenerated");
            }
            givePlayerImmunity(500);
            playSoundFX("Audio/success.mp3");
            redAst3.exist = true;
        }
    }
    if (score >= 30 && score < 50) {
        currentSpeed = 2.5;
        ast.speed = 0.5;
        if (!cheese.exist && !slowDown) {
            cheese.x = Math.random() * (astRangeX) + padding;
            cheese.y = Math.random() * (astRangeY) + sBHeight + padding;
            while (detectRangeCollision(ship, cheese)) {
                cheese.x = Math.random() * (astRangeX) + padding;
                cheese.y = Math.random() * (astRangeY) + sBHeight + padding;
                console.log("cheese regenerated");
            }
            givePlayerImmunity(200);
            playSoundFX("Audio/success.mp3");
            cheese.CDframe = 4;
            cheese.exist = true;
        }
    }
    if (score >= 50 && score < 100) {
        currentSpeed = 2.8;
        ast.speed = 0.8;
        if (!redAst4.exist) {
            redAst4.x = Math.random() * (astRangeX) + padding;
            redAst4.y = Math.random() * (astRangeY) + sBHeight + padding;
            while (detectRangeCollision(ship, redAst4)) {
                redAst4.x = Math.random() * (astRangeX) + padding;
                redAst4.y = Math.random() * (astRangeY) + sBHeight + padding;
                console.log("red asteroid 4 regenerated");
            }
            givePlayerImmunity(500);
            playSoundFX("Audio/success.mp3");
            redAst4.exist = true;
        }
    }
    if (score >= 100) {
        currentSpeed = 3;
        ast.speed = 1;
        playSoundFX("Audio/success.mp3");
    }
    if (score >= 150) {
        ast.speed = 1.2;
        playSoundFX("Audio/success.mp3");
    }
    if (score >= 250) {
        ast.speed = 1.5;
        playSoundFX("Audio/success.mp3");
    }
    if (score >= 500) {
        ast.speed = 2;
        playSoundFX("Audio/success.mp3");
    }
}

function detectRange(player, obstacle) {
    if (playerControl) {
        if (player.x > obstacle.x + obstacle.width + tolerance || //same collision code, but adding extra distance to create a range
            player.x + player.width + tolerance < obstacle.x ||
            player.y > obstacle.y + obstacle.height + tolerance ||
            player.y + player.height + tolerance < obstacle.y) {
            return false;
        }
        return true;
    }
}

function detectBorderCollision(obstacle) {
    if (obstacle.x < 1 - obstacle.width) {
        obstacle.x = canvas.width;
    }
    if (obstacle.x > canvas.width) {
        obstacle.x = 1 - obstacle.width;
    }
    if (obstacle.y < 1 - obstacle.height) {
        obstacle.y = canvas.height;
    }
    if (obstacle.y > canvas.height) {
        obstacle.y = 1 - obstacle.height;
    }
}

function detectCheeseBorderCol(obstacle) {
    if (obstacle.x < 0 ||
        obstacle.x > canvas.width ||
        obstacle.y < sBHeight ||
        obstacle.y > canvas.height) {
        obstacle.x = 460;
        obstacle.y = 310;
    }
}