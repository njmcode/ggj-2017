/**
 * config.js
 *
 * Configuration object used across the app.
 */


var CONFIG = {
    debug: {
        enabled: true
    },

    stateAfterStartup: 'Title',

    // Pixel size of the Phaser canvas
    gameSize: {
        width: 800,
        height: 500
    },

    font: {
        baseStyle: {
            font: '24px VT323',
            fill: '#4fcfc9',
            stroke: '#000',
            strokeThickness: 1,
            align: 'center'
        },
        smallStyle: {
            font: '18px VT323',
            fill: '#01a6d0',
            stroke: '#000',
            strokeThickness: 1,
            align: 'center'
        }
    },

    settings: {
        roomSize: 8,    // Room size in tiles
        tileSize: 32    // Tile size in pixels
    }
};

module.exports = CONFIG;
