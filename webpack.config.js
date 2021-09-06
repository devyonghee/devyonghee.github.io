const path = require("path");
const { WebpackManifestPlugin } = require("webpack-manifest-plugin");

const isProduction = process.env.NODE_ENV === "production";
module.exports = {
  mode: isProduction ? "production" : "development",
  entry: {
    application: "./javascripts/application.js",
    scrollappear: "./javascripts/scrollappear.js",
    themetoggle: "./javascripts/themetoggle.js",
  },
  output: {
    filename: isProduction ? "[name].[chunkhash].js" : "[name].js",
    path: path.resolve(__dirname, "assets/js"),
    publicPath: ""
  },
  plugins: [
    new WebpackManifestPlugin({
      fileName: path.resolve(__dirname, "_data/manifest.json")
    })
  ],
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  }
};