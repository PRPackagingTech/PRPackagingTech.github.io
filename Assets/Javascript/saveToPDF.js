//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var editorRatio, editorMax;

if(Math.min(window.innerWidth, window.innerHeight) < 1080){
  editorMax = 512;
}
else{
  editorMax = 1024;
}

pDFWidth = 1123;
pDFHeight = 794;

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
/*canvasPDFExternal.setBackgroundColor("rgb(100, 100, 100)");
canvasPDFExternal.renderAll();
canvasPDFInternal.setBackgroundColor("rgb(100, 100, 100)");
canvasPDFInternal.renderAll();*/

//////////////////// TEST //////////////////////////////


//////////////////////////////////////////////////////////////////

canvasPDFExternal.renderAll();

function downloadPDF(){

  //canvasPDFExternal.renderAll();

  var pdf = new jsPDF('l', 'mm', [pDFWidth / dpiConversion, pDFHeight / dpiConversion]);

  pdf.addImage(canvasPDFE.toDataURL("image/jpeg", 1.0), 'JPEG', 0, 0);
  pdf.save("download.pdf");

}

function savePagesAndDownload(){

  /*var pdf = new jsPDF('l', 'mm', 'a4');
  var add = false;
  var fs = faceSelected;

  for(i = 0; i < faces[modelType].length; i++){
    if(faces[modelType][i].createPage){
      if(!add){
        add = true;
      }
      else{
        pdf.addPage();
      }

      var canvP = document.getElementById("pdfCanvas");
      var ctxP = canvP.getContext("2d");
      var tempRatio = (Math.min(faces[modelType][i].w, faces[modelType][i].h) / Math.max(faces[modelType][i].w, faces[modelType][i].h));

      canvP.width = 1123;
      canvP.height = 1123 * tempRatio;

      var canvasPF = new fabric.Canvas("pdfCanvasFabric", {});

      //sides[getSide(faces[modelType][i].name)].canvasSave
      console.log(faces[modelType][i].name);
      console.log(getSide(faces[modelType][i].name));

      canvasPF.loadFromJSON(sides[getSide(faces[modelType][faceSelected].name)].canvasSave, canvas.renderAll.bind(canvas));
      canvasPF.renderAll();



      //ctxP.drawImage(
      //  sides[getSide(faces[modelType][i].name)].canvasSave, 0, 0, canvP.width, canvP.height
      //);

      pdf.addImage(canvP.toDataURL("image/png", 1.0), 'PNG', 0, 0, 297, 210);
    }
  }*/

  pdf.save("downloadNew.pdf");

}
