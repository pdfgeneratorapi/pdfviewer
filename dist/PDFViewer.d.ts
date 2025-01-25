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
    private options;
    protected iframeId: string;
    constructor(params: PDFViewerParams);
    setOptions: (options: PDFViewerOptions) => void;
    loadUrl: (url: string) => Promise<void>;
    loadBase64: (encodedPdf: string) => Promise<void>;
    private render;
    private initUI;
    private loadStyles;
    private loadScripts;
    private pdfJsApplication;
}

export { PDFViewer, type PDFViewerOptions, type PDFViewerParams, PDFViewerThemes };
