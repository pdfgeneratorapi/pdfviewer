interface PDFViewerParams {
    readonly container: HTMLElement;
    options?: PDFViewerOptions | undefined;
}
interface PDFViewerOptions {
    readonly print: boolean;
    readonly download: boolean;
    readonly upload: boolean;
}
declare class PDFViewer {
    private readonly container;
    protected options?: PDFViewerOptions | undefined;
    constructor(params: PDFViewerParams);
    setOptions: (options: PDFViewerOptions) => void;
    loadUrl: (url: string) => Promise<void>;
    loadBase64: (encodedPdf: string) => Promise<void>;
    private render;
    private loadStyles;
    private loadScripts;
}

export { PDFViewer, type PDFViewerOptions, type PDFViewerParams };
