/**
 * config.js
 * 
 * Configuration object used across the app.
 */

var CONFIG = {
    debug: {
        enabled: true
    },
    
    stateAfterStartup: 'Play',
    
    // Pixel size of the Phaser canvas
    gameSize: {
        width: 600,
        height: 400
    },
    
    font: {
        baseStyle: {
            font: '24px VT323',
            fill: '#caa',
            stroke: '#000',
            strokeThickness: 1,
            align: 'center'
        },
        smallStyle: {
            font: '18px VT323',
            fill: '#caa',
            stroke: '#000',
            strokeThickness: 1,
            align: 'center'
        }
    },
    
    settings: {
    }
};

module.exports = CONFIG;
