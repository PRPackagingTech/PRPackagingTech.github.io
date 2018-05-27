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
sides[12] = new side("00");
sides[13] = new side("01");
sides[14] = new side("02");
sides[15] = new side("03");
sides[16] = new side("04");
sides[17] = new side("05");
sides[18] = new side("06");
sides[19] = new side("07");
sides[20] = new side("08");
sides[21] = new side("09");
sides[22] = new side("10");
sides[23] = new side("11");
sides[24] = new side("12");
sides[25] = new side("13");
sides[26] = new side("14");
sides[27] = new side("15");
sides[28] = new side("16");

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
