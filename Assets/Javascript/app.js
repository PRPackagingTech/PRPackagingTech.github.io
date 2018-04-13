//*****************************************************************************\\
//                                    SETUP                                    \\
//*****************************************************************************\\


var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var renderer,
  scene,
  camera,
  myCanvas = document.getElementById('myCanvas');

var clock = new THREE.Clock();

//RENDERER
renderer = new THREE.WebGLRenderer({
  canvas: myCanvas,
  antialias: true,
});
renderer.setClearColor(0xf0ffff);
//renderer.setClearColor(0x0000ff);
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
var zNear = 0.01;
var zFar = 100;
camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, zNear, zFar);
camera.position.set(-5,2.5,2.5);

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
var faceSelected = 0;

//LOAD MODEL
var loader = new THREE.JSONLoader();
//loader.load('../Models/0426animatedv6.json', handle_load);
loader.load('../Models/0426retry14.json', handle_load);

var modelTexture = new THREE.TextureLoader().load("../Images/0426retry2.png");
//var modelTexture = new THREE.TextureLoader().load("../Images/cardboard.png");

//New face textures
var newModelTexture = new THREE.TextureLoader().load("../Images/0426retry2.png");
//var newModelTexture = new THREE.TextureLoader().load("../Images/cardboard.png");

//clean up
var modelMaterial = new THREE.MeshLambertMaterial({map: modelTexture, transparent: true, opacity: 1, side: THREE.DoubleSide});

var mesh;

//Generate face for updating
var canvasF = document.getElementById("faceCanvas");
canvasF.width = document.getElementById("face").clientWidth;
canvasF.height = document.getElementById("face").clientWidth;
var ctxF = canvasF.getContext("2d");

//Generate image for texture map
var image = new Image(); //Line155
var updateMaterial = false;

var canvasM = document.getElementById("uvMapCanvas");
canvasM.width = 1024;
canvasM.height = 1024;
var ctxM = canvasM.getContext("2d");

var canvasT = document.getElementById("tempCanvas");
canvasT.width = 1024;
canvasT.height = 1024;
var ctxT = canvasT.getContext("2d");

var canvasT2 = document.getElementById("tempCanvas2");
canvasT2.width = 1024;
canvasT2.height = 1024;
var ctxT2 = canvasT2.getContext("2d");

/////////////////////////////////////////////////////////////

//Fonts
var fonts = ["Times New Roman", "Pacifico", "VT323", "Quicksand", "Inconsolata"];

// Load all fonts using Font Face Observer
var canvas = new fabric.Canvas("faceCanvas", {
  selectionColor: 'blue',
  selectionLineWidth: 2,
  preserveObjectStacking: true
});

var canvasTF = new fabric.StaticCanvas("tempCanvas");

fonts.forEach(function(font) {
  var option = document.createElement('option');
  option.innerHTML = font;
  option.value = font;
  document.getElementById("fontSelect").appendChild(option);
});


//Setting the background colour of the canvas
//canvas.setBackgroundColor("rgb(100, 100, 100)");
//canvas.renderAll();

//
canvas.on('selection:updated', function (event) {
  setActiveLayer();
});

canvas.on('selection:created', function (event) {
  setActiveLayer();
});

canvas.on('selection:cleared', function (event){

  var d;

  for(var i = 1; i <= canvas.getObjects().length; i++){
    d = document.getElementById(i);

    if (d == null){}
    else { d.setAttribute("style", "outline: hidden;"); }
  }
});


var canvasModifiedCallback = function() {

  sides[getSide(faces[modelType][faceSelected].name)].canvasSave = canvas.toJSON();
  addToTextureMap();

};

canvas.on('object:added', canvasModifiedCallback);
canvas.on('object:removed', canvasModifiedCallback);
canvas.on('object:modified', canvasModifiedCallback);

document.getElementById('fontSelect').onchange = function() {
  if (this.value !== 'Times New Roman') {
    if(canvas.getActiveObject() != null && canvas.getActiveObject().isType("i-text")){
      loadAndUseFont(this.value);
    }
  }
  else {
    if(canvas.getActiveObject() != null && canvas.getActiveObject().isType("i-text")){
      canvas.getActiveObject().set("fontFamily", this.value);
      canvas.requestRenderAll();
    }
  }
};

var observer = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {

    if(canvas.getActiveObject() != null && canvas.getActiveObject().isType("i-text")){
      canvas.getActiveObject().set({fill: document.getElementById("fontColour").style.backgroundColor });
      canvas.renderAll();
    }
  });
});

