import htmlContent from "./viewer.html";
import pdfjsStyles from "./viewer.css";
import pdfjsViewer from "./viewer.mjs";
import pdfjsLib from "./pdf.min.mjs";
import pdfjsWorker from "./pdf.worker.min.mjs";
import pdfjsSandbox from "./pdf.sandbox.min.mjs";

interface PDFViewerParams {
  readonly container: HTMLElement;
  options?: PDFViewerOptions | undefined;
}

enum Theme {
  Light = "light",
  Dark = "dark",
  PDFApi = "pdfapi",
}

enum Scale {
  AutomaticZoom = "auto",
  ActualSize = "page-actual",
  PageFit = "page-fit",
  PageWidth = "page-width",
}

type ToolbarIconSize = 16 | 24 | 32 | 48;
type ToolbarFontSize = NumericRange<10, 24>;

type NumericRange<
  Start extends number,
  End extends number,
  Arr extends unknown[] = [],
  Acc extends number = never
> = Arr['length'] extends End
  ? Acc | Start | End
  : NumericRange<Start, End, [...Arr, 1], Arr[Start] extends undefined ? Acc : Acc | Arr['length']>


interface PDFViewerOptions {
  readonly theme: Theme;
  readonly initialScale: Scale | number;
  readonly toolbarFontSize: ToolbarFontSize;
  readonly toolbarIconSize: ToolbarIconSize;
  readonly scaleDropdown: boolean;
  readonly search: boolean;
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
  setTheme(theme: Theme): void;
  setInitialScale(scale: Scale | number): void;
  setToolbarFontSize(fontSize: ToolbarFontSize): void;
  setToolbarIconSize(iconSize: ToolbarIconSize): void;
  showScaleDropdown(): void;
  hideScaleDropdown(): void;
  enableTextSearch(): void;
  disableTextSearch(): void;
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
   * The iframe window internal ID
   */
  private iframeId: string = "";

  /**
   * The iframe state
   */
  private isIframeLoaded: boolean = false;

  /**
   * Interval (in milliseconds) for checking the iframe loading state
   */
  private readonly LOADING_INTERVAL: number = 100;

  /**
   * Default settings
   */
  private options: PDFViewerOptions = {
    theme: Theme.Light,
    initialScale: Scale.PageFit,
    toolbarFontSize: 16,
    toolbarIconSize: 24,
    scaleDropdown: true,
    search: true,
    print: true,
    download: true,
    upload: true,
  };

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
   * @param encodedPdf - string
   */
  public loadBase64 = async (encodedPdf: string): Promise<void> => {
    await this.render({ data: window.atob(encodedPdf) });
  };

  /**
   * Renders a PDF document using the PDF.js API
   *
   * @param documentParams - OpenDocumentParams
   */
  private render = async (documentParams: OpenDocumentParams): Promise<void> => {
    const checkLoadingInterval = setInterval(async () => {
      if (this.isIframeLoaded) {
        clearInterval(checkLoadingInterval);

        const pdfjsApp = await this.pdfJsApplication();

        try {
          await pdfjsApp.open(documentParams);
        } catch (error) {
          throw new Error(`PDFViewer error: PDF document can not be loaded - ${error}`);
        }
      }
    }, this.LOADING_INTERVAL);
  };

  /**
   * Applies global settings
   */
  private applyOptions = async (): Promise<void> => {
    const pdfjsApp = await this.pdfJsApplication();

    pdfjsApp.setTheme(this.options.theme);
    pdfjsApp.setInitialScale(this.options.initialScale);
    pdfjsApp.setToolbarFontSize(this.options.toolbarFontSize);
    pdfjsApp.setToolbarIconSize(this.options.toolbarIconSize);

    this.options.scaleDropdown ? pdfjsApp.showScaleDropdown() : pdfjsApp.hideScaleDropdown();
    this.options.search ? pdfjsApp.enableTextSearch() : pdfjsApp.disableTextSearch();
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
      this.isIframeLoaded = true;
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
    [pdfjsLib, pdfjsWorker, pdfjsSandbox, pdfjsViewer].forEach((script, key) => {
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

export { PDFViewer, PDFViewerOptions, PDFViewerParams, Scale, Theme, ToolbarFontSize, ToolbarIconSize };
