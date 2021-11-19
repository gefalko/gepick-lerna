const path = require('path')
const webpack = require('webpack')

module.exports = function (env, args) {
  const config = {
    entry: { server: './src/index.ts' },
    module: {
      rules: [
        {
          test: /\.ts?$/,
          use: 'awesome-typescript-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.mjs$/,
          include: /node_modules/,
          type: 'javascript/auto',
        },
      ],
    },
    resolve: {
      extensions: ['.ts', '.js', '.mjs'],
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
    },
    stats: { warnings: false },
    target: 'async-node',
    mode: 'development',
    watchOptions: {
      ignored: '**/node_modules',
      poll: 1000,
    },
  }
  return config
}
