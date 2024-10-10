import { PDFViewer } from "pdf-generator-api-pdfviewer";

const viewer = new PDFViewer({
  container: document.getElementById("container") as HTMLElement,
});

viewer.loadUrl("https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/examples/learning/helloworld.pdf");
