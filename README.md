# PDF Viewer by PDF Generator API

[PDFViewer](http://pdfviewer.com/) is a library to display and interact with PDF documents in web applications,
offering features such as document loading via URL and base64 encoded strings.

![PDF Viewer](https://pdfgeneratorapi-web-assets.s3.amazonaws.com/images/pdfviewer-example.png)

## Installing PDFViewer

### npm
    $ npm install pdf-generator-api-pdfviewer
### yarn
    $ yarn add pdf-generator-api-pdfviewer

## Using PDFViewer

### API
* `loadUrl(string)` - load PDF from an URL
* `loadBase64(string)` - load PDF from a base64 encoded string
* `setOptions(object)` - update options
  * `print`: boolean - enable print button
  * `download`: boolean - enable download button
  * `upload`: boolean - enable upload file button


### ECMAScript module

```javascript

import { PDFViewer } from "pdf-generator-api-pdfviewer";

const viewer = new PDFViewer({
  container: document.getElementById("viewer-container"),
});

viewer.loadUrl("https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/examples/learning/helloworld.pdf");
```

### CommonJS

```javascript
const { PDFViewer } = require("pdf-generator-api-pdfviewer");

const viewer = new PDFViewer({
  container: document.getElementById("viewer-container"),
});

viewer.loadUrl("https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/examples/learning/helloworld.pdf");
```

### CDN

```html
<div id="id"></div>
<script src="https://unpkg.com/pdf-generator-api-pdfviewer@latest/dist/PDFViewer.iife.js"></script>
<script>
  const { PDFViewer } = PDFGeneratorApi;

  const viewer = new PDFViewer({
    container: document.getElementById("id"),
  });

  viewer.loadUrl("https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/examples/learning/helloworld.pdf");
</script>
```

## Loading PDF documents

The PDF Viewer library loads documents from various sources:

+ **URL**

```typescript
const viewer = new PDFViewer({
  container: document.getElementById("viewer-container"),
})

viewer.loadUrl("https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/examples/learning/helloworld.pdf");
```

+ **Base64 Encoded String**

```typescript
const viewer = new PDFViewer({
  container: document.getElementById("viewer-container"),
})

const base64encodedPdf =
  "JVBERi0xLjcKCjEgMCBvYmogICUgZW50cnkgcG9pbnQKPDwKICAvVHlwZSAvQ2F0YWxvZwog" +
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
  container: document.getElementById("viewer-container") as HTMLElement,
})

viewer.setOptions({
  print: true,
  download: true,
  upload: true,
});
```

## Examples
Complete code examples can be found in the [examples folder](https://github.com/pdfgeneratorapi/pdfviewer/tree/main/examples).

 * [Webpack](https://github.com/pdfgeneratorapi/pdfviewer/tree/main/examples/webpack)
 * [Esbuild](https://github.com/pdfgeneratorapi/pdfviewer/tree/main/examples/esbuild)
 * [Rollup](https://github.com/pdfgeneratorapi/pdfviewer/tree/main/examples/rollup)
 * [Parcel](https://github.com/pdfgeneratorapi/pdfviewer/tree/main/examples/parcel)
 * [Browserify](https://github.com/pdfgeneratorapi/pdfviewer/tree/main/examples/browserify)

## Building PDF Viewer

To apply customization changes and build the library, run:

    $ npm run build


This will compile minified files in the `dist` directory.

## Contributing

PDFViewer is an open source project and always looking for more contributors.

## Issues

+ https://github.com/pdfgeneratorapi/pdfviewer/issues/new
