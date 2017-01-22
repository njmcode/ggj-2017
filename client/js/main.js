console.log('MAIN');

var camera, scene, renderer, fog;
var effect, controls;
var element, container;

var hudGroup, hudIconMesh;

var clock = new THREE.Clock();

var STEREO = !(window.location.hash && window.location.hash.substr(1) === '2d');

SocketTransport.open({
    /*host: '29b12dba.ngrok.io',
    port: 5005,*/
    url: location.protocol.replace('http', 'ws') + '//29b12dba.ngrok.io',
    onopen: function() {
      console.log('SOCKET OPEN');
        SocketTransport.send('visor:connected');
        init();
        animate();
    }
});

SocketTransport.on('simulation:dead', function(data) {

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

  var floor = ElementFactory.VisorFloor();
  floor.rotation.x = -Math.PI / 2;
  scene.add(floor);

  /** Rotation mesh **/

  rotsphere = ElementFactory.VisorSphere();
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
  hudIconMesh.position.set(-4, -2, -6);

  hudGroup.add(hudIconMesh);

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
function update(dt) {
  resize();

  camera.position.set(Math.sin(Date.now() * 0.0005) * 5, 10, Math.sin(Date.now() * 0.001) * 5);
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
      angle: radToDeg(camera.rotation.y)
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


