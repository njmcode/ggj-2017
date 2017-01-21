/**
 * Room class
 */
'use strict';

var Room = function( roomId, roomsize, bounds ) {
    this.roomId = roomId;
    this.connectedRooms = [];
    this.adjacentRooms = {};
    this.isStart = false;
    this.hasExit = false;
    this.bounds = bounds;
    this.tiles = [];
    
    var isEdgeTile = function(x, y) {
        if ( x === 0 || x === roomsize - 1 ) {
            return true;
        }
        else if ( y === 0 || y === roomsize - 1 ) {
            return true;
        }
        return false;
    };
    
    // Initialise the tiles array
    for ( var x = 0; x < roomsize; x++ ) {
        this.tiles[x] = [];
        for ( var y = 0; y < roomsize; y++ ) {
            this.tiles[x].push( ( isEdgeTile(x, y) ) ? 1 : 0 );
        }
    }
};
Room.prototype.connectToRoom = function( room ) {
    if ( !this.isConnectedTo(room) ) {
        this.connectedRooms.push(room);
        if ( !room.isConnectedTo(this) ) {
            room.connectToRoom(this);
        }
    }
};
Room.prototype.isConnectedTo = function( room ) {
    return this.connectedRooms.includes(room);
};
Room.prototype.hasConnectedRooms = function( room ) {
    return this.connectedRooms.length > 0;
};
Room.prototype.hasFreeAdjacentRooms = function() {
    for ( var i in this.adjacentRooms ) {
        if ( !this.adjacentRooms[i].hasConnectedRooms() ) {
            return true;
        }
    }
};

module.exports = Room;
