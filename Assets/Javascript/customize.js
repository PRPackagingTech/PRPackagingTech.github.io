//*****************************************************************************\\
//                                    SETUP                                    \\
//*****************************************************************************\\


var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var renderer,
  scene,
  camera,
  myCanvas = document.getElementById('myCanvas');

//RENDERER
renderer = new THREE.WebGLRenderer({
  canvas: myCanvas,
  antialias: true
});
renderer.setClearColor(0x000000);
renderer.setPixelRatio(window.devicePixelRatio);
//Change this back or to suit screen size later
//renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setSize(windowHalfX, windowHalfY);

//

document.getElementById("preview").style.height = windowHalfY;
var cBH = document.getElementsByClassName("contentBody");
cBH[0].style.height = windowHalfY + 512 + "px";
//

//

//CAMERA
camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.set(5,2.5,2.5);

//SCENE
scene = new THREE.Scene();

//LIGHTS
var light = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(light);

var light2 = new THREE.PointLight(0xffffff, 0.5);
scene.add(light2);

//controls
controls = new THREE.OrbitControls(camera, renderer.domElement);

//MODEL and MODE and FACESELECTED
var modelType = 0;
var modeType = 0;
var faceSelected = 0;

//LOAD MODEL
var loader = new THREE.JSONLoader();
loader.load('../Models/0215closed.json', handle_load);
loader.load('../Models/0215open.json', handle_load);
loader.load('../Models/0215.json', handle_load);

//LOAD TEXTURES
var textures = [];
textures.push(new THREE.TextureLoader().load("../Images/0215closedv3.png"));
textures.push(new THREE.TextureLoader().load("../Images/0215openv2.png"));
textures.push(new THREE.TextureLoader().load("../Images/0215v4.png"));

//New face textures
var newTextures = [];
newTextures.push(new THREE.TextureLoader().load("../Images/0215closedv3.png"));
newTextures.push(new THREE.TextureLoader().load("../Images/0215openv2.png"));
newTextures.push(new THREE.TextureLoader().load("../Images/0215v4.png"));

var closedFaceImages = [];

//clean up
var materials = [];

for(var i = 0; i < 3; i++)
{
  materials.push(new THREE.MeshLambertMaterial({map: textures[i], transparent: true, opacity: 1, side: THREE.DoubleSide}));
}

var mesh = [];

//Generate face for updating
var canvasF = document.getElementById("faceCanvas");
canvasF.width = document.getElementById("face").clientWidth;
canvasF.height = document.getElementById("face").clientWidth;
var ctxF = canvasF.getContext("2d");

//Generate image for texture map
var image = new Image(); //Line155
var updateMaterials = [false, false, false];

var canvasM = document.getElementById("uvMapCanvas");
canvasM.width = 1024;
canvasM.height = 1024;
var ctxM = canvasM.getContext("2d");

var canvasT = document.getElementById("tempCanvas");
canvasT.width = document.getElementById("face").clientWidth;
canvasT.height = document.getElementById("face").clientWidth;
var ctxT = canvasT.getContext("2d");

textures[modeType].image.onload = function(){
  ctxM.drawImage(this, 0, 0);
  drawOnAFace(0);
}

//*****************************************************************************\\
//                                  FUNCTIONS                                  \\
//*****************************************************************************\\

function handle_load(geometry) {

    //BASIC MESH
    //var material = new THREE.MeshNormalMaterial(materials);

    mesh.push(new THREE.Mesh(geometry, materials[mesh.length]));

    scene.add(mesh[mesh.length - 1]);
    mesh[mesh.length - 1].position.z = 0;
    mesh[mesh.length - 1].scale.set(1, 1, 1);

    if(mesh[(modeType + 1) % 3] != null) mesh[(modeType + 1) % 3].visible = false;
    if(mesh[(modeType + 2) % 3] != null) mesh[(modeType + 2) % 3].visible = false;

}


