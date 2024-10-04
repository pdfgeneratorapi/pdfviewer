import type { PDFViewer } from "./PDFViewer";

declare global {
  interface Window {
    PDFViewer: typeof PDFViewer;
  }

  declare module "*.html"
  declare module "*.mjs"
  declare module "*.css"
  declare module "*.json"
}
