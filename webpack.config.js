const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
  entry: './src/js/index.js',
  output: {
    filename: 'js/built.js',
    path: resolve(__dirname, 'build')
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
        ]
      },
      {
        test: /\.less$/,
        use: [
          'style-loader',
          'css-loader',
          'less-loader'
        ]
      },
      {
        test: /\.(gif|img|png|jpg)$/,
        loader: 'url-loader',
        options: {
          limit: 8 * 1024,
          name: '[hash:10].[ext]',
          esModule: false,
          outputPath: 'images'
        }
      },
      {
        // 处理 html 中 img 资源
        test: /\.(html|htm)$/i,
        use: 'html-withimg-loader', // 解析 html中的图片资源
      },
      {
        exclude: /\.(css|js|html|less|gif|img|png|jpg)$/,
        loader: 'file-loader',
        options: {
          name: '[hash:10].[ext]',
          outputPath: 'assets'
        }
      }
    ]
  },
  plugins: [new HtmlWebpackPlugin({ template: './src/index.html' })],
  mode: 'development',
  devServer: {
    // 项目构建后路径 
    contentBase: resolve(__dirname, 'build'),
    // 启动 gzip 压缩 
    compress: true,
    // 端口号 
    port: 3000,
    // 自动打开浏览器 
    open: true
  }
}