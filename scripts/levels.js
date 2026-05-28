//Changes to ship & asteroids as score increases
let phases = [5, 10, 15, 25, 50, 75, 100, 150, 250, 500, 1000];
let speeds = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

function changeLevelUp() {
    if (score < phases[0]) { // <5
        if (currentSpeed < speeds[0]) { currentSpeed = speeds[0]; ship.speed = currentSpeed; }
    }
    if ((phases[0] <= score)) { // 5+
        if (currentSpeed < speeds[1]) { currentSpeed = speeds[1]; ship.speed = currentSpeed; }
        redAst.spawn();
    }
    if ((phases[1] <= score)) { // 10+
        if (currentSpeed < speeds[2]) { currentSpeed = speeds[2]; ship.speed = currentSpeed; }
        redAst2.spawn();
    }
    if ((phases[2] <= score)) { //15+
        if (currentSpeed < speeds[3]) { currentSpeed = speeds[3]; ship.speed = currentSpeed; }
        redAst3.spawn();
    }
    if ((phases[3] <= score)) { //25+
        if (!sDInterval) {
            if (currentSpeed < speeds[4]) { currentSpeed = speeds[4]; ship.speed = currentSpeed; }
            cheese.spawn();
        }
    }
    if ((phases[4] <= score)) { // 50+
        if (!sDInterval && currentSpeed < speeds[5]) { currentSpeed = speeds[5]; ship.speed = currentSpeed; }
        redAst4.spawn();
    }
    if ((phases[5] <= score)) { // 75+
        if (!sDInterval && currentSpeed < speeds[6]) { currentSpeed = speeds[6]; ship.speed = currentSpeed; }
        if (!hasUnlockedSnake) {
            unlocks = ["snake"];
            hasUnlockedSnake = true;
            lvlUpSound.play();
        }
    }
    if ((phases[6] <= score)) { // 100+
        if (!sDInterval && currentSpeed < speeds[7]) { currentSpeed = speeds[7]; ship.speed = currentSpeed; }
        if (!hasUnlockedInverted) {
            unlocks = ["snake", "inverted"];
            hasUnlockedInverted = true;
            lvlUpSound.play();
        }
    }
    if ((phases[7] <= score)) { // 150+
        if (!sDInterval && currentSpeed < speeds[8]) { currentSpeed = speeds[8]; ship.speed = currentSpeed; }
        if (!hasUnlockedAsteroid) {
            unlocks = ["snake", "inverted", "asteroid"];
            hasUnlockedAsteroid = true;
            lvlUpSound.play();
        }
    }
    if ((phases[8] <= score)) { // 250+
        if (!sDInterval && currentSpeed < speeds[9]) { currentSpeed = speeds[9]; ship.speed = currentSpeed; }
        if (!legendaryScore) {
            legendaryScore = true;
            lvlUpSound.play();
        }
    }
    if (phases[9] <= score) { // 500+
        if (!sDInterval) {
            currentSpeed *= 1.1;
            ship.speed = currentSpeed;
        } //every collection onwards will multiply speed by 110%
        lvlUpSound.play();
        console.log("game breaking score");
    }
}

function moveToAway(player, obstacle, speedFactor) {
    // positive speedFactor is away, negative speedFactor is towards
    dX = (player.x + player.radius) - (obstacle.x + obstacle.radius);
    dY = (player.y + player.radius) - (obstacle.y + obstacle.radius);
    //ship is on right
    if (dX > tolerance / 4) { obstacle.x -= player.speed * speedFactor; }
    //ship is on left
    else if (dX < -tolerance / 4) { obstacle.x += player.speed * speedFactor; }
    //ship is below
    if (dY > tolerance / 4) { obstacle.y -= player.speed * speedFactor; }
    //ship is above
    else if (dY < -tolerance / 4) { obstacle.y += player.speed * speedFactor; }
    detectCheeseBorderCol();
}

function handleAsteroids() { //moving & drawing asteroids as score goes up, every frame
    drawAstArray.forEach(asteroid => {
        if (asteroid.exist) {
            asteroid.update();
        }
    });
    if (cheese.exist) {
        if (detectCircleCollision(ship, cheese, tolerance)) {
            moveToAway(ship, cheese, 0.2); //unique move function
        }
    }
    cheeseCD.src = "assets/sprites/cheeseCooldown" + JSON.stringify(sDCount) + ".png"; //!!!
    ctx.drawImage(cheeseCD, cheeseCDx, cheeseCDy);

}

function updateUnlocks() {
    const HISCORE = localScores[0];
    //check scores
    if (!unlocks.includes("assets/sprites/snakeSS1.png") && HISCORE >= 100) {
        unlocks.push("assets/sprites/snakeSS1.png");
    }
    if (!unlocks.includes("assets/sprites/alphaInvertedSS1.png") && HISCORE >= 150) {
        unlocks.push("assets/sprites/alphaInvertedSS1.png");
    }
    if (!unlocks.includes("assets/sprites/asteroidSS1.png") && HISCORE >= 250) {
        unlocks.push("assets/sprites/asteroidSS1.png");
    }
    //update skins to be Unlocked or Greyed
    if (unlocks.includes("assets/sprites/snakeSS1.png")) {
        uiElements.snakeSkin.classList.remove("greyed");
        uiElements.snakeSkin.src = "assets/sprites/shipSnake.png"; //html image
        window.localStorage.setItem('unlocks', JSON.stringify(unlocks));
    }
    else {
        uiElements.snakeSkin.classList.add("greyed");
        uiElements.snakeSkin.src = "assets/sprites/shipSnakeLocked.png";
    }
    if (unlocks.includes("assets/sprites/alphaInvertedSS1.png")) {
        uiElements.invertedSkin.classList.remove("greyed");
        uiElements.invertedSkin.src = "assets/sprites/shipAlphaInverted.png";
        window.localStorage.setItem('unlocks', JSON.stringify(unlocks));
    }
    else {
        uiElements.invertedSkin.classList.add("greyed");
        uiElements.invertedSkin.src = "assets/sprites/shipAlphaInvertedLocked.png";
    }
    if (unlocks.includes("assets/sprites/asteroidSS1.png")) {
        uiElements.asteroidSkin.classList.remove("greyed");
        uiElements.asteroidSkin.src = "assets/sprites/asteroid.png";
        window.localStorage.setItem('unlocks', JSON.stringify(unlocks));
    }
    else {
        uiElements.asteroidSkin.classList.add("greyed");
        uiElements.asteroidSkin.src = "assets/sprites/AsteroidLocked.png";
    }
}

