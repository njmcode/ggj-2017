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
    this.roomsize = roomsize;
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
    var direction = this.determineDirectionOf(room);
    if ( !direction ) {
        // Room is not adjacent to this one! Cannot connect them!
        return;
    }
    
    if ( !this.isConnectedTo(room) ) {
        this.connectedRooms.push(room);
        this.setDoorway(direction);
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
Room.prototype.determineDirectionOf = function( room ) {
    for ( var d in this.adjacentRooms ) {
        if ( room === this.adjacentRooms[d] ) {
            return d;
        }
    };
    
    return null;
};
Room.prototype.setDoorway = function( direction ) {
    var roomMiddle = Math.floor(this.roomsize / 2);
    
    switch ( direction ) {
        case 'N':
            this.tiles[roomMiddle][0] = 0;
            this.tiles[roomMiddle + 1][0] = 0;
            break;
        case 'S':
            this.tiles[roomMiddle][this.roomsize - 1] = 0;
            this.tiles[roomMiddle + 1][this.roomsize - 1] = 0;
            break;
        case 'E':
            this.tiles[this.roomsize - 1][roomMiddle] = 0;
            this.tiles[this.roomsize - 1][roomMiddle + 1] = 0;
            break;
        case 'W':
            this.tiles[0][roomMiddle] = 0;
            this.tiles[0][roomMiddle + 1] = 0;
            break;
    }
};

module.exports = Room;
