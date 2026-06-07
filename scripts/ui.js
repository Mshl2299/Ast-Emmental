//ui elements
import { CONFIG } from "./config.js";
import { STATE, DEFAULT_STATE } from "./game/state.js";
import { uiElements, uiElementsHidable, addUIElement, addUIElementHidable } from "./dom.js";
import { keys } from "./game/input.js";
import { kebabToCamel } from "./utils.js";
import { ship, SPRITES_PATH, SKINS_MAP } from "./entities/entities.js";
import { gameOver } from "./setup.js";
import { AUDIO } from "./audio.js";

export const UI_DEFAULTS = {
    SCORE_WIDTH: 280,
    BUTTON_WIDTH: 20, // TODO: unused?
    SCORE_WIDTH_ADJUST: 5,

    SCOREBOARD_HEIGHT: 50,
    BORDER_PADDING: 30, // distance from borders for Grey & Red Asteroid generation
}
//style elements
//'end the current game first!' Flashing text
let eGTCount = 0;
let eGTInterval;
//Highscores menu
let scoreDisplayOpen = false; //to move the score button & display together

function openAudioMenu() {
    uiElementsHidable.audioMenu.classList.toggle('hidden');
    AUDIO.playSFX('click');
}
function toggleSFX() {
    if (uiElements.sfxRange.value > 0) {
        uiElements.sfxRange.value = 0;
    }
    else if (uiElements.sfxRange.value == 0) {
        uiElements.sfxRange.value = 100;
        AUDIO.playSFX('click');
    }
}
function toggleMusic() {
    if (uiElements.musicRange.value > 0) {
        uiElements.musicRange.value = 0;
    }
    else if (uiElements.musicRange.value == 0) {
        uiElements.musicRange.value = 100;
        AUDIO.playSFX('click');
    }
}

// TODO: move to input handler
uiElements.sfxToggleButton.addEventListener('click', toggleSFX);
uiElements.musicToggleButton.addEventListener('click', toggleMusic);

uiElements.resetDataButton.addEventListener('click', () => {
    if (uiElements.resetDataButton.classList.contains('greyed')) {
        showEndGameFirstText();
    } else if (!uiElements.resetDataButton.classList.contains('greyed')) {
        clearData();
    }
});

function resetBkgImg() {
    uiElements.backgroundImg.src = BKG_PATH + BKG_SKINS_MAP['blueSpace'].unlockedImage;
    window.localStorage.setItem('bkgImg', JSON.stringify('blueSpace'));
}

function clearData() {
    window.localStorage.clear();

    updateScoresHTML();

    STATE.unlocks = DEFAULT_STATE.unlocks;
    STATE.score = DEFAULT_STATE.score;
    ship.resetSkin();
    resetBkgImg();

    AUDIO.playSFX('explosion');
    updateUnlocks();

    console.log("Data Successfully Cleared.");
    console.log(window.localStorage);
}
function closeAll() {
    gameOver();
    //closes all UI
    for (let key in uiElementsHidable) {
        uiElementsHidable[key].classList.add('hidden');
    }

    AUDIO.randomizeMenuMusic();
}

//-------------------------HIGHSCORES----------------------------------
//SCORE RETRIEVAL TODO: refactor, global leaderboard
const GLOBAL_LB = [
    { name: "PLAYER1", score: 0 },
    { name: "PLAYER2", score: 0 },
    { name: "PLAYER3", score: 0 },
    { name: "PLAYER4", score: 0 },
    { name: "PLAYER5", score: 0 }
]

export function updateScoresHTML() {
    for (let i = 0; i < 10; i++) {
        if (!STATE.scores[i]) {
            STATE.scores[i] = 0;
        }
        if (document.querySelector('.score0')) {
            document.querySelector('.score' + i).innerHTML = STATE.scores[i].toString().padStart(3, "0");
        }
    }
}

// Retreives local leaderboard from localScores, fill with 0's
function retrieveLocalScores() {
    if (window.localStorage.getItem('localScores')) {
        STATE.scores = JSON.parse(window.localStorage.getItem('localScores'));

        updateScoresHTML();

        console.log("Highscores retrieved. " + STATE.scores);
    }
}

retrieveLocalScores(); // TODO: move to main

