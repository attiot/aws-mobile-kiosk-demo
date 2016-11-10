const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const path = require("path");

const _root = path.resolve(__dirname, "..");
function root(args) {
    args = Array.prototype.slice.call(arguments, 0);
    return path.join.apply(path, [_root].concat(args));
}

module.exports = {
    devtool: "cheap-module-eval-source-map",

    output: {
        path: root("build"),
        publicPath: "http://localhost:8080",
        filename: "[name].js",
        chunkFilename: "[id].chunk.js"
    },

    entry: {
        "polyfills": "./app/polyfills.ts",
        "vendor": "./app/vendor.ts",
        "app": "./app/main.ts"
    },

    resolve: {
        extensions: ["", ".js", ".ts"]
    },

    module: {
        loaders: [
            {
                test: /\.ts$/,
                loaders: ["ts", "angular2-template-loader"]
            },
            {
                test: /\.html$/,
                loader: "html"
            },
            {
                test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)(\?v=\d+\.\d+\.\d+)?$/,
                loader: "file?name=assets/[name].[hash].[ext]"
            },
            {
                test: /\.css$/,
                exclude: root("src", "app"),
                loader: ExtractTextPlugin.extract("style", "css?sourceMap")
            },
            {
                test: /\.css$/,
                include: root("src", "app"),
                loader: "raw"
            },
        ]
    },

    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: ["app", "vendor", "polyfills"]
        }),

        new HtmlWebpackPlugin({
            template: "app/index.html"
        }),

        new ExtractTextPlugin("[name].css"),
    ],

    devServer: {
        historyApiFallback: true,
        stats: "minimal"
    }
};

