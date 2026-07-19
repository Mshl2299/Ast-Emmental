// Ship & Bacgkround skin data, Skins menu rendering
import { uiElements, addUIElement, addUIElementHidable } from "../dom.js";
import { storeBackground } from "../persistence.js";
import { AUDIO } from "../audio.js";
import { STATE } from "../game/state.js";

// ----------------------------- SKINS MENU ------------------------------------------
export const SPRITES_PATH = "assets/sprites/";
export const SKINS_MAP = {
    alpha: {
        unlockedImage: "shipAlpha.png",
        lockedImage: null,
        spriteSheet: "alphaSS1.png",
        isLocked: false,
        cssClass: "alpha-skin"
    },

    beta: {
        unlockedImage: "shipBeta.png",
        lockedImage: null,
        spriteSheet: "betaSS1.png",
        isLocked: false,
        cssClass: "beta-skin"
    },

    ufo: {
        unlockedImage: "shipUFO.png",
        lockedImage: null,
        spriteSheet: "ufoSS1.png",
        isLocked: false,
        cssClass: "ufo-skin"
    },

    snake: {
        unlockedImage: "shipSnake.png",
        lockedImage: "shipSnakeLocked.png",
        spriteSheet: "snakeSS1.png",
        isLocked: true,
        cssClass: "snake-skin"
    },

    inverted: {
        unlockedImage: "shipAlphaInverted.png",
        lockedImage: "shipAlphaInvertedLocked.png",
        spriteSheet: "alphaInvertedSS1.png",
        isLocked: true,
        cssClass: "inverted-skin"
    },

    asteroid: {
        unlockedImage: "Asteroid.png",
        lockedImage: "AsteroidLocked.png",
        spriteSheet: "asteroidSS1.png",
        isLocked: true,
        cssClass: "asteroid-skin"
    }
};

export const BKG_PATH = "assets/backgrounds/";
export const BKG_SKINS_MAP = {
    blueSpace: {
        display: true,
        unlockedImage: "blueSpace.jpg",
        lockedImage: null,
        isLocked: false,
        cssClass: "blue-space"
    },
    hatSpace: {
        display: false,
        unlockedImage: "hatSpace.png",
        lockedImage: null,
        isLocked: false,
        cssClass: "hat-space"
    },
    purpleSpace: {
        display: false,
        unlockedImage: "purpleSpace.jpg",
        lockedImage: null,
        isLocked: false,
        cssClass: "purple-space"
    },
    jamesWebb: {
        display: true,
        unlockedImage: "JamesWebb.jpg",
        lockedImage: null,
        isLocked: false,
        cssClass: "james-webb"
    },
    orbit: {
        display: true,
        unlockedImage: "Orbit.jpg",
        lockedImage: null,
        isLocked: false,
        cssClass: "orbit"
    },

    // Animated
    galaxyAnim: {
        display: true,
        unlockedImage: "galaxyAnim.gif",
        lockedImage: null,
        isLocked: false,
        cssClass: "galaxy-anim"
    },
    purpleAnim: {
        display: true,
        unlockedImage: "purpleAnim.gif",
        lockedImage: null,
        isLocked: false,
        cssClass: "purple-anim"
    },
    blueNebulaAnim: {
        display: true,
        unlockedImage: "blueNebulaAnim.gif",
        lockedImage: null,
        isLocked: false,
        cssClass: "blue-nebula-anim"
    },
};

export function changeBkgSkin(bkgId) {
    uiElements.backgroundImg.src = BKG_PATH + BKG_SKINS_MAP[bkgId].unlockedImage;
    storeBackground(bkgId);
    AUDIO.playSFX('click');
}

// id: a SKINS_MAP key as string, i.e. 'alpha'
function createSkinImage(id) {
    const wrap = document.createElement('div');
    wrap.className = 'flex';

    const img = document.createElement('img');
    img.draggable = false;
    const obj = SKINS_MAP[id];

    if (obj.isLocked && obj.lockedImage) {
        img.src = SPRITES_PATH + obj.lockedImage;
    } else {
        img.src = SPRITES_PATH + obj.unlockedImage;
    }

    img.classList.add('skin');
    img.classList.add(obj.cssClass);
    img.addEventListener('click', () => STATE.ship.changeSkin(id));

    wrap.appendChild(img);
    addUIElement(obj.cssClass, img);
    return wrap;
}

// id: a BKG_SKINS_MAP key as string, i.e. 'blueSpace'
function createBkgImage(id) {
    const wrap = document.createElement('div');
    wrap.className = 'flex';

    const img = document.createElement('img');
    img.draggable = false;
    const obj = BKG_SKINS_MAP[id];

    if (obj.isLocked && obj.lockedImage) {
        img.src = BKG_PATH + obj.lockedImage;
    } else {
        img.src = BKG_PATH + obj.unlockedImage;
    }

    img.classList.add('bkg');
    img.classList.add(obj.cssClass);
    img.addEventListener('click', () => changeBkgSkin(id));

    wrap.appendChild(img);
    addUIElement(obj.cssClass, img);
    return wrap;
}

const skinsMount = document.getElementById('skins-mount');
export function initSkinScreen() {
    const skinsScreen = document.createElement('div');
    skinsScreen.classList.add('skins-menu-screen', 'fs32', 'hidden');
    skinsScreen.innerHTML = `<h2>SKINS</h2>`;

    const shipSkinContainer = document.createElement('div');
    shipSkinContainer.className = 'flex';
    Object.keys(SKINS_MAP).forEach((id) => shipSkinContainer.appendChild(createSkinImage(id)));
    skinsScreen.appendChild(shipSkinContainer);

    const bkgSkinContainer = document.createElement('div');
    bkgSkinContainer.className = 'flex';
    bkgSkinContainer.style.flexWrap = 'wrap';
    Object.keys(BKG_SKINS_MAP).forEach((id) => {
        if (BKG_SKINS_MAP[id].display) {
            bkgSkinContainer.appendChild(createBkgImage(id));
        }
    });
    skinsScreen.appendChild(bkgSkinContainer);

    const backgroundWarning = document.createElement('p');
    backgroundWarning.innerHTML = '<u>CAUTION: some backgrounds may give you motion sickness</u>';
    skinsScreen.appendChild(backgroundWarning);

    skinsMount.replaceChildren(skinsScreen);
    addUIElementHidable('skinsMenuScreen', skinsScreen);
}