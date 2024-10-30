export const GAME_CONFIG = {
    GRID_WIDTH: 10,
    SHIPS: [
        { name: 'destroyer', size: 2 },
        { name: 'submarine', size: 3 },
        { name: 'cruiser', size: 3 },
        { name: 'battleship', size: 4 },
        { name: 'carrier', size: 5 }
    ],
    AUDIO: {
        SETUP: { id: 'setupMusic', volume: 0.5 },
        GAME: { id: 'gameMusic', volume: 0.5 },
        BOOM: { src: '../music/boom.mp3', volume: 0.01 },
        PLAYER_BOOM: { src: '../music/player_boom.mp3', volume: 0.01 }
    }
};