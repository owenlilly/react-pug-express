const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const config = {
  context: path.resolve(__dirname, 'public/src'),
  entry: {
    home: './pages/home/index.js'
  },
  output: {
    path: path.resolve(__dirname, 'public', 'js'),
    filename: '[name].bundle.js',
    sourceMapFilename: '[name].js.map'
  },
  plugins: [
    new CleanWebpackPlugin(['public/js'])
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['env', 'react', 'stage-2']
        }
      },
      {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader' ]
      }
    ]
  }
};

module.exports = config;
