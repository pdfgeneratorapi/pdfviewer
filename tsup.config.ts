import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/PDFViewer.ts"],
  outDir: "dist",
  outExtension({ format }) {
    switch (format) {
      case "cjs":
        return { js: ".cjs" };
      case "esm":
        return { js: ".mjs" };
      case "iife":
        return { js: ".iife.js" };
      default:
        return {};
    }
  },
  format: ["cjs", "esm", "iife"],
  splitting: false,
  bundle: true,
  minify: true,
  dts: true,
  loader: {
    ".html": "text",
    ".css": "text",
    ".mjs": "text",
  },
});
