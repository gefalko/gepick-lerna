const path = require('path')

module.exports = function (env, args) {
  const config = {
    entry: { index: './src/index.ts' },
    module: {
      rules: [
        {
          test: /\.ts?$/,
          use: 'ts-loader',
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
    target: 'async-node',
    mode: 'development',
  }
  return config
}
