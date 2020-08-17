const path = require('path')
function resolve(dir){
  return path.join(__dirname, dir)
}
module.exports = {
  chainWebpack: config => {
    config.resolve.alias
    .set('components', resolve('src/components'))
  },
  devServer: {
    proxy: {
      '/api' :{
        target: 'http://localhost:3000',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      },
      '/file': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        pathRewrite: null
      },
      '/fileBig': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        pathRewrite: null
      }
    }
  }
}