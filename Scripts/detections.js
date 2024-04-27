//collision detection; first "if" is for x-values/domain, second "if" is for y-values/range
var distanceToPlayer;

// function detectCollision(player, obstacle) {
//     if (playerControl && !ship.immunity) {
//         // if (player.x > obstacle.x + obstacle.width ||
//         //     player.x + player.width < obstacle.x ||
//         //     player.y > obstacle.y + obstacle.height ||
//         //     player.y + player.height < obstacle.y) {
//         //     return false;
//         // }
//         // return true; //use "detectCollision" in an if statement
//     }
// }

function detectCircleCollision(player, obstacle){
    if (playerControl && !ship.immunity) {
        distanceToPlayer = Math.sqrt(((player.x+player.radius)-(obstacle.x+obstacle.radius))**2+((player.y+player.radius)-(obstacle.y+obstacle.radius))**2);
        //pythagoras: (player centerX - obstacle centerX)^2 + (player centerY - obstacle centerY)^2
        if (distanceToPlayer <= player.radius + obstacle.radius) {
            return true;
        }
        return false;
    }
}
//update: added circle collision, updated detectAllCollisions to match
function detectAllCollisions() {
    if (detectCircleCollision(ship, ast)) {
        generateAsteroid(ast);
        score += scoreAmt;
        detectLevelUp();
        changeLevelUp();
        popSound.play();
    }
    if ((redAst.exist && detectCircleCollision(ship, redAst))) {
        gameOver();
    }
    if ((redAst2.exist && detectCircleCollision(ship, redAst2))) {
        gameOver();
    }
    if ((redAst3.exist && detectCircleCollision(ship, redAst3))) {
        gameOver();
    }
    if ((redAst4.exist && detectCircleCollision(ship, redAst4))) {
        gameOver();
    }
    if (cheese.exist && detectCircleCollision(ship, cheese)) {
        slowDown = true;
        cheeseCDFrame = 1;
        givePlayerImmunity(300);
        score += 5; 
        detectLevelUp();
        changeLevelUp();
        popSound.play();
        
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
    sDInterval = setInterval(sDCounter, 1000);
}

function sDCounter() {
    if (sDCount > 4) {
        ship.speed = currentSpeed;
        cheeseCDFrame = 4;
        slowDown = false;
        cheese.exist = true;
        clearInterval(sDInterval);
        dingSound.play();
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

// code for cheese to run away
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