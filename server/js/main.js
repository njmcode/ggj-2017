'use strict';

/**
 * main.js
 */

var CONFIG = require('./config');

var States = {
    'Startup': require('./states/startup'),
    'Title': require('./states/title'),
    'Play': require('./states/play')
};

/**
 * Main app - logic is in the various states
 */
function Main() {
    // Create a new game
    var game = new Phaser.Game(
        CONFIG.gameSize.width,
        CONFIG.gameSize.height,
        Phaser.AUTO
    );
    for ( var k in States ) {
        game.state.add(k, States[k]);
    }

    console.log('Starting game...');
    game.state.start('Startup');
};

module.exports = Main;