function renderLocalLeaderboard() {
    const container = document.querySelector(".local-scores");
    container.innerHTML = "";

    STATE.scores
        .sort((a, b) => b - a)
        .forEach((player, index) => {
            const row = document.createElement("div");
            row.className = "player-card";

            row.innerHTML = `
                <div class="player-rank">${index + 1}</div>
                <div class="player-score score${index}">${player.toString().padStart(3, "0")}</div>
            `;

            container.appendChild(row);
        });
}
renderLocalLeaderboard(); // TODO: move to main

function renderGlobalLeaderboard() {
    const container = document.querySelector(".global-scores");
    container.innerHTML = "";

    const header = document.createElement("div");
    header.className = "player-card header-row";
    header.innerHTML = `
        <div class="player-rank">#</div>
        <div class="player-score">SCORE</div>
        <div class="player-name">NAME</div>
    `;
    container.appendChild(header);

    GLOBAL_LB
        .sort((a, b) => b.score - a.score)
        .forEach((player, index) => {
            const row = document.createElement("div");
            row.className = "player-card";

            row.innerHTML = `
                <div class="player-rank">${index + 1}</div>
                <div class="player-score">${player.score.toString().padStart(3, "0")}</div>
                <div class="player-name">${player.name}</div>
            `;

            container.appendChild(row);
        });
}
renderGlobalLeaderboard(); // TODO: move to main

function toggleScores() {
    if (scoreDisplayOpen) {
        hideScoreDisplay();
    }
    else if (!scoreDisplayOpen) {
        showScoreDisplay();
    }
}
function hideScoreDisplay() {
    uiElements.scoreAnchor.style.left = `${canvas.width - UI_DEFAULTS.BUTTON_WIDTH - UI_DEFAULTS.SCORE_WIDTH_ADJUST}px`;
    scoreDisplayOpen = false;
    AUDIO.playSFX('click');
}
function showScoreDisplay() {
    const SCORE_X = canvas.width - UI_DEFAULTS.SCORE_WIDTH - UI_DEFAULTS.SCORE_WIDTH_ADJUST;

    uiElements.scoreAnchor.style.left = `${SCORE_X}px`;

    scoreDisplayOpen = true;
    AUDIO.playSFX('click');
}

//-------------------------OTHER-------------------------------
// TODO: refactor into a custom Display Alert
function showEndGameFirstText() {
    clearInterval(eGTInterval);
    eGTCount = 0;
    eGTFlash();
    eGTInterval = setInterval(eGTFlash, 600);
}
function eGTFlash() {
    if (eGTCount > 3) {
        clearInterval(eGTInterval);
        uiElementsHidable.endGameFirstText.classList.add('hidden');
    }
    else if (eGTCount % 2 == 0) {
        uiElementsHidable.endGameFirstText.classList.remove('hidden');
        eGTCount += 1;
    }
    else if (eGTCount % 2 != 0) {
        uiElementsHidable.endGameFirstText.classList.add('hidden');
        eGTCount += 1;
    }
}

// TODO: move to inputs/handlers

uiElements.closeButton.addEventListener('click', closeAll);
uiElements.howToButton.addEventListener('click', () => openMenu(uiElements.howToButton, uiElementsHidable.howToScreen));

// ------------------------
function openMenu(button, screen) {
    if (button.classList.contains('greyed')) {
        showEndGameFirstText();
    }
    else if (!button.classList.contains('greyed')) {
        if (screen.classList.contains('skins-menu-screen') && screen.classList.contains('hidden')) {
            ship.displayOnSide();
            ship.exploding = false;

            updateUnlocks();
        } else if (!screen.classList.contains('hidden')) {
            ship.reset();
        }
        screen.classList.toggle('hidden'); //toggles screen
        AUDIO.playSFX('click');
    }
}

