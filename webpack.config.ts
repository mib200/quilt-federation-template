import path from "path";
import { Configuration } from "webpack";
import TerserWebpackPlugin from "terser-webpack-plugin";
const ModuleFederationPlugin =
  require("webpack").container.ModuleFederationPlugin;
const tailwindcss = require("tailwindcss");
import autoprefixer from "autoprefixer";
import HtmlWebpackPlugin from "html-webpack-plugin";
import "webpack-dev-server";

const config: Configuration = {
  entry:
    process.env.NODE_ENV == "production" ? "./src/main.ts" : "./src/index.tsx",
  mode: process.env.NODE_ENV == "production" ? "production" : "development",
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-typescript"],
            plugins: [
              [
                "@babel/plugin-transform-react-jsx",
                {
                  throwIfNamespace: false,
                  runtime: "automatic",
                  importSource: "preact",
                },
              ],
              [
                "@babel/plugin-transform-runtime",
                {
                  regenerator: true,
                },
              ],
              "@babel/plugin-syntax-dynamic-import",
            ],
          },
        },
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: "style-loader",
          },
          {
            loader: "css-loader",
            options: {
              modules: { auto: true },
            },
          },
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [[autoprefixer], [tailwindcss]],
              },
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".jsx", ".ts", ".js"],
  },
  devtool: undefined,
  optimization: {
    minimize: true,
    minimizer: [new TerserWebpackPlugin()],
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
    chunkFilename: "[name].[hash].js",
    publicPath: "auto",
  },
  plugins:
    process.env.NODE_ENV == "production"
      ? [
          new ModuleFederationPlugin({
            name: "federation_template",
            filename: "remoteEntry.js",
            exposes: {
              "./loadApp": "./src/main.ts",
            },
          }),
        ]
      : [new HtmlWebpackPlugin()],
  devServer: {
    static: {
      directory: "./dist",
      publicPath: "auto",
    },
    historyApiFallback: true,
    open: true,
  },
};

export default config;
