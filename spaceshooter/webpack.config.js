const webpack = require('webpack')
const path = require('path')

module.exports = {
  context: path.resolve(__dirname, 'src'),
  entry: './js/app.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  devtool: 'source-map',
  devServer: {
    contentBase: 'dist',
    inline: true
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: [/node_modules/],
      use: [{
        loader: 'babel-loader',
        options: {
          presets: [
            ['es2015', { modules: false }]
          ]
        }
      }]
    }]
  }
}
