module.exports = {
    entry: {
        index: "./index.js",
        "update-device-shadow": "./update-device-shadow.js",
    },
    output: {
        path: "./lib",
        filename: "[name].js",
        libraryTarget: "commonjs2"
    },
    module: {
        noParse: [
            /node_modules/
        ],
        loaders: [
            {
                test: /\.js$/,
                loader: "babel",
                exclude: [/node_modules/]
            },
        ]
    },
};
