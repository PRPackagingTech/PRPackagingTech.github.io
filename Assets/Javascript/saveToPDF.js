//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var pDFWidth, pDFHeight, editorRatio, editorMax;

if(Math.min(window.innerWidth, window.innerHeight) < 1080){
  editorMax = 512;
}
else{
  editorMax = 1024;
}

if(faces[modelType][faceSelected].box.substring(0, 4) == "0426"){
  pDFWidth = ((6 * dpiConversion) + (4 * faces[0][2].h) + (2 * faces[0][0].w));
  pDFHeight = ((2 * faces[0][2].h) + (faces[0][1].h));
}
else if(faces[modelType][faceSelected].box.substring(0, 4) == "0427"){
  console.log("Not set up");
}
else if(faces[modelType][faceSelected].box.substring(0, 4) == "0421"){
  console.log("Not set up");
}
else if(faces[modelType][faceSelected].box.substring(0, 4) == "0215"){
  console.log("Not set up");
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var canvasPDFExternal = new fabric.Canvas("pdfCanvasExternal", {
  width: pDFWidth,// 11.81,
  height: pDFHeight,// 11.81,
  selectionColor: 'blue',
  selectionLineWidth: 2,
  preserveObjectStacking: true
});

var canvasPDFInternal = new fabric.Canvas("pdfCanvasInternal", {
  width: pDFWidth,// 11.81,
  height: pDFHeight,// 11.81,
  selectionColor: 'blue',
  selectionLineWidth: 2,
  preserveObjectStacking: true
});

//Setting the background colour of the canvas
canvasPDFExternal.setBackgroundColor("rgb(100, 100, 100)");
canvasPDFExternal.renderAll();
canvasPDFInternal.setBackgroundColor("rgb(100, 100, 100)");
canvasPDFInternal.renderAll();

//////////////////// TEST //////////////////////////////

var rect;

for(var i = 0; i < faces[0].length; i++)
{
  rect = new fabric.Rect({
     left: faces[modelType][i].l,
     top: faces[modelType][i].t,
     width: faces[modelType][i].w,
     height: faces[modelType][i].h,
     fill: 'rgba(255, 255, 255, 1)',
     strokeWidth: 0
  });

  if(faces[modelType][i].external){ canvasPDFExternal.add(rect); }
  else{ canvasPDFInternal.add(rect); }

}


//////////////////////////////////////////////////////////////////

canvasPDFExternal.renderAll();

function downloadPDF(){

  //canvasPDFExternal.renderAll();

  var pdf = new jsPDF('l', 'mm', [pDFWidth / dpiConversion, pDFHeight / dpiConversion]);

  pdf.addImage(canvasPDFE.toDataURL("image/jpeg", 1.0), 'JPEG', 0, 0);
  pdf.save("download.pdf");

}