var config = { attributes: true, attributeOldValue: true }

observer.observe(document.getElementById("fontColour"), config);

/////////////////////////////////////////////////////////////

//modelTexture.image.onload = function(){ctxM.drawImage(this, 0, 0); changeMode(modeType);}
modelTexture.image.onload = function(){ctxM.drawImage(this, 0, 0);}

//*****************************************************************************\\
//                                  FUNCTIONS                                  \\
//*****************************************************************************\\

function handle_load(geometry) {

  modelMaterial.skinning = true;

  mesh = new THREE.SkinnedMesh(geometry, modelMaterial);

  mesh.position.z = 0;
  mesh.scale.set(1, 1, 1);

  mixer = new THREE.AnimationMixer(mesh);

  console.log(geometry);

  for(var i = 0; i < geometry.animations.length; i++){
    action[i] = mixer.clipAction(geometry.animations[i]);
    //action[i].setEffectiveWeight(1);
    action[i].setLoop(THREE.LoopOnce, 0);
    action[i].clampWhenFinished = true;
    action[i].enabled = true;
  }

  scene.add(mesh);

  action[1].reset().play();

  animate();

}

function changeMode(mode){


  //console.log(mode);
  //console.log(actualAnimation);

  if(mode == 0){ //close
    if(actualAnimation == 1 || actualAnimation == 3){ //from open
      action[actualAnimation].stop();
      actualAnimation = 4;
      action[actualAnimation].reset().play();
      console.log("Open To Close");
    }
    else if(actualAnimation == 0 || actualAnimation == 5){ //from flat
      action[actualAnimation].stop();
      actualAnimation = 2;
      action[actualAnimation].reset().play();
      console.log("Flat to Close");
    }
  }

  if(mode == 1){ //open
    if(actualAnimation == 2 || actualAnimation == 4){ //from closed
      action[actualAnimation].stop();
      actualAnimation = 1;
      action[actualAnimation].reset().play();
      console.log("Close to Open");
    }
    else if(actualAnimation == 0 || actualAnimation == 5){ //from flat
      action[actualAnimation].stop();
      actualAnimation = 3;
      action[actualAnimation].reset().play();
      console.log("Flat to Open");
    }
  }

  if(mode == 2){ //flatten
    if(actualAnimation == 1 || actualAnimation == 3){ //from open
      action[actualAnimation].stop();
      actualAnimation = 5;
      action[actualAnimation].reset().play();
      console.log("Open to Flat");
    }
    else if(actualAnimation == 2 || actualAnimation == 4){ //from closed
      action[actualAnimation].stop();
      actualAnimation = 0;
      action[actualAnimation].reset().play();
      console.log("Closed to Flat");
    }
  }

  //console.log(action[arrAnimations[actualAnimation]]);
}

/*function changeMode(mode){

  sides[getSide(faces[modelType][faceSelected].name)].canvasSave = canvas.toJSON();
  canvas.loadFromJSON(sides[getSide(faces[modelType][faceSelected].name)].canvasSave);

  if(sides[getSide(faces[modelType][faceSelected].name)].canvasSave == null || sides[getSide(faces[modelType][faceSelected].name)].canvasSave.objects.length == 0){

    fabric.Image.fromURL('../Images/clear.png', function(myImg) {
      myImg.selectable = false;
      myImg.hoverCursor = "default";
      canvas.add(myImg);
    });
  }

  modeType = mode;

  for(var i = 0; i < mesh.length; i++){
    if(i == modeType) mesh[i].visible = true;
    else mesh[i].visible = false;
  }

  ctxM.drawImage(newModelTexture.image, 0, 0, canvasM.width, canvasM.height);
}*/

function drawOnAFaceFast(face){
  sides[getSide(faces[modelType][faceSelected].name)].canvasSave = canvas.toJSON();

  canvas.clear();

  faceSelected = face;

  if(sides[getSide(faces[modelType][faceSelected].name)].canvasSave == null || sides[getSide(faces[modelType][faceSelected].name)].canvasSave.objects.length == 0){

    fabric.Image.fromURL('../Images/clear.png', function(myImg) {
      myImg.selectable = false;
      canvas.add(myImg);
    });
  }

  canvasTF.clear();

  ctxT.drawImage(newModelTexture.image, 0, 0, canvasT.width, canvasT.height);

  canvas.loadFromJSON(sides[getSide(faces[modelType][faceSelected].name)].canvasSave, canvas.renderAll.bind(canvas));

  canvas.renderAll();
}

