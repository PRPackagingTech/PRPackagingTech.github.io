//*****************************************************************************\\
//                                    SETUP                                    \\
//*****************************************************************************\\

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
renderer.setClearColor(0xffffff);
//renderer.setClearColor(0x0000ff);
renderer.setPixelRatio(window.devicePixelRatio);
//Change this back or to suit screen size later
//renderer.setSize(window.innerWidth, window.innerHeight);
var h = $(document.getElementById('middle')).height() / (window.innerWidth / $(document.getElementById('middle')).width());
renderer.setSize($(document.getElementById('middle')).width(), h );

document.getElementById("preview").style.height = h;

//
//

//CAMERA
var zNear = 0.01;
var zFar = 100;
//camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, zNear, zFar);
camera = new THREE.PerspectiveCamera(35, $(document.getElementById('middle')).width()/h, zNear, zFar);
//camera.position.set(-5,2.5,2.5);
camera.position.set(-5,2,1.7);
//camera.position.set(1, 1, 1);

//SCENE
scene = new THREE.Scene();

//LIGHTS
var light = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(light);

var light2 = new THREE.PointLight(0xffffff, 0.3);
light2.position.set( 1, 5, 6 );
scene.add(light2);

var light3 = new THREE.DirectionalLight(0xffffff, 0.3);
scene.add(light3);

//controls
controls = new THREE.OrbitControls(camera, renderer.domElement);

//MODEL and MODE and FACESELECTED
var boxType = 0;
var modelType = 0;
var modeType = 1;
var faceSelected = 6;

//LOAD MODEL
var loader = new THREE.JSONLoader();
//loader.load('../Models/0426animatedv6.json', handle_load);
loader.load('../Models/0426_220_155_50.json', handle_load);
updateDimensionSelections();

var textureLoader = new THREE.TextureLoader();

var modelTexture = textureLoader.load("../Images//0426_220_155_50_kraft.png");
var modelTextureWhite = textureLoader.load("../Images//0426_220_155_50_white.png");
var modelTextureHalf = textureLoader.load("../Images//0426_220_155_50_white_outside.png");
var modelNormalMap = textureLoader.load("../Images//0426_220_155_50_normal.png");
//var modelTexture = new THREE.TextureLoader().load("../Images/cardboard.png");

//New face textures
var newModelTexture = new THREE.TextureLoader().load("../Images/0426_220_155_50_kraft.png");
//var newModelTexture = new THREE.TextureLoader().load("../Images/cardboard.png");

//clean up
var modelMaterial = new THREE.MeshPhongMaterial({map: modelTexture, normalMap: modelNormalMap, transparent: true, opacity: 1, side: THREE.DoubleSide});

modelMaterial.normalMap.wrapS = THREE.MirroredRepeatWrapping;
modelMaterial.normalMap.wrapT = THREE.MirroredRepeatWrapping;

var mesh;

//Generate face for updating
var canvasF = document.getElementById("faceCanvas");
canvasF.width = faces[0][0][0].w;
canvasF.height = faces[0][0][0].h;
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

var canvasPDFE = document.getElementById("pdfCanvasExternal");

/////////////////////////////////////////////////////////////

//Fonts
var fonts = ["Times New Roman", "Pacifico", "VT323", "Quicksand", "Inconsolata"];

