require('script!./libs/threejs/three.js');
require('script!./libs/threejs/StereoEffect.js');
require('script!./libs/threejs/DeviceOrientationControls.js');
require('script!./libs/threejs/OrbitControls.js');
require('script!/shared/js/socket-transport.js');

console.log('MAIN');

var camera, scene, renderer, fog;
var effect, controls;
var element, container;

require('script!./modules/elements.js');

var hudGroup, hudIconMesh;

var clock = new THREE.Clock();

var STEREO = !(window.location.hash && window.location.hash.substr(1) === '2d');

SocketTransport.open({
    port: 5005,
    onopen: function() {
      console.log('SOCKET OPEN');
        SocketTransport.send('visor:connected');
        init();
        animate();
    }
});

var MOTION = {
  fwd: false,
  back: false,
  left: false,
  right: false
}

SocketTransport.on('simulation:dead', function(data) {

});

SocketTransport.on('simulation:movement', function(data) {
  console.log(data);
  MOTION[data.direction] = data.active;
});

SocketTransport.on('REFRESH', function(data) {
  window.location.reload();
});

function setOrientationControls(e) {
  if (!e.alpha) {
    return;
  }

  controls = new THREE.DeviceOrientationControls(camera, true);
  controls.connect();
  controls.update();

  element.addEventListener('click', fullscreen, false);

  window.removeEventListener('deviceorientation', setOrientationControls, true);
}

function init() {
  renderer = new THREE.WebGLRenderer();
  element = renderer.domElement;
  container = document.getElementById('example');
  container.appendChild(element);

  scene = new THREE.Scene();

  /** Camera and controls **/

  if (STEREO) {
    effect = new THREE.StereoEffect(renderer);
  }

  camera = new THREE.PerspectiveCamera(90, 1, 0.001, 700);
  camera.position.set(0, 10, 0);
  scene.add(camera);

  console.log('CAMERA', camera);

  controls = new THREE.OrbitControls(camera, element);
  controls.rotateUp(Math.PI / 4);
  controls.target.set(
    camera.position.x + 0.1,
    camera.position.y,
    camera.position.z + 100
  );
  controls.noZoom = true;
  controls.noPan = true;

  window.addEventListener('deviceorientation', setOrientationControls, true);

  /** Lights and fog **/

  var light = new THREE.HemisphereLight(0x777777, 0x000000, 0.6);
  scene.add(light);

  /** Plane / horizon **/

  var floor = ElementFactory.VisorFloor(renderer);
  floor.rotation.x = -Math.PI / 2;
  scene.add(floor);

  /** Rotation mesh **/

  rotsphere = ElementFactory.VisorSphere(renderer);
  scene.add(rotsphere);


  /** UI **/

  hudGroup = new THREE.Object3D(0, 0, 0);

  var hudIconTexture = new THREE.ImageUtils.loadTexture(
    'assets/textures/icons/warning.png'
  );
  var hudIconGeo = new THREE.PlaneGeometry(0.5, 0.5);
  hudIconTexture.wrapS = THREE.RepeatWrapping;
  hudIconTexture.wrapT = THREE.RepeatWrapping;
  hudIconTexture.anisotropy = renderer.getMaxAnisotropy();
  var hudIconMaterial = new THREE.MeshBasicMaterial({
    shading: THREE.FlatShading,
    transparent: true,
    map: hudIconTexture
  });
  hudIconMesh = new THREE.Mesh(hudIconGeo, hudIconMaterial);
  hudIconMesh.position.set(-3, -1, -7);

  hudGroup.add(hudIconMesh);

  var hudLower = ElementFactory.VisorHUDLower(renderer);
  hudLower.position.set(0, -3, -6);
  hudLower.material.opacity = 0.5;
  hudGroup.add(hudLower);

  var hudUpper = ElementFactory.VisorHUDUpper(renderer);
  hudUpper.position.set(0, 3, -6);
  hudUpper.material.opacity = 0.5;
  hudGroup.add(hudUpper);

  scene.add(hudGroup);
  hudGroup.position.copy(camera.position);

  /** Listeners **/

  window.addEventListener('resize', resize, false);
  setTimeout(resize, 1);
}

function resize() {
  var width = container.offsetWidth;
  var height = container.offsetHeight;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  renderer.setSize(width, height);
  if (STEREO) effect.setSize(width, height);
}

var SOCKET_UPDATE_TIME = 50;
var _lt, _ct;
var _lt = Date.now();


var MOTION_SPEED = 0.08;

function update(dt) {
  resize();

  //camera.position.set(Math.sin(Date.now() * 0.0005) * 5, 10, Math.sin(Date.now() * 0.001) * 5);
  camera.position.y = 10;
  /*var dir = camera.getWorldDirection();*/
  if (MOTION.fwd) {
    camera.translateZ( -MOTION_SPEED );
  } else if (MOTION.back) {
    camera.translateZ( MOTION_SPEED );
  }

  if (MOTION.left) {
    camera.translateX( -MOTION_SPEED );
  } else if (MOTION.right) {
    camera.translateX( MOTION_SPEED );
  }

  rotsphere.position.copy(camera.position);
  rotsphere.position.y = camera.position.y - 25;

  hudGroup.position.copy(camera.position);
  hudGroup.rotation.copy(camera.rotation);

  hudIconMesh.material.opacity = Math.abs(Math.sin(Date.now() * 0.005));

  camera.updateProjectionMatrix();

  controls.update(dt);

  // send socket messages
  _ct = Date.now();
  if (_ct - _lt > SOCKET_UPDATE_TIME) {
    SocketTransport.send('visor:rotation', {
      angle: radToDeg(-camera.rotation.y)
    });
    _lt = _ct;
  }
}

function radToDeg (angle) {
  return angle * (180 / Math.PI);
}

function render(dt) {
  if (STEREO) {
    effect.render(scene, camera);
  } else {
    renderer.render(scene, camera);
  }
}

function animate(t) {
  requestAnimationFrame(animate);

  update(clock.getDelta());
  render(clock.getDelta());
}

function fullscreen() {
  if (container.requestFullscreen) {
    container.requestFullscreen();
  } else if (container.msRequestFullscreen) {
    container.msRequestFullscreen();
  } else if (container.mozRequestFullScreen) {
    container.mozRequestFullScreen();
  } else if (container.webkitRequestFullscreen) {
    container.webkitRequestFullscreen();
  }
}


