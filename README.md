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
  * `theme`: Theme - set viewer theme
  * `initialScale`: Scale - set initial page scale
  * `toolbarFontSize`: number - set toolbar font size
  * `toolbarIconSize`: number - set toolbar icon size
  * `scaleDropdown`: boolean - display scaling options
  * `search`: boolean - enable search button
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
<div id="viewer-container"></div>
<script src="https://unpkg.com/pdf-generator-api-pdfviewer@latest/dist/PDFViewer.iife.js"></script>
<script>
  const { PDFViewer } = PDFGeneratorApi;

  const viewer = new PDFViewer({
    container: document.getElementById("viewer-container"),
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
PDFViewer theme:
* **theme**: (`Theme.Light` | `Theme.Dark` | `Theme.PDFApi`)
  * *Default*: Theme.Light

Initial page scale:
* **initialScale**: (`Scale.AutomaticZoom` | `Scale.ActualSize` | `Scale.PageFit` | `Scale.PageWidth` | `number`)
  * *Default*: Scale.PageFit

Toolbar font size:
* **toolbarFontSize**: (`number`):
  * Ranged from 10 to 24
  * *Default*: 16

Toolbar icon size:
* **toolbarIconSize**: (`16` | `24` | `32` | `48`):
  * *Default*: 24

Page scale dropdown:
* **scaleDropdown**: (`boolean`):
  * *Default*: true

Searching:
* **search**: (`boolean`):
  * *Default*: true

Printing:
* **print**: (`boolean`):
  * *Default*: true

Downloading:
* **download**: (`boolean`):
  * *Default*: true

Uploading:
* **upload**: (`boolean`):
  * *Default*: true

```typescript
import { PDFViewer, Scale, Theme } from "pdf-generator-api-pdfviewer";

// Initialize options in the constructor
const viewer = new PDFViewer({
  container: document.getElementById("viewer-container") as HTMLElement,
  options: {
    theme: Theme.Light,
    initialScale: Scale.PageFit,
    toolbarFontSize: 16,
    toolbarIconSize: 24,
    scaleDropdown: true,
    search: true,
    print: true,
    download: true,
    upload: true,
  },
});

// Or set them using API function
viewer.setOptions({
  theme: Theme.Light,
  initialScale: Scale.PageFit,
  toolbarFontSize: 16,
  toolbarIconSize: 24,
  scaleDropdown: true,
  search: true,
  print: true,
  download: true,
  upload: true,
});
```

## Examples
Complete code examples can be found in the [examples folder](https://github.com/pdfgeneratorapi/pdfviewer/tree/main/examples).

 * [Webpack](https://github.com/pdfgeneratorapi/pdfviewer/tree/main/examples/webpack)
 * [ESBuild](https://github.com/pdfgeneratorapi/pdfviewer/tree/main/examples/esbuild)
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
