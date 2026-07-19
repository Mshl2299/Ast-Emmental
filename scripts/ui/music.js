// Music Data & Music Page rendering
import { uiElementsHidable, addUIElementHidable } from "../dom.js";
import { AUDIO } from "../audio.js";

// ------------------------------------- MUSIC MENU ------------------------------------
let musicPages = [];
let currMusicPage = 1;

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

function showPage(pageNum) {
    const max = musicPages.length;
    if (pageNum < 1) pageNum = max;
    if (pageNum > max) pageNum = 1;
    currMusicPage = pageNum;
    uiElementsHidable.musicMenuScreen.querySelectorAll('.music-page')
        .forEach((element, idx) => {
            element.classList.toggle('hidden', (idx + 1) !== currMusicPage);
        });
}

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

function createMusicHeader() {
    const header = document.createElement('h2');
    const prevButton = document.createElement('button');
    prevButton.classList.add('prev-page-button');
    prevButton.textContent = "◀";
    prevButton.addEventListener('click', () => showPage(currMusicPage - 1));

    const nextButton = document.createElement('button');
    nextButton.classList.add('next-page-button');
    nextButton.textContent = "▶";
    nextButton.addEventListener('click', () => showPage(currMusicPage + 1));

    header.append(prevButton);
    header.append(' MUSIC ');
    header.append(nextButton);
    return header;
}

function createMusicPage(pageNumber, show = false) {
    musicPages.push(pageNumber);
    const pageSongs = musicData[`page${pageNumber}`];
    const row1Data = pageSongs.slice(0, 3);
    const row2Data = pageSongs.slice(3, 6);

    const div = document.createElement('div');
    div.classList.add('music-page');
    if (!show) {
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
    musicPages.push(pageNumber);
    const div = document.createElement('div');
    div.classList.add('music-page', 'hidden');

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
export function initMusicScreen() {
    const musicScreen = document.createElement('div');
    musicScreen.classList.add('music-screen', 'fs32', 'hidden');

    const header = createMusicHeader();
    const page1 = createMusicPage(1, true);
    const page2 = createMusicPage(2);
    const page3 = createMusicCreditsPage(3);

    musicScreen.appendChild(header);
    musicScreen.appendChild(page1);
    musicScreen.appendChild(page2);
    musicScreen.appendChild(page3);

    musicMount.replaceChildren(musicScreen);
    addUIElementHidable('musicMenuScreen', musicScreen);
}