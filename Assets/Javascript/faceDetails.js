var dpiConversion = 3.77941176471;
var amount = 6;
var fefcos = 4; //update
//var faces = [[[0],[0],[0]],[[0],[0],[0]],[[0],[0],[0]],[[0],[0],[0]]];
var faces = new Array(amount); //6 different styles of FEFCO box

for(var j = 0; j < fefcos; j++){
  faces[j] = new Array(fefcos);

  for(var i = 0; i < amount; i++){
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

// 0426 - 195 x 115 x 77
//Closed
faces[0][0][0] = new faceDetails("0426-01", "TopExternal",     114, 744, 280, 167,   0,    115, 192);//, 352, 78.5,    90);
faces[0][0][1] = new faceDetails("0426-01", "BottomExternal",  112, 463, 284, 168,   180,  115, 195);//, 160, 77,      90);
faces[0][0][2] = new faceDetails("0426-01", "LeftExternal",    397, 463, 111, 168,   270,  115, 77);//, 160, 272,      180);
faces[0][0][3] = new faceDetails("0426-01", "RightExternal",   0, 463, 111, 168,     90,   115, 77);//, 160, 0,        0);
faces[0][0][4] = new faceDetails("0426-01", "FrontExternal",   114, 351, 280, 112,   0,    78.5, 192);//, 81.5, 78.5,  90);
faces[0][0][5] = new faceDetails("0426-01", "BackExternal",    114, 631, 280, 112,   180,  77, 192);//, 275, 78.5,     270);
//Open

faces[0][0][6]  = new faceDetails("0426-01", "TopInternal",     624, 743, 278, 168,   0,    115, 192);//, 352, 78.5,    90);
faces[0][0][7]  = new faceDetails("0426-01", "BottomInternal",  622, 463, 284, 168,   180,  115, 195);//, 160, 77,      90);
faces[0][0][8]  = new faceDetails("0426-01", "LeftInternal",    508, 463, 113, 168,   270,  115, 77);//, 160, 272,      180);
faces[0][0][9]  = new faceDetails("0426-01", "RightInternal",   907, 463, 111, 168,   90,   115, 77);//, 160, 0,        0);
faces[0][0][10] = new faceDetails("0426-01", "FrontInternal",   624, 912, 280, 111,   0,    78.5, 192);//, 81.5, 78.5,  90);
faces[0][0][11] = new faceDetails("0426-01", "BackInternal",    624, 631, 280, 112,   180,  77, 192);
//Flat
faces[0][0][12] = new faceDetails("0426-01", "TopInternal",     624, 743, 278, 168,   0,    115, 192);
faces[0][0][13] = new faceDetails("0426-01", "BottomInternal",  622, 463, 284, 168,   180,  115, 195);
faces[0][0][14] = new faceDetails("0426-01", "LeftInternal",    508, 463, 113, 168,   270,  115, 77);
faces[0][0][15] = new faceDetails("0426-01", "RightInternal",   907, 463, 111, 168,   90,   115, 77);
faces[0][0][16] = new faceDetails("0426-01", "FrontInternal",   624, 912, 280, 111,   0,    78.5, 192);
faces[0][0][17] = new faceDetails("0426-01", "BackInternal",    624, 631, 280, 112,   180,  77, 192);
/*
faces[0][0][12] = new faceDetails("0426-01", "TopExternal", 0, 0, (newModelTexture.image.width / 3), (newModelTexture.image.height / 3), 0);
faces[0][0][13] = new faceDetails("0426-01", "LeftExternal", 0, 0, (newModelTexture.image.width / 3), (newModelTexture.image.height / 3), 0);
faces[0][0][14] = new faceDetails("0426-01", "RightExternal", 0, 0, (newModelTexture.image.width / 3), (newModelTexture.image.height / 3), 0);
faces[0][0][15] = new faceDetails("0426-01", "FrontExternal", 0, 0, (newModelTexture.image.width / 3), (newModelTexture.image.height / 3), 0);
faces[0][0][16] = new faceDetails("0426-01", "BackExternal", 0, 0, (newModelTexture.image.width / 3), (newModelTexture.image.height / 3), 0);
faces[0][0][17] = new faceDetails("0426-01", "BottomExternal", 0, 0, (newModelTexture.image.width / 3), (newModelTexture.image.height / 3), 0);
faces[0][0][18] = new faceDetails("0426-01", "Test", (newModelTexture.image.width / 3), ((newModelTexture.image.height / 3) * 2), (newModelTexture.image.width / 3), (newModelTexture.image.height / 3), 90);
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
