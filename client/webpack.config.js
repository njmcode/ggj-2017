'use strict';

var webpack = require('webpack');

module.exports = {
    entry: {
        'boot': './js/boot.js'
    },
    output: {
        path: './js/',
        filename: '[name].bundle.js'
    }
};