/**
 * path.js
 */
'use strict';

/**
 * Path class. Used to generate a path from point to point.
 */
var Path = function( startX, startY ) {
    this.points = [];
    if ( startX !== undefined && startY !== undefined ) {
        this.points.push( [startX, startY] );
    }
};
Path.prototype.push = function( x, y ) {
    this.points.push( [x, y] );
};
Path.prototype.pop = function() {
    return this.points.pop();
};
Path.prototype.getLast = function() {
    if ( this.points.length < 1 ) {
        return false;
    }
    return this.points[this.points.length - 1];
};
Path.prototype.contains = function( x, y ) {
    for ( var i = 0, ln = this.points.length; i < ln; i++ ) {
        if ( this.points[i][0] === x && this.points[i][1] === y ) {
            return true;
        }
    }
    return false;
};

module.exports = Path;