function drawOnMap(){

  //////////////////////////////////

  ctxT2.translate(canvasT2.width / 2, canvasT2.height / 2);
  ctxT2.rotate((Math.PI / 180) * -faces[modelType][faceSelected].rotation);
  ctxT2.translate(-(canvasT2.width / 2), -(canvasT2.height / 2));

  ctxT2.drawImage(canvasT, 0, 0, canvasT2.width, canvasT2.height);
  ctxM.drawImage(canvasT2, 0, 0, canvasM.width, canvasM.height, faces[modelType][faceSelected].sx, faces[modelType][faceSelected].sy, faces[modelType][faceSelected].sWidth, faces[modelType][faceSelected].sHeight);

  ctxT2.translate(canvasT2.width / 2, canvasT2.height / 2);
  ctxT2.rotate((Math.PI / 180) * faces[modelType][faceSelected].rotation);
  ctxT2.translate(-(canvasT2.width / 2), -(canvasT2.height / 2));

  ctxT2.clearRect(0, 0, canvasT2.width, canvasT2.height);

  updateTextureMap();

  clearTemp();
}

function updateTextureMap(){
  image.src = canvasM.toDataURL();
  newModelTexture = new THREE.TextureLoader().load(image.src);
  //image.src = canvasM.toDataURL();
  updateMaterial = true;
}

function orientateForFace(face){

  ctxT.translate(canvasT.width / 2, canvasT.height / 2);
  ctxT.rotate((Math.PI / 180) * faces[modelType][faceSelected].rotation);
  ctxT.translate(-(canvasT.width / 2), -(canvasT.height / 2));

  canvasTF.clear();

  ctxT.drawImage(newModelTexture.image, faces[modelType][faceSelected].sx, faces[modelType][faceSelected].sy, faces[modelType][faceSelected].sWidth, faces[modelType][faceSelected].sHeight, 0, 0, canvasT.width, canvasT.height);
}

function orientateFaceForUV(){

  ctxT.translate(canvasT.width / 2, canvasT.height / 2);
  ctxT.rotate((Math.PI / 180) * -(faces[modelType][faceSelected].rotation));
  ctxT.translate(-(canvasT.width / 2), -(canvasT.height / 2));

  ctxT.drawImage(canvasF, 0, 0, canvasT.width, canvasT.height);

}

function clearTemp(){

  ctxT.clearRect(0, 0, canvasT.width, canvasT.height);

}

function addToTextureMap(){

  orientateFaceForUV();

  canvasT.width = canvasF.width;
  canvasT.height = canvasF.height;

  canvasTF.loadFromJSON(sides[getSide(faces[modelType][faceSelected].name)].canvasSave);
  canvasTF.renderAll();

  canvasT.width = 1024;
  canvasT.height = 1024;

  ctxT.scale((1024/canvasF.width), (1024/canvasF.height));

  ctxM.drawImage(modelTexture.image, faces[modelType][faceSelected].sx, faces[modelType][faceSelected].sy, faces[modelType][faceSelected].sWidth, faces[modelType][faceSelected].sHeight, faces[modelType][faceSelected].sx, faces[modelType][faceSelected].sy, faces[modelType][faceSelected].sWidth, faces[modelType][faceSelected].sHeight);

  window.setTimeout(drawOnMap, 1);

}

function updateLayersPanel(){
  var p = document.getElementById("layersPanel");
  p.innerHTML = "";

  for(var i = 2; i <= canvas.getObjects().length; i++){
    var p = document.getElementById("layersPanel");
    var newElement = document.createElement("div");
    newElement.setAttribute('id', (i - 1));
    newElement.setAttribute('onclick', "layerClicked(" + (i - 1) + ")");
    if(canvas.item(i - 1).isType('i-text')){newElement.innerHTML = canvas.item(i - 1).text;}
    else if(canvas.item(i - 1).isType('image')){newElement.innerHTML = canvas.item(i - 1).id;}
    else{newElement.innerHTML = "Layer " + (i-1)}

    p.appendChild(newElement);
  }
}

/////////////////////////////////////////////////////////////////////////////////

function printJSON(){
  console.log(sides[getSide(faces[modelType][faceSelected].name)].canvasSave);
}

