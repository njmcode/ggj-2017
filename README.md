# ggj-2017
Repo for Global Game Jam 2017.


## Requirements

 * Node
 * Docker
 * Make

## Installation

Clone the repo and `make run` to spin up the Docker environment.
All internal dependencies will be installed.

## Infrastructure

There are two main components to the game: *Visor* and *Screen*.

 * *Visor* is the view seen by the player wearing the VR headset.
 * *Screen* is the view seen by the player(s) issuing guidance and instructions.

Once `make run` has finished, *Screen* will be available from `localhost:5005`.

`nodemon` is used to watch any changes in the `js` directory and rebuild/restart
the Node server accordingly.
