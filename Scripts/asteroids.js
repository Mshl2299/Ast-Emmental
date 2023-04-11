function moveAsteroids() {
    if (redAst.exist) {
        redAst.x -= ast.speed; //bottom Left
        redAst.y += ast.speed;
        detectBorderCollision(redAst);
    }
    if (redAst2.exist) {
        redAst2.x -= ast.speed / 2; //top Left
        redAst2.y -= ast.speed / 2;
        detectBorderCollision(redAst2);
    }
    if (redAst3.exist) {
        redAst3.x += ast.speed / 3; //bottom Right
        redAst3.y += ast.speed / 3;
        detectBorderCollision(redAst3);
    }
    if (redAst4.exist) {
        redAst4.x += ast.speed * 1.5; //top Right
        redAst4.y -= ast.speed * 1.5;
        detectBorderCollision(redAst4);
    }
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
        drawAst(cheeseSprite, cheese.x, cheese.y, cheese.width, cheese.height);
        moveCheese();
    }
    if (score >= 5 && score < 10 && redAst.exist) {
        drawAst(redAstSprite, redAst.x, redAst.y, ast.width, ast.height);
        setTimeout(moveAsteroids(), 500);
    }
    if (score >= 10 && score < 20 && redAst2.exist) {
        drawAst(redAstSprite, redAst.x, redAst.y, ast.width, ast.height);
        drawAst(redAstSprite, redAst2.x, redAst2.y, redAst2.width, redAst2.height);
        setTimeout(moveAsteroids(), 500);
    }
    if (score >= 20 && score < 30 && redAst3.exist) {
        drawAst(redAstSprite, redAst.x, redAst.y, ast.width, ast.height);
        drawAst(redAstSprite, redAst2.x, redAst2.y, redAst2.width, redAst2.height);
        drawAst(redAstSprite, redAst3.x, redAst3.y, redAst3.width, redAst3.height);
        setTimeout(moveAsteroids(), 500);
    }
    if (score >= 30 && score < 50) {
        drawAst(redAstSprite, redAst.x, redAst.y, ast.width, ast.height);
        drawAst(redAstSprite, redAst2.x, redAst2.y, redAst2.width, redAst2.height);
        drawAst(redAstSprite, redAst3.x, redAst3.y, redAst3.width, redAst3.height);
        setTimeout(moveAsteroids(), 500);
    }
    if (score >= 50 && score < 100 && redAst4.exist) {
        drawAst(redAstSprite, redAst.x, redAst.y, ast.width, ast.height);
        drawAst(redAstSprite, redAst2.x, redAst2.y, redAst2.width, redAst2.height);
        drawAst(redAstSprite, redAst3.x, redAst3.y, redAst3.width, redAst3.height);
        drawAst(redAstSprite, redAst4.x, redAst4.y, redAst4.height, redAst4.width);
        setTimeout(moveAsteroids(), 500);
    }
    if (score >= 100 && redAst4.exist) {
        drawAst(redAstSprite, redAst.x, redAst.y, ast.width, ast.height);
        drawAst(redAstSprite, redAst2.x, redAst2.y, redAst2.width, redAst2.height);
        drawAst(redAstSprite, redAst3.x, redAst3.y, redAst3.width, redAst3.height);
        drawAst(redAstSprite, redAst4.x, redAst4.y, redAst4.height, redAst4.width);
        setTimeout(moveAsteroids(), 500);
    }
}