function handleImage(input){

  var reader = new FileReader();

  reader.onload = function(e){

    fabric.Image.fromURL(e.target.result, function(oImg){
      oImg.set({
        id : (document.getElementById('uploadedImage').files.item(0).name).substring(0, 14)
      });
      canvas.centerObject(oImg);
      canvas.add(oImg);

      layerClicked(canvas.getObjects().length - 1);
    });

    var p = document.getElementById("layersPanel");
    var newElement = document.createElement("div");
    newElement.setAttribute('id', canvas.getObjects().length);
    newElement.setAttribute('onclick', "layerClicked(" + (canvas.getObjects().length) + ")");
    newElement.innerHTML = (document.getElementById('uploadedImage').files.item(0).name).substring(0, 14);
    p.appendChild(newElement);

    canvas.renderAll();
  };

  reader.readAsDataURL(input.files[0]);

}

function layerClicked(id){

  var d;

  for(var i = 1; i < canvas.getObjects().length; i++){
    d = document.getElementById(i);
    d.setAttribute("style", "outline: hidden;");
  }

  d = document.getElementById(id);
  d.setAttribute("style", "outline: green solid 2px;");

  canvas.setActiveObject(canvas.item(id));
  canvas.renderAll();

}

function setActiveLayer(){

  var d;

  for(var i = 1; i < canvas.getObjects().length; i++){
    d = document.getElementById(i);
    d.setAttribute("style", "outline: hidden;");

    if(canvas.item(i) === canvas.getActiveObject()){
      d = document.getElementById(i);
      d.setAttribute("style", "outline: green solid 2px;");
    }
  }

}

function deleteLayer(){

  if(canvas.getActiveObject() != null){

    document.getElementById(canvas.getObjects().indexOf(canvas.getActiveObject())).remove();

    var val = (canvas.getObjects().indexOf(canvas.getActiveObject())) + 1;

    canvas.remove(canvas.getActiveObject());
    updateDivID(val);

    canvas.renderAll();
  }
}

function updateDivID(val){

  for(var i = val; i <= canvas.getObjects().length; i++){
    document.getElementById(i).setAttribute('onclick', "layerClicked(" + (i - 1) + ")");
    document.getElementById(i).id = (i - 1);
  }

}

function moveUpLayer(){

  if( (canvas.getObjects().indexOf(canvas.getActiveObject()) + 1) < canvas.getObjects().length){

    var arrayNames = [];
    canvas.getActiveObject().bringForward();
    arrayNames[0] = document.getElementById(canvas.getObjects().indexOf(canvas.getActiveObject())).innerHTML;

    for(var i = 1; i < canvas.getObjects().length; i++){

      arrayNames[i] = document.getElementById(i).innerHTML;

    }

    arrayNames[canvas.getObjects().indexOf(canvas.getActiveObject())] = arrayNames[(canvas.getObjects().indexOf(canvas.getActiveObject()) - 1)];
    arrayNames[(canvas.getObjects().indexOf(canvas.getActiveObject()) - 1)] = arrayNames[0];

    var p = document.getElementById("layersPanel");
    p.innerHTML = "";

    for(var i = 1; i < canvas.getObjects().length; i++){

      var newElement = document.createElement("div");
      newElement.setAttribute('id', i);
      newElement.setAttribute('onclick', "layerClicked(" + i + ")");
      newElement.innerHTML = arrayNames[i];
      p.appendChild(newElement);

    }

    setActiveLayer();

    canvasModifiedCallback();

  }
}

function moveDownLayer(){

  if( canvas.getObjects().indexOf(canvas.getActiveObject()) > 1){

    var arrayNames = [];
    arrayNames[0] = document.getElementById(canvas.getObjects().indexOf(canvas.getActiveObject())).innerHTML;
    canvas.getActiveObject().sendBackwards();

    for(var i = 1; i < canvas.getObjects().length; i++){

      arrayNames[i] = document.getElementById(i).innerHTML;

    }

    arrayNames[canvas.getObjects().indexOf(canvas.getActiveObject()) + 1] = arrayNames[canvas.getObjects().indexOf(canvas.getActiveObject())];
    arrayNames[canvas.getObjects().indexOf(canvas.getActiveObject())] = arrayNames[0];

    var p = document.getElementById("layersPanel");
    p.innerHTML = "";

    for(var i = 1; i < canvas.getObjects().length; i++){

      var newElement = document.createElement("div");
      newElement.setAttribute('id', i);
      newElement.setAttribute('onclick', "layerClicked(" + i + ")");
      newElement.innerHTML = arrayNames[i];
      p.appendChild(newElement);

    }

    setActiveLayer();

    canvasModifiedCallback();

  }
}

