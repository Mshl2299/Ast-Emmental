//Audio
import { uiElements } from "./dom.js";

// Sound effects
const SOUNDS = {
    pop: "assets/audio/pop.ogg",
    click: "assets/audio/click.wav",
    lvlUp: "assets/audio/success.mp3",
    ding: "assets/audio/ding.wav",
    explosion: "assets/audio/explosion.wav",
};


export const AUDIO = {
    bkgMusic: new Audio(),
    menuMusic: new Audio(),
    menuMusicNumber: 0,

    // Use: AUDIO.playSFX('id');
    sfxVolume: 1,
    playSFX(id) {
        const audio = new Audio(SOUNDS[id]);
        audio.volume = this.sfxVolume;
        audio.play();
    },

    // Retrieve and apply audio settings from localStorage
    // uiElements should contain: sfxRange, musicRange, sfxButton, musicToggleButton
    retrieveAudioSettings(uiElements = {}) {
        // SFX volume
        if (window.localStorage.getItem("sfxRange")) {
            uiElements.sfxRange.value = JSON.parse(window.localStorage.getItem("sfxRange"));
        } else {
            uiElements.sfxRange.value = "100";
            window.localStorage.setItem("sfxRange", JSON.stringify(uiElements.sfxRange.value));
        }

        // MUSIC volume
        if (window.localStorage.getItem("musicRange")) {
            uiElements.musicRange.value = JSON.parse(window.localStorage.getItem("musicRange"));
        } else {
            uiElements.musicRange.value = "50";
            window.localStorage.setItem("musicRange", JSON.stringify(uiElements.musicRange.value));
        }

        // BKG MUSIC
        if (!window.localStorage.getItem("bkgMusic")) {
            this.bkgMusic.src = "assets/audio/rainingBitsGundatsch.ogg";
            window.localStorage.setItem("bkgMusic", JSON.stringify(this.bkgMusic.src));
        } else {
            this.bkgMusic.src = JSON.parse(window.localStorage.getItem("bkgMusic"));
        }

        // MENU MUSIC
        if (!window.localStorage.getItem("menuMusic")) {
            this.randomizeMenuMusic();
            window.localStorage.setItem("menuMusic", JSON.stringify(this.menuMusic.src));
        } else {
            this.menuMusic.src = JSON.parse(window.localStorage.getItem("menuMusic"));
        }

        // Apply initial volumes and UI icons
        this.updateVolume(uiElements);
    },

    // Change background music source
    changeBkgMusic(source) {
        this.bkgMusic.pause();
        this.bkgMusic.src = source;
        this.playSFX('click');
    },

    // Change menu music source (played immediately)
    changeMenuMusic(source) {
        this.menuMusic.pause();
        this.menuMusic.src = source;
        this.menuMusic.play();
        this.playSFX('click');
    },

    restartBkgMusic() {
        if (this.bkgMusic.ended) this.bkgMusic.play();
    },

    restartMenuMusic() {
        if (this.menuMusic.ended || this.menuMusic.paused) this.menuMusic.play();
    },

    switchToMenu() {
        this.bkgMusic.pause();
        this.menuMusic.play();
    },

    switchToBkg() {
        this.menuMusic.pause();
        this.bkgMusic.play();
    },

    randomizeMenuMusic() {
        this.menuMusic.pause();
        this.menuMusicNumber = Math.floor(Math.random() * 4);
        switch (this.menuMusicNumber) {
            case 0:
                this.menuMusic.src = "assets/audio/menuDeepSeaUmplix.mp3";
                break;
            case 1:
                this.menuMusic.src = "assets/audio/menuMagicSpaceCodeManu.mp3";
                break;
            case 2:
                this.menuMusic.src = "assets/audio/menuLSLBMorris.wav";
                break;
            case 3:
                this.menuMusic.src = "assets/audio/stageSelectJJunkala.wav";
                break;
            default:
                this.menuMusic.src = "";
        }
        this.menuMusic.play();
    },

    // Update volumes and UI; expects uiElements as in retrieveAudioSettings
    updateVolume(uiElements = {}) {
        const sfxVal = Number(uiElements.sfxRange?.value ?? 100);
        const musicVal = Number(uiElements.musicRange?.value ?? 50);

        this.sfxVolume = sfxVal / 100;
        this.bkgMusic.volume = musicVal / 180;
        this.menuMusic.volume = musicVal / 200;

        if (uiElements.sfxRange) {
            if (sfxVal > 0) uiElements.sfxButton.src = "assets/images/audioUnmuted.png";
            else uiElements.sfxButton.src = "assets/images/audioMuted.png";
        }

        if (uiElements.musicRange) {
            if (musicVal > 0) uiElements.musicToggleButton.src = "assets/images/musicUnmuted.jpg";
            else uiElements.musicToggleButton.src = "assets/images/musicMuted.png";
        }

        window.localStorage.setItem("sfxRange", JSON.stringify(String(sfxVal)));
        window.localStorage.setItem("musicRange", JSON.stringify(String(musicVal)));
    },
};

export default AUDIO;
