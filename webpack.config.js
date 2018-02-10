const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const DirectoryNamedWebpackPlugin = require('directory-named-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');


const config = {
  entry: {
    main: [
      'babel-polyfill',
      './src/main.jsx'
    ]
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    filename: '[name].[hash].js',
    chunkFilename: '[id].js'
  },
  devServer: {
    historyApiFallback: true
  },
  cache: true,
  devtool: false,
  stats: {
    colors: true,
    reasons: true
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      'images': path.join(__dirname, '/src/images'),
      'store': path.join(__dirname, '/src/store/'),
      'selectors': path.join(__dirname, '/src/selectors/'),
      'reducers': path.join(__dirname, '/src/reducers/'),
      'actions': path.join(__dirname, '/src/actions/'),
      'views': path.join(__dirname, '/src/views/'),
      'lib': path.join(__dirname, '/src/lib/'),
      'img': path.join(__dirname, '/src/img/'),
      'services': path.join(__dirname, '/src/services/'),
      'routes': path.join(__dirname, '/src/routes/'),
      'meta': path.join(__dirname, '/src/meta/')
    },
    plugins: [
      new DirectoryNamedWebpackPlugin({
        exclude: /node_modules/,
        include: [
          path.resolve('./src/')
        ],
        transformFn: function(dirName) {
          return `${dirName}.jsx`;
        }
      })
    ]
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['env', 'react']
            }
          }
        ]
      },
      {
        test: /\.css$/,
        exclude: [/\.x\.css$/, /node_modules/],
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader',
            options: {
              modules: true,
              sourceMap: true,
              importLoaders: 1,
              localIdentName: '[name]_[local]_[hash:base64:5]'
            }
          },
          {
            loader: 'postcss-loader'
          }
        ]
      },
      {
        test: /\.css$/,
        include: [/node_modules/],
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader'
          }
        ]
      },
      {
        test: /meta\/.+\.(ico|png|json|txt|svg|xml)?$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]'
        }
      },
      {
        test: /\.(png|jpg|gif)$/,
        exclude: [/meta.+/],
        loader: 'url-loader',
        options: {
          limit: 8192
        }
      },
      {
        test: /\.woff(2)?(\?.*)?$/,
        loader: 'file-loader'
      },
      {
        test: /\.(ttf|eot|svg)(\?.*)?$/,
        loader: 'file-loader'
      },
      {
        test: /\.(html|txt|ico)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]'
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.ejs'
    })
  ]
};


if (process.env.npm_lifecycle_event === 'build') {
  [1, 2].forEach(i => {
    config.module.rules[i].use = ExtractTextPlugin.extract({
      fallback: 'style-loader',
      use: config.module.rules[i].use.slice(1)
    });
  });
  config.plugins = config.plugins.concat([
    new ExtractTextPlugin('[name].[contenthash].css'),
    new CleanWebpackPlugin(['dist']),
    new webpack.DefinePlugin({
      'process.env':{
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true
    }),
    new webpack.optimize.AggressiveMergingPlugin()
  ]);
} else {
  config.plugins = config.plugins.concat([
    new BrowserSyncPlugin(
      {
        host: 'localhost',
        port: 9000,
        // proxy the Webpack Dev Server endpoint
        // (which should be serving on http://localhost:8080/)
        // through BrowserSync
        proxy: 'http://localhost:8080/'
      },
      // plugin options
      {
        // prevent BrowserSync from reloading the page
        // and let Webpack Dev Server take care of this
        reload: false
      }
    )
  ]);
}

module.exports = config;
