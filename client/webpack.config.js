'use strict';

var webpack = require('webpack');

module.exports = {
    entry: {
        'monitor': './monitor/js/index.js',
        'visor': './visor/js/index.js'
    },
    output: {
        path: '/static/dist',
        filename: '[name].bundle.js'
    }
};