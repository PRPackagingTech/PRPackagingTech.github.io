if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var BOXES = {

  "0215": 	{

    name:	"FEFCO 0215",
    url: 	"../Models/0215.json",
    author: 'Paddy Carroll',
    init_rotation: [ 0, 0, 0 ],
    scale: 0.1,
    init_material: 5,
    body_materials: [ 5 ],

    object: null,
    buttons: null,
    materials: null

  }
};

var container;

var camera, scene, renderer;

var m, mi;

var directionalLight, pointLight;

var mouseX = 0, mouseY = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

init();
animate();

function init() {

  container = document.createElement( 'div' );
  document.body.appendChild( container );

  var loader = new THREE.JSONLoader();

  // CAMERAS

  camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 100000 );

  // SCENE

  scene = new THREE.Scene();

  var textureCube = new THREE.CubeTextureLoader()
    .setPath( '../Images/')
    .load( [ 'design.jpg', 'design.jpg', 'design.jpg', 'design.jpg', 'design.jpg', 'design.jpg' ] );
  scene.background = textureCube;

  // LIGHTS

  var ambient = new THREE.AmbientLight( 0x050505 );
  scene.add( ambient );

  directionalLight = new THREE.DirectionalLight( 0xffffff, 2 );
  directionalLight.position.set( 2, 1.2, 10 ).normalize();
  scene.add( directionalLight );

  directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
  directionalLight.position.set( -2, 1.2, -10 ).normalize();
  scene.add( directionalLight );

  pointLight = new THREE.PointLight( 0xffaa00, 2 );
  pointLight.position.set( 2000, 1200, 10000 );
  scene.add( pointLight );

  //
  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.setFaceCulling( THREE.CullFaceNone );

  document.body.appendChild( renderer.domElement );

  // CONTROLS

  controls = new THREE.OrbitControls(camera, renderer.domElement);

  // common materials

  var mlib = {

  "Fullblack rough":	new THREE.MeshLambertMaterial( { color: 0x000000 } ),
  "Black rough":		new THREE.MeshLambertMaterial( { color: 0x050505 } ),
  "Darkgray rough":	new THREE.MeshLambertMaterial( { color: 0x090909 } ),
  "Red rough":		new THREE.MeshLambertMaterial( { color: 0x330500 } ),

  "Darkgray shiny":	new THREE.MeshPhongMaterial( { color: 0x000000, specular: 0x050505 } ),
  "Gray shiny":		new THREE.MeshPhongMaterial( { color: 0x050505, shininess: 20 } )

  };

  // 0215 materials

  BOXES[ "0215" ].materials = {

    body: [

      [ "Fullblack rough", 	mlib[ "Fullblack rough" ] ],
      [ "Black rough", 		  mlib[ "Black rough" ] ],
      [ "Darkgray rough",   mlib[ "Darkgray rough" ] ],
      [ "Red rough", 		    mlib[ "Red rough" ] ],

      [ "Darkgray shiny", 	mlib[ "Darkgray shiny" ] ],
      [ "Gray shiny", 	    mlib[ "Gray shiny" ] ]

    ]

  };

  m = BOXES[ "0215" ].materials;
  mi = BOXES[ "0215" ].init_material;

  BOXES[ "0215" ].mmap = {

    0: m.body[ 3 ][ 1 ], 	  // face 1
    1: m.body[ 3 ][ 1 ],    // face 2
    2: m.body[ 3 ][ 1 ], 	  // face 3
    3: m.body[ 4 ][ 1 ],   // face 4
    4: m.body[ 4 ][ 1 ],    // face 5
    5: m.body[ 4 ][ 1 ],    // face 6
    6: m.body[ 4 ][ 1 ]	    // face 7

  };

  loader.load( BOXES [ "0215" ].url, function( geometry )
  {
      createScene( geometry, "0215" )
  });

  for( var b in BOXES )
  {
      //initBoxButton( b );
  }


  //

  window.addEventListener( 'resize', onWindowResize, false );

}

function onWindowResize() {

  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );

}

function initBoxButton( box ) {

  $( box ).addEventListener( 'click', function() {

    if ( ! BOXES[ box ].object ) {

      loader.load( BOXES[ box ].url, function( geometry ) { createScene( geometry, box ) } );

    } else {

      switchBox( box );

    }

  }, false );

}

function $( id )
{
  return document.getElementById( id )
}

function button_name( box, index )
{
  return "m_" + box  + "_" + index
}

function switchBox( box ) {

  for ( var b in BOXES ) {

    if ( b != box && BOXES[ b ].object ) {

      BOXES[ b ].object.visible = false;
      BOXES[ b ].buttons.style.display = "none";

    }
  }

  BOXES[ box ].object.visible = true;
  BOXES[ box ].buttons.style.display = "block";

  $( "box_name" ).innerHTML = BOXES[ box ].name + " model";
  $( "box_author" ).innerHTML = BOXES[ box ].author;

}

function createButtons( materials, box ) {

  var buttons, i, src = "";

  for( i = 0; i < materials.length; i ++ ) {

    src += '<button id="' + button_name( box, i ) + '">' + materials[ i ][ 0 ] + '</button> ';

  }

  buttons = document.createElement( "div" );
  buttons.innerHTML = src;

  $( "buttons_materials" ).appendChild( buttons );

  return buttons;

}

function attachButtonMaterials( materials, faceMaterials, material_indices, box ) {

  for( var i = 0; i < materials.length; i ++ ) {

    $( button_name( box, i ) ).counter = i;
    $( button_name( box, i ) ).addEventListener( 'click', function() {

      for ( var j = 0; j < material_indices.length; j ++ ) {

        faceMaterials[ material_indices [ j ] ] = materials[ this.counter ][ 1 ];

      }

    }, false );

  }

}

function createScene( geometry, box ) {

  geometry.sortFacesByMaterialIndex();

  var m = [],
    s = BOXES[ box ].scale * 1,
    r = BOXES[ box ].init_rotation,
    materials = BOXES[ box ].materials,
    mi = BOXES[ box ].init_material,
    bm = BOXES[ box ].body_materials;

  for ( var i in BOXES[ box ].mmap ) {

    m[ i ] = BOXES[ box ].mmap[ i ];

  }

  var mesh = new THREE.Mesh( geometry, m );

  mesh.rotation.x = r[ 0 ];
  mesh.rotation.y = r[ 1 ];
  mesh.rotation.z = r[ 2 ];

  mesh.scale.x = mesh.scale.y = mesh.scale.z = s;

  scene.add( mesh );

  BOXES[ box ].object = mesh;

  //BOXES[ box ].buttons = createButtons( materials.body, box );
  //attachButtonMaterials( materials.body, m, bm, box );

  //switchBox( box );

}

//

function animate() {

  requestAnimationFrame( animate );
  render();

}

function render() {

  controls.update();

  camera.position.x = 1;
  camera.position.y = 1;
  camera.position.z = 1;

  var timer = -0.0002 * Date.now();

  camera.position.x = 1 * Math.cos( timer );
  camera.position.z = 1 * Math.sin( timer );

  camera.lookAt( scene.position );

  renderer.render( scene, camera );

}
