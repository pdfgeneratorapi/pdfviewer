import htmlContent from "./viewer.html";
import pdfjsStyles from "./viewer.css";
import pdfjsViewer from "./viewer.mjs";
import pdfjsLib from "./pdf.min.mjs";
import pdfjsWorker from "./pdf.worker.min.mjs";

interface PDFViewerParams {
  readonly container: HTMLElement;
  options?: PDFViewerOptions | undefined;
}

enum PDFViewerThemes {
  Light = "light",
  Dark = "dark",
  PDFApi = "pdfapi",
}

interface PDFViewerOptions {
  readonly theme: PDFViewerThemes;
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
  setTheme(theme: PDFViewerThemes): void;
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

  /**
   * Default settings
   */
  private options: PDFViewerOptions = {
    theme: PDFViewerThemes.Light,
    print: true,
    download: true,
    upload: true,
  };

  /**
   * Iframe window internal ID
   */
  protected iframeId: string = "";

  constructor(params: PDFViewerParams) {
    this.container = params.container;

    if (params.options) {
      this.setOptions(params.options);
    }

    try {
      this.initUI();
    } catch (error) {
      console.error(`PDFViewer initialization error: ${error}`);
    }
  }

  /**
   * Sets application settings
   *
   * @param options - PDFViewerOptions
   */
  public setOptions = (options: PDFViewerOptions): void => {
    this.options = { ...this.options, ...options };
  };

  /**
   * Loads a document via a URL
   *
   * @param url - string
   */
  public loadUrl = async (url: string): Promise<void> => {
    const response = await fetch(url);
    const blob = await response.blob();

    await this.render({ url: URL.createObjectURL(blob) });
  };

  /**
   * Loads a document that is base64 encoded
   *
   * @param encodedPdf
   */
  public loadBase64 = async (encodedPdf: string): Promise<void> => {
    await this.render({ data: window.atob(encodedPdf) });
  };

  /**
   * Renders a PDF document using the PDF.js API
   *
   * @param documentParams
   */
  private render = async (documentParams: OpenDocumentParams): Promise<void> => {
    const pdfjsApp = await this.pdfJsApplication();

    try {
      await pdfjsApp.open(documentParams);
    } catch (error) {
      throw new Error(`PDFViewer error: PDF document can not be loaded - ${error}`);
    }
  };

  /**
   * Applies global settings
   */
  private applyOptions = async (): Promise<void> => {
    const pdfjsApp = await this.pdfJsApplication();

    if (this.options.theme) {
      pdfjsApp.setTheme(this.options.theme);
    }

    this.options.print ? pdfjsApp.enablePrinting() : pdfjsApp.disablePrinting();
    this.options.download ? pdfjsApp.enableDownloading() : pdfjsApp.disableDownloading();
    this.options.upload ? pdfjsApp.enableUploading() : pdfjsApp.disableUploading();
  }

  /**
   * UI initialization
   */
  private initUI = (): void => {
    if (!(this.container instanceof Element)) {
      throw new Error(`PDFViewer error: Wrong iframe container. Example: document.getElementById("#id").`);
    }

    const iframe = document.createElement("iframe") as HTMLIFrameElement;
    iframe.id = this.iframeId = `${this.container.id}-iframe`;
    iframe.style.width = "100%";
    iframe.style.height = "100%";
    iframe.style.border = "none";
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

    iframe.addEventListener("load", async () => {
      await this.applyOptions();
    });
  };

  /**
   * Style loader
   *
   * @param document - Document
   */
  private loadStyles = (document: Document): void => {
    const stylesElement = document.createElement("style");
    stylesElement.textContent = pdfjsStyles;
    document.head.appendChild(stylesElement);
  };

  /**
   * Script loader
   *
   * @param document - Document
   */
  private loadScripts = (document: Document): void => {
    [pdfjsLib, pdfjsWorker, pdfjsViewer].forEach((script, key) => {
      const scriptElement: HTMLScriptElement = document.createElement("script");
      scriptElement.type = "module";
      scriptElement.defer = true;
      scriptElement.textContent = script;
      document.body.appendChild(scriptElement);
    });
  };

  /**
   * Returns PDF.js application
   */
  private pdfJsApplication = async (): Promise<PDFViewerApplication> => {
    return new Promise((resolve, reject) => {
      const viewerContainer = document.getElementById(this.iframeId) as HTMLIFrameElement;

      if (!viewerContainer) {
        reject(`PDFViewer error: PDFViewer iframe "#${this.iframeId}" not found.`);
      }

      const viewerWindow = viewerContainer.contentWindow as IframeWindow;

      if (!viewerWindow) {
        reject(`PDFViewer error: PDFViewer iframe "#${this.iframeId}" is corrupted.`);
      }

      resolve(viewerWindow.PDFViewerApplication);
    });
  };
}

export { PDFViewerParams, PDFViewerOptions, PDFViewerThemes, PDFViewer };
