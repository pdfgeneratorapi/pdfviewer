interface PDFViewerParams {
    readonly container: HTMLElement;
    options?: PDFViewerOptions | undefined;
}
declare enum Theme {
    Light = "light",
    Dark = "dark",
    PDFApi = "pdfapi"
}
declare enum Scale {
    AutomaticZoom = "auto",
    ActualSize = "page-actual",
    PageFit = "page-fit",
    PageWidth = "page-width"
}
type ToolbarIconSize = 16 | 24 | 32 | 48;
type ToolbarFontSize = NumericRange<10, 24>;
type NumericRange<Start extends number, End extends number, Arr extends unknown[] = [], Acc extends number = never> = Arr['length'] extends End ? Acc | Start | End : NumericRange<Start, End, [...Arr, 1], Arr[Start] extends undefined ? Acc : Acc | Arr['length']>;
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

export { PDFViewer, type PDFViewerOptions, type PDFViewerParams, Scale, Theme, type ToolbarFontSize, type ToolbarIconSize };
