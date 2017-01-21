'use strict';

/**
 * assets.js
 * List of required project assets and some simple logic
 * for preloading them in Phaser.
 * Used during the Startup state to preload and report on all
 * required assets - we do this upfront to prevent pauses/delays
 * during the game.
**/

// Object list of assets to preload
var assets = {

    // ui, scenes and images are standard image files.
    // Format is [key, path, width, height]
    ui: [
        /*['icon-fire', '/static/assets/icon-fire.png', 128, 128],
        ['icon-shield', '/static/assets/icon-shield.png', 128, 128],
        ['title-logo', '/static/assets/title/logo.png', 480, 81],
        ['starfield', '/static/assets/title/starfield.png', 800, 400],
        ['layer1', '/static/assets/title/layer1.png', 800, 400],
        ['layer2', '/static/assets/title/layer2.png', 800, 400],
        ['layer3', '/static/assets/title/layer3.png', 800, 400],
        ['clouds', '/static/assets/title/clouds.png', 800, 400],
        ['dusk-mask', '/static/assets/title/dusk_mask.png', 800, 400],
        ['vignette', '/static/assets/title/vignette.png', 800, 400]*/
    ],
    // Format is [key, path, width, height]
    images: [
        /*['s-wizard', '/static/assets/empty.png', 40, 120],
        ['shot', '/static/assets/spell-shot.png', 128, 128],
        ['shield', '/static/assets/spell-shield.png', 128, 128]*/
        ['walls', '/assets/walls.png', 224, 32],
        ['player', '/assets/player.png', 32, 32],
        ['hazard', '/assets/hazard.png', 32, 32]
    ],
    // Audio files to load
    sounds: [
        /*['title-theme', ['/static/assets/audio/title-theme.mp3',
                         '/static/assets/audio/title-theme.opus']
        ],
        ['bgm', ['/static/assets/audio/bgm.mp3',
                 '/static/assets/audio/bgm.opus']
        ],
        ['collide1', ['/static/assets/audio/collide1.mp3',
                      '/static/assets/audio/collide1.opus']
        ],
        ['shield-collide1', ['/static/assets/audio/shield-collide1.mp3',
                             '/static/assets/audio/shield-collide1.opus']
        ],
        ['shield1', ['/static/assets/audio/shield1.mp3',
                     '/static/assets/audio/shield1.opus']
        ],
        ['shot1', ['/static/assets/audio/shot1.mp3',
                   '/static/assets/audio/shot1.opus']
        ]*/
    ]
};

/**
 * Calls Phaser's load functions on the assets list and fires a callback
 * when each one completes.
 * @param game - reference to Phaser.Game instance
 * @param fileLoadedCallback - function to fire when *each* file loads
**/
function preloadAssets(game, fileLoadedCallback) {

    game.load.onFileComplete.add(fileLoadedCallback, this);

    console.log('Preloading ui...');
    assets.ui.forEach(function(item) {
        game.load.image(item[0], item[1], item[2], item[3]);
    });

    console.log('Preloading images...');
    assets.images.forEach(function(item) {
        game.load.image(item[0], item[1], item[2], item[3]);
    });

    console.log('Preloading sounds...');
    assets.sounds.forEach(function(item) {
        game.load.audio(item[0], item[1]);
    });

    game.load.start();

}

module.exports = {
    assets: assets,
    preload: preloadAssets
};
