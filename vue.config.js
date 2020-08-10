module.exports = {
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