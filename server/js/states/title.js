/**
 * title.js
 * State for the game title screen.
**/
'use strict';

var CONFIG = require('../config');
//var STRINGS = require('../strings');
var _common = require('./_common');

var TitleState = function() {};

TitleState.prototype.preload = function() {
    _common.setGameScale(this.game);
    console.log('TITLESTATE PRELOAD');
};

TitleState.prototype.create = function() {
  console.log('Fuckin shazam');

};


TitleState.prototype.update = function() {

};

module.exports = TitleState;
