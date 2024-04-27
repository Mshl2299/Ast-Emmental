//level up detection & values
function detectLevelUp() {
    if (score >= 0 && score < 5) {
        level = 0;
    }
    else if (score >= 5 && score < 10) {
        level = 1;
    }
    else if (score >= 10 && score < 20) {
        level = 2;
    }
    else if (score >= 20 && score < 30) {
        level = 3;
    }
    else if (score >= 30 && score < 50) {
        level = 4;
    }
    else if (score >= 50 && score < 100) {
        level = 5;
    }
    else if (score >= 100 && score < 150) {
        level = 6;
    }
    else if (score >= 150 && score < 250) {
        level = 7;
    }
    else if (score >= 250 && score < 500) {
        level = 8;
    }
    else if (score >= 500 && score < 1000) {
        level = 9;
    }
    else if (score >= 1000) {
        level = 10;
    }
}

//Changes to ship & asteroids as score increases
function changeLevelUp() {
    if (level == 0) {
        if (!mobile) { currentSpeed = 3; }
        else if (mobile) { currentSpeed = 1.5; } //starting values
        ship.speed = currentSpeed;
        if (!mobile) {ast.speed = 1;}
        else if (mobile) {ast.speed = 0.5;}
    }
    if (level == 1 && !redAst.exist) {
        currentSpeed = 4;
        ship.speed = currentSpeed;
        if (!redAst.exist) {
            generateAsteroid(redAst);
            lvlUpSound.play();
        }
    }
    if (level == 2 && !redAst2.exist) {
        currentSpeed = 5;
        ship.speed = currentSpeed;
        ast.speed = 1.5;
        if (!redAst.exist) {
            generateAsteroid(redAst);
            lvlUpSound.play();
        }
        if (!redAst2.exist) {
            generateAsteroid(redAst2);
            lvlUpSound.play();
        }
    }
    if (level == 3 && !redAst3.exist) {
        currentSpeed = 6;
        ship.speed = currentSpeed;
        ast.speed = 2;
        if (!redAst.exist) {
            generateAsteroid(redAst);
            lvlUpSound.play();
        }
        if (!redAst2.exist) {
            generateAsteroid(redAst2);
            lvlUpSound.play();
        }
        if (!redAst3.exist) {
            generateAsteroid(redAst3);
            lvlUpSound.play();
        }
    }
    if (level == 4 && !cheese.exist) {
        currentSpeed = 7;
        ship.speed = currentSpeed;
        ast.speed = 3;
        if (!redAst.exist) {
            generateAsteroid(redAst);
            lvlUpSound.play();
        }
        if (!redAst2.exist) {
            generateAsteroid(redAst2);
            lvlUpSound.play();
        }
        if (!redAst3.exist) {
            generateAsteroid(redAst3);
            lvlUpSound.play();
        }
        if (!cheese.exist && !slowDown) {
            generateAsteroid(cheese);
            cheeseCDFrame = 4;
            lvlUpSound.play();
        }

    }
    if (level == 5 && !redAst4.exist) {
        currentSpeed = 8;
        if (cheese.exist) { //if cheese exists; slowdown not in effect
            ship.speed = currentSpeed;
        }
        ast.speed = 4;
        if (!redAst4.exist) {
            generateAsteroid(redAst4);
            lvlUpSound.play();
        }
    }
    if (level == 6 && !tripleDigit1) {
        currentSpeed = 9;
        if (cheese.exist) { //if cheese exists; slowdown not in effect
            ship.speed = currentSpeed;
        }
        ast.speed = 5;
        if (!tripleDigit1) {
            unlocks = ["snake"];
            tripleDigit1 = true;
            lvlUpSound.play();
        }
    }
    if (level == 7 && !tripleDigit2) {
        currentSpeed = 10;
        if (cheese.exist) { //if cheese exists; slowdown not in effect
            ship.speed = currentSpeed;
        }
        ast.speed = 6;
        if (!tripleDigit2) {
            unlocks = ["snake", "inverted"];
            tripleDigit2 = true;
            lvlUpSound.play();
        }
    }
    if (level == 8 && !tripleDigit3) {
        currentSpeed = 12;
        if (cheese.exist) { //if cheese exists; slowdown not in effect
            ship.speed = currentSpeed;
        }
        ast.speed = 7;
        if (!tripleDigit3) {
            unlocks = ["snake", "inverted", "asteroid"];
            tripleDigit3 = true;
            lvlUpSound.play();
        }
    }
    if (level == 9 && !legendaryScore) {
        currentSpeed *= 1.05; //every collection onwards will multiply speed by 105%
        if (cheese.exist) { //if cheese exists; slowdown not in effect
            ship.speed = currentSpeed;
        }
        ast.speed = 8;
        if (!legendaryScore) {
            legendaryScore = true;
            lvlUpSound.play();
        }
    }
    if (level == 10) {
        currentSpeed *= 1.1; //every collection onwards will multiply speed by 110%
        if (cheese.exist) { //if cheese exists; slowdown not in effect
            ship.speed = currentSpeed;
        }
        ast.speed = 9;
        lvlUpSound.play();
        console.log("game breaking score");
    }
}