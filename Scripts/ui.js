


function openAudioMenu() {
    audioMenu.classList.toggle('hidden');
    clickSound.play();
    //debug
}
function toggleSFX() {
    if (sFXRange.value > 0) {
        sFXRange.value = 0;
    }
    else if (sFXRange.value == 0) {
        sFXRange.value = 100;
        clickSound.play();
    }
}
function toggleMusic() {
    if (musicRange.value > 0) {
        musicRange.value = 0;
    }
    else if (musicRange.value == 0) {
        musicRange.value = 100;
        clickSound.play();
    }
}
function clearData() {
    window.localStorage.clear();
    scoreArray = [];
    for (i = 0; i <= 4; i++) {
        scoreArray[i] = "000";
        document.querySelector('.score' + i.toString()).innerHTML = scoreArray[i];
    }
    unlocks = [];
    ship.changeSkin('Sprites/alphaSS1.png');
    backgroundImg.src = blueSpace;

    explSound.play();
    updateUnlocks();

    console.log("Data Successfully Cleared.");
    console.log(window.localStorage);
}
function closeAll() {
    gameOver();
    //closes all UI
    uIScreensByClass.forEach(element => {
        element.classList.add('hidden');
    });

    randomizeMenuMusic();
}

//-------------------------HIGHSCORES----------------------------------
function toggleScores() {
    if (scoreDisplayOpen) {
        rightHexButton.style.left = "98%";
        scoreDisplay.style.left = "100%";
        scoreDisplayOpen = false;
        clickSound.play();
    }
    else if (!scoreDisplayOpen) {
        rightHexButton.style.left = "78.8%";
        scoreDisplay.style.left = "80%";
        scoreDisplayOpen = true;
        clickSound.play();
    }
}
//-------------------------OTHER-------------------------------
function showEndGameFirstText() {
    clearInterval(eGTInterval);
    eGTCount = 0;
    eGTFlash();
    eGTInterval = setInterval(eGTFlash, 600);
}
function eGTFlash() {
    if (eGTCount > 3) {
        clearInterval(eGTInterval);
        endGameFirstText.classList.add('hidden');
    }
    else if (eGTCount % 2 == 0) {
        endGameFirstText.classList.remove('hidden');
        eGTCount += 1;
    }
    else if (eGTCount % 2 != 0) {
        endGameFirstText.classList.add('hidden');
        eGTCount += 1;
    }
}

// All event Listeners
startButton.addEventListener('click', startGame);
//startButton.addEventListener('touchstart', startGame);
closeButton.addEventListener('click', closeAll);

howToButton.addEventListener('click', () => openMenu(howToButton, howToScreen));

// ------------------------
function openMenu(button, screen) {
    if (button.classList.contains('greyed')) {
        showEndGameFirstText();
    }
    else if (!button.classList.contains('greyed')) {
        if (screen.classList.contains('skinsMenuScreen') && screen.classList.contains('hidden')) {
            ship.x = 100; //move ship to side to see skins
            ship.y = canvas.height / 2 - ship.height / 2;
            ship.frameX = 0;
            ship.frameY = 0;
            updateUnlocks();
        } else if (!screen.classList.contains('hidden')) {
            ship.resetPos();
        }
        screen.classList.toggle('hidden'); //toggles screen
        clickSound.play();
    }
}
//navigation
function prevMusicPage() {
    //if on page 1 go to page 3
    if (!musicPage1.classList.contains("hidden")) {
        musicPage1.classList.add("hidden");
        musicPage3.classList.remove("hidden");
    }
    //if on page 2 go to page 1
    else if (!musicPage2.classList.contains("hidden")) {
        musicPage2.classList.add("hidden");
        musicPage1.classList.remove("hidden");
    }
    //if on page 3 go to page 2
    else if (!musicPage3.classList.contains("hidden")) {
        musicPage3.classList.add("hidden");
        musicPage2.classList.remove("hidden");
    }
    clickSound.play();
}
function nextMusicPage() {
    //if on page 1 go to page 2
    if (!musicPage1.classList.contains("hidden")) {
        musicPage1.classList.add("hidden");
        musicPage2.classList.remove("hidden");
    }
    //if on page 2 go to page 3
    else if (!musicPage2.classList.contains("hidden")) {
        musicPage2.classList.add("hidden");
        musicPage3.classList.remove("hidden");
    }
    //if on page 3 go to page 1
    else if (!musicPage3.classList.contains("hidden")) {
        musicPage3.classList.add("hidden");
        musicPage1.classList.remove("hidden");
    }
    clickSound.play();
}
//--------------
const musicData = {
    page1: [
        {
            icon: '&#128126',
            title: 'Raining Bits (default)',
            artist: 'Gundatsch',
            url: 'https://soundcloud.com/gundatsch',
            src: 'Audio/rainingBitsGundatsch.ogg'
        },
        // {
        //     icon: '&#128299',
        //     title: 'NES Shooter - Boss',
        //     artist: 'SketchyLogic',
        //     url: 'https://soundcloud.com/sketchylogic',
        //     src: 'Audio/NESBossIntroSketchyLogic.wav'
        // }, !!!
        {
            icon: '&#63',
            title: 'WIP (no sound)',
            artist: 'N/A',
            url: '',
            src: 'Audio/pop.ogg'
        },
        {
            icon: '&#128121',
            title: 'Lines of Code',
            artist: 'Trevor Lentz',
            url: 'https://open.spotify.com/artist/3AjWA7sRmeZSKqr7PoKL6k',
            src: 'Audio/linesOfCodeTLentz.mp3'
        },
        {
            icon: '&#127932',
            title: 'Cyber Sonata',
            artist: 'Joth',
            url: 'https://opengameart.org/users/joth',
            src: 'Audio/cyberSonataJoth.mp3'
        },
        {
            icon: '&#127950',
            title: 'Hyper Ultra-Racing',
            artist: 'cynicmusic',
            url: 'https://cynicmusic.com',
            src: 'Audio/hyperUltraRacingcynicmusic.wav'
        },
        {
            icon: '&#127776',
            title: 'Lunar Arrow',
            artist: 'mmry',
            url: 'https://soundcloud.com/mmry/',
            src: 'Audio/lunarArrowmmry.mp3'
        },
    ],
    page2: [
        {
            icon: '&#9749',
            title: 'Bossa Nova',
            artist: 'Joth',
            url: 'https://opengameart.org/users/joth',
            src: 'Audio/bossaNovaJoth.mp3'
        },
        {
            icon: '&#127754',
            title: 'Enchanted Tiki 86',
            artist: 'cynicmusic',
            url: 'https://cynicmusic.com',
            src: 'Audio/ET86cynicmusic.mp3'
        },
        {
            icon: '&#11088',
            title: 'Chiptune Adventures',
            artist: 'Juhani Junkala',
            url: 'https://juhanijunkala.com/',
            src: 'Audio/chiptunesJJunkala.wav'
        },
        {
            icon: '&#128760',
            title: 'Thrust Sequence',
            artist: 'matthewpablo',
            url: 'https://www.matthewpablo.com',
            src: 'Audio/thrustSequenceMPablo.mp3'
        },
        {
            icon: '&#127761',
            title: 'Orbital Colossus',
            artist: 'matthewpablo',
            url: 'https://www.matthewpablo.com',
            src: 'Audio/orbitalColossusMPablo.mp3'
        },
        {
            icon: '&#127928',
            title: 'The Recon Mission',
            artist: 'Zander Noriega',
            url: 'https://twitter.com/ZanderNoriega',
            src: 'Audio/theReconMissionZNoriega.mp3'
        },
    ]
};
function createMusicTile(song) {
    return `
        <div onclick="changeBkgMusic('${song.src}')" class="musicTile">
            <h6 class="musicIcon">${song.icon}</h6>
            <h6><u>${song.title}</u></h6>
            <p><a target="_blank" href="${song.url}"><b><u>${song.artist}</u></b></a></p>
        </div>
    `;
}

