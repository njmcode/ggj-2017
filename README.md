# 'Fathom' - Global Game Jam 2017

Repo for Global Game Jam 2017 ('Waves').

http://globalgamejam.org/2017/games/fathom

## Requirements

 * Node
 * Docker
 * Make

## Installation

Clone the repo and `make run` to spin up the Docker environment.
All internal dependencies will be installed.

## Infrastructure

Two Docker containers are created by `make run`:

 * `client` encapsulates the dev environment for both the 'Visor' and the 'Monitor' (see below), including build tools and source code.
 * `server` encapsulates the runtime game server including HTML, static assets and websockets.

When the Docker environment is running, the `/static` directory is also mounted as a volume for both the client and the server. The build tools for `client` will output JS payloads, assets and HTML templates to the `/static` directory (see `/client/package.json` and `/client/webpack.config.js`).

There are two main components to the game: **Visor** and **Monitor**.

 * **Visor** is the view seen by the player exploring the environment (and wearing a VR headset).
 * **Monitor** is the view seen by the player(s) issuing guidance and instructions.

The default port is 5005. Once `make run` has finished:

 * **Monitor** will be available from `localhost:5005` (connect to this *first*).
 * **Visor** will be available from `localhost:5005/visor`, leading to `/play`.

`nodemon` is used to watch any changes in the `js` directory and rebuild/restart
the Node server and dev tools accordingly (_TODO: this is currently broken, fix it_).

## Playing/testing the game locally

 * Load **Monitor** on a laptop or desktop. It will automatically start the game once **Visor** has connected.
 * Proxy the app through `ngrok` or another tunnelling service.
 * Load **Visor** on a VR-equipped web device (e.g. Chrome Android w/Google Cardboard).
 * **Monitor** will detect when **Visor** has connected and automatically start the game.
 * Use the arrow keys or a gamepad (experimental) _on the **Monitor**_ to move the player. Mouse-drag the **Visor** view or physically turn the VR device to change orientation.

## Post-jam TODOS

 * Clean up code and convert to ES6
 * Improved UX and robustness for game startup (options, connection prompts, gamepad, QR codes etc)
 * Server-side game state (room/lobby handling)
 * Improved visuals, narrative, audio etc
 * Improved map generation and exploration options
 * Additional mechanics - echolocation, sentient enemies, puzzles, timed hazards, objectives etc
 * _[DONE]_ Improve Docker container infrastructure / server setup