//navigation TODO: improve music menu, refactor
function showPage(n) {
    // d
}
function prevMusicPage() {
    //if on page 1 go to page 3
    if (!musicItems.musicPage1.classList.contains("hidden")) {
        musicItems.musicPage1.classList.add("hidden");
        musicItems.musicPage3.classList.remove("hidden");
    }
    //if on page 2 go to page 1
    else if (!musicItems.musicPage2.classList.contains("hidden")) {
        musicItems.musicPage2.classList.add("hidden");
        musicItems.musicPage1.classList.remove("hidden");
    }
    //if on page 3 go to page 2
    else if (!musicItems.musicPage3.classList.contains("hidden")) {
        musicItems.musicPage3.classList.add("hidden");
        musicItems.musicPage2.classList.remove("hidden");
    }
    AUDIO.playSFX('click');
}
function nextMusicPage() {
    //if on page 1 go to page 2
    if (!musicItems.musicPage1.classList.contains("hidden")) {
        musicItems.musicPage1.classList.add("hidden");
        musicItems.musicPage2.classList.remove("hidden");
    }
    //if on page 2 go to page 3
    else if (!musicItems.musicPage2.classList.contains("hidden")) {
        musicItems.musicPage2.classList.add("hidden");
        musicItems.musicPage3.classList.remove("hidden");
    }
    //if on page 3 go to page 1
    else if (!musicItems.musicPage3.classList.contains("hidden")) {
        musicItems.musicPage3.classList.add("hidden");
        musicItems.musicPage1.classList.remove("hidden");
    }
    AUDIO.playSFX('click');
}
//--------------
const musicData = {
    page1: [
        {
            icon: '&#128126',
            title: 'Raining Bits (default)',
            artist: 'Gundatsch',
            url: 'https://soundcloud.com/gundatsch',
            src: 'assets/audio/rainingBitsGundatsch.ogg'
        },
        // {
        //     icon: '&#128299',
        //     title: 'NES Shooter - Boss',
        //     artist: 'SketchyLogic',
        //     url: 'https://soundcloud.com/sketchylogic',
        //     src: 'assets/audio/NESBossIntroSketchyLogic.wav'
        // }, !!!
        {
            icon: '&#63',
            title: 'WIP (no sound)',
            artist: 'N/A',
            url: '',
            src: 'assets/audio/pop.ogg'
        },
        {
            icon: '&#128121',
            title: 'Lines of Code',
            artist: 'Trevor Lentz',
            url: 'https://open.spotify.com/artist/3AjWA7sRmeZSKqr7PoKL6k',
            src: 'assets/audio/linesOfCodeTLentz.mp3'
        },
        {
            icon: '&#127932',
            title: 'Cyber Sonata',
            artist: 'Joth',
            url: 'https://opengameart.org/users/joth',
            src: 'assets/audio/cyberSonataJoth.mp3'
        },
        {
            icon: '&#127950',
            title: 'Hyper Ultra-Racing',
            artist: 'cynicmusic',
            url: 'https://cynicmusic.com',
            src: 'assets/audio/hyperUltraRacingcynicmusic.wav'
        },
        {
            icon: '&#127776',
            title: 'Lunar Arrow',
            artist: 'mmry',
            url: 'https://soundcloud.com/mmry/',
            src: 'assets/audio/lunarArrowmmry.mp3'
        },
    ],
    page2: [
        {
            icon: '&#9749',
            title: 'Bossa Nova',
            artist: 'Joth',
            url: 'https://opengameart.org/users/joth',
            src: 'assets/audio/bossaNovaJoth.mp3'
        },
        {
            icon: '&#127754',
            title: 'Enchanted Tiki 86',
            artist: 'cynicmusic',
            url: 'https://cynicmusic.com',
            src: 'assets/audio/ET86cynicmusic.mp3'
        },
        // {
        //     icon: '&#11088',
        //     title: 'Chiptune Adventures',
        //     artist: 'Juhani Junkala',
        //     url: 'https://juhanijunkala.com/',
        //     src: 'assets/audio/chiptunesJJunkala.wav'
        // },
        {
            icon: '&#63',
            title: 'WIP (no sound)',
            artist: 'N/A',
            url: '',
            src: 'assets/audio/pop.ogg'
        },
        {
            icon: '&#128760',
            title: 'Thrust Sequence',
            artist: 'matthewpablo',
            url: 'https://www.matthewpablo.com',
            src: 'assets/audio/thrustSequenceMPablo.mp3'
        },
        {
            icon: '&#127761',
            title: 'Orbital Colossus',
            artist: 'matthewpablo',
            url: 'https://www.matthewpablo.com',
            src: 'assets/audio/orbitalColossusMPablo.mp3'
        },
        {
            icon: '&#127928',
            title: 'The Recon Mission',
            artist: 'Zander Noriega',
            url: 'https://twitter.com/ZanderNoriega',
            src: 'assets/audio/theReconMissionZNoriega.mp3'
        },
    ]
};
function createMusicTile(song) {
    const div = document.createElement('div');
    div.className = 'music-tile';
    div.innerHTML = `
        <h6 class="music-icon">${song.icon}</h6>
        <h6><u>${song.title}</u></h6>
        <p><a target="_blank" href="${song.url}"><b><u>${song.artist}</u></b></a></p>
    `;
    div.addEventListener('click', () => AUDIO.changeBkgMusic(song.src));
    return div;
}

