const path = require("path");

module.exports = {
    mode: "production",
    context: __dirname,
    entry: "./index.js",
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "dist"),
    },
    resolve: {
        extensions: [".js"],
    },
};