function changeMode(mode){

  modeType = mode;

  for(var i = 0; i < mesh.length; i++){
    if(i == mode) mesh[i].visible = true;
    else mesh[i].visible = false;
  }

  ctxM.drawImage(newTextures[mode].image, 0, 0);

  /*if(layerAdded || colourUpdate){
    for(var i = 0; i < faces[modelType][modeType].length; i++){
      drawSideColour(faces[modelType][modeType][i].name, i);
      drawLayers(faces[modelType][modeType][i].name, i);
    }
  }*/

  drawOnAFace(faceSelected);
}

function drawOnAFace(face){

    orientateForFace(face);

    //canvas.add(canvasT.toDataURL());

    ctxF.drawImage(canvasT, 0, 0, canvasT.width, canvasT.height);

    //canvas.setBackgroundImage(canvasT, canvas.renderAll.bind(canvas), {
    //  originX: 'left',
    //  originY: 'top'
    //});

    //orientateFaceForUV();
    //clearTemp();

    //addToTextureMap();
}

function orientateForFace(face){

  faceSelected = face;

  ctxT.translate(canvasT.width / 2, canvasT.height / 2);
  ctxT.rotate((Math.PI / 180) * faces[modelType][modeType][faceSelected].rotation);
  ctxT.translate(-(canvasT.width / 2), -(canvasT.height / 2));

  ctxT.drawImage(newTextures[modeType].image, faces[modelType][modeType][faceSelected].sx, faces[modelType][modeType][faceSelected].sy, faces[modelType][modeType][faceSelected].sWidth, faces[modelType][modeType][faceSelected].sHeight, 0, 0, canvasF.width, canvasF.height);
}

function orientateFaceForUV(){

  ctxT.translate(canvasF.width / 2, canvasF.height / 2);
  ctxT.rotate((Math.PI / 180) * -(faces[modelType][modeType][faceSelected].rotation));
  ctxT.translate(-(canvasF.width / 2), -(canvasF.height / 2));

  ctxT.drawImage(canvasF, 0, 0, canvasM.width, canvasM.height);//, faces[modelType][modeType][faceSelected].sx, faces[modelType][modeType][faceSelected].sy, faces[modelType][modeType][faceSelected].sWidth, faces[modelType][modeType][faceSelected].sHeight);

}

function clearTemp(){

  ctxT.clearRect(0, 0, canvasT.width, canvasT.height);

}

function addToTextureMap(){

  orientateFaceForUV();

  ctxM.drawImage(canvasT, 0, 0, canvasM.width, canvasM.height, faces[modelType][modeType][faceSelected].sx, faces[modelType][modeType][faceSelected].sy, faces[modelType][modeType][faceSelected].sWidth, faces[modelType][modeType][faceSelected].sHeight);

  updateTextureMap();

  ctxT.translate(canvasF.width / 2, canvasF.height / 2);
  ctxT.rotate((Math.PI / 180) * faces[modelType][modeType][faceSelected].rotation);
  ctxT.translate(-(canvasF.width / 2), -(canvasF.height / 2));

}

function updateTextureMap(){
  image.src = canvasM.toDataURL();
  newTextures[modeType] = new THREE.TextureLoader().load(image.src);
  updateMaterials[modeType] = true;
}

