const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// 用于css生产单独文件
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// 引入serviceworker 插件
// const WorkboxWebpackPlugin = require('workbox-webpack-plugin');
// dll相关
const webpack = require('webpack')
const AddAssetHtmlWebpackPlugin = require('add-asset-html-webpack-plugin');
// 压缩css
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
// 设置nodejs环境变量，默認是生产环境
process.env.NODE_ENV = 'production ';
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
    // 文件名加hash值可防止缓存
    filename: 'js/built.[contenthash:10].js',
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
            use: [
              /* 
                 thread-loader会对其后面的loader（这里是babel-loader）开启多进程打包。 
                 进程启动大概为600ms，进程通信也有开销。(启动的开销比较昂贵，不要滥用)
                 只有工作消耗时间比较长，才需要多进程打包
               */
              // {
              //   loader: 'thread-loader',
              //   options: {
              //     workers: 2 // 进程2个
              //   }
              // },
              {
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
                  // 开启babel缓存
                  // 第二次构建时，会读取之前的缓存
                  cacheDirectory: true,
                },
              }
            ]
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
    new MiniCssExtractPlugin({ filename: 'css/built.[contenthash:10].css' }),
    // 压缩css
    new OptimizeCssAssetsWebpackPlugin(),
    // plugins中加入：
    // new WorkboxWebpackPlugin.GenerateSW({
    //   /*
    //     1. 帮助serviceworker快速启动
    //     2. 删除旧的 serviceworker

    //     生成一个 serviceworker 配置文件
    //   */
    //   clientsClaim: true,
    //   skipWaiting: true
    // }),
    // dll技术:
    // 告诉webpack哪些库不参与打包，同时使用时的名称也得变
    // 1.需先執行webpack --config webpack.dll.js生成manifest.json文件
    new webpack.DllReferencePlugin({
      manifest: resolve(__dirname, 'dll/manifest.json')
    }),
    // 2.将某个文件打包输出到build目录下，并在html中自动引入该资源
    new AddAssetHtmlWebpackPlugin({
      filepath: resolve(__dirname, 'dll/jquery.js')
    }),
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
  // 将 node_modules 中的代码单独打包
  optimization: {
    splitChunks: {
      chunks: 'all'
    }
  },
  externals: {
    // 拒绝jQuery被打包进来(通过cdn引入，速度会快一些)
    // 忽略的库名 -- npm包名 
    // 忽略的库名 需要在 index.html 中通过 cdn 引入：
    jquery: 'jQuery'
  }
};
