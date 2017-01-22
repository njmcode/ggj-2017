/**
 * Room class
 */
'use strict';

var CONFIG = require('../config');
var Util = require('./util');
var Path = require('./path');

var Room = function( roomId, roomsize, bounds ) {
    this.roomId = roomId;
    this.connectedRooms = [];
    this.adjacentRooms = {};
    this.isStart = false;
    this.hasExit = false;
    this.bounds = bounds;
    this.roomsize = roomsize;
    this.tiles = [];
    
    // Initialise the tiles array
    for ( var x = 0; x < roomsize; x++ ) {
        this.tiles[x] = [];
        for ( var y = 0; y < roomsize; y++ ) {
            this.tiles[x].push( ( this.isEdgeTile(x, y) ) ? CONFIG.tiles.wall : CONFIG.tiles.floor );
        }
    }
};
Room.prototype.isEdgeTile = function( x, y ) {
    if ( x === 0 || x === this.roomsize - 1 ) {
        return true;
    }
    else if ( y === 0 || y === this.roomsize - 1 ) {
        return true;
    }
    return false;
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
    var roomMiddle = Math.floor(this.roomsize / 2) - 1;
    
    switch ( direction ) {
        case 'N':
            this.tiles[roomMiddle][0] = CONFIG.tiles.floor;
            this.tiles[roomMiddle + 1][0] = CONFIG.tiles.floor;
            break;
        case 'S':
            this.tiles[roomMiddle][this.roomsize - 1] = CONFIG.tiles.floor;
            this.tiles[roomMiddle + 1][this.roomsize - 1] = CONFIG.tiles.floor;
            break;
        case 'E':
            this.tiles[this.roomsize - 1][roomMiddle] = CONFIG.tiles.floor;
            this.tiles[this.roomsize - 1][roomMiddle + 1] = CONFIG.tiles.floor;
            break;
        case 'W':
            this.tiles[0][roomMiddle] = CONFIG.tiles.floor;
            this.tiles[0][roomMiddle + 1] = CONFIG.tiles.floor;
            break;
    }
};
Room.prototype.generateRoom = function() {
    var hazardCount, hX, hY;
    if ( !this.hasConnectedRooms() ) {
        // Fill the room (impassable)
        for ( var x = 0; x < this.roomsize; x++ ) {
            for ( var y = 0; y < this.roomsize; y++ ) {
                this.tiles[x][y] = CONFIG.tiles.wall;
            }
        }
    }
    else if ( !this.isStart ) {
        var safePath, startPoint, nextRoomIndex = 1, nextTarget;
        
        // Randomly place hazards, but not in the starting room
        /*
        hazardCount = Util.randomInt(18, 3);
        for ( var c = 0; c < hazardCount; c++ ) {
            // Don't generate hazards at the walls >.>
            hX = Util.randomInt(7, 1);
            hY = Util.randomInt(7, 1);
            this.tiles[hX][hY] = 8;
        }
        */
        var pickDoorTargetTile = function( direction ) {
            var roomMiddle = Math.floor(this.roomsize / 2) - 1;
            roomMiddle += Util.randomInt(1);
            switch ( direction ) {
                case 'N':
                    x = roomMiddle;
                    y = 1;
                    break;
                case 'S':
                    x = roomMiddle;
                    y = this.roomsize - 2;
                    break;
                case 'E':
                    x = this.roomsize - 2;
                    y = roomMiddle;
                    break;
                case 'W':
                    x = 1;
                    y = roomMiddle;
                    break;
            }
            
            return [x, y];
        };
        var generatePathTo = function( givenPath, target ) {
            var nonviable = new Path();
            var resets = 0;
            var lastPoint = givenPath.getLast();
            var curX = lastPoint[0], curY = lastPoint[1];
            var direction, validDirs, nextd;
            do {
                // Compile a list of valid directions we can go
                validDirs = [];
                if ( !this.isEdgeTile(curX, curY - 1) && !givenPath.contains(curX, curY - 1) && direction !== 'S' && !nonviable.contains(curX, curY - 1) ) {
                    validDirs.push('N');
                }
                if ( !this.isEdgeTile(curX, curY + 1) && !givenPath.contains(curX, curY + 1) && direction !== 'N' && !nonviable.contains(curX, curY + 1) ) {
                    validDirs.push('S');
                }
                if ( !this.isEdgeTile(curX + 1, curY) && !givenPath.contains(curX + 1, curY) && direction !== 'W' && !nonviable.contains(curX + 1, curY) ) {
                    validDirs.push('E');
                }
                if ( !this.isEdgeTile(curX - 1, curY) && !givenPath.contains(curX - 1, curY) && direction !== 'E' && !nonviable.contains(curX - 1, curY) ) {
                    validDirs.push('W');
                }
                
                if ( validDirs.length === 0 ) {
                    // Dead end! Pop from the stack, and try again
                    resets++;
                    lastPoint = givenPath.pop();
                    nonviable.push(lastPoint[0], lastPoint[1]);
                    lastPoint = givenPath.getLast();
                    curX = lastPoint[0];
                    curY = lastPoint[1];
                    if ( resets > 30 ) {
                        console.log('something is broken again ... roomId: ' + this.roomId);
                        console.log('path', givenPath);
                        console.log('nonviable', nonviable);
                        break;
                    }
                    continue;
                }
                nextd = validDirs[Util.randomInt(validDirs.length - 1)];
                
                switch ( nextd ) {
                    case 'N':
                        curY--;
                        break;
                    case 'S':
                        curY++;
                        break;
                    case 'E':
                        curX++;
                        break;
                    case 'W':
                        curX--;
                        break;
                }
                givenPath.push(curX, curY);
                direction = nextd;
            } while ( !givenPath.contains(target[0], target[1]) );
            
            return givenPath;
        };
        
        // First, see if we need a path through the room
        //  Dead-end rooms will only have one connecting room (and no exit)
        // Doors are two tiles wide, so we'll randomly pick one
        startPoint = pickDoorTargetTile.call(this, this.determineDirectionOf(this.connectedRooms[0]));
        safePath = new Path(startPoint[0], startPoint[1]);
        
        if ( this.connectedRooms.length > 1 ) {
            // Pathfind to other connected rooms
            while ( this.connectedRooms[nextRoomIndex] ) {
                nextTarget = pickDoorTargetTile.call(this, this.determineDirectionOf(this.connectedRooms[nextRoomIndex]));
                if ( !safePath.contains(nextTarget[0], nextTarget[1]) ) {
                    // Generate path
                    safePath = generatePathTo.call(this, safePath, nextTarget);
                }
                
                nextRoomIndex++;
            }
        }
        if ( this.hasExit ) {
            // Pathfind to the exit
            nextTarget = pickDoorTargetTile.call(this, 'E');
            if ( !safePath.contains(nextTarget[0], nextTarget[1]) ) {
                safePath = generatePathTo.call(this, safePath, nextTarget);
            }
        }
        
        // TESTING ONLY: mark the path with the hazard tile for now
        var temp;
        for ( var i = 0, ln = safePath.points.length; i < ln; i++ ) {
            temp = safePath.points[i];
            this.tiles[temp[0]][temp[1]] = CONFIG.tiles.hazardFloor;
        }
    }
};

module.exports = Room;
