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
renderer.setClearColor(0xf0ffff);
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
//loader.load('../Models/0215.json', handle_load);
loader.load('../Models/0426.json', handle_load);

/*var textures = [];
textures.push(new THREE.TextureLoader().load("../Images/0215closedv3.png"));
textures.push(new THREE.TextureLoader().load("../Images/0215openv2.png"));
textures.push(new THREE.TextureLoader().load("../Images/0215v4.png"));

//New face textures
var newTextures = [];
newTextures.push(new THREE.TextureLoader().load("../Images/0215closedv3.png"));
newTextures.push(new THREE.TextureLoader().load("../Images/0215openv2.png"));
newTextures.push(new THREE.TextureLoader().load("../Images/0215v4.png"));*/

var textures = [];
textures.push(new THREE.TextureLoader().load("../Images/cardboard.png"));
textures.push(new THREE.TextureLoader().load("../Images/cardboard.png"));
textures.push(new THREE.TextureLoader().load("../Images/0426colour.png"));

//New face textures
var newTextures = [];
newTextures.push(new THREE.TextureLoader().load("../Images/cardboard.png"));
newTextures.push(new THREE.TextureLoader().load("../Images/cardboard.png"));
newTextures.push(new THREE.TextureLoader().load("../Images/0426colour.png"));

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

var canvasM2 = document.getElementById("uvMapCanvas2");
canvasM2.width = 1024;
canvasM2.height = 1024;
var ctxM2 = canvasM2.getContext("2d");

var canvasM3 = document.getElementById("uvMapCanvas3");
canvasM3.width = 1024;
canvasM3.height = 1024;
var ctxM3 = canvasM3.getContext("2d");

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

var canvasM2F = new fabric.StaticCanvas("uvMapCanvas2");

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

