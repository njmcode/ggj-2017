/**
 * util.js
 */
'use strict';

var Util = {
    randomInt: function( max, min ) {
        max = Math.floor(max);
        min = Math.ceil(min || 0);
        return Math.floor(Math.random() * (max - min)) + min;
    }
};

module.exports = Util;
