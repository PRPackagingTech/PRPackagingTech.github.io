var dpiConversion = 3.77941176471;
var amount = 6;
//var faces = [[[],[],[]],[[],[],[]],[[],[],[]],[[],[],[]]];
var faces = new Array(amount); //6 different styles of FEFCO box

for(var i = 0; i < amount; i++){
  faces[i] = new Array();
}

function faceDetails(box, name, sx, sy, sWidth, sHeight, rotation, l, t, w, h, external, pdfRotation){
  this.box = box;
  this.name = name;
  this.sx = sx;
  this.sy = sy;
  this.sWidth = sWidth;
  this.sHeight = sHeight;
  this.rotation = rotation;
  this.l = Math.round(l * dpiConversion);
  this.t = Math.round(t * dpiConversion);
  this.w = Math.round(w * dpiConversion);
  this.h = Math.round(h * dpiConversion);
  this.external = external
  this.pdfRotation = pdfRotation;
}

// 0426 - 195 x 115 x 77
//Closed
faces[0][0] = new faceDetails("0426-01", "TopExternal",     114, 744, 280, 167,   0,    352, 78.5, 115, 192,    true, 90);
faces[0][1] = new faceDetails("0426-01", "BottomExternal",  112, 463, 284, 168,   180,  160, 77, 115, 195,      true, 90);
faces[0][2] = new faceDetails("0426-01", "LeftExternal",    397, 463, 111, 168,   270,  160, 272, 115, 77,      true, 180);
faces[0][3] = new faceDetails("0426-01", "RightExternal",   0, 463, 111, 168,     90,   160, 0, 115, 77,        true, 0);
faces[0][4] = new faceDetails("0426-01", "FrontExternal",   114, 351, 280, 112,   0,    81.5, 78.5, 78.5, 192,  true, 90);
faces[0][5] = new faceDetails("0426-01", "BackExternal",    114, 631, 280, 112,   180,  275, 78.5, 77, 192,     true, 270);
//Open
/*
faces[0][6] = new faceDetails("0426-01", "TopExternal", 787, 767, 217, 257, 270);
faces[0][7] = new faceDetails("0426-01", "LeftExternal", 525, 767, 261, 256, 270);
faces[0][8] = new faceDetails("0426-01", "RightExternal", 525, 510, 261, 256, 90);
faces[0][9] = new faceDetails("0426-01", "FrontExternal", 0, 768, 261, 256, 90);
faces[0][10] = new faceDetails("0426-01", "BackExternal", 0, 510, 261, 256, 90);
faces[0][11] = new faceDetails("0426-01", "BottomExternal", 262, 510, 261, 256, 90);
//Flat
faces[0][12] = new faceDetails("0426-01", "TopExternal", 0, 0, (newModelTexture.image.width / 3), (newModelTexture.image.height / 3), 0);
faces[0][13] = new faceDetails("0426-01", "LeftExternal", 0, 0, (newModelTexture.image.width / 3), (newModelTexture.image.height / 3), 0);
faces[0][14] = new faceDetails("0426-01", "RightExternal", 0, 0, (newModelTexture.image.width / 3), (newModelTexture.image.height / 3), 0);
faces[0][15] = new faceDetails("0426-01", "FrontExternal", 0, 0, (newModelTexture.image.width / 3), (newModelTexture.image.height / 3), 0);
faces[0][16] = new faceDetails("0426-01", "BackExternal", 0, 0, (newModelTexture.image.width / 3), (newModelTexture.image.height / 3), 0);
faces[0][17] = new faceDetails("0426-01", "BottomExternal", 0, 0, (newModelTexture.image.width / 3), (newModelTexture.image.height / 3), 0);
faces[0][18] = new faceDetails("0426-01", "Test", (newModelTexture.image.width / 3), ((newModelTexture.image.height / 3) * 2), (newModelTexture.image.width / 3), (newModelTexture.image.height / 3), 90);
*/
//

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
sides[6] = new side("Test");

function updateSideColor(side, hex){
  for(var i = 0; i < sides.length; i++){
    if(sides[i].name == side){ sides[i].color = hex; colourUpdate = true;}
  }
}

function addImageLayer(side, img, x, y, width, height, rotation){
  for(var i = 0; i < sides.length; i++){
    if(sides[i].name == side){
      sides[i].layers.push(new imageLayer(img, x, y, width, height, rotation));

      layerAdded = true;
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
      layerAdded = true;
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
