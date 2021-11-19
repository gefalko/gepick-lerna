/* eslint-disable */
const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
const webpack = require('webpack')
const { CheckerPlugin } = require('awesome-typescript-loader')
const CompressionPlugin = require('compression-webpack-plugin')
const createStyledComponentsTransformer = require('typescript-plugin-styled-components').default
const paths = require('./paths')
const styledComponentsTransformer = createStyledComponentsTransformer()
const FaviconsWebpackPlugin = require('favicons-webpack-plugin')
const basePath = __dirname
const dotenv = require('dotenv')

dotenv.config({ path: '../../../.env' })

const isProduction = process.env.NODE_ENV === 'production'

console.log('isProduction', isProduction)

module.exports = function (env, arg) {
  const base = {
    context: path.join(basePath, 'src'),
    entry: ['./index.tsx'],
    output: {
      path: path.join(basePath, 'dist'),
      filename: '[name].bundle.js',
      chunkFilename: '[name].bundle.js',
      publicPath: '/',
    },
    module: {
      rules: [
        {
          test: /\.(graphql|gql)$/,
          exclude: /node_modules/,
          loader: 'graphql-tag/loader',
        },
        {
          test: /\.(tsx|ts)?$/,
          loader: 'awesome-typescript-loader',
          options: {
            transpileOnly: false,
            experimentalWatchApi: true,
            getCustomTransformers: () => ({
              before: [styledComponentsTransformer],
            }),
          },
        },
        {
          test: /\.js$/,
          use: ['source-map-loader'],
          enforce: 'pre',
        },
        {
          test: /\.css$/i,
          use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
        },
        {
          test: /\.less$/,
          use: [
            {
              loader: 'less-loader',
              options: {
                modifyVars: {
                  'text-color': '#000000',
                },
                javascriptEnabled: true,
              }, // compiles Less to CSS
            },
            {
              loader: 'style-loader',
            },
            {
              loader: 'css-loader', // translates CSS into CommonJS
            },
          ],
        },
        isProduction
          ? {}
          : {
              test: /\.(ts|tsx)$/,
              exclude: /node_modules/,
              loader: 'eslint-loader',
              options: {
                emitError: true,
                emitWarning: true,
                configFile: '../../../.eslintrc',
              },
            },
        {
          test: /\.(jpe?g|gif|png|svg)$/i,
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 10000,
              },
            },
          ],
        },
      ],
    },
    resolve: {
      extensions: ['.mjs', '.tsx', '.ts', '.js', '.png'],
      alias: {
        containers: paths.containers,
        components: paths.components,
        services: paths.services,
        routes: paths.routes,
        config: paths.config,
        hooks: paths.hooks,
        modals: paths.modals,
        utils: paths.utils,
        generatedGraphqlType: paths.generatedGraphqlTypes,
      },
    },
    devtool: 'source-map',
    externals: {
      React: 'react',
    },
    devServer: {
      contentBase: path.join(__dirname, 'dist'),
      inline: true,
      compress: true,
      open: true,
      historyApiFallback: true,
      port: 3000,
      proxy: {
        '/graphql': {
          secure: false,
          target: process.env.GRAPHQL_HOST,
          changeOrigin: true,
        },
        '/upload_bot_web': {
          secure: false,
          target: 'http://localhost:' + process.env.NEW_PREDICTION_BOT_LISTENER_PORT,
          changeOrigin: true,
        },
      },
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: paths.html,
        inject: true,
        isProduction: isProduction,
      }),
      new FaviconsWebpackPlugin(paths.favicon),
      new CheckerPlugin(),
    ],
    stats: {
      colors: true,
    },
    optimization: {
      splitChunks: {
        chunks: 'all',
      },
    },
  }

  return base
}
