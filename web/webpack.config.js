const WasmPackPlugin = require("@wasm-tool/wasm-pack-plugin")
const path = require("path")
const { TsconfigPathsPlugin } = require("tsconfig-paths-webpack-plugin")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const webpack = require("webpack")

const dist = path.resolve(__dirname, "dist")

const [author, email] = require("../package.json").author.split(/s+/)

const envs = new webpack.DefinePlugin({
    "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV || "production"),
    "process.env.NAME": JSON.stringify(require("../package.json").name),
    "process.env.VERSION": JSON.stringify(require("../package.json").version),
    "process.env.AUTHOR": JSON.stringify(author),
    "process.env.EMAIL": JSON.stringify(email.substring(1, email.length - 1)),
})

/**
 * @type {import('webpack').Configuration}
 */
module.exports = {
    mode: "development",
    entry: "./src/index.tsx",
    experiments: {
        syncWebAssembly: true,
        topLevelAwait: true,
    },
    output: {
        filename: "[name].js",
        path: dist,
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: "ts-loader",
                options: {
                    transpileOnly: true,
                },
                exclude: /dist/,
            },
        ],
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js"],
        plugins: [new TsconfigPathsPlugin()],
    },
    devServer: {
        contentBase: dist,
        open: true,
        port: 3000,
    },
    plugins: [
        new HtmlWebpackPlugin({ template: "./public/index.html" }),
        new WasmPackPlugin({
            crateDirectory: path.resolve(__dirname, "../crate"),
            outDir: path.resolve(__dirname, "./src/crate"),
        }),
        envs,
    ],
}
