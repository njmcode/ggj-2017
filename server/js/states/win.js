/**
 * win.js
 * State for the "Win" screen
 */
'use strict';

var CONFIG = require('../config');
var STRINGS = require('../strings');
var _common = require('./_common');

var WinState = function() {};

WinState.prototype.preload = function() {
    _common.setGameScale(this.game);
};
WinState.prototype.create = function() {
    var state = this;
    
    state.statusText = state.add.text(
        400, 400,
        STRINGS['win.gameOver'],
        CONFIG.font.baseStyle);
    state.statusText.anchor.set(0.5);
    
    // Credits footer
    state.footerText = state.add.text(
        400, 480,
        STRINGS['title.creditFooter'],
        CONFIG.font.smallStyle);
    state.footerText.anchor.set(0.5);
};

module.exports = WinState;
