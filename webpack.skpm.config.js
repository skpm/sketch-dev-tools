/* eslint-disable no-not-accumulator-reassign/no-not-accumulator-reassign */
const webpack = require('webpack')
const path = require('path')

module.exports = config => {
  config.resolve.extensions = ['.sketch.js', '.js', '.jsx']
  config.module.rules.push({
    test: /\.(html)$/,
    use: [
      {
        loader: '@skpm/extract-loader',
      },
      {
        loader: 'html-loader',
        options: {
          attrs: ['img:src', 'link:href'],
          interpolate: true,
        },
      },
    ],
  })
  config.module.rules.push({
    test: /\.(css)$/,
    use: [
      {
        loader: '@skpm/extract-loader',
      },
      {
        loader: 'css-loader',
      },
    ],
  })
  config.module.rules.push({
    test: /\.jsx?$/,
    include: [path.resolve(__dirname, 'node_modules/cocoascript-class')],
    use: {
      loader: 'babel-loader',
      options: {
        babelrc: false,
        presets: ['babel-preset-airbnb'],
      },
    },
  })

  config.plugins.push(
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      },
    })
  )
}
