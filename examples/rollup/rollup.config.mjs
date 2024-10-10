import { defineConfig } from "rollup";
import typescript from "@rollup/plugin-typescript";
import resolve from "@rollup/plugin-node-resolve";

export default defineConfig({
    input: "index.ts",
    output: {
        file: "dist/bundle.js",
        format: "es",
        sourcemap: true,
    },
    plugins: [
        typescript(),
        resolve(),
    ],
});
