'use strict';

var CONFIG = require('../config');
var _common = require('./_common');
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

    tileMap.addTilesetImage('floor', 'floor', tileSize, tileSize, 0, 0, 0);
    tileMap.addTilesetImage('walls', 'walls', tileSize, tileSize, 0, 0, 2);
    //tileMap.addTilesetImage('hazards', 'hazards', tileSize, tileSize, 0, 0, 3);
    //tileMap.addTilesetImage('exit', 'exit', tileSize, tileSize, 0, 0, 16);
    tileMap.setCollisionBetween(CONFIG.tiles.hazardFloor, CONFIG.tiles.wall);

    // Set the tiles according to what the rooms have generated
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
    
    // Group the hazards
    tileMap.setTileIndexCallback(CONFIG.tiles.hazardFloor, state.hazardHit, state, layer);
    
    // Add in exit tiles
    var exitLayer = tileMap.create('objectLayer', 48, 32, tileSize, tileSize);
    var exitTiles = theMap.getExitTiles();
    tileMap.putTile(16, exitTiles[0][0], exitTiles[0][1], exitLayer);
    tileMap.putTile(16, exitTiles[1][0], exitTiles[1][1], exitLayer);
    
    var exits = state.exits = state.game.add.group();
    exits.enableBody = true;
    tileMap.createFromTiles(16, 0, 'exit', exitLayer, exits);
    console.log(exits);
    

    // Player sprite needs to be smaller than the tile size, or getting around
    // hazards is going to be impossible!!
    var playerStartX = Math.floor(roomSize / 2) * tileSize;
    var playerStartY = Math.floor(roomSize / 2) * tileSize + (theMap.startRoom.roomId * roomSize * tileSize);
    var playerSprite = state.playerSprite = state.game.add.sprite(playerStartX, playerStartY, 'player');
    playerSprite.height = 16;
    playerSprite.width = 16;
    playerSprite.anchor.set(0.4, 0.5);
    state.game.physics.enable(playerSprite);
    playerSprite.body.setSize(48, 48, 0, 8);    // Note: body size is based off original sprite size!

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

    _common.disablePausing(state.game);
};

PlayfieldState.prototype.update = function() {
    var state = this;
    state.game.physics.arcade.collide(state.playerSprite, state.tileLayer);
    state.game.physics.arcade.overlap(state.playerSprite, state.exits, state.exitFound, null, state);

    state.playerSprite.body.velocity.x = 0;
    state.playerSprite.body.velocity.y = 0;

    if ( state.socketControls.left || state.cursors.left.isDown ) {
        //state.playerSprite.body.angularVelocity = -100;
        state.game.physics.arcade.velocityFromAngle(state.playerSprite.angle - 90, 100, state.playerSprite.body.velocity);
    }
    else if ( state.socketControls.right || state.cursors.right.isDown ) {
        //state.playerSprite.body.angularVelocity = 100;
        state.game.physics.arcade.velocityFromAngle(state.playerSprite.angle + 90, 100, state.playerSprite.body.velocity);
    }
    if ( state.socketControls.fwd || state.cursors.up.isDown ) {
        state.game.physics.arcade.velocityFromAngle(state.playerSprite.angle, 100, state.playerSprite.body.velocity);
    }
    else if ( state.socketControls.back || state.cursors.down.isDown ) {
        state.game.physics.arcade.velocityFromAngle(state.playerSprite.angle, -100, state.playerSprite.body.velocity);
    }
};

PlayfieldState.prototype.render = function() {
    //this.game.debug.body(this.playerSprite);
};

PlayfieldState.prototype.hazardHit = function() {
    console.log('you ded');
};

PlayfieldState.prototype.exitFound = function() {
    console.log('you win!');
};

module.exports = PlayfieldState;