function scaleToHeight(){

  if(canvas.getActiveObject() != null){
    canvas.getActiveObject().scaleToHeight(canvas.getHeight());
    canvas.getActiveObject().center();
    canvas.renderAll();
    canvasModifiedCallback();
  }
}

function scaleToWidth(){

  if(canvas.getActiveObject() != null){
    canvas.getActiveObject().scaleToWidth(canvas.getWidth());
    canvas.getActiveObject().center();
    canvas.renderAll();
    canvasModifiedCallback();
  }
}

function centreObject(){

  if(canvas.getActiveObject() != null){
    canvas.getActiveObject().center();
    canvas.renderAll();
    canvasModifiedCallback();
  }
}

function resetObject(){

  if(canvas.getActiveObject() != null){
    canvas.getActiveObject().scale(1);
    canvas.getActiveObject().rotate(0);
    canvas.getActiveObject().center();
    canvas.renderAll();
    canvasModifiedCallback();
  }
}

function addText(){

  if(document.getElementById("textInput").value != ""){

    var text = new fabric.IText(document.getElementById("textInput").value, {
      fontFamily: document.getElementById("fontSelect").value,
      fill: document.getElementById("fontColour").style.backgroundColor,
      left: 100,
      top: 100,
      objecttype: 'text'
    });

    canvas.add(text);

    var p = document.getElementById("layersPanel");
    var newElement = document.createElement("div");
    newElement.setAttribute('id', canvas.getObjects().length - 1);
    newElement.setAttribute('onclick', "layerClicked(" + (canvas.getObjects().length - 1) + ")");
    newElement.innerHTML = (document.getElementById("textInput").value).substring(0, 14);
    p.appendChild(newElement);

    canvas.renderAll();

    layerClicked(canvas.getObjects().length - 1);

  }

}

function loadAndUseFont(font) {
  var myfont = new FontFaceObserver(font);

  myfont.load().then(function() {

    canvas.getActiveObject().set("fontFamily", font);
    canvas.requestRenderAll();

  }).catch(function(e){

    console.log(e)
    alert('font loading failed ' + font);

  });
}

function updateFontColour(){

  if(canvas.getActiveObject() != null && canvas.getActiveObject().isType("i-text")){
    canvas.getActiveObject().setColor(document.getElementById("fontColour").style.backgroundColor);
  }

}

function updateFaceColour(){

  var str = document.getElementById("faceColour").style.backgroundColor;

  ///////////////////
  // Updates
  // change opacity for different materials and colours
  //
  ///////////////////

  canvas.backgroundColor = "rgba(" + str.substring(4, (str.length - 1)) + ", " + 0.7 + ")";

  canvas.renderAll();
  canvasModifiedCallback();

}

$('.trigger').colorPicker();

/////////////////////////////////////////////////////////////////////////////////

function updateScale() {

    scaleMax = document.getElementById("lengthScale").value;
    if(document.getElementById("widthScale").value > scaleMax){ scaleMax = document.getElementById("widthScale").value }
    if(document.getElementById("depthScale").value > scaleMax){ scaleMax = document.getElementById("depthScale").value }

    for(i = 0; i < mesh.length; i++)
    {
      mesh.scale.set(document.getElementById("lengthScale").value / scaleMax, document.getElementById("widthScale").value / scaleMax, document.getElementById("depthScale").value / scaleMax);

      console.log("Length: " + document.getElementById("lengthScale").value / scaleMax);
      console.log("Width: " + document.getElementById("widthScale").value / scaleMax);
      console.log("Depth: " + document.getElementById("depthScale").value / scaleMax);
    }
}

//*****************************************************************************\\
//                                 RENDER LOOP                                 \\
//*****************************************************************************\\

var action = {}
var mixer;
var activeActionName = 'Idle';

var arrAnimations = [
  'Idle',
  'CloseToFlat',
  'CloseToOpen',
  'FlatToClose',
  'FlatToOpen',
  'OpenToClose',
  'OpenToFlat'
];
var actualAnimation = 1;

function animate(){

  requestAnimationFrame(animate);
  controls.update();
  render();

}

function render() {

  if(updateMaterial){
    modelMaterial.map = newModelTexture;
    modelMaterial.needsUpdate = true;
  }

  var delta = clock.getDelta();
  mixer.update(delta);

  renderer.render(scene, camera);
}
