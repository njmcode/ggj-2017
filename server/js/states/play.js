'use strict';

var CONFIG = require('../config');
var _common = require('./_common');
var Gamepad = require('../utils/gamepad');
var Map = require('../classes/map');


/**
 * State object
 */
var PlayfieldState = function() {
};

PlayfieldState.prototype.preload = function() {
    _common.setGameScale(this.game);
};

PlayfieldState.prototype.create = function() {
    console.log('PLAY FIELD');
    //this.socket = _common.socket;
    var state = this;

    // CONFIG
    var roomSize = CONFIG.settings.roomSize;
    var tileSize = CONFIG.settings.tileSize;

    state.game.physics.startSystem(Phaser.Physics.ARCADE);

    var theMap = new Map(48, 32, roomSize);
    console.log('map generated', theMap);

    var tileMap = state.game.add.tilemap();
    var layer = state.tileLayer = tileMap.create('layer1', 48, 32, tileSize, tileSize);
    layer.resizeWorld();

    tileMap.addTilesetImage('walls', 'walls', tileSize, tileSize, 0, 0, 1);
    tileMap.addTilesetImage('hazard', 'hazard', tileSize, tileSize, 0, 0, 8);
    tileMap.setCollisionBetween(1, 7);

    var rooms = theMap.rooms;
    var tiles, tileOffsetX, tileOffsetY, tX, tY, lnX, lnY;
    for ( var i = 0, ln = rooms.length; i < ln; i++ ) {
        tileOffsetX = (Math.floor(i / theMap.yRange) * roomSize);
        tileOffsetY = (i % theMap.yRange) * roomSize;
        tiles = rooms[i].tiles;
        for ( tX = 0, lnX = tiles.length; tX < lnX; tX++ ) {
            for ( tY = 0, lnY = tiles[tX].length; tY < lnY; tY++ ) {
                tileMap.putTile(tiles[tX][tY], tX + tileOffsetX, tY + tileOffsetY, layer);
            }
        }
    }

    // Player sprite needs to be smaller than the tile size, or getting around
    // hazards is going to be impossible!!
    var playerStartX = Math.floor(roomSize / 2) * tileSize;
    var playerStartY = Math.floor(roomSize / 2) * tileSize + (theMap.startRoom.roomId * roomSize * tileSize);
    var playerSprite = state.playerSprite = state.game.add.sprite(playerStartX, playerStartY, 'player');
    playerSprite.height = 16;
    playerSprite.width = 16;
    playerSprite.anchor.set(0.5, 0.5);
    state.game.physics.enable(playerSprite);
    playerSprite.body.setSize(24, 24, 0, 4);    // Note: body size is based off original sprite size!

    state.game.camera.follow(playerSprite);

    // Player controls - these may need tweaked once we have socket comms working!
    playerSprite.body.maxAngular = 500;
    playerSprite.body.angularDrag = 50;
    state.cursors = state.game.input.keyboard.createCursorKeys();

    // Bind socket events for controls
    state.socketControls = {
      fwd: false,
      back: false,
      left: false,
      right: false
    };

    SocketTransport.off('visor:controls');
    SocketTransport.off('visor:rotation');

    SocketTransport.on('visor:controls', function(data) {
      state.socketControls[data.direction] = data.active;
    });
    SocketTransport.on('visor:rotation', function(data) {
      state.playerSprite.angle = data.angle;
    });

    Gamepad.start();

    _common.disablePausing(state.game);
};

PlayfieldState.prototype.update = function() {
    var state = this;
    state.game.physics.arcade.collide(state.playerSprite, state.tileLayer);

    state.playerSprite.body.velocity.x = 0;
    state.playerSprite.body.velocity.y = 0;

    if ( state.socketControls.left || state.cursors.left.isDown || Gamepad.dirs.left ) {
        //state.playerSprite.body.angularVelocity = -100;
        state.game.physics.arcade.velocityFromAngle(state.playerSprite.angle - 90, 100, state.playerSprite.body.velocity);
    }
    else if ( state.socketControls.right || state.cursors.right.isDown || Gamepad.dirs.right ) {
        //state.playerSprite.body.angularVelocity = 100;
        state.game.physics.arcade.velocityFromAngle(state.playerSprite.angle + 90, 100, state.playerSprite.body.velocity);
    }
    if ( state.socketControls.fwd || state.cursors.up.isDown || Gamepad.dirs.up ) {
        state.game.physics.arcade.velocityFromAngle(state.playerSprite.angle, 100, state.playerSprite.body.velocity);
    }
    else if ( state.socketControls.back || state.cursors.down.isDown || Gamepad.dirs.down ) {
        state.game.physics.arcade.velocityFromAngle(state.playerSprite.angle, -100, state.playerSprite.body.velocity);
    }
};

PlayfieldState.prototype.render = function() {
};

module.exports = PlayfieldState;
