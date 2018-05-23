var dpiConversion = 3.77941176471;
var amount = [10, 4, 3, 2];
var fefcos = 4; //update
//var faces = [[[0],[0],[0]],[[0],[0],[0]],[[0],[0],[0]],[[0],[0],[0]]];
var faces = new Array(amount); //6 different styles of FEFCO box

for(var j = 0; j < fefcos; j++){
  faces[j] = new Array(fefcos);

  for(var i = 0; i < amount[j]; i++){
    faces[j][i] = new Array();
  }
}

function faceDetails(box, name, sx, sy, sWidth, sHeight, rotation, w, h){//, l, t, pdfRotation){
  this.box = box;
  this.name = name;
  this.sx = sx;
  this.sy = sy;
  this.sWidth = sWidth;
  this.sHeight = sHeight;
  this.rotation = rotation;
  this.w = Math.round(w * dpiConversion);
  this.h = Math.round(h * dpiConversion);
  /*this.l = Math.round(l * dpiConversion);
  this.t = Math.round(t * dpiConversion);
  this.pdfRotation = pdfRotation;
  this.createPage = false;*/
}

setFaceCoords();

function side(name){
  this.name = name;
  this.canvasSave = null;
}

function imageLayer(img, x, y, width, height, rotation){
  this.img = img;
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.rotation = rotation;
}

function textLayer(text, x, y, rotation, fontSize, font){
  this.text = text;
  this.x = x;
  this.y = y;
  this.rotation = rotation;
  this.fontSize = fontSize;
  this.font = font;
}

var sides = new Array(amount);

sides[0] = new side("TopExternal");
sides[1] = new side("BottomExternal");
sides[2] = new side("LeftExternal");
sides[3] = new side("RightExternal");
sides[4] = new side("FrontExternal");
sides[5] = new side("BackExternal");
sides[6] = new side("TopInternal");
sides[7] = new side("BottomInternal");
sides[8] = new side("LeftInternal");
sides[9] = new side("RightInternal");
sides[10] = new side("FrontInternal");
sides[11] = new side("BackInternal");

function updateSideColor(side, hex){
  for(var i = 0; i < sides.length; i++){
    if(sides[i].name == side){ sides[i].color = hex; colourUpdate = true;}
  }
}

function addImageLayer(side, img, x, y, width, height, rotation){
  for(var i = 0; i < sides.length; i++){
    if(sides[i].name == side){
      sides[i].layers.push(new imageLayer(img, x, y, width, height, rotation));

      createPage = true;
      /*for(var j = 0; j < sides[i].layers.length; j++)
      {
        console.log("HERE " + j);//s sides[i].layers[0].img.src);
      }*/
    }
  }
}

function addTextLayer(side, text, x, y, rotatiom, fontSize, font){
  for(var i = 0; i < sides.length; i++){
    if(sides[i].name == side){
      sides[i].layers.push(new textLayer(text, x, y, rotation, fontSize, font));
      createPage = true;
    }
  }
}

function getSide(sideName){
  for(var i = 0; i < sides.length; i++)
  {
    if(sides[i].name == sideName){
      return i;
    }
  }
}
