interface PDFViewerParams {
    readonly container: HTMLElement;
    options?: PDFViewerOptions | undefined;
}
declare enum PDFViewerThemes {
    Light = "light",
    Dark = "dark",
    PDFApi = "pdfapi"
}
interface PDFViewerOptions {
    readonly theme: PDFViewerThemes;
    readonly print: boolean;
    readonly download: boolean;
    readonly upload: boolean;
}
declare class PDFViewer {
    private readonly container;
    /**
     * Default settings
     */
    private options;
    /**
     * Iframe window internal ID
     */
    protected iframeId: string;
    constructor(params: PDFViewerParams);
    /**
     * Sets application settings
     *
     * @param options - PDFViewerOptions
     */
    setOptions: (options: PDFViewerOptions) => void;
    /**
     * Loads a document via a URL
     *
     * @param url - string
     */
    loadUrl: (url: string) => Promise<void>;
    /**
     * Loads a document that is base64 encoded
     *
     * @param encodedPdf
     */
    loadBase64: (encodedPdf: string) => Promise<void>;
    /**
     * Renders a PDF document using the PDF.js API
     *
     * @param documentParams
     */
    private render;
    /**
     * Applies global settings
     */
    private applyOptions;
    /**
     * UI initialization
     */
    private initUI;
    /**
     * Style loader
     *
     * @param document - Document
     */
    private loadStyles;
    /**
     * Script loader
     *
     * @param document - Document
     */
    private loadScripts;
    /**
     * Returns PDF.js application
     */
    private pdfJsApplication;
}

export { PDFViewer, type PDFViewerOptions, type PDFViewerParams, PDFViewerThemes };
