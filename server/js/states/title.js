/**
 * title.js
 * State for the game title screen.
**/
'use strict';

var CONFIG = require('../config');
var STRINGS = require('../strings');
var _common = require('./_common');

var TitleState = function() {};

TitleState.prototype.preload = function() {
    _common.setGameScale(this.game);
};

TitleState.prototype.create = function() {

  var state = this;

  // Water background
  // Taken from Phaser FILTERS examples page

  var fragmentSrc = [

      "precision mediump float;",

      "uniform float     time;",
      "uniform vec2      resolution;",
      "uniform vec2      mouse;",

      "#define MAX_ITER 4",

      "void main( void )",
      "{",
          "vec2 v_texCoord = gl_FragCoord.xy / resolution;",

          "vec2 p =  v_texCoord * 8.0 - vec2(20.0);",
          "vec2 i = p;",
          "float c = 1.0;",
          "float inten = .05;",

          "for (int n = 0; n < MAX_ITER; n++)",
          "{",
              "float t = time * (1.0 - (3.0 / float(n+1)));",

              "i = p + vec2(cos(t - i.x) + sin(t + i.y),",
              "sin(t - i.y) + cos(t + i.x));",

              "c += 1.0/length(vec2(p.x / (sin(i.x+t)/inten),",
              "p.y / (cos(i.y+t)/inten)));",
          "}",

          "c /= float(MAX_ITER);",
          "c = 1.5 - sqrt(c);",

          "vec4 texColor = vec4(0.0, 0.01, 0.015, 1.0);",

          "texColor.rgb *= (1.0 / (1.0 - (c + 0.05)));",

          "gl_FragColor = texColor;",
      "}"
  ];

  state.waterFilter = new Phaser.Filter(state.game, null, fragmentSrc);
  state.waterFilter.setResolution(800, 500);
  var waterBG = state.add.sprite()
  waterBG.width = 800;
  waterBG.height = 500;
  waterBG.filters = [state.waterFilter];

  // Main logo
  state.logo = state.add.sprite(400, 250, 'logo');
  state.logo.anchor.set(0.5);
  state.logo.alpha = 0.5;

  // Connection status text
  state.conStatusText = state.add.text(
        400, 400,
        STRINGS['title.awaitingVisor'],
        CONFIG.font.baseStyle);
  state.conStatusText.anchor.set(0.5);

  // Credits footer
  state.footerText = state.add.text(
    400, 480,
    STRINGS['title.creditFooter'],
    CONFIG.font.smallStyle);
  state.footerText.anchor.set(0.5);

  SocketTransport.on('visor:connected', function() {
    state.conStatusText.setText(STRINGS['title.gameStarting']);
    state.time.events.add(Phaser.Timer.SECOND * 5, function() {
      state.game.state.start('Play');
    });
  });

  SocketTransport.open();
};


TitleState.prototype.update = function() {
  var state = this;

  state.waterFilter.update();
  state.conStatusText.alpha = Math.abs(Math.sin(Date.now() * 0.005));
};

module.exports = TitleState;
