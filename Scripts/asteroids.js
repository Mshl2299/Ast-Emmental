//all asteroid related functions
function generateAsteroid(asteroid) {
    asteroid.x = Math.random() * (astRangeX) + padding;
    asteroid.y = Math.random() * (astRangeY) + sBHeight + padding;
    while (detectRangeCollision(ship, asteroid)) {
        asteroid.x = Math.random() * (astRangeX) + padding;
        asteroid.y = Math.random() * (astRangeY) + sBHeight + padding;
        console.log(JSON.stringify(asteroid.name) + " regenerated");
    }
    givePlayerImmunity(500);
    asteroid.exist = true;
    asteroid.moving = false;
}

function moveCheese() {
    if (cheese.exist && detectRange(ship, cheese)) {
        switch (ship.direction) {
            case 1:
                cheese.y -= ship.speed * 0.5;
                detectCheeseBorderCol(cheese);
                break;
            case 2:
                cheese.x += ship.speed * 0.5;
                detectCheeseBorderCol(cheese);
                break;
            case 3:
                cheese.y += ship.speed * 0.5;
                detectCheeseBorderCol(cheese);
                break;
            case 4:
                cheese.x -= ship.speed * 0.5;
                detectCheeseBorderCol(cheese);
                break;
            case 5:
                cheese.y -= ship.speed * 0.5;
                cheese.x += ship.speed * 0.5;
                detectCheeseBorderCol(cheese);
                break;
            case 6:
                cheese.y += ship.speed * 0.5;
                cheese.x += ship.speed * 0.5;
                detectCheeseBorderCol(cheese);
                break;
            case 7:
                cheese.y += ship.speed * 0.5;
                cheese.x -= ship.speed * 0.5;
                detectCheeseBorderCol(cheese);
                break;
            case 8:
                cheese.y -= ship.speed * 0.5;
                cheese.x -= ship.speed * 0.5;
                detectCheeseBorderCol(cheese);
                break;
        }
    }
}

function handleAsteroids() { //moving & drawing asteroids as score goes up
    if (cheese.exist) {
        cheese.drawAst();
        moveCheese();
    }
    if (level == 1 && redAst.exist) {
        redAst.drawAst();
        if (!redAst.moving) {
            clearInterval(redAst.moveInterval);
            redAst.moveInterval = setInterval(() => redAst.move(), 30);
            redAst.moving = true;
        }
    }
    if (level == 2 && redAst2.exist) {
        redAst.drawAst();
        redAst2.drawAst();
        if (!redAst2.moving) {
            clearInterval(redAst2.moveInterval);
            redAst2.moveInterval = setInterval(() => redAst2.move(), 30);
            redAst2.moving = true;
        }
    }
    if (((level == 3) || (level == 4)) && redAst3.exist) {
        redAst.drawAst();
        redAst2.drawAst();
        redAst3.drawAst();
        if (!redAst3.moving) {
            clearInterval(redAst3.moveInterval);
            redAst3.moveInterval = setInterval(() => redAst3.move(), 30);
            redAst3.moving = true;
        }
    }
    if (level == 5 && redAst4.exist) {
        redAst.drawAst();
        redAst2.drawAst();
        redAst3.drawAst();
        redAst4.drawAst();
        if (!redAst4.moving) {
            clearInterval(redAst4.moveInterval);
            redAst4.moveInterval = setInterval(() => redAst4.move(), 30);
            redAst4.moving = true;
        }
    }
    if (level > 5) {
        redAst.drawAst();
        redAst2.drawAst();
        redAst3.drawAst();
        redAst4.drawAst();
    }
}