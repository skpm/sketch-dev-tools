const webpack = require('webpack')

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

  config.plugins.push(
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      },
    })
  )
}
