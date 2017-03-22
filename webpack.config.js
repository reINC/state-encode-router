module.exports = {
  entry: './src/index.es',
  output: {
    path: __dirname + '/dist',
    filename: 'index.js',
    library: 'StateEncodeRouter',
    libraryTarget: 'umd',
  },
  module: {
    loaders: [
      { test: /\.es$/, loader: "babel-loader" },
    ],
  },
};
