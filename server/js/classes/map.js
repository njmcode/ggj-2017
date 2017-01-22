/**
 * Map class
 */
'use strict';

var Room = require('./room');
var Util = require('./util');

/**
 * Map class used to generate and represent the level
 */
var Map = function( width, height, roomsize ) {
    this.width = width;
    this.height = height;
    this.roomsize = roomsize;
    this.xRange = width / roomsize;
    this.yRange = height / roomsize;
    this.rooms = [];
    this.hasExit = false;
    this.startRoom;
    
    this.initRooms();
    this.initPath();
};
Map.prototype.initRooms = function() {
    var x1, y1, x2, y2, t;
    // Initialise the room objects
    for ( var i = 0; i < this.xRange; i++ ) {
        for ( var j = 0; j  < this.yRange; j++ ) {
            x1 = i * this.roomsize;
            x2 = x1 + this.roomsize;
            y1 = j * this.roomsize;
            y2 = y1 + this.roomsize;
            /*this.rooms.push(new Room( (i * this.yRange) + j, new Bounds(x1, y1, x2, y2)));*/
            this.rooms.push(new Room( (i * this.yRange) + j, this.roomsize, {tl: {x: x1, y: y1}, br: {x: x2, y: y2}}));
        }
    }
    
    // Assign adjacent rooms
    for ( var x = 0, ln = this.rooms.length; x < ln; x++ ) {
        t = this.rooms[x];
        if ( t.roomId % this.yRange !== 0 ) {
            t.adjacentRooms.N = this.rooms[t.roomId - 1];
        }
        if ( (t.roomId + 1) % this.yRange !== 0 ) {
            t.adjacentRooms.S = this.rooms[t.roomId + 1];
        }
        if ( t.roomId - this.yRange >= 0 ) {
            t.adjacentRooms.W = this.rooms[t.roomId - this.yRange];
        }
        if ( t.roomId + this.yRange < ln ) {
            t.adjacentRooms.E = this.rooms[t.roomId + this.yRange];
        }
    }
};
Map.prototype.initPath = function() {
    var path = [];
    var theMap = this;
    path.push(this.rooms[Util.randomInt(this.yRange)]);
    path[0].isStart = true;
    theMap.startRoom = path[0];
    
    var generatePath = function() {
        var direction = ( Util.randomInt(2) ) ? 'N' : 'S';
        var lastRoomId = path[path.length - 1]['roomId'];
        var nextRoomId = lastRoomId;
        do {
            if ( direction === 'N' ) {
                // Path to the north
                if ( lastRoomId % theMap.yRange === 0 ) {
                    // Room is at top edge, cannot go north
                    // Instead, go east, and reverse direction
                    nextRoomId = lastRoomId + theMap.yRange;
                    direction = 'S';
                }
                else {
                    // Random chance to go east instead
                    if ( Util.randomInt(3) === 0 ) {
                        direction = 'E';
                        continue;
                    }
                    nextRoomId = lastRoomId - 1;
                }
            }
            else if ( direction === 'S' ) {
                // Path to the south
                if ( (lastRoomId + 1) % theMap.yRange === 0 ) {
                    // Room is at bottom edge, cannot go south
                    // Instead, go east, and reverse direction
                    nextRoomId = lastRoomId + theMap.yRange;
                    direction = 'N';
                }
                else {
                    // Random chance to go east instead
                    if ( Util.randomInt(3) === 0 ) {
                        direction = 'E';
                        continue;
                    }
                    nextRoomId = lastRoomId + 1;
                }
            }
            else {
                // Path to the east
                nextRoomId = lastRoomId + theMap.yRange;
                direction = ( Util.randomInt(2) ) ? 'N' : 'S';
            }
            
            if ( nextRoomId >= theMap.rooms.length ) {
                // Next room is beyond our map edge
                nextRoomId = -1;
                // Only one exit per map!
                if ( !theMap.hasExit ) {
                    theMap.rooms[lastRoomId].hasExit = true;
                    theMap.rooms[lastRoomId].setDoorway('E');
                    theMap.hasExit = true;
                }
            }
            else if ( theMap.rooms[nextRoomId].hasConnectedRooms() ) {
                // Bumped into an existing room, end the loop
                nextRoomId = -1;
            }
            else {
                theMap.rooms[lastRoomId].connectToRoom(theMap.rooms[nextRoomId]);
                path.push(theMap.rooms[nextRoomId]);
                lastRoomId = nextRoomId;
            }
        } while ( nextRoomId >= 0 );
    };
    
    generatePath();
    
    // Backtrack and generate branches
    var backtrack = path.pop();
    var nextRoom;
    while ( backtrack ) {
        if ( backtrack.hasFreeAdjacentRooms() ) {
            // Random chance to generate branches
            if ( Util.randomInt(3) === 0 ) {
                path.push(backtrack);
                generatePath();
                while ( backtrack !== path.pop() ) {}
            }
        }
        backtrack = path.pop();
    }
    
    // More efficient way of doing this? Could do while backtracking, but then
    //  we miss any rooms not connected :S
    for ( var r = 0, ln = theMap.rooms.length; r < ln; r++ ) {
        theMap.rooms[r].generateRoom();
    }
};

module.exports = Map;
