
var PAD_INDEX = 1;
var PAD_DEAD_ZONE = 0.3;

var padData;

var axes = {
  v: 0,
  h: 0
}

var dirs = {
  up: false,
  down: false,
  left: false,
  right: false
};

if (!navigator.getGamepads()) {
  console.warn('WARNING: Gamepad API not supported');
}

function poll() {
  requestAnimationFrame(poll);
  var pads = navigator.getGamepads();
  if(!pads[PAD_INDEX]) return false;
  padData = pads[PAD_INDEX];
  axes.v = padData.axes[1];
  axes.h = padData.axes[0];

  dirs.up = (axes.v < -PAD_DEAD_ZONE);
  dirs.down = (axes.v > PAD_DEAD_ZONE);
  dirs.left = (axes.h < -PAD_DEAD_ZONE);
  dirs.right = (axes.h > PAD_DEAD_ZONE);
}

module.exports = {
  start: function() {
    poll();
  },
  axes: axes,
  dirs: dirs
};
