import htmlContent from "./viewer.html";
import pdfjsStyles from "./viewer.css";
import pdfjsViewer from "./viewer.mjs";
import pdfjsLib from "../dist/pdf.min.mjs";

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
  togglePrinting(value: boolean): void;
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
    // if (this.container instanceof Element) {
    //   throw new Error(`PDFViewer error: Element .`);
    // }

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
    try {
      await this.getPDFJsApplication().open({ url: pdf });
    } catch (e) {
      console.error("PDFViewer error: PDF document can not be loaded - " + e);
      alert("Corrupted PDF file.");
    }
  };

  private loadStyles = (document: Document): void => {
    const stylesElement = document.createElement('style');
    stylesElement.textContent = pdfjsStyles;
    document.head.appendChild(stylesElement);
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

  private getPDFJsApplication = (): PDFViewerApplication => {
    const viewerContainer = document.getElementById(this.iframeId) as HTMLIFrameElement;

    if (!viewerContainer) {
      throw new Error(`PDFViewer error: iframe container ${this.iframeId} not found.`);
    }

    const viewerWindow = viewerContainer.contentWindow as IframeWindow;

    if (!viewerWindow) {
      throw new Error(`PDFViewer error: iframe window is corrupted.`);
    }

    return viewerWindow.PDFViewerApplication;
  };
}

(window as any).PDFViewer = PDFViewer;