// Load all fonts using Font Face Observer
var canvas = new fabric.Canvas("faceCanvas", {
  selectionBorderColor: 'rgba(255, 100, 50, 0.3)',
  borderScaleFactor: 10,
  cornersize: 50
  //preserveObjectStacking: true
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

  sides[getSide(faces[boxType][modelType][faceSelected].name)].canvasSave = canvas.toJSON();
  addToTextureMap();
  addToPDF();
  createImage();

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
modelTexture.image.onload = function(){ctxM.drawImage(this, 0, 0); }



//debugger;


//*****************************************************************************\\
//                                  FUNCTIONS                                  \\
//*****************************************************************************\\

function handle_load(geometry) {

  modelMaterial.skinning = true;

  mesh = new THREE.SkinnedMesh(geometry, modelMaterial);

  mesh.position.z = 0;
  mesh.scale.set(1, 1, 1);

  mixer = new THREE.AnimationMixer(mesh);

  //console.log(geometry);

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
  changeMode(modeType);
  drawOnAFaceFast(faceSelected);

}

function changeMode(mode){

  //console.log(mode);
  //console.log(actualAnimation);
  sides[getSide(faces[boxType][modelType][faceSelected].name)].canvasSave = canvas.toJSON();

  if(mode == 0){ //close
    if(actualAnimation == 1 || actualAnimation == 3){ //from open
      action[actualAnimation].stop();
      actualAnimation = 4;
      action[actualAnimation].reset().play();
      //console.log("Open To Close");
      faceSelected -= 6;
    }
    else if(actualAnimation == 0 || actualAnimation == 5){ //from flat
      action[actualAnimation].stop();
      actualAnimation = 2;
      action[actualAnimation].reset().play();
      //console.log("Flat to Close");
      faceSelected -= 12;
    }
    updateButtonNames(mode);
  }

  if(mode == 1){ //open
    if(actualAnimation == 2 || actualAnimation == 4){ //from closed
      action[actualAnimation].stop();
      actualAnimation = 1;
      action[actualAnimation].reset().play();
      //console.log("Close to Open");
      faceSelected += 6;
    }
    else if(actualAnimation == 0 || actualAnimation == 5){ //from flat
      action[actualAnimation].stop();
      actualAnimation = 3;
      action[actualAnimation].reset().play();
      //console.log("Flat to Open");
      faceSelected -= 6;
    }
    updateButtonNames(mode);
  }

  if(mode == 2){ //flatten
    if(actualAnimation == 1 || actualAnimation == 3){ //from open
      action[actualAnimation].stop();
      actualAnimation = 5;
      action[actualAnimation].reset().play();
      //console.log("Open to Flat");
      faceSelected += 6;
    }
    else if(actualAnimation == 2 || actualAnimation == 4){ //from closed
      action[actualAnimation].stop();
      actualAnimation = 0;
      action[actualAnimation].reset().play();
      //console.log("Closed to Flat");
      faceSelected += 12;
    }
    updateButtonNames(mode);
  }
  //console.log("FS: " + faceSelected);

  updateActiveModeButton(mode);
  drawOnAFaceFast(faceSelected);

  //console.log(action[arrAnimations[actualAnimation]]);
}

function updateButtonNames(mode){

    var p = document.getElementById("faceContainer");
    p.innerHTML = "";
    var newElement = document.createElement("h3");
    newElement.appendChild(document.createTextNode("Choose Side"));
    p.appendChild(newElement);

    if(mode == 0){
      newElement = document.createElement("div");
      newElement.appendChild(document.createTextNode("Top"));
      newElement.setAttribute('class', "btn inverse edtr one_third first");
      newElement.setAttribute('onclick', "drawOnAFace(0)");
      p.appendChild(newElement);

      newElement = document.createElement("div");
      newElement.appendChild(document.createTextNode("Bottom"));
      newElement.setAttribute('class', "btn inverse edtr one_third");
      newElement.setAttribute('onclick', "drawOnAFace(1)");
      p.appendChild(newElement);

      newElement = document.createElement("div");
      newElement.appendChild(document.createTextNode("Left"));
      newElement.setAttribute('class', "btn inverse edtr one_third");
      newElement.setAttribute('onclick', "drawOnAFace(2)");
      p.appendChild(newElement);

      newElement = document.createElement("div");
      newElement.appendChild(document.createTextNode("Right"));
      newElement.setAttribute('class', "btn inverse edtr one_third first");
      newElement.setAttribute('onclick', "drawOnAFace(3)");
      p.appendChild(newElement);

      newElement = document.createElement("div");
      newElement.appendChild(document.createTextNode("Front"));
      newElement.setAttribute('class', "btn inverse edtr one_third");
      newElement.setAttribute('onclick', "drawOnAFace(4)");
      p.appendChild(newElement);

      newElement = document.createElement("div");
      newElement.appendChild(document.createTextNode("Back"));
      newElement.setAttribute('class', "btn inverse edtr one_third");
      newElement.setAttribute('onclick', "drawOnAFace(5)");
      p.appendChild(newElement);
    }
    else if(mode == 1){
      newElement = document.createElement("div");
      newElement.appendChild(document.createTextNode("Top"));
      newElement.setAttribute('class', "btn inverse edtr one_third first");
      newElement.setAttribute('onclick', "drawOnAFace(6)");
      p.appendChild(newElement);

      newElement = document.createElement("div");
      newElement.appendChild(document.createTextNode("Bottom"));
      newElement.setAttribute('class', "btn inverse edtr one_third");
      newElement.setAttribute('onclick', "drawOnAFace(7)");
      p.appendChild(newElement);

      newElement = document.createElement("div");
      newElement.appendChild(document.createTextNode("Left"));
      newElement.setAttribute('class', "btn inverse edtr one_third");
      newElement.setAttribute('onclick', "drawOnAFace(8)");
      p.appendChild(newElement);

      newElement = document.createElement("div");
      newElement.appendChild(document.createTextNode("Right"));
      newElement.setAttribute('class', "btn inverse edtr one_third first");
      newElement.setAttribute('onclick', "drawOnAFace(9)");
      p.appendChild(newElement);

      newElement = document.createElement("div");
      newElement.appendChild(document.createTextNode("Front"));
      newElement.setAttribute('class', "btn inverse edtr one_third");
      newElement.setAttribute('onclick', "drawOnAFace(10)");
      p.appendChild(newElement);

      newElement = document.createElement("div");
      newElement.appendChild(document.createTextNode("Back"));
      newElement.setAttribute('class', "btn inverse edtr one_third");
      newElement.setAttribute('onclick', "drawOnAFace(11)");
      p.appendChild(newElement);
    }
    else if(mode == 2){
      for(var i = 12; i < faces[boxType][modelType].length; i++){
        newElement = document.createElement("div");
        newElement.appendChild(document.createTextNode(faces[boxType][modelType][i].name));
        newElement.setAttribute('class', "btn inverse edtr one_third");
        newElement.setAttribute('onclick', "drawOnAFace(" + i + ")");
        p.appendChild(newElement);
      }
    }

}

function drawOnAFace(face){
  sides[getSide(faces[boxType][modelType][faceSelected].name)].canvasSave = canvas.toJSON();

  drawOnAFaceFast(face);
}

function drawOnAFaceFast(face){

  //console.log("Box Type: " + boxType + " - Model Type: " + modelType + " - Face: " + faceSelected);

  //sides[getSide(faces[boxType][modelType][faceSelected].name)].canvasSave = canvas.toJSON();

  canvas.clear();

  faceSelected = face;

  updateActiveFaceButton(face);

  editorRatio = (Math.min(faces[boxType][modelType][faceSelected].w, faces[boxType][modelType][faceSelected].h) / Math.max(faces[boxType][modelType][faceSelected].w, faces[boxType][modelType][faceSelected].h));

  //canvas.setWidth(editorMax);
  //canvas.setHeight(editorMax * editorRatio);
  //canvas.setWidth(1123);
  //canvas.setHeight(1123 * editorRatio);
  canvas.setWidth(1024);
  canvas.setHeight(1024 * editorRatio);

  var canvCC = document.getElementsByClassName("canvas-container");
  var canvFC = document.getElementById("faceCanvas");
  var canvUC = document.getElementsByClassName("upper-canvas");
  canvCC[0].style.width = editorMax;
  canvCC[0].style.height = editorMax * editorRatio;
  canvFC.style.width = editorMax;
  canvFC.style.height = editorMax * editorRatio;
  canvUC[0].style.width = editorMax;
  canvUC[0].style.height = editorMax * editorRatio;


  if(sides[getSide(faces[boxType][modelType][faceSelected].name)].canvasSave == null || sides[getSide(faces[boxType][modelType][faceSelected].name)].canvasSave.objects.length == 0){

    fabric.Image.fromURL('../Images/clear.png', function(myImg) {
      myImg.selectable = false;
      canvas.add(myImg);
      canvas.item(canvas.getObjects().length - 1).set({
        borderColor: 'orange',
        cornerColor: 'orange',
        cornerSize: 12,
        borderScaleFactor: 3,
        transparentCorners: true
      });
    });
  }

  canvasTF.clear();

  ctxT.drawImage(newModelTexture.image, 0, 0, canvasT.width, canvasT.height);

  canvas.loadFromJSON(sides[getSide(faces[boxType][modelType][faceSelected].name)].canvasSave, canvas.renderAll.bind(canvas));

  canvas.renderAll();

  updateLayersPanel();
}

function drawOnMap(){

  //////////////////////////////////

  ctxT2.translate(canvasT2.width / 2, canvasT2.height / 2);
  ctxT2.rotate((Math.PI / 180) * -faces[boxType][modelType][faceSelected].rotation);
  ctxT2.translate(-(canvasT2.width / 2), -(canvasT2.height / 2));

  ctxT2.drawImage(canvasT, 0, 0, canvasT2.width, canvasT2.height);
  ctxM.drawImage(canvasT2, 0, 0, canvasM.width, canvasM.height, faces[boxType][modelType][faceSelected].sx, faces[boxType][modelType][faceSelected].sy, faces[boxType][modelType][faceSelected].sWidth, faces[boxType][modelType][faceSelected].sHeight);

  ctxT2.translate(canvasT2.width / 2, canvasT2.height / 2);
  ctxT2.rotate((Math.PI / 180) * faces[boxType][modelType][faceSelected].rotation);
  ctxT2.translate(-(canvasT2.width / 2), -(canvasT2.height / 2));

  ctxT2.clearRect(0, 0, canvasT2.width, canvasT2.height);

  updateTextureMap();

  clearTemp();
}

var curMat = 0;

function changeMaterial(mat){

  //trigger warning

  if(window.confirm("This will reset your enitre design. Are you sure you want to continue?")){
    curMat = mat;
    var img;

    if(mat == 0){ img = modelTexture.image; }
    else if(mat == 1){ img = modelTextureWhite.image; }
    else if(mat == 2){ img = modelTextureHalf.image; }
    else{}

    ctxM.drawImage(img, 0, 0);
    updateTextureMap();

    updateActiveMaterialButton(mat);
  }
}

function updateTextureMap(){
  image.src = canvasM.toDataURL();
  newModelTexture = new THREE.TextureLoader().load(image.src);
  //image.src = canvasM.toDataURL();
  updateMaterial = true;
}

function orientateForFace(face){

  ctxT.translate(canvasT.width / 2, canvasT.height / 2);
  ctxT.rotate((Math.PI / 180) * faces[boxType][modelType][faceSelected].rotation);
  ctxT.translate(-(canvasT.width / 2), -(canvasT.height / 2));

  canvasTF.clear();

  ctxT.drawImage(newModelTexture.image, faces[boxType][modelType][faceSelected].sx, faces[boxType][modelType][faceSelected].sy, faces[boxType][modelType][faceSelected].sWidth, faces[boxType][modelType][faceSelected].sHeight, 0, 0, canvasT.width, canvasT.height);
}

function orientateFaceForUV(){

  ctxT.translate(canvasT.width / 2, canvasT.height / 2);
  ctxT.rotate((Math.PI / 180) * -(faces[boxType][modelType][faceSelected].rotation));
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

  canvasTF.loadFromJSON(sides[getSide(faces[boxType][modelType][faceSelected].name)].canvasSave);
  canvasTF.renderAll();

  canvasT.width = 1024;
  canvasT.height = 1024;

  ctxT.scale((1024/canvasF.width), (1024/canvasF.height));

  //ctxM.drawImage(modelTexture.image, faces[boxType][modelType][faceSelected].sx, faces[boxType][modelType][faceSelected].sy, faces[boxType][modelType][faceSelected].sWidth, faces[boxType][modelType][faceSelected].sHeight, faces[boxType][modelType][faceSelected].sx, faces[boxType][modelType][faceSelected].sy, faces[boxType][modelType][faceSelected].sWidth, faces[boxType][modelType][faceSelected].sHeight);

  window.setTimeout(drawOnMap, 1);

}

function updateLayersPanel(){

  //console.log(canvas.getObjects());

  window.setTimeout(function(){

    var p = document.getElementById("layersPanel");
    p.innerHTML = "";

    window.setTimeout(function(){

      //console.log(canvas.getObjects().length);

      for(var i = 2; i <= canvas.getObjects().length; i++){
        //console.log("HERE");
        var p = document.getElementById("layersPanel");
        var newElement = document.createElement("div");
        newElement.setAttribute('id', (i - 1));
        newElement.setAttribute('onclick', "layerClicked(" + (i - 1) + ")");
        if(canvas.item(i - 1).isType('i-text')){newElement.innerHTML = canvas.item(i - 1).text;}
        else if(canvas.item(i - 1).isType('image')){newElement.innerHTML = "Image";}
        else{newElement.innerHTML = "Layer " + (i-1)}

        p.appendChild(newElement);
        //console.log(canvas.item(i - 1).id);
      }

    }, 1);
  }, 1);
}

/////////////////////////////////////////////////////////////////////////////////

function printJSON(){
  //console.log(sides[getSide(faces[boxType][modelType][faceSelected].name)].canvasSave);
}

function updateActiveModeButton(mode){

  var btnContainer = document.getElementById("modeContainer");
  var btns = btnContainer.getElementsByClassName("btn");

  for(var i = 0; i < btns.length; i++)
  {
    var current = btnContainer.getElementsByClassName("active");
  }

  if(current.length > 0){current[0].className = current[0].className.replace(" active", "");}

  btns[mode].className += " active";

}

function updateActiveMaterialButton(button){

  var btnContainer = document.getElementById("materialContainer");
  var btns = btnContainer.getElementsByClassName("btn");

  for(var i = 0; i < btns.length; i++)
  {
    var current = btnContainer.getElementsByClassName("active");
  }

  if(current.length > 0){current[0].className = current[0].className.replace(" active", "");}

  btns[button].className += " active";

}

function updateActiveFaceButton(face){

  if(face > 11){face -= 12}
  else if(face > 5){face -= 6;}

  var btnContainer = document.getElementById("faceContainer");
  var btns = btnContainer.getElementsByClassName("btn");

  for(var i = 0; i < btns.length; i++)
  {
    var current = btnContainer.getElementsByClassName("active");
  }

  if(current.length > 0){current[0].className = current[0].className.replace(" active", "");}

  //console.log("Face: " + face);
  //console.log(btns[face]);

  btns[face].className += " active";

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
      canvas.item(canvas.getObjects().length - 1).set({
        borderColor: 'orange',
        cornerColor: 'orange',
        cornerSize: 12,
        borderScaleFactor: 3,
        transparentCorners: true
      });

      layerClicked(canvas.getObjects().length - 1);
    });

    var p = document.getElementById("layersPanel");
    var newElement = document.createElement("div");
    newElement.setAttribute('id', canvas.getObjects().length);
    newElement.setAttribute('onclick', "layerClicked(" + (canvas.getObjects().length) + ")");
    newElement.innerHTML = (document.getElementById('uploadedImage').files.item(0).name).substring(0, 14);
    p.appendChild(newElement);

    canvas.renderAll();
    faces[boxType][modelType][faceSelected].createPage = true;
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
    canvas.item(canvas.getObjects().length - 1).set({
      borderColor: 'orange',
      cornerColor: 'orange',
      cornerSize: 12,
      borderScaleFactor: 3,
      transparentCorners: true
    });

    var p = document.getElementById("layersPanel");
    var newElement = document.createElement("div");
    newElement.setAttribute('id', canvas.getObjects().length - 1);
    newElement.setAttribute('onclick', "layerClicked(" + (canvas.getObjects().length - 1) + ")");
    newElement.innerHTML = (document.getElementById("textInput").value).substring(0, 14);
    p.appendChild(newElement);

    canvas.renderAll();

    faces[boxType][modelType][faceSelected].createPage = true;

    layerClicked(canvas.getObjects().length - 1);

  }

}

