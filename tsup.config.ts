import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/PDFViewer.ts"],
  outDir: "dist",
  format: ["cjs", "esm", "iife"],
  splitting: false,
  bundle: true,
  dts: true,
  loader: {
    ".html": "text",
    ".css": "text",
    ".mjs": "text",
  },
});
