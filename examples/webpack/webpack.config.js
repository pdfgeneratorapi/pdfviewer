const path = require("path");

module.exports = {
    mode: "production",
    context: __dirname,
    entry: {
        "cjs": "./index.cjs",
        "esm": "./index.mjs"
    },
    output: {
        filename: "[name].bundle.js",
        path: path.resolve(__dirname, "dist"),
    },
    resolve: {
        extensions: [".js", ".mjs", ".cjs"],
    },
};