function createMusicPage(pageNumber, isHidden = false) {
    const pageSongs = musicData[`page${pageNumber}`];
    const row1Data = pageSongs.slice(0, 3);
    const row2Data = pageSongs.slice(3, 6);

    const div = document.createElement('div');
    div.classList.add(`music-page${pageNumber}`);
    if (isHidden) {
        div.classList.add('hidden');
    }

    const row1 = document.createElement('div');
    row1.className = 'flex';
    row1Data.forEach(song => row1.appendChild(createMusicTile(song)));

    const row2 = document.createElement('div');
    row2.className = 'flex';
    row2Data.forEach(song => row2.appendChild(createMusicTile(song)));

    div.appendChild(row1);
    div.appendChild(row2);
    return div;
}

function createMusicCreditsPage(pageNumber) {
    const div = document.createElement('div');
    div.classList.add(`music-page${pageNumber}`, 'hidden');

    const heading = document.createElement('h5');
    heading.innerHTML = '<u>Menu/Loading Music</u>';
    div.appendChild(heading);

    const makeLinkLine = (label, src, artist, url) => {
        const p = document.createElement('p');
        const link = document.createElement('u');
        link.textContent = label;
        link.style.cursor = 'pointer';
        link.addEventListener('click', () => AUDIO.changeMenuMusic(src));
        p.appendChild(link);
        p.appendChild(document.createTextNode(` - `));

        const artistName = document.createElement('u');
        artistName.innerHTML = `<a href=${url}>${artist}</a>`;


        p.appendChild(artistName);
        return p;
    };

    div.appendChild(makeLinkLine('Deep Sea', 'assets/audio/menuDeepSeaUmplix.mp3', 'Umplix', 'https://opengameart.org/users/umplix'));
    div.appendChild(makeLinkLine('Magic Space', 'assets/audio/menuMagicSpaceCodeManu.mp3', 'CodeManu', 'https://opengameart.org/users/codemanu'));
    div.appendChild(makeLinkLine('Loading Screen Loop', 'assets/audio/menuLSLBMorris.wav', 'HaelDB', 'https://www.youtube.com/brandon75689'));
    div.appendChild(makeLinkLine('Stage Select', 'assets/audio/stageSelectJJunkala.wav', 'Juhani Junkala', 'https://juhanijunkala.com/'));

    const checkTheseHeading = document.createElement('h5');
    checkTheseHeading.innerHTML = '<u>Check these out!</u>';
    div.appendChild(checkTheseHeading);

    const p1 = document.createElement('p');
    p1.innerHTML = '<b>PixelSphere</b> by <b>cynicmusic</b>, a free "2d-sidescroller with an <b>interactive</b> musical soundtrack"! <a target="_blank" href="https://pixelsphere.org/">https://pixelsphere.org/</a>';
    div.appendChild(p1);

    const p2 = document.createElement('p');
    p2.innerHTML = '<b>Aviary Attorney</b> by <b>SketchyLogic</b>, a paid "~swanderful~ experience", where you play as "Monsieur Jayjay Falcon, a bird of prey with a good heart and questionable lawyering expertise". <a target="_blank" href="https://aviaryattorney.com/">https://aviaryattorney.com/</a>';
    div.appendChild(p2);

    return div;
}

const musicMount = document.getElementById('music-mount');
const musicScreen = document.createElement('div'); // needs to exist outside scope
function initMusicScreen() {
    musicScreen.classList.add('music-screen', 'fs32', 'hidden');

    const heading = `
        <h2>
            <button class="prev-page-button">◀</button> 
            MUSIC 
            <button class="next-page-button">▶</button>
        </h2>
    `;

    const page1 = createMusicPage(1);
    const page2 = createMusicPage(2, true);
    const page3 = createMusicCreditsPage(3);

    musicScreen.innerHTML = `
    ${heading}
    `;
    musicScreen.appendChild(page1);
    musicScreen.appendChild(page2);
    musicScreen.appendChild(page3);

    musicMount.replaceChildren(musicScreen);
}

initMusicScreen(); // TODO: move to main



