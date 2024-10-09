const { PDFViewer } = require("../../dist/PDFViewer.mjs");

const viewer = new PDFViewer({
  container: document.getElementById("container"),
});

viewer.loadUrl("https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/examples/learning/helloworld.pdf");
