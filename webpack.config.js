// NOTE: To use this example standalone (e.g. outside of deck.gl repo)
// delete the local development overrides at the bottom of this file

const webpack = require('webpack');

const CONFIG = {
  mode: 'development',

  entry: {
    app: './src/app.js'
  },

  output: {
    library: 'App'
  },

  module: {
    rules: [
      {
        // Transpile ES6 to ES5 with babel
        // Remove if your app does not use JSX or you don't need to support old browsers
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: [/node_modules/],
        options: {
          presets: ['@babel/preset-react']
        }
      },
      {
        test: /\.csv$/,
        loader: 'csv-loader',
        options: {
          dynamicTyping: true,
          header: true,
          skipEmptyLines: true
        }
      },
      {
        test: /\.css$/,
        use: 'css-loader'
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          'style-loader',
          // Translates CSS into CommonJS
          'css-loader',
          // Compiles Sass to CSS
          'sass-loader',
        ],
      },
    ]
  },

  devServer: {
    port: 9001
  },

  // Optional: Enables reading mapbox token from environment variable
  plugins: [new webpack.EnvironmentPlugin({
    'MapboxAccessToken': "pk.eyJ1IjoiYmVsb3BvdCIsImEiOiJjazZzMjB4ZjQwYzhwM2xzNTVkcHBudTY4In0.FbuCqIEfhgMN3d02eZQ4hQ",
    'MapboxStyle': "mapbox://styles/belopot/ckbt1oxxw0gjr1jlahbsj7c3s"
  })]
};

// This line enables bundling against src in this repo rather than installed module
module.exports = env => (env ? require('../../webpack.config.local')(CONFIG)(env) : CONFIG);
