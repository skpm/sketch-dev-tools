const webpack = require('webpack')
const path = require('path')
const generateWebpackConfig = require('@skpm/builder/lib/utils/webpackConfig')
  .default

generateWebpackConfig(
  {},
  path.join(process.cwd(), './.scripts'),
  path.join(process.cwd(), './.scripts'),
  {}
)(process.argv[2], [], ['onRun']).then(webpackConfig => {
  const compiler = webpack(webpackConfig)

  return compiler.run((err, res) => {
    if (err) {
      console.error(err)
      process.exit(1)
    }
    console.log(res)
    process.exit(0)
  })
})
