const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const DirectoryNamedWebpackPlugin = require('directory-named-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');


const devMode = process.env.NODE_ENV !== 'production';

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
            loader: devMode ? 'style-loader' : MiniCssExtractPlugin.loader
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
            loader: devMode ? 'style-loader' : MiniCssExtractPlugin.loader
          },
          {
            loader: 'css-loader'
          }
        ]
      },
      {
        test: /meta\/.+\.(ico|png|txt|svg|xml)?$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]'
        }
      },
      {
        type: 'javascript/auto',
        test: /meta\/.+\.json$/,
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
    }),
    new MiniCssExtractPlugin({
      filename: devMode ? '[name].css' : '[name].[hash].css',
      chunkFilename: devMode ? '[id].css' : '[id].[hash].css'
    }),
    new webpack.DefinePlugin({
      'process.env':{
        'NODE_ENV': `"${process.env.NODE_ENV}"`
      }
    })
  ]
};

if (!devMode) {
  config.plugins = config.plugins.concat([
    new CleanWebpackPlugin(['dist'])
  ]);
}

module.exports = config;
