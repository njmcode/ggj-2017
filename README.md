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

Once `make run` has finished:

 * *Visor* will be available from 'localhost:8000`.
 * *Screen* will be available from `localhost:5005`.

`nodemon` is used to watch any changes in the `js` directory and rebuild/restart
the Node server accordingly.

## Playing/testing the game

 * Load *Screen* on a large monitor. It will automatically start the game once
   *Visor* has connected.
 * Proxy *Visor* through `ngrok` or another tunnelling service.
 * Load *Visor* on a VR-equipped web device (e.g. Chrome Android w/Google Cardboard).
 * *Screen* will detect when *Visor* has connected and automatically start the game.



