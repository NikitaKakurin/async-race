const path = require('path');
const { merge } = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const Dotenv = require('dotenv-webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const postcssPresetEnv = require('postcss-preset-env');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

let mode = 'development';
if (process.env.Node_ENV === 'production') {
  mode = 'production';
}
console.log(`${mode} mode`);
const filename = (ext) => (mode === 'production' ? `[name].${ext}` : `[name].${ext}`);

const optimization = function () {
  const config = {
    splitChunks: {
      chunks: 'all',
    },
    minimize: false,
    minimizer: [],
  };

  if (mode === 'production') {
    config.minimize = true;
    config.minimizer = [new TerserPlugin(), new CssMinimizerPlugin()];
  }
  return config;
};

const choseModeCss = function () {
  return mode === 'development' ? 'style-loader' : MiniCssExtractPlugin.loader;
};

const cssLoaders = (extra) => {
  const loaders = [
    {
      loader: choseModeCss(),
    },
    'css-loader',
    {
      loader: 'postcss-loader',
      options: {
        postcssOptions: {
          plugins: [[postcssPresetEnv({ browsers: '>0.2%, last 2 versions, not dead' })]],
        },
      },
    },
  ];
  if (extra) {
    loaders.push(extra);
  }
  return loaders;
};

const baseConfig = {
  entry: path.resolve(__dirname, './src/index.ts'),
  optimization: optimization(),
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.html$/i,
        loader: 'html-loader',
      },
      {
        test: /\.s[ac]ss$/i,
        use: cssLoaders('sass-loader'),
      },
      {
        test: /\.css$/i,
        use: cssLoaders(),
      },
      {
        test: /\.(mp3|wav)$/,
        type: 'asset/resource',
      },
      {
        test: /\.(png|jpeg|jpg|svg|gif)$/,
        type: 'asset/resource',
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    assetModuleFilename: 'assets/[name][ext][query]',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './src/index.html'),
      filename: 'index.html',
    }),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: filename('css'),
    }),
    new Dotenv(),
  ],
};

module.exports = ({ mode }) => {
  const isProductionMode = mode === 'prod';
  const envConfig = isProductionMode ? require('./webpack.prod.config') : require('./webpack.dev.config');

  return merge(baseConfig, envConfig);
};
