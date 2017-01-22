var ElementFactory = (function() {

  var TEXTURES = {

  }

  function VisorFloor() {
    var geo = new THREE.PlaneGeometry(1000, 1000);

    var texture = THREE.ImageUtils.loadTexture(
    'assets/textures/patterns/dots2.png'
    );
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat = new THREE.Vector2(250, 250);
    texture.anisotropy = renderer.getMaxAnisotropy();

    var material = new THREE.MeshBasicMaterial({
      shading: THREE.FlatShading,
      map: texture
    });

    var mesh = new THREE.Mesh(geo, material);

    return mesh;
  }

  function VisorSphere() {
    var geo = new THREE.SphereGeometry( 30, 40, 40 );

    var texture = THREE.ImageUtils.loadTexture(
      'assets/textures/patterns/dots2.png'
    );
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat = new THREE.Vector2(60, 60);
    texture.anisotropy = renderer.getMaxAnisotropy();

    var material = new THREE.MeshBasicMaterial({
      shading: THREE.FlatShading,
      transparent: true,
      map: texture,
      side: THREE.BackSide
    });
    material.depthWrite = false;
    material.depthTest = false;
    var mesh = new THREE.Mesh(geo, material);
    mesh.renderDepth = -10;

    return mesh;
  }

  function VisorHUDLower() {
    var geo = new THREE.PlaneGeometry(11.2, 2.5);
    var texture = THREE.ImageUtils.loadTexture(
      'assets/hudtex/hud-bottom.png'
    );
    texture.anisotropy = renderer.getMaxAnisotropy();

    var material = new THREE.MeshBasicMaterial({
      shading: THREE.FlatShading,
      transparent: true,
      map: texture
    });
    var mesh = new THREE.Mesh(geo, material);

    return mesh;
  }

  function VisorHUDUpper() {
    var geo = new THREE.PlaneGeometry(11.2, 2.5);
    var texture = THREE.ImageUtils.loadTexture(
      'assets/hudtex/hud-top.png'
    );
    texture.anisotropy = renderer.getMaxAnisotropy();

    var material = new THREE.MeshBasicMaterial({
      shading: THREE.FlatShading,
      transparent: true,
      map: texture
    });
    var mesh = new THREE.Mesh(geo, material);

    return mesh;
  }

  return {
    VisorFloor: VisorFloor,
    VisorSphere: VisorSphere,
    VisorHUDLower: VisorHUDLower,
    VisorHUDUpper: VisorHUDUpper
  }

})();