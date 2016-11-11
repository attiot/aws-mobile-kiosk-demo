const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const path = require("path");

const _root = path.resolve(__dirname);
function root(args) {
    args = Array.prototype.slice.call(arguments, 0);
    return path.join.apply(path, [_root].concat(args));
}

const devtool = process.env.DEVTOOL || "cheap-module-eval-source-map";
const publicPath = process.env.PUBLIC_PATH || "http://localhost:8080/";

let filename = "[name].js";
let chunkFilename = "[id].chunk.js";
let devServer = {};

const plugins = [
    new webpack.optimize.CommonsChunkPlugin({
        name: ["app", "vendor", "polyfills"]
    }),

    new HtmlWebpackPlugin({
        template: "app/index.html"
    }),

    new webpack.DefinePlugin({
        'process.env': JSON.stringify(process.env),
    }),

    new webpack.ContextReplacementPlugin(
        /angular(\\|\/)core(\\|\/)(esm(\\|\/)src|src)(\\|\/)linker/,
        __dirname
    ),

    new CopyWebpackPlugin([{
        from: "assets",
        to: "assets",
    }]),
];

if (process.env.MINIFY) {
    plugins.push(
        new webpack.NoErrorsPlugin(),
        new webpack.optimize.UglifyJsPlugin({mangle: {keep_fnames: true}})
    );
}

if (process.env.HASH_FILES) {
    filename = "[name].[hash].js";
    chunkFilename = "[name].[hash].js";
    plugins.push(new ExtractTextPlugin("[name].[hash].css"));
}
else {
    plugins.push(new ExtractTextPlugin("[name].css"));
}


if (process.env.DEV_SERVER) {
    devServer = {
        historyApiFallback: true,
        stats: "minimal"
    };
}

module.exports = {
    devtool,
    output: {
        path: root("dist"),
        publicPath,
        filename,
        chunkFilename,
    },
    entry: {
        "polyfills": "./app/polyfills.ts",
        "vendor": "./app/vendor.ts",
        "app": "./app/main.ts"
    },
    resolve: {
        extensions: [".js", ".ts"],
        alias: {
            "querystring": "querystring-browser",
        },
    },
    module: {
        loaders: [
            {
                test: /\.json$/,
                loader: "json"
            },
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
                loader: ExtractTextPlugin.extract({fallbackLoader: "style", loader: "css?sourceMap"})
            },
            {
                test: /\.css$/,
                include: root("src", "app"),
                loader: "raw"
            },
        ]
    },

    plugins,
    devServer,
};

