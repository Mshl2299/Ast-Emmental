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
    triedPlayingMenu: false,

    // Usage: AUDIO.playSFX('id');
    sfxVolume: 1,
    playSFX(id) {
        const audio = new Audio(SOUNDS[id]);
        audio.volume = this.sfxVolume;
        audio.play();
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
    // Called every frame, TODO: fix audio settings persistence
    updateVolume() {
        const sfxVal = Number(uiElements.sfxRange?.value ?? 100);
        const musicVal = Number(uiElements.musicRange?.value ?? 50); // TODO

        this.sfxVolume = sfxVal / 100;
        this.bkgMusic.volume = musicVal / 180;
        this.menuMusic.volume = musicVal / 200;

        if (uiElements.sfxRange) {
            if (sfxVal > 0) uiElements.sfxToggleButton.src = "assets/images/audioUnmuted.png";
            else uiElements.sfxToggleButton.src = "assets/images/audioMuted.png";
        }

        if (uiElements.musicRange) {
            if (musicVal > 0) uiElements.musicToggleButton.src = "assets/images/musicUnmuted.jpg";
            else uiElements.musicToggleButton.src = "assets/images/musicMuted.png";
        }
    },
};

AUDIO.bkgMusic.loop = true;
AUDIO.menuMusic.loop = true;

export default AUDIO;
