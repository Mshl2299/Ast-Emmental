// Contains Ship-related data & logic

// SHIP
// TODO: base speed
let currentSpeed = 3; //speed variable that will change
let ship = {
    image: new Image(),
    width: 64,
    height: 64,
    x: canvas.width / 2 - 33,
    y: canvas.height / 2 - 33,
    frameX: 0,
    frameY: 0,
    radius: 60 / 2,
    speed: currentSpeed,
    direction: "",
    immunity: false,
    breathingRoom: 5,
    exploded: false,
    explosionInterval: null,
    explosionFrame: 1,
    draw(img, sX, sY, sW, sH, dX, dY, dW, dH) {
        this.image.src = img; // TODO remove
        if (showDebug) { drawCircle("rgb(255,255,255,0.5)", this); };
        ctx.drawImage(this.image, sX, sY, sW, sH, dX, dY, dW, dH);
    },
    resetPos() { ship.x = canvas.width / 2 - ship.width / 2; ship.y = canvas.height / 2 - ship.height / 2; },
    getImmunity(duration) { ship.immunity = true; setTimeout(function () { ship.immunity = false }, duration); },
    changeSkin(skinName) {
        if (window.localStorage.getItem('unlocks') && JSON.parse(window.localStorage.getItem('unlocks')).includes(skinName)) {
            currentSkin = skinName;
        } else if (defaultUnlocks.includes(skinName)) {
            currentSkin = skinName;
        }
        window.localStorage.setItem('skinName', JSON.stringify(currentSkin));
        clickSound.play();
    },
    upPressed() { return ((keys["w"] || keys["ArrowUp"]) && ship.y > sBHeight); },
    downPressed() { return ((keys["s"] || keys["ArrowDown"]) && ship.y < canvas.height - ship.height); },
    leftPressed() { return ((keys["a"] || keys["ArrowLeft"]) && ship.x > 0); },
    rightPressed() { return ((keys["d"] || keys["ArrowRight"]) && ship.x < canvas.width - ship.width); },
    move() {
        if (this.upPressed()) { //up, left right center
            if (this.leftPressed()) {
                ship.y -= ship.speed / Math.sqrt(2);
                ship.x -= ship.speed / Math.sqrt(2);
                ship.frameX = 3;
                ship.frameY = 1;
            } else if (this.rightPressed()) {
                ship.y -= ship.speed / Math.sqrt(2);
                ship.x += ship.speed / Math.sqrt(2);
                ship.frameX = 0;
                ship.frameY = 1;
            } else {
                ship.y -= ship.speed;
                ship.frameX = 0;
                ship.frameY = 0;
            }
        } else if (this.downPressed()) { //down, left right center
            if (this.leftPressed()) {
                ship.y += ship.speed / Math.sqrt(2);
                ship.x -= ship.speed / Math.sqrt(2);
                ship.frameX = 2;
                ship.frameY = 1;
            } else if (this.rightPressed()) {
                ship.y += ship.speed / Math.sqrt(2);
                ship.x += ship.speed / Math.sqrt(2);
                ship.frameX = 1;
                ship.frameY = 1;
            } else {
                ship.y += ship.speed;
                ship.frameX = 2;
                ship.frameY = 0;
            }
        } else if (this.leftPressed()) { //left
            ship.x -= ship.speed;
            ship.frameX = 3;
            ship.frameY = 0;
        } else if (this.rightPressed()) { //right
            ship.x += ship.speed;
            ship.frameX = 1;
            ship.frameY = 0;
        }
    },
    cycleExplosionFrame() {
        if (!ship.explosionInterval) {
            ship.explosionInterval = setInterval(function () {
                if (ship.explosionFrame < 10) {
                    ship.explosionFrame++;
                }
                else {
                    ship.explosionFrame = 1;
                }
            }, 100);
        }
    }
}