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
    var roomSize = 8;

    // Audio
    /*state.bgm = this.add.audio('bgm', 1, true);
    state.audio_prep = this.add.audio('shield2');
    state.audio_shot = this.add.audio('shot3');
    state.audio_shield = this.add.audio('shield1');
    state.audio_scollide = this.add.audio('shield-collide4');
    state.audio_collide = this.add.audio('collide2');
    state.audio_death = this.add.audio('shield-collide1');*/

    state.game.physics.startSystem(Phaser.Physics.ARCADE);

    var theMap = new Map(48, 32, roomSize);
    console.log('map generated', theMap);
    
    var tileMap = state.game.add.tilemap();
    var layer1 = tileMap.create('layer1', 48, 32, 32, 32);
    layer1.resizeWorld();
    
    tileMap.addTilesetImage('walls');
    tileMap.addTilesetImage('hazard');
    
    var rooms = theMap.rooms;
    var tiles, tileOffsetX, tileOffsetY, tX, tY, lnX, lnY;
    for ( var i = 0, ln = rooms.length; i < ln; i++ ) {
        tileOffsetX = (Math.floor(i / theMap.yRange) * roomSize);
        tileOffsetY = (i % theMap.yRange) * roomSize;
        tiles = rooms[i].tiles;
        for ( tX = 0, lnX = tiles.length; tX < lnX; tX++ ) {
            for ( tY = 0, lnY = tiles[tX].length; tY < lnY; tY++ ) {
                console.log('placing tile', tiles[tX][tY], tX + tileOffsetX, tY + tileOffsetY);
                tileMap.putTile(tiles[tX][tY], tX + tileOffsetX, tY + tileOffsetY, layer1);
            }
        }
    }

    // Connect event
    /*state.socket.on('connect', function(data) {
        console.log('PlayField received CONNECT');
        state.socket.emit('host', {game: gameID});
    });

    state.socket.on('gesture', function(data) {
        console.log('PlayField received GESTURE', data);

        switch (data.state) {
            // Prepare a spell
            case 'prep':
                prepSpell(data.player, data);
                break;

            // Cast a spell
            case 'action':
                switch (data.intent) {
                    case 'shot':
                        fireProjectile(data.player, data);
                        break;
                    case 'shield':
                        raiseShield(data.player, data);
                        break;
                }
                break;
        }
    });*/
};

PlayfieldState.prototype.update = function() {
    var state = this;
    
};

PlayfieldState.prototype.render = function() {
};

module.exports = PlayfieldState;
