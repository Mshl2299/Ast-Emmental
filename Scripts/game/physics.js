// Handles collisions, border detection & movement helpers

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

        greyAst.generate(); //move to a new location
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