/*function updateUVs(){

  var curModel, curMode, curFace;
  curModel = modelType;
  curMode = modeType;
  curFace = faceSelected;

  for(var i = 0; i < faces[modelType].length; i++){

    changeMode(i);

    for(var j = 0; j < faces[modelType][modeType].length; j++){
      //console.log("Name: " + faces[modelType][modeType][j].name + ", Face: " + j);
      drawSideColour(faces[modelType][modeType][j].name, j);
      drawLayers(faces[modelType][modeType][j].name, j);
    }
  }

  changeMode(curMode);
  drawOnAFace(faceSelected);
}


function drawSideColour(name, face){
    var sideNum = getSide(name);
    if(sideNum != null){
      if(sides[sideNum].color != ""){

        orientateForFace(face);

        ctxF.fillStyle = sides[sideNum].color;
        ctxF.fillRect(0, 0, canvasF.width, canvasF.height);

        orientateFaceForUV();
        clearTemp();

        addToTextureMap();
      }
    }
}

function drawLayers(name, face){

  var sideNum = getSide(name);
  if(sideNum != null){
    for(var i = 0; i < sides[sideNum].layers.length; i++)
    {
      orientateForFace(face);

      //only draws images at the minute, text to come later
      //console.log(sides[sideNum].layers[i].img);
      ctxF.drawImage(sides[sideNum].layers[i].img, 0, 0, canvasT.width, canvasT.height);

      orientateFaceForUV();
      clearTemp();

      addToTextureMap();
    }
  }
}

function orientateCorners(){

  ctxF.fillStyle = "rgba(0, 0, 0, 1)";
  ctxF.fillRect(0, 0, 100, 100);

  ctxF.fillStyle = "#b3b3b3";
  ctxF.fillRect(canvasF.width - 100, 0, 100, 100);

  ctxF.fillStyle = "#4d4d4d";
  ctxF.fillRect(0, canvasF.height - 100, 100, 100);

  ctxF.fillStyle = "white";
  ctxF.fillRect(canvasF.width - 100, canvasF.height - 100, 100, 100);

  addToTextureMap();

}

function updateColorPreview(){
  //console.log(document.getElementById("colorC").value + ", " + document.getElementById("colorM").value + ", " +document.getElementById("colorK").value);
  document.getElementById("colorPreview").style.backgroundColor = cmykToHex(document.getElementById("colorC").value, document.getElementById("colorM").value, document.getElementById("colorY").value, document.getElementById("colorK").value);
}

function updateFaceColour(){

  var cmykVal = cmykToHex(document.getElementById("colorC").value, document.getElementById("colorM").value, document.getElementById("colorY").value, document.getElementById("colorK").value);

  ctxF.fillStyle = cmykVal;
  ctxF.fillRect(0, 0, canvasF.width, canvasF.height);

  updateSideColor(faces[modelType][modeType][faceSelected].name, cmykVal);

  addToTextureMap(faces[modelType][modeType][faceSelected].sx);

}

function clearImage(){
  document.getElementById("uploadedImage").value = null;
}

function handleImage(input)
{

  var reader = new FileReader();

  reader.onload = function(e){
    closedFaceImages[faceSelected] = new THREE.TextureLoader().load(e.target.result);
    closedFaceImages[faceSelected].image.onload = function(){
      ctxF.drawImage(closedFaceImages[faceSelected].image, 0, 0, canvasF.width, canvasF.height);

      addImageLayer(faces[modelType][modeType][faceSelected].name, closedFaceImages[faceSelected].image, 0, 0, 0, 0, 0);

      addToTextureMap();
      clearImage();
    };
  };

  reader.readAsDataURL(input.files[0]);
}

function resizeFace(){

  canvasF.style.height = 256;
}

var scaleMax = 1;

function updateScale() {

    scaleMax = document.getElementById("lengthScale").value;
    if(document.getElementById("widthScale").value > scaleMax){ scaleMax = document.getElementById("widthScale").value }
    if(document.getElementById("depthScale").value > scaleMax){ scaleMax = document.getElementById("depthScale").value }

    for(i = 0; i < mesh.length; i++)
    {
      mesh[i].scale.set(document.getElementById("lengthScale").value / scaleMax, document.getElementById("widthScale").value / scaleMax, document.getElementById("depthScale").value / scaleMax);

      console.log("Length: " + document.getElementById("lengthScale").value / scaleMax);
      console.log("Width: " + document.getElementById("widthScale").value / scaleMax);
      console.log("Depth: " + document.getElementById("depthScale").value / scaleMax);
    }
}

//
var colourUpdate = false;
var layerAdded = false;

*/

//*****************************************************************************\\
//                                 RENDER LOOP                                 \\
//*****************************************************************************\\

render();

//var frame = 0;

function render() {

  controls.update();

  /*if(colourUpdate || layerAdded)
  {
    colourUpdate = false;
    layerAdded = false;

    updateUVs();
  }*/

  for(var i = 0; i < mesh.length; i++){
    if(updateMaterials[i]){
      materials[i].map = newTextures[i];
      materials[i].needsUpdate = true;
    }
  }

  requestAnimationFrame(render);

  renderer.render(scene, camera);
}