// HEREHERHEHREHRHER
var canvasModifiedCallback = function() {

  sides[getSide(faces[modelType][modeType][faceSelected].name)].canvasSave = canvas.toJSON();
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

textures[0].image.onload = function(){ctxM.drawImage(this, 0, 0);}
//???
//textures[0].image.onload = function(){canvasM.setBackgroundImage(new fabric.Image(this));}
textures[1].image.onload = function(){ctxM2.drawImage(this, 0, 0);}
textures[2].image.onload = function(){ctxM3.drawImage(this, 0, 0); changeMode(modeType);}

//*****************************************************************************\\
//                                  FUNCTIONS                                  \\
//*****************************************************************************\\

function handle_load(geometry) {

    //BASIC MESH

    mesh.push(new THREE.Mesh(geometry, materials[mesh.length]));

    scene.add(mesh[mesh.length - 1]);
    mesh[mesh.length - 1].position.z = 0;
    mesh[mesh.length - 1].scale.set(1, 1, 1);

    if(mesh[(modeType + 1) % 3] != null) mesh[(modeType + 1) % 3].visible = false;
    if(mesh[(modeType + 2) % 3] != null) mesh[(modeType + 2) % 3].visible = false;

}

function changeMode(mode){

  sides[getSide(faces[modelType][modeType][faceSelected].name)].canvasSave = canvas.toJSON();
  canvas.loadFromJSON(sides[getSide(faces[modelType][modeType][faceSelected].name)].canvasSave);

  if(sides[getSide(faces[modelType][modeType][faceSelected].name)].canvasSave == null || sides[getSide(faces[modelType][modeType][faceSelected].name)].canvasSave.objects.length == 0){

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

  ctxM.drawImage(newTextures[0].image, 0, 0, canvasM.width, canvasM.height);
  ctxM2.drawImage(newTextures[1].image, 0, 0, canvasM2.width, canvasM2.height);
  ctxM3.drawImage(newTextures[2].image, 0, 0, canvasM3.width, canvasM3.height);
}

/*function drawChangeMode(){

  console.log("HERE");
  var sel = faceSelected;
  drawOnAFaceFast(sel);

  for(var i = 0; i < faces[modelType][modeType].length; i++)
  {
    drawOnAFaceFast(i);
  }

  drawOnAFaceFast(sel);
}

function drawModeChange(mode){

  for(var i = 0; i < faces[modelType][mode].length; i++){

    ctxMT.clearRect(0, 0, canvasMT.width, canvasMT.height);
    ctxT2.clearRect(0, 0, canvasT2.width, canvasT2.height);
    canvasMTF.loadFromJSON(sides[getSide(faces[modelType][mode][i].name)].canvasSave);

    canvasMTF.renderAll();

    ////////////////////////////////////////////////////////////////////////////////////////////

    //ctxT2.translate(canvasT2.width / 2, canvasT2.height / 2);
    //ctxT2.rotate((Math.PI / 180) * -faces[modelType][mode][i].rotation);
    //ctxT2.translate(-(canvasT2.width / 2), -(canvasT2.height / 2));

    ctxT2.drawImage(canvasMT, 0, 0, canvasT2.width, canvasT2.height);

    ////////////////////////////////////////////////////////////////////////////////////////////

    ctxM.drawImage(canvasT2, faces[modelType][modeType][i].sx, faces[modelType][modeType][i].sy, faces[modelType][modeType][i].sWidth, faces[modelType][modeType][i].sHeight, faces[modelType][mode][i].sx, faces[modelType][mode][i].sy, faces[modelType][mode][i].sWidth, faces[modelType][mode][i].sHeight);

  }

  //ctxT2.translate(canvasT2.width / 2, canvasT2.height / 2);
  //ctxT2.rotate((Math.PI / 180) * faces[modelType][mode][(faces[modelType][mode].length - 1)].rotation);
  //ctxT2.translate(-(canvasT2.width / 2), -(canvasT2.height / 2));

  ctxT2.clearRect(0, 0, canvasT2.width, canvasT2.height);

  updateTextureMap();

  //ctxMT.clearRect(0, 0, canvasT.width, canvasT.height);

}*/

function drawOnAFaceFast(face){
  sides[getSide(faces[modelType][modeType][faceSelected].name)].canvasSave = canvas.toJSON();

  canvas.clear();

  faceSelected = face;

  if(sides[getSide(faces[modelType][modeType][faceSelected].name)].canvasSave == null || sides[getSide(faces[modelType][modeType][faceSelected].name)].canvasSave.objects.length == 0){

    fabric.Image.fromURL('../Images/clear.png', function(myImg) {
      myImg.selectable = false;
      canvas.add(myImg);
    });
  }

  canvasTF.clear();

  ctxT.drawImage(newTextures[modeType].image, 0, 0, canvasT.width, canvasT.height);

  canvas.loadFromJSON(sides[getSide(faces[modelType][modeType][faceSelected].name)].canvasSave, canvas.renderAll.bind(canvas));

  canvas.renderAll();
}

function drawOnMap(){

  //////////////////////////////////

  ctxT2.translate(canvasT2.width / 2, canvasT2.height / 2);
  ctxT2.rotate((Math.PI / 180) * -faces[modelType][0][faceSelected].rotation);
  ctxT2.translate(-(canvasT2.width / 2), -(canvasT2.height / 2));

  ctxT2.drawImage(canvasT, 0, 0, canvasT2.width, canvasT2.height);
  ctxM.drawImage(canvasT2, 0, 0, canvasM.width, canvasM.height, faces[modelType][0][faceSelected].sx, faces[modelType][0][faceSelected].sy, faces[modelType][0][faceSelected].sWidth, faces[modelType][0][faceSelected].sHeight);

  ctxT2.translate(canvasT2.width / 2, canvasT2.height / 2);
  ctxT2.rotate((Math.PI / 180) * (faces[modelType][0][faceSelected].rotation - faces[modelType][1][faceSelected].rotation));
  ctxT2.translate(-(canvasT2.width / 2), -(canvasT2.height / 2));

  ctxT2.clearRect(0, 0, canvasT2.width, canvasT2.height);
  ctxT2.drawImage(canvasT, 0, 0, canvasT2.width, canvasT2.height);
  ctxM2.drawImage(canvasT2, 0, 0, canvasM2.width, canvasM2.height, faces[modelType][1][faceSelected].sx, faces[modelType][1][faceSelected].sy, faces[modelType][1][faceSelected].sWidth, faces[modelType][1][faceSelected].sHeight);

  ctxT2.translate(canvasT2.width / 2, canvasT2.height / 2);
  ctxT2.rotate((Math.PI / 180) * (faces[modelType][1][faceSelected].rotation - faces[modelType][2][faceSelected].rotation));
  ctxT2.translate(-(canvasT2.width / 2), -(canvasT2.height / 2));

  ctxT2.clearRect(0, 0, canvasT2.width, canvasT2.height);
  ctxT2.drawImage(canvasT, 0, 0, canvasT2.width, canvasT2.height);
  ctxM3.drawImage(canvasT2, 0, 0, canvasM3.width, canvasM3.height, faces[modelType][2][faceSelected].sx, faces[modelType][2][faceSelected].sy, faces[modelType][2][faceSelected].sWidth, faces[modelType][2][faceSelected].sHeight);
  //ctxM.drawImage(canvasT2, 0, 0, canvasM.width, canvasM.height, faces[modelType][modeType][faceSelected].sx, faces[modelType][modeType][faceSelected].sy, faces[modelType][modeType][faceSelected].sWidth, faces[modelType][modeType][faceSelected].sHeight);

  //////////////////////////////////

  ctxT2.translate(canvasT2.width / 2, canvasT2.height / 2);
  ctxT2.rotate((Math.PI / 180) * faces[modelType][2][faceSelected].rotation);
  ctxT2.translate(-(canvasT2.width / 2), -(canvasT2.height / 2));

  ctxT2.clearRect(0, 0, canvasT2.width, canvasT2.height);

  updateTextureMap();

  clearTemp();
}

function updateTextureMap(){
  image.src = canvasM.toDataURL();
  newTextures[0] = new THREE.TextureLoader().load(image.src);
  image.src = canvasM2.toDataURL();
  newTextures[1] = new THREE.TextureLoader().load(image.src);
  image.src = canvasM3.toDataURL();
  newTextures[2] = new THREE.TextureLoader().load(image.src);
  //image.src = canvasM.toDataURL();
  //newTextures[modeType] = new THREE.TextureLoader().load(image.src);
  updateMaterials[modeType] = true;
}

function orientateForFace(face){

  ctxT.translate(canvasT.width / 2, canvasT.height / 2);
  ctxT.rotate((Math.PI / 180) * faces[modelType][modeType][faceSelected].rotation);
  ctxT.translate(-(canvasT.width / 2), -(canvasT.height / 2));

  canvasTF.clear();

  ctxT.drawImage(newTextures[modeType].image, faces[modelType][modeType][faceSelected].sx, faces[modelType][modeType][faceSelected].sy, faces[modelType][modeType][faceSelected].sWidth, faces[modelType][modeType][faceSelected].sHeight, 0, 0, canvasT.width, canvasT.height);
}

function orientateFaceForUV(){

  ctxT.translate(canvasT.width / 2, canvasT.height / 2);
  ctxT.rotate((Math.PI / 180) * -(faces[modelType][modeType][faceSelected].rotation));
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

  canvasTF.loadFromJSON(sides[getSide(faces[modelType][modeType][faceSelected].name)].canvasSave);
  canvasTF.renderAll();

  canvasT.width = 1024;
  canvasT.height = 1024;

  //console.log((1024/canvasF.width) + " - " + (1024/canvasF.height));

  ctxT.scale((1024/canvasF.width), (1024/canvasF.height));

  /*if(modeType == 0){}
  else if(modeType == 1){}
  else if(modeType == 2){}*/

  ctxM.drawImage(textures[0].image, faces[modelType][0][faceSelected].sx, faces[modelType][0][faceSelected].sy, faces[modelType][0][faceSelected].sWidth, faces[modelType][0][faceSelected].sHeight, faces[modelType][0][faceSelected].sx, faces[modelType][0][faceSelected].sy, faces[modelType][0][faceSelected].sWidth, faces[modelType][0][faceSelected].sHeight);
  ctxM2.drawImage(textures[1].image, faces[modelType][1][faceSelected].sx, faces[modelType][1][faceSelected].sy, faces[modelType][1][faceSelected].sWidth, faces[modelType][1][faceSelected].sHeight, faces[modelType][1][faceSelected].sx, faces[modelType][1][faceSelected].sy, faces[modelType][1][faceSelected].sWidth, faces[modelType][1][faceSelected].sHeight);
  ctxM3.drawImage(textures[2].image, faces[modelType][2][faceSelected].sx, faces[modelType][2][faceSelected].sy, faces[modelType][2][faceSelected].sWidth, faces[modelType][2][faceSelected].sHeight, faces[modelType][2][faceSelected].sx, faces[modelType][2][faceSelected].sy, faces[modelType][2][faceSelected].sWidth, faces[modelType][2][faceSelected].sHeight);
  //ctxM.drawImage(textures[modeType].image, faces[modelType][modeType][faceSelected].sx, faces[modelType][modeType][faceSelected].sy, faces[modelType][modeType][faceSelected].sWidth, faces[modelType][modeType][faceSelected].sHeight, faces[modelType][modeType][faceSelected].sx, faces[modelType][modeType][faceSelected].sy, faces[modelType][modeType][faceSelected].sWidth, faces[modelType][modeType][faceSelected].sHeight);

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
  console.log(sides[getSide(faces[modelType][modeType][faceSelected].name)].canvasSave);
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
    //console.log(i);
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

  //console.log("HERE");

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
      mesh[i].scale.set(document.getElementById("lengthScale").value / scaleMax, document.getElementById("widthScale").value / scaleMax, document.getElementById("depthScale").value / scaleMax);

      console.log("Length: " + document.getElementById("lengthScale").value / scaleMax);
      console.log("Width: " + document.getElementById("widthScale").value / scaleMax);
      console.log("Depth: " + document.getElementById("depthScale").value / scaleMax);
    }
}

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
