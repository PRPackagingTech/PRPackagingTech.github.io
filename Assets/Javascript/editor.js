var fonts = ["Times New Roman", "Pacifico", "VT323", "Quicksand", "Inconsolata"];

//document.getElementById("faceCanvas").width = document.getElementById("face").width;

// Load all fonts using Font Face Observer
var canvas = new fabric.Canvas("faceCanvas", {
  selectionColor: 'blue',
  selectionLineWidth: 2
});

fonts.forEach(function(font) {
  var option = document.createElement('option');
  option.innerHTML = font;
  option.value = font;
  document.getElementById("fontSelect").appendChild(option);
});

canvas.setBackgroundColor("rgb(100, 100, 100)");
canvas.renderAll();

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

/*document.getElementById('fontColour').onchange = function(){

  console.log("HERE");

  if(canvas.getActiveObject() != null && canvas.getActiveObject().isType("i-text")){
    canvas.getActiveObject().setColor(document.getElementById("fontColour").style.backgroundColor);
  }

};*/

var observer = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    /*console.log('old', mutation.oldValue);
    console.log('new', mutation.target.style.cssText);*/

    if(canvas.getActiveObject() != null && canvas.getActiveObject().isType("i-text")){
      //console.log(document.getElementById("fontColour").style.backgroundColor);
      canvas.getActiveObject().set({fill: document.getElementById("fontColour").style.backgroundColor });
      canvas.renderAll();
    }
  });
});

var config = { attributes: true, attributeOldValue: true }

observer.observe(document.getElementById("fontColour"), config);

function handleImage(input){

  var reader = new FileReader();

  reader.onload = function(e){

    fabric.Image.fromURL(e.target.result, function(oImg){
      canvas.centerObject(oImg);
      canvas.add(oImg);

      layerClicked(canvas.getObjects().length);
    });

    var p = document.getElementById("layersPanel");
    var newElement = document.createElement("div");
    newElement.setAttribute('id', canvas.getObjects().length + 1);
    newElement.setAttribute('onclick', "layerClicked(" + (canvas.getObjects().length + 1) + ")");
    newElement.innerHTML = (document.getElementById('uploadedImage').files.item(0).name).substring(0, 14);
    p.appendChild(newElement);

    canvas.renderAll();
  };

  reader.readAsDataURL(input.files[0]);

}

function layerClicked(id){

  var d;

  for(var i = 0; i < canvas.getObjects().length; i++){
    d = document.getElementById(i + 1);
    d.setAttribute("style", "outline: hidden;");
  }

  d = document.getElementById(id);
  d.setAttribute("style", "outline: green solid 2px;");

  canvas.setActiveObject(canvas.item((id - 1)));
  canvas.renderAll();

}

function setActiveLayer(){

  var d;

  for(var i = 0; i < canvas.getObjects().length; i++){
    d = document.getElementById(i+1);
    d.setAttribute("style", "outline: hidden;");

    if(canvas.item(i) === canvas.getActiveObject()){
      d = document.getElementById(i+1);
      d.setAttribute("style", "outline: green solid 2px;");
    }
  }

}

function deleteLayer(){

  if(canvas.getActiveObject() != null){
    document.getElementById((canvas.getObjects().indexOf(canvas.getActiveObject())) + 1).remove();

    var val = (canvas.getObjects().indexOf(canvas.getActiveObject())) + 2;

    canvas.remove(canvas.getActiveObject());
    updateDivID(val);

    canvas.renderAll();
  }
}

function updateDivID(val){

  for(var i = val; i <= (canvas.getObjects().length + 1); i++){
    document.getElementById(i).setAttribute('onclick', "layerClicked(" + (i - 1) + ")");
    document.getElementById(i).id = (i - 1);
  }

}

function moveUpLayer(){

  if( (canvas.getObjects().indexOf(canvas.getActiveObject()) + 1) < canvas.getObjects().length){

    var arrayNames = [];
    canvas.getActiveObject().bringForward();
    arrayNames[0] = document.getElementById((canvas.getObjects().indexOf(canvas.getActiveObject()) + 1)).innerHTML;

    for(var i = 1; i <= canvas.getObjects().length; i++){

      arrayNames[i] = document.getElementById(i).innerHTML;

    }

    arrayNames[canvas.getObjects().indexOf(canvas.getActiveObject()) + 1] = arrayNames[(canvas.getObjects().indexOf(canvas.getActiveObject()))];
    arrayNames[(canvas.getObjects().indexOf(canvas.getActiveObject()))] = arrayNames[0];

    var p = document.getElementById("layers");
    p.innerHTML = "";

    for(var i = 1; i <= canvas.getObjects().length; i++){

      var newElement = document.createElement("div");
      newElement.setAttribute('id', i);
      newElement.setAttribute('onclick', "layerClicked(" + i + ")");
      newElement.innerHTML = arrayNames[i];
      p.appendChild(newElement);

    }

    setActiveLayer();

  }
}

function moveDownLayer(){

  if( canvas.getObjects().indexOf(canvas.getActiveObject()) > 0){

    var arrayNames = [];
    arrayNames[0] = document.getElementById((canvas.getObjects().indexOf(canvas.getActiveObject()) + 1)).innerHTML;
    canvas.getActiveObject().sendBackwards();

    for(var i = 1; i <= canvas.getObjects().length; i++){

      arrayNames[i] = document.getElementById(i).innerHTML;

    }

    arrayNames[(canvas.getObjects().indexOf(canvas.getActiveObject()) + 2)] = arrayNames[(canvas.getObjects().indexOf(canvas.getActiveObject()) + 1)];
    arrayNames[(canvas.getObjects().indexOf(canvas.getActiveObject()) + 1)] = arrayNames[0];

    var p = document.getElementById("layers");
    p.innerHTML = "";

    for(var i = 1; i <= canvas.getObjects().length; i++){

      var newElement = document.createElement("div");
      newElement.setAttribute('id', i);
      newElement.setAttribute('onclick', "layerClicked(" + i + ")");
      newElement.innerHTML = arrayNames[i];
      p.appendChild(newElement);

    }

    setActiveLayer();

  }
}

function scaleToHeight(){

  if(canvas.getActiveObject() != null){
    canvas.getActiveObject().scaleToHeight(canvas.getHeight());
    canvas.getActiveObject().center();
    canvas.renderAll();
  }
}

function scaleToWidth(){

  if(canvas.getActiveObject() != null){
    canvas.getActiveObject().scaleToWidth(canvas.getWidth());
    canvas.getActiveObject().center();
    canvas.renderAll();
  }
}

function centreObject(){

  if(canvas.getActiveObject() != null){
    canvas.getActiveObject().center();
    canvas.renderAll();
  }
}

function resetObject(){

  if(canvas.getActiveObject() != null){
    canvas.getActiveObject().scale(1);
    canvas.getActiveObject().rotate(0);
    canvas.getActiveObject().center();
    canvas.renderAll();
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
    newElement.setAttribute('id', canvas.getObjects().length);
    newElement.setAttribute('onclick', "layerClicked(" + (canvas.getObjects().length) + ")");
    newElement.innerHTML = (document.getElementById("textInput").value).substring(0, 14);
    p.appendChild(newElement);

    canvas.renderAll();

    layerClicked(canvas.getObjects().length);

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

$('.trigger').colorPicker();
