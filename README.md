# PDF viewer by PDF Generator API

[PDFViewer](http://pdfviewer.com/) is a library to display and interact with PDF documents in web applications, 
offering features such as document loading via URL or base64 encoded strings.

## Installing PDFViewer

### npm
    $ npm install pdfgeneratorapi/pdfviewer
### yarn
    $ yarn add pdfgeneratorapi/pdfviewer

## Using PDFViewer

### Inline

```html
<div id="id"></div>
<script src="./dist/PDFViewer.global.js"></script>
<script>
    const viewer = new PDFViewer({
        container: document.getElementById("id"),
    });

    viewer.loadUrl("https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/examples/learning/helloworld.pdf");
</script>
```

### CommonJS

```javascript
const { PDFViewer } = require("pdf-generator-api-pdfviewer");

const viewer = new PDFViewer({
  container: document.getElementById("id"),
});
```

### ES Module

```javascript
import { PDFViewer } from "pdf-generator-api-pdfviewer";

const viewer = new PDFViewer({
  container: document.getElementById("id"),
});
```

### Typescript

```typescript
import { PDFViewer } from "pdf-generator-api-pdfviewer";

const viewer = new PDFViewer({
  container: document.getElementById("id") as HTMLElement,
});
```

## Loading PDF documents

The PDF Viewer library loads documents from various sources:

+ **URL**

```typescript
const viewer = new PDFViewer({
  container: document.getElementById("id"),
})

viewer.loadUrl("https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/examples/learning/helloworld.pdf");
```

+ **Base64 Encoded String**

```typescript
const viewer = new PDFViewer({
  container: document.getElementById("id"),
})

const base64encodedPdf = "JVBERi0xLjcKCjEgMCBvYmogICUgZW50cnkgcG9pbnQKPDwKICAvVHlwZSAvQ2F0YWxvZwog" +
  "IC9QYWdlcyAyIDAgUgo+PgplbmRvYmoKCjIgMCBvYmoKPDwKICAvVHlwZSAvUGFnZXMKICAv" +
  "TWVkaWFCb3ggWyAwIDAgMjAwIDIwMCBdCiAgL0NvdW50IDEKICAvS2lkcyBbIDMgMCBSIF0K" +
  "Pj4KZW5kb2JqCgozIDAgb2JqCjw8CiAgL1R5cGUgL1BhZ2UKICAvUGFyZW50IDIgMCBSCiAg" +
  "L1Jlc291cmNlcyA8PAogICAgL0ZvbnQgPDwKICAgICAgL0YxIDQgMCBSIAogICAgPj4KICA+" +
  "PgogIC9Db250ZW50cyA1IDAgUgo+PgplbmRvYmoKCjQgMCBvYmoKPDwKICAvVHlwZSAvRm9u" +
  "dAogIC9TdWJ0eXBlIC9UeXBlMQogIC9CYXNlRm9udCAvVGltZXMtUm9tYW4KPj4KZW5kb2Jq" +
  "Cgo1IDAgb2JqICAlIHBhZ2UgY29udGVudAo8PAogIC9MZW5ndGggNDQKPj4Kc3RyZWFtCkJU" +
  "CjcwIDUwIFRECi9GMSAxMiBUZgooSGVsbG8sIHdvcmxkISkgVGoKRVQKZW5kc3RyZWFtCmVu" +
  "ZG9iagoKeHJlZgowIDYKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDEwIDAwMDAwIG4g" +
  "CjAwMDAwMDAwNzkgMDAwMDAgbiAKMDAwMDAwMDE3MyAwMDAwMCBuIAowMDAwMDAwMzAxIDAw" +
  "MDAwIG4gCjAwMDAwMDAzODAgMDAwMDAgbiAKdHJhaWxlcgo8PAogIC9TaXplIDYKICAvUm9v" +
  "dCAxIDAgUgo+PgpzdGFydHhyZWYKNDkyCiUlRU9G";

viewer.loadBase64(base64encodedPdf);
```

## Available options
- **Print**: boolean
- **Download**: boolean
- **Upload**: boolean

```typescript
import { PDFViewer } from "pdf-generator-api-pdfviewer";

const viewer = new PDFViewer({
  container: document.getElementById("id") as HTMLElement,
})

viewer.setOptions({
  print: true,
  download: true,
  upload: true,
});
```

## Contributing

PDFViewer is an open source project and always looking for more contributors.

## Issues

+ https://github.com/pdfgeneratorapi/pdfviewer/issues/new
