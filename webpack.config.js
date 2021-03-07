const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// 用于css生产单独文件
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// 压缩css
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
// 设置nodejs环境变量，默認是生产环境
process.env.NODE_ENV = 'development';
// 复用css的loader配置
const commCssLoader = [
  MiniCssExtractPlugin.loader,
  'css-loader',
  {
    loader: 'postcss-loader',
    options: {
      postcssOptions: {
        ident: 'postcss',
        plugins: [require('postcss-preset-env')()]
      }
    },
  }]
module.exports = {
  // entry中添加index.html才能实现html热更新
  entry: ['./src/js/index.js', './src/index.html'],
  output: {
    filename: 'js/built.js',
    path: resolve(__dirname, 'build'),
    publicPath: '/build/',
  },
  module: {
    rules: [
      {
        /*
            语法检查： eslint-loader eslint
            注意：只检查自己写的源代码，第三方的库是不用检查的
            设置检查规则： package.json 中 eslintConfig 中设置~
            "eslintConfig": {
              "extends": "airbnb-base"
            }
            airbnb 需要的语法依赖--> eslint-config-airbnb-base eslint-plugin-import eslint
        */
        test: /\.js$/,
        // 不需要语法检查的路径
        exclude: /node_modules/,
        // 指定检查的目录
        include: [resolve(__dirname, 'src')],
        loader: 'eslint-loader',
        // 优先执行(先做检查,再执行兼容性处理)
        enforce: 'pre',
        options: {
          // 自动修复
          fix: true,
        },
      },
      {
        oneOf: [
          {
            test: /\.css$/,
            use: [
              ...commCssLoader
            ],
          },
          {
            test: /\.less$/,
            use: [
              ...commCssLoader,
              'less-loader',
            ],
          },
          {
            test: /\.(gif|img|png|jpg)$/,
            loader: 'url-loader',
            options: {
              limit: 8 * 1024,
              name: '[hash:10].[ext]',
              esModule: false,
              outputPath: 'images',
            },
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
              outputPath: 'assets',
            },
          },
          /*
           js兼容性处理：需要下载 babel-loader @babel/core
             1. 基本js兼容性处理 --> @babel/preset-env
               问题：只能转换基本语法，如promise高级语法不能转换
             2. 全部js兼容性处理 --> @babel/polyfill
               问题：只要解决部分兼容性问题，但是将所有兼容性代码全部引入，体积太大了
             3. 需要做兼容性处理的就做：按需加载  --> core-js
           最終方案：@babel/preset-env + core-js
         */
          {
            test: /\.js$/,
            exclude: /node_module/,
            loader: 'babel-loader',
            options: {
              presets: [
                [
                  // 基本预设
                  '@babel/preset-env',
                  {
                    // 按需加载
                    useBuiltIns: 'usage',
                    // 指定core-js版本
                    corejs: { version: 3 },
                    // 指定兼容到什么版本的浏览器
                    targets: {
                      chrome: '60',
                      firefox: '50',
                      ie: '9',
                      safari: '10',
                      edge: '17',
                    },
                  },
                ],
              ],
            },
          },
        ]
      }
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      minify: {
        // 移除空格:
        collapseWhitespace: true,
        // 移除注释
        removeComments: true
      }
    }),
    new MiniCssExtractPlugin({ filename: 'css/built.css' }),
    // 压缩css
    new OptimizeCssAssetsWebpackPlugin(),
  ],
  devtool: 'eval-source-map',
  // 生产环境(production)下会压缩js文件
  mode: 'development',
  // 实现热更新
  target: 'web',
  devServer: {
    // 项目构建后路径
    contentBase: resolve(__dirname, 'build'),
    // 启动 gzip 压缩
    compress: true,
    // 端口号
    port: 3000,
    progress: true,  // 是否显示加载进度条
    // 自动打开浏览器
    open: true,
    // 开启热模块替换
    hot: true,
  },
};
