import { GAME_CONFIG } from "./config.js";
export class AudioManager {
    constructor() {
        this.setupMusic = document.getElementById(GAME_CONFIG.AUDIO.SETUP.id);
        this.gameMusic = document.getElementById(GAME_CONFIG.AUDIO.GAME.id);
        this.boomSound = new Audio(GAME_CONFIG.AUDIO.BOOM.src);
        this.playerBoom = new Audio(GAME_CONFIG.AUDIO.PLAYER_BOOM.src);
        
        this.setupMusic.volume = GAME_CONFIG.AUDIO.SETUP.volume;
        this.gameMusic.volume = GAME_CONFIG.AUDIO.GAME.volume;
        this.boomSound.volume = GAME_CONFIG.AUDIO.BOOM.volume;
        this.playerBoom.volume = GAME_CONFIG.AUDIO.PLAYER_BOOM.volume;
    }

    // Audio methods remain the same
    playSetupMusic() {
        this.setupMusic.play();
        this.setupMusic.style.visibility = "visible";
    }

    stopSetupMusic() {
        this.setupMusic.pause();
        this.setupMusic.style.visibility = "hidden";
    }

    playGameMusic() {
        this.gameMusic.play();
        this.gameMusic.style.visibility = "visible";
    }

    playBoom(isPlayer = false) {
        isPlayer ? this.playerBoom.play() : this.boomSound.play();
    }
}