// ----------------------------- SKINS ------------------------------------------




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

// Persistence TODO: move to dedicated?

//BKG RETRIEVAL
function retrieveBackground() {
    if (window.localStorage.getItem('bkgImg')) {
        const id = JSON.parse(window.localStorage.getItem('bkgImg'));
        uiElements.backgroundImg.src = BKG_PATH + BKG_SKINS_MAP[id].unlockedImage;
    } else {
        resetBkgImg();
    }
}
retrieveBackground(); // TODO: move to persistence/main

export function changeBkgSkin(bkgId) {
    uiElements.backgroundImg.src = BKG_PATH + BKG_SKINS_MAP[bkgId].unlockedImage;
    window.localStorage.setItem('bkgImg', JSON.stringify(bkgId));
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
    img.addEventListener('click', () => ship.changeSkin(id));

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

const skinsScreen = document.createElement('div'); // needs to exist outside scope
const skinsMount = document.getElementById('skins-mount');
function initSkinScreen() {
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
    addUIElementHidable('skinsMenuScreen', skinsScreen); // TODO: good way to do this? Run dom.js after?
}

initSkinScreen(); // TODO: move to main & call update on the page

// Update skins to be Unlocked or Greyed
function updateSkinUnlocks() {
    window.localStorage.setItem('unlocks', JSON.stringify(DEFAULT_STATE.unlocks));

    Object.keys(SKINS_MAP).forEach((id) => {
        const obj = SKINS_MAP[id];
        if (!obj.lockedImage) return;

        const elem = uiElements[kebabToCamel(obj.cssClass)];
        if (STATE.unlocks.includes(id)) {
            elem.classList.remove("greyed");
            elem.src = SPRITES_PATH + SKINS_MAP[id].unlockedImage;
            window.localStorage.setItem('unlocks', JSON.stringify(STATE.unlocks));
        } else {
            elem.classList.add("greyed");
            elem.src = SPRITES_PATH + SKINS_MAP[id].lockedImage;
        }
    });
}

export function updateUnlocks() {
    let highestScore = STATE.scores[0];
    if (CONFIG.unlockAll) {
        highestScore = 1000000;
    } else if (!CONFIG.unlockAll) {
        STATE.unlocks = DEFAULT_STATE.unlocks;
    }

    if (!STATE.unlocks.includes("snake") && highestScore >= 100) {
        STATE.unlocks.push("snake");
    }
    if (!STATE.unlocks.includes("inverted") && highestScore >= 150) {
        STATE.unlocks.push("inverted");
    }
    if (!STATE.unlocks.includes("asteroid") && highestScore >= 250) {
        STATE.unlocks.push("asteroid");
    }
    updateSkinUnlocks();
}


// TODO: get this working dynamically?
const musicSelectors = [
    '.prev-page-button',
    '.next-page-button',
    '.music-page1',
    '.music-page2',
    '.music-page3',
];
const musicItems = {};

musicSelectors.forEach(selector => {
    const className = selector.substring(1);
    const variableName = kebabToCamel(className);

    musicItems[variableName] = document.querySelector(selector);
});

uiElements.musicButton.addEventListener('click', () => openMenu(uiElements.musicButton, musicScreen));
musicItems.prevPageButton.addEventListener('click', prevMusicPage);
musicItems.nextPageButton.addEventListener('click', nextMusicPage);

//deviceButton.addEventListener('click', changeDevice);
uiElements.skinsButton.addEventListener('click', () => openMenu(uiElements.skinsButton, uiElementsHidable.skinsMenuScreen));
uiElements.audioButton.addEventListener('click', openAudioMenu);

uiElements.scoreAnchor.addEventListener('click', toggleScores);

//keyboard
window.addEventListener("keydown", function (e) { //creates an array to detect keys
    keys[e.key] = true;
    //console.log(e.key);
});
window.addEventListener("keyup", function (e) { //deletes any keys in the array to save memory
    delete keys[e.key];
});

function onFirstInteraction() {
    AUDIO.retrieveAudioSettings(); // TODO: move to main
    if (!AUDIO.triedPlayingMenu) {
        AUDIO.menuMusic.play().catch(() => console.log("error playing menu music"));
        AUDIO.triedPlayingMenu = true;
    }
    STATE.userInteracted = true;

    document.removeEventListener('click', onFirstInteraction);
}
document.addEventListener('click', onFirstInteraction);