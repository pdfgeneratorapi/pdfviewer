import htmlContent from "./viewer.html";
import pdfjsStyles from "./viewer.css";
import pdfjsViewer from "./viewer.mjs";
import pdfjsLib from "../public/pdf.min.mjs";
import fortAwesomeStyles from "../node_modules/@fortawesome/fontawesome-free/css/all.min.css";

export interface PDFViewerParams {
  readonly container: HTMLElement;
  options?: PDFViewerOptions | undefined;
}

export interface PDFViewerOptions {
  readonly print: boolean;
  readonly download: boolean;
  readonly upload: boolean;
}

interface PDFViewerApplication {
  open(params: { url: string }): Promise<void>;
  disablePrinting(): void;
}

interface IframeWindow extends Window {
  document: Document;
  PDFViewerApplication: PDFViewerApplication;
}

export class PDFViewer {
  private readonly container: HTMLElement;
  protected iframeId: string = "";
  protected options?: PDFViewerOptions | undefined;

  constructor(params: PDFViewerParams) {
    this.container = params.container;
    this.options = params.options;
    this.initUI();
  }

  public setOptions = (options: PDFViewerOptions): void => {
    this.options = options;
  };

  public loadUrl = async (url: string): Promise<void> => {
    const response = await fetch(url);
    const blob = await response.blob();

    await this.render(URL.createObjectURL(blob));
  };

  public loadBase64 = async (encodedPdf: string): Promise<void> => {
    await this.render(encodedPdf);
  };

  private initUI = (): void => {
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

  private render = async (pdf: string): Promise<void> => {
    const viewerContainer = document.getElementById(this.iframeId) as HTMLIFrameElement;

    if (!viewerContainer) {
      throw new Error(`PDFViewer error: iframe container ${this.iframeId} not found.`);
    }

    const viewerWindow = viewerContainer.contentWindow as IframeWindow;

    if (!viewerWindow) {
      throw new Error(`PDFViewer error: iframe window is corrupted.`);
    }

    try {
      await viewerWindow.PDFViewerApplication.open({ url: pdf });
    } catch (e) {
      console.error("PDFViewer error: PDF document can not be loaded - " + e);
      alert("Corrupted PDF file.");
    }
  };

  private loadStyles = (document: Document): void => {
    [pdfjsStyles, fortAwesomeStyles].forEach((styles) => {
      const stylesElement = document.createElement('style');
      stylesElement.textContent = styles;
      document.head.appendChild(stylesElement);
    });
  };

  private loadScripts = (document: Document): void => {
    [pdfjsLib, pdfjsViewer].forEach((script) => {
      const scriptElement: HTMLScriptElement = document.createElement("script");
      scriptElement.type = "module";
      scriptElement.defer = true;
      scriptElement.textContent = script;
      document.body.appendChild(scriptElement);
    });
  };
}

(window as any).PDFViewer = PDFViewer;
