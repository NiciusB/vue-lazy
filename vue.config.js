// vue.config.js
module.exports = {
  assetsDir: 'src',
  productionSourceMap: false,
  configureWebpack: {
    output: {
      libraryExport: 'default'
    }
  }
}
