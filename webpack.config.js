// webpack.config.js
const path = require("path");

module.exports = {
  entry: "./js/index.js",
  output: {
    path: path.resolve(__dirname, "_site/dist/"),
    filename: "bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          "style-loader", {
            loader: "css-loader", options: {
               importLoaders: 1
            } 
          },
          "postcss-loader",
        ],
      },
    ],
  },
}