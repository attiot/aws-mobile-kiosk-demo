const nodeExternals = require("webpack-node-externals");

module.exports = {
    entry: "./index.js",
    target: "node",
    output: {
        path: "./lib",
        filename: "index.js",
        libraryTarget: "commonjs2"
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: "babel",
            },
        ],
    },
    externals: [nodeExternals()],
};
