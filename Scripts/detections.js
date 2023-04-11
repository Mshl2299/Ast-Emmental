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
        generateAsteroid(ast);
        score += scoreAmt;
        detectLevelUp();
        changeLevelUp();
        playPopSound();
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
        cheeseCDFrame = 1;
        givePlayerImmunity(300);
        score += 5; 
        detectLevelUp();
        changeLevelUp();
        playPopSound();
        
        cheese.x = Math.random() * (astRangeX) + padding; //regenerate cheese coordinates
        cheese.y = Math.random() * (astRangeY) + sBHeight + padding;
        startSD();
    }
}

//slowDown effect
function startSD() {
    cheese.exist = false;
    sDCount = 1;
    ship.speed = currentSpeed * (sDCount / 10);
    sDInterval = setInterval(sDCountr, 1000);
}

function sDCountr() {
    if (sDCount > 4) {
        ship.speed = currentSpeed;
        cheeseCDFrame = 4;
        slowDown = false;
        cheese.exist = true;
        clearInterval(sDInterval);
        playDingSound();
    }
    else if (sDCount <= 6) {
        cheese.exist = false;
        sDCount += 2;
        ship.speed = currentSpeed * (sDCount / 10);
        cheeseCDFrame += 1;
        if (cheeseCDFrame > 4) {
            cheeseCDFrame = 1;
        }
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