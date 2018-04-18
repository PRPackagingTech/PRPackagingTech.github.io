/*var canvasPDF = document.getElementById("pdfCanvas");
canvasPDF.width = 544;
canvasPDF.height = 349;
var ctxPDF = canvasPDF.getContext("2d");*/

var canvasPDF = new fabric.Canvas("pdfCanvas", {
  width: 544 * (96 / 72),// 11.81,
  height: 349 * (96 / 72),// 11.81,
  selectionColor: 'blue',
  selectionLineWidth: 2,
  preserveObjectStacking: true
});

//Setting the background colour of the canvas
canvasPDF.setBackgroundColor("rgb(100, 100, 100)");
canvasPDF.renderAll();

function downloadPDF(){

  var pdf = new jsPDF('l', 'mm', [544, 349]);

  pdf.addImage(canvasPDF.toDataURL("image/jpeg", 1.0), 'JPEG', 0, 0);
  pdf.save("download.pdf");

}
