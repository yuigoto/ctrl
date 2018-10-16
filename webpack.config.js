const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const HtmlWebpack = new HtmlWebpackPlugin({
  template: path.join(__dirname, "examples/src/index.html"),
  filename: "./index.html"
});

module.exports = {
  entry: path.join(__dirname, "examples/src/index.js"),
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: "babel-loader",
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      }
    ]
  },
  plugins: [HtmlWebpack],
  resolve: {
    extensions: [".js", ".jsx"],
    modules: [path.resolve(__dirname, 'src'), 'node_modules']
  },
  devServer: {
    port: 3001
  }
};

console.log(path.resolve(__dirname, 'src'));