function createMusicPage(pageNumber) {
    if (pageNumber == 3) {

    } else {
        const pageSongs = musicData[`page${pageNumber}`];
        const row1 = pageSongs.slice(0, 3);
        const row2 = pageSongs.slice(3, 6);
        return `
        <div class="flex">
            ${row1.map(createMusicTile).join('')}
        </div>
        <div class="flex">
            ${row2.map(createMusicTile).join('')}
        </div>
    `;
    }
}

function createMusicScreen() {
    const musicScreen = document.createElement('div');
    musicScreen.classList.add('musicScreen', 'fs32', 'hidden');

    const heading = `
        <h2>
            <button class="prevPageButton">◀</button> 
            MUSIC 
            <button class="nextPageButton">▶</button>
        </h2>
    `;

    musicScreen.innerHTML = `
        ${heading}
        <div class="musicPage1">
            ${createMusicPage(1)}
        </div>
        <div class="musicPage2 hidden">
            ${createMusicPage(2)}
        </div>
        <div class="musicPage3 hidden">
            <h5><u>Menu/Loading Music</u></h5>
            <p><u onclick="changeMenuMusic('Audio/menuDeepSeaUmplix.mp3')">Deep Sea</u> - <u>Umplix</u></p>
            <p><u onclick="changeMenuMusic('Audio/menuMagicSpaceCodeManu.mp3')">Magic Space</u> - <u>Code Manu</u></p>
            <p><u onclick="changeMenuMusic('Audio/menuLSLBMorris.wav')">Loading Screen Loop</u> - <u>Brandon Morris</u></p>
            <h5><u>Check these out!</u></h5>
            <p><b>PixelSphere</b> by <b>cynicmusic</b>, a free "2d-sidescroller with an <b>interactive</b> musical soundtrack"! <a target="_blank" href="https://pixelsphere.org/">https://pixelsphere.org/</a></p>
            <p><b>Aviary Attorney</b> by <b>SketchyLogic</b>, a paid "~swanderful~ experience", where you play as "Monsieur Jayjay Falcon, a bird of prey with a good heart and questionable lawyering expertise". <a target="_blank" href="https://aviaryattorney.com/">https://aviaryattorney.com/</a></p>
        </div>
    `;

    document.body.appendChild(musicScreen);
}

createMusicScreen();
let musicItems = ['.musicScreen', '.prevPageButton', '.nextPageButton', '.musicPage1', '.musicPage2', '.musicPage3',]
musicItems.forEach(element => {
    window[element.substring(1)] = document.querySelector(element);
})

musicButton.addEventListener('click', () => openMenu(musicButton, musicScreen));
prevPageButton.addEventListener('click', prevMusicPage);
nextPageButton.addEventListener('click', nextMusicPage);

//deviceButton.addEventListener('click', changeDevice);
skinsButton.addEventListener('click', () => openMenu(skinsButton, skinsMenuScreen));
audioButton.addEventListener('click', openAudioMenu);

rightHexButton.addEventListener('click', toggleScores);
scoreDisplay.addEventListener('click', toggleScores);

//keyboard
window.addEventListener("keydown", function (e) { //creates an array to detect keys
    keys[e.key] = true;
    //console.log(e.key);
});
window.addEventListener("keyup", function (e) { //deletes any keys in the array to save memory
    delete keys[e.key];
});

document.addEventListener('click', function () {
    userInteracted = true;
}); //make chrome happy; no DOM errors when trying to play music before user 