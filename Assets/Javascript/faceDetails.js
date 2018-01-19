//var faces = [[[],[],[]],[[],[],[]],[[],[],[]],[[],[],[]]];
var faces = new Array(6);

for(var i = 0; i < faces.length; i++){
  faces[i] = new Array(3);

  for(var j = 0; j < 3; j++){
    faces[i][j] = new Array();
  }
}

function faceDetails(name, sx, sy, sWidth, sHeight){
  this.name = name;
  this.sx = sx;
  this.sy = sy;
  this.sWidth = sWidth;
  this.sHeight = sHeight;
}

//0215
//Closed
faces[0][0][0] = new faceDetails("Top", 0, 0, (newTextures[modeType].image.width / 3), (newTextures[modeType].image.height / 3));
faces[0][0][1] = new faceDetails("Left", 0, (newTextures[modeType].image.height / 3), (newTextures[modeType].image.width / 3), (newTextures[modeType].image.height / 3));
faces[0][0][2] = new faceDetails("Right", (newTextures[modeType].image.width / 3), (newTextures[modeType].image.height / 3), (newTextures[modeType].image.width / 3), (newTextures[modeType].image.height / 3));
faces[0][0][3] = new faceDetails("Front", 0, ((newTextures[modeType].image.height / 3) * 2), (newTextures[modeType].image.width / 3), (newTextures[modeType].image.height / 3));
faces[0][0][4] = new faceDetails("Back", (newTextures[modeType].image.width / 3), ((newTextures[modeType].image.height / 3) * 2), (newTextures[modeType].image.width / 3), (newTextures[modeType].image.height / 3));
faces[0][0][5] = new faceDetails("Bottom", ((newTextures[modeType].image.width / 3) * 2), ((newTextures[modeType].image.height / 3) * 2), (newTextures[modeType].image.width / 3), (newTextures[modeType].image.height / 3));
//Open
faces[0][1][0] = new faceDetails("Top", 0, 0, (newTextures[modeType].image.width / 3), (newTextures[modeType].image.height / 3));
//Flat
faces[0][2][0] = new faceDetails("Top", 0, 0, (newTextures[modeType].image.width / 3), (newTextures[modeType].image.height / 3));

//
