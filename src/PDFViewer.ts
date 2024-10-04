import htmlContent from "./viewer.html";
import pdfjsStyles from "./viewer.css";
import pdfjsViewer from "./viewer.mjs";
import pdfjsLib from "../dist/pdf.min.mjs";
import pdfjsWorker from "../dist/pdf.worker.min.mjs";

interface PDFViewerParams {
  readonly container: HTMLElement;
  options?: PDFViewerOptions | undefined;
}

interface PDFViewerOptions {
  readonly print: boolean;
  readonly download: boolean;
  readonly upload: boolean;
}

interface OpenDocumentParams {
  url?: string | undefined;
  data?: string | undefined;
}

interface PDFViewerApplication {
  open(params: OpenDocumentParams): Promise<void>;
  enablePrinting(): void;
  disablePrinting(): void;
  enableDownloading(): void;
  disableDownloading(): void;
  enableUploading(): void;
  disableUploading(): void;
}

interface IframeWindow extends Window {
  document: Document;
  PDFViewerApplication: PDFViewerApplication;
}

class PDFViewer {
  private readonly container: HTMLElement;
  protected iframeId: string = "";

  constructor(params: PDFViewerParams) {
    this.container = params.container;
    this.initUI();

    if (params.options) {
      this.setOptions(params.options);
    }
  }

  public setOptions = async (options: PDFViewerOptions): Promise<void> => {
    const pdfjsApp = await this.pdfJsApplication();

    options.print ? pdfjsApp.enablePrinting() : pdfjsApp.disablePrinting();
    options.download ? pdfjsApp.enableDownloading() : pdfjsApp.disableDownloading();
    options.upload ? pdfjsApp.enableUploading() : pdfjsApp.disableUploading();
  };

  public loadUrl = async (url: string): Promise<void> => {
    const response = await fetch(url);
    const blob = await response.blob();

    await this.render({ url: URL.createObjectURL(blob) });
  };

  public loadBase64 = async (encodedPdf: string): Promise<void> => {
    await this.render({ data: window.atob(encodedPdf) });
  };

  private render = async (documentParams: OpenDocumentParams): Promise<void> => {
    const pdfjsApp = await this.pdfJsApplication();

    try {
      await pdfjsApp.open(documentParams);
    } catch (error) {
      throw new Error(`PDFViewer error: PDF document can not be loaded - ${error}`);
    }
  };

  private initUI = (): void => {
    if (!(this.container instanceof Element)) {
      throw new Error(`PDFViewer error: Wrong iframe container. Example: document.getElementById("#id").`);
    }

    const iframe = document.createElement("iframe") as HTMLIFrameElement;
    iframe.id = this.iframeId = `${this.container.id}-iframe`;
    this.container.appendChild(iframe);

    const iframeWindow = iframe.contentWindow;
    const iframeDocument = iframe.contentDocument || iframeWindow?.document;

    if (iframeDocument) {
      iframeDocument.open();
      iframeDocument.write(htmlContent);
      iframeDocument.close();

      this.loadStyles(iframeDocument);
      this.loadScripts(iframeDocument);
    }
  };

  private loadStyles = (document: Document): void => {
    const stylesElement = document.createElement('style');
    stylesElement.textContent = pdfjsStyles;
    document.head.appendChild(stylesElement);
  };

  private loadScripts = (document: Document): void => {
    [pdfjsLib, pdfjsWorker, pdfjsViewer].forEach((script) => {
      const scriptElement: HTMLScriptElement = document.createElement("script");
      scriptElement.type = "module";
      scriptElement.defer = true;
      scriptElement.textContent = script;
      document.body.appendChild(scriptElement);
    });
  };

  private pdfJsApplication = (): Promise<PDFViewerApplication> => {
    return new Promise<PDFViewerApplication>(
      (resolve) => {
        setTimeout(() => {
          const viewerContainer = document.getElementById(this.iframeId) as HTMLIFrameElement;

          if (!viewerContainer) {
            throw new Error(`PDFViewer error: PDFViewer iframe "#${this.iframeId}" not found.`);
          }

          const viewerWindow = viewerContainer.contentWindow as IframeWindow;

          if (!viewerWindow) {
            throw new Error(`PDFViewer error: PDFViewer iframe "#${this.iframeId}" is corrupted.`);
          }

          resolve(viewerWindow.PDFViewerApplication);
        }, 200);
      }
    );
  };
}

window.PDFViewer = PDFViewer;
export { PDFViewerParams, PDFViewerOptions, PDFViewer };
