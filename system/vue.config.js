module.exports = {
  devServer: {
    open: true,
    hot: true
  },
  // 配置webpack
  configureWebpack: {
    externals: {
      // 格式：包名 ： 构造函数
      // "lodash": "_",
      // "vue": "Vue"
    }
  }
};