function loadAndUseFont(font) {
  var myfont = new FontFaceObserver(font);

  myfont.load().then(function() {

    canvas.getActiveObject().set("fontFamily", font);
    canvas.requestRenderAll();

  }).catch(function(e){

    //console.log(e)
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

  var pat = /(\d+(\.\d*)?|\.\d+)(?=\))/;
  var newA = str.search(pat);

  ///////////////////
  // Updates
  // change opacity for different materials and colours
  //
  ///////////////////

  var opac = 1;
  var opacA = (str.substring(newA, str.length - 1)) * opac;

  if(str.substring(0, 4) == "rgba"){ canvas.backgroundColor = "rgba(" + str.substring(5, newA) + opacA + ")"; }
  else{ canvas.backgroundColor = "rgba(" + str.substring(4, (str.length - 1)) + ", " + opac + ")"; }

  canvas.renderAll();
  faces[boxType][modelType][faceSelected].createPage = true;
  canvasModifiedCallback();

}

$('.trigger').colorPicker();

/////////////////////////////////////////////////////////////////////////////////

var imagesToSave = [];

function saveImages(){

  for(var i = 0; i < imagesToSave.length; i++){
    if(imagesToSave[i] != null){
      console.log(i)
    }
  }

}

function createImage(){

  var s = sides[getSide(faces[boxType][modelType][faceSelected].name)].canvasSave;
  if(s.objects.length > 1 || s.background != null){
    imagesToSave[faceSelected] = canvasF.toDataURL("image/png");
  }

}

var pdf = new jsPDF('l', 'mm', 'a4');
var pageNames = [];
var numPages = 0;

function addToPDF(){

  var curPage = faces[boxType][modelType][faceSelected];
  var pageNum = 0;

  for(var i = 0; i < numPages; i++){
    //console.log("PN: " + pageNames[i] + " CP: " + curPage.name);
    if(pageNames[i] == curPage.name){
      pageNum = i;
    }
  }

  if(pageNum > 0){
    pdf.setPage((pageNum + 1));
    canvas.discardActiveObject().renderAll();
    pdf.addImage(canvasF.toDataURL("image/png", 1.0), 'PNG', 0, 0);
  }
  else if(numPages == 0){
    var s = sides[getSide(faces[boxType][modelType][faceSelected].name)].canvasSave;
    if(s.objects.length > 1 || s.background != null){
      pageNames[numPages] = curPage.name;
      numPages++;
      canvas.discardActiveObject().renderAll();
      pdf.addImage(canvasF.toDataURL("image/png", 1.0), 'PNG', 0, 0);
    }
  }
  else{
    var s = sides[getSide(faces[boxType][modelType][faceSelected].name)].canvasSave;
    if(s.objects.length > 1 || s.background != null){
      pageNames[numPages] = curPage.name;
      numPages++;
      pdf.addPage();
      canvas.discardActiveObject().renderAll();
      pdf.addImage(canvasF.toDataURL("image/png", 1.0), 'PNG', 0, 0);
    }
  }

  //if(sides[getSide(faces[boxType][modelType][faceSelected].name)].canvasSave == null || sides[getSide(faces[boxType][modelType][faceSelected].name)].canvasSave.objects.length == 0)

}

function addToPDFOLD(){

  ctxT.translate(canvasT.width / 2, canvasT.height / 2);
  ctxT.rotate((Math.PI / 180) * -(faces[boxType][modelType][faceSelected].pdfRotation));
  ctxT.translate(-(canvasT.width / 2), -(canvasT.height / 2));

    //window.setTimeout(addToPDFPart2, 1);

    ctxT.drawImage(canvasF, 0, 0, canvasT.width, canvasT.height);

    canvasT.width = canvasF.width;
    canvasT.height = canvasF.height;

    canvasTF.loadFromJSON(sides[getSide(faces[boxType][modelType][faceSelected].name)].canvasSave);
    canvasTF.renderAll();

    canvasT.width = 1024;
    canvasT.height = 1024;

    ctxT.scale((1024/canvasF.width), (1024/canvasF.height));

    window.setTimeout(drawOnPDF, 1);

}

function addToPDFPart2(){


  ctxT.drawImage(canvasF, 0, 0, canvasT.width, canvasT.height);

  canvasT.width = canvasF.width;
  canvasT.height = canvasF.height;

  canvasTF.loadFromJSON(sides[getSide(faces[boxType][modelType][faceSelected].name)].canvasSave);
  canvasTF.renderAll();

  canvasT.width = 1024;
  canvasT.height = 1024;

  ctxT.scale((1024/canvasF.width), (1024/canvasF.height));

  window.setTimeout(drawOnPDF, 1);
}

function drawOnPDF(){

  ctxT2.translate(canvasT2.width / 2, canvasT2.height / 2);
  ctxT2.rotate((Math.PI / 180) * -faces[boxType][modelType][faceSelected].pdfRotation);
  ctxT2.translate(-(canvasT2.width / 2), -(canvasT2.height / 2));

  ctxT2.drawImage(canvasT, 0, 0, canvasT2.width, canvasT2.height);

  //here

  canvasPDFE.getContext("2d").drawImage(
    canvasT2, 0, 0, canvasT2.width, canvasT2.height,
    faces[boxType][modelType][faceSelected].l, faces[boxType][modelType][faceSelected].t, faces[boxType][modelType][faceSelected].w, faces[boxType][modelType][faceSelected].h
  );

  /*fabric.Image.fromURL(canvasT2.toDataURL(), function(myImg){
    myImg.set({
      left: faces[boxType][modelType][faceSelected].l,
      top: faces[boxType][modelType][faceSelected].t,
      width: faces[boxType][modelType][faceSelected].w,
      height: faces[boxType][modelType][faceSelected].h
    });

    if(faces[boxType][modelType][faceSelected].external){ canvasPDFExternal.add(myImg); }
    else{ canvasPDFInternal.add(myImg); }

  });*/

  ctxT2.translate(canvasT2.width / 2, canvasT2.height / 2);
  ctxT2.rotate((Math.PI / 180) * faces[boxType][modelType][faceSelected].pdfRotation);
  ctxT2.translate(-(canvasT2.width / 2), -(canvasT2.height / 2));

  ctxT2.clearRect(0, 0, canvasT2.width, canvasT2.height);

  clearTemp();

}

/////////////////////////////////////////////////////////////////////////////////

var curModel = "0426/";

function changeBoxType(sel){

  boxType = sel;

  switch (boxType) {
    case 0:
      curModel = "0426/";
      break;
    case 1:
      curModel = "0427/";
      break;
    case 2:
      curModel = "0421/";
      break;
    case 3:
      curModel = "0215/";
      break;
    default:
      curModel = "0426/";
  }

  updateDimensionSelections();

}

function updateDimensionSelections(){

  var choices;

  if(boxType == 0){
    choices = ["195mm x 115mm x 77mm", "220mm x 155mm x 50mm", "400mm x 250mm x 150mm", "420mm x 320mm x 75mm", "460mm x 460mm x 50mm", "490mm x 375mm x 62mm", "580mm x 360mm x 100mm", "640mm x 430mm x 60mm", "300mm x 280mm x 160mm", "160mm x 160mm x 35mm"];
  }
  else if(boxType == 1){
    choices = ["300mm x 225mm x 100mm", "280mm x 105mm x 90mm", "300mm x 300mm x 100mm", "275mm x 205mm x 115mm"];
  }
  else if(boxType == 2){
    choices = ["145mm x 115mm x 120mm", "165mm x 160mm x 150mm", "160mm x 160mm x 115mm"];
  }
  else if(boxType == 3){
    choices = ["200mm x 200mm x 280mm", "160mm x 160mm x 570mm"];
  }

  $("#dimensionsSelect").empty();

  var sel = document.getElementById('dimensionsSelect');
  var fragment = document.createDocumentFragment();

  choices.forEach(function(choices, index) {
      var opt = document.createElement('option');
      opt.innerHTML = choices;
      opt.value = choices;
      fragment.appendChild(opt);
  });

  sel.appendChild(fragment);

}

function changeDimensions(){

  ctxM.clearRect(0, 0, canvasM.width, canvasM.height);

  var sel = document.getElementById('dimensionsSelect').selectedIndex;
  var ans;

  switch(boxType){
    case 0:
      switch (sel) {
        case 0:
          ans = curModel + "0426_160_160_35";
          break;
        case 1:
          ans = curModel + "0426_195_115_77";
          break;
        case 2:
          ans = curModel + "0426_220_155_50";
          break;
        case 3:
          ans = curModel + "0426_400_250_150";
          break;
        case 4:
          ans = curModel + "0426_420_320_75";
          break;
        case 5:
          ans = curModel + "0426_460_460_50";
          break;
        case 6:
          ans = curModel + "0426_490_375_62";
          break;
        case 7:
          ans = curModel + "0426_580_360_100";
          break;
        case 8:
          ans = curModel + "0426_640_430_60";
          break;
        default:
          ans = curModel + "0426_160_160_35";
      }
      modelType = sel;
      break;
    case 1:
      switch (sel) {
        case 0:
          ans = curModel + "0427_100_225_300";
          break;
        case 1:
          ans = curModel + "0427_275_205_115";
          break;
        case 2:
          ans = curModel + "0427_280_105_90";;
          break;
        case 3:
          ans = curModel + "0427_300_300_110";;
          break;
        default:
          ans = curModel + "0427_100_225_300";
      }
      modelType = 0;
      break;
    case 2:
      switch (sel) {
        case 0:
          ans = curModel + "0421_145_115_120";
          break;
        case 1:
          ans = curModel + "0421_160_160_115";
          break;
        case 2:
          ans = curModel + "0421_165_160_150";;
          break;
        default:
          ans = curModel + "0421_145_115_120";
      }
      modelType = 0;
      break;
    default:
      ans = "0426/0426_220_155_50";
  }

  scene.remove(mesh);

  //loader.load('../Models/0426/' + ans + '.json', handle_load);
  loader.load('../Models/' + ans + '.json', handle_load);

  modelTexture = new THREE.TextureLoader().load("../Images/Materials/" + ans + "_kraft.png");
  modelTextureWhite = new THREE.TextureLoader().load("../Images/Materials/" + ans + "_white.png");
  modelTextureHalf = new THREE.TextureLoader().load("../Images/Materials/" + ans + "_white_outside.png");
  //modelTexture = new THREE.TextureLoader().load("../Images/Materials/0426/" + ans + "_kraft.png");
  //modelTextureWhite = new THREE.TextureLoader().load("../Images/Materials/0426/" + ans + "_white.png");
  //modelTextureHalf = new THREE.TextureLoader().load("../Images/Materials/0426/" + ans + "_white_outside.png");

  var matVer = 0;

  switch (curMat) {
    case 0:
      modelTexture.image.onload = function(){ctxM.drawImage(this, 0, 0); }
      matVer = "_kraft.png";
      break;
    case 1:
      modelTextureWhite.image.onload = function(){ctxM.drawImage(this, 0, 0); }
      matVer = "_white.png";
      break;
    case 2:
      modelTextureHalf.image.onload = function(){ctxM.drawImage(this, 0, 0); }
      matVer = "_white_outside.png";
      break;
    default:
      modelTexture.image.onload = function(){ctxM.drawImage(this, 0, 0); }
      matVer = "_kraft.png";
  }

  //New face textures
  //newModelTexture = new THREE.TextureLoader().load("../Images/Materials/0426/" + ans + "_kraft.png");
  newModelTexture = new THREE.TextureLoader().load("../Images/Materials/" + ans + matVer);

  //clean up
  modelMaterial = new THREE.MeshPhongMaterial({
    map: modelTexture,
    normalMap: modelNormalMap,
    transparent: true, opacity: 1, side: THREE.DoubleSide});

  modelMaterial.normalMap.wrapS = THREE.MirroredRepeatWrapping;
  modelMaterial.normalMap.wrapT = THREE.MirroredRepeatWrapping;

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
