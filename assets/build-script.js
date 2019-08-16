const webpack = require('webpack')
const path = require('path')
const generateWebpackConfig = require('@skpm/builder').webpackConfig

generateWebpackConfig(
  {},
  path.join(process.cwd(), './.scripts'),
  path.join(process.cwd(), './.scripts'),
  {}
)({
  isPluginCommand: true,
  script: path.basename(process.argv[2]),
  absolutePath: process.argv[2],
  handlers: ['onRun'],
})
  .then(webpackConfig => {
    const compiler = webpack(webpackConfig)

    return compiler.run((err, res) => {
      if (err) {
        console.error(err)
        process.exit(1)
      }
      if (res.hasErrors()) {
        res.toJson().errors.forEach(error => {
          console.error(error)
        })
        process.exit(1)
      }
      console.log(res)
      process.exit(0)
    })
  })
  .catch(err => {
    console.error(err)
    process.exit(1)
  })
