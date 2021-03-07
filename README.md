第 1 章：webpack 简介
1.1webpack 是什么
webpack 是一种前端资源构建工具，一个静态模块打包器(modulebundler)。 在 webpack 看来, 前端的所有资源文件(js/json/css/img/less/...)都会作为模块处理。 它将根据模块的依赖关系进行静态分析，打包生成对应的静态资源(bundle)。

1.2webpack 五个核心概念
   1.2.1Entry
入口(Entry)指示 webpack 以哪个文件为入口起点开始打包，分析构建内部依赖图。
   1.2.2Output
输出(Output)指示 webpack 打包后的资源 bundles 输出到哪里去，以及如何命名。
   1.2.3Loader
Loader 让 webpack 能够去处理那些非 JavaScript 文件(webpack 自身只理解 JavaScript),相当于一个翻译官
   1.2.4Plugins
插件(Plugins)可以用于执行范围更广的任务。插件的范围包括，从打包优化和压缩，一直到重新定义环境中的变量等
   1.2.5Mode
模式(Mode)指示 webpack 使用相应模式的配置。
选项  描述  特点
development 会将 DefinePlugin 中 process.env.NODE_ENV 的值设置 为 development。启用 NamedChunksPlugin 和 NamedModulesPlugin。 能让代码本地调试 运行的环境
production 会将 DefinePlugin 中 process.env.NODE_ENV 的值设置 为 production。启用 FlagDependencyUsagePlugin, FlagIncludedChunksPlugin,ModuleConcatenationPlugin, NoEmitOnErrorsPlugin,OccurrenceOrderPlugin, SideEffectsFlagPlugin 和 TerserPlugin。 能让代码优化上线 运行的环境

第 2 章：webpack 的初体验
  2.1 初始化配置
    1. 初始化 package.json 输入指令: 
npm  init

2. 下载并安装 webpack 输入指令: 
npm  install  webpack  webpack-cli -g 
npm  install  webpack  webpack-cli -D


2.2 编译打包应用
1. 创建文件 
2. 运行指令
 开发环境指令：  
webpack ./src/index.js -o ./build/built.js --mode=development

功能：webpack会以 ./src/index.js 为入口文件开始打包，打包后输出到 ./build/built.js 整体打包环境，是开发环境;webpack 能够编译打包 js 和 json 文件，并且能将 es6 的模块化语法转换成浏览器能识别的语法。
生产环境指令：
webpack ./src/index.js -o ./build/built.js --mode=production

功能：webpack会以 ./src/index.js 为入口文件开始打包，打包后输出到 ./build/built.js 整体打包环境，是生产环境;在开发配置功能上多一个功能，压缩代码。
3. 结论 
webpack 本身能处理 js/json 资源，不能处理 css/img 等其他资源
生产环境和开发环境将 ES6 模块化编译成浏览器能识别的模块化，但是不能处理 ES6  的基本语法转化为 ES5（需要借助 loader）
生产环境比开发环境多一个压缩 js 代码

第 3 章：webpack 开发环境的基本配置
3.1 创建配置文件
1. 创建文件 webpack.config.js
2. 配置内容如下
const { resolve } = require('path');/ /node内置核心模块,用来处理路径问题 
module.exports = {
entry: './src/js/index.js',
/ / 入 口 文 件
output: {
/ / 输 出 配 置
filename: './built.js',
/ / 输 出 文 件 名
path: resolve(__dirname, 'build/js')
/ / 输 出 文 件 路 径 配 置
},
mode: 'development'
/ / 开 发 环 境
};


3. 运行指令:webpack 
4. 结论: 此时功能与上节一致
3.2 打包样式资源
1. 创建文件

2. 下载安装 loader 包 
npm i css-loader style-loader less-loader less -D

3. 修改配置文件 
// resolve 用来拼接绝对路径的方法
const { resolve } = require('path');
module.exports = {
  // webpack 配置 // 入口起点 
  entry: './src/index.js',
  // 输出 
  output: {
    // 输出文件名 filename: 'built.js',
    // 输出路径 
    // __dirname nodejs 的变量，代表当前文件的目录绝对路径 
    path: resolve(__dirname, 'build')
  },
  // loader 的配置
  module: {
    rules: [
      // 详细 loader 配置
      // 不同文件必须配置不同 loader 处理 
      {
        // 匹配哪些文件 
        test: /\.css$/,
        // 使用哪些 loader 进行处理 
        use: [
          // use 数组中 loader 执行顺序：从右到左，从下到上 依次执行
          // 创建 style 标签，将 js 中的样式资源插入进行，添加到 head 中生效
          'style-loader',
          // 将 css 文件变成 commonjs 模块加载 js 中，里面内容是样式字符串 
          'css-loader'
        ]
      }, {
        test: /\.less$/,
        use: ['style-loader', 'css-loader',
          // 将 less 文件编译成 css 文件 
          // 需要下载 less-loader 和 less
          'less-loader'
        ]
      }
    ]
  },
  // plugins 的配置 
  plugins: [
    // 详细 plugins 的配置
  ],
  // 模式
  mode: 'development',
  // 开发模式 
  // mode: 'production'
}

4. 运行指令:webpack
3.3 打包 HTML 资源
1. 创建文件

2. 下载安装 plugin 包 
npm install --save -dev html-webpack-plugin 

3. 修改配置文件
const { resolve } = require('path'); 
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'built.js',
    path: resolve(__dirname, 'build')
  },
  module: {
    rules: [
      // loader 的配置 
    ]
  }, plugins: [
    // plugins 的配置 
    // html-webpack-plugin 
    // 功能：默认会创建一个空的 HTML，自动引入打包输出的所有资源（JS/CSS） 
    // 需求：需要有结构的 HTML 文件 
    new HtmlWebpackPlugin({
      // 复制 './src/index.html' 文件，并自动引入打包输出的所有资源（JS/CSS） 
      template: './src/index.html'
    })
  ],
  mode: 'development'
};

4.运行指令:webpack
3.4 打包图片资源
1. 创建文件

2. 下载安装 loader 包 
npm  install --save-dev html-withimg-loader url-loader file-loader

3. 修改配置文件
const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'built.js',
    path: resolve(__dirname, 'build')
  }, module: {
    rules: [
      {
        test: /\.less$/,
        // 要使用多个 loader 处理用 use
        use: ['style-loader', 'css-loader', 'less-loader']
      }, {
        // 问题：默认处理不了 html 中 img 图片 
        // 处理图片资源 
        test: /\.(jpg|png|gif)$/,
        // 使用一个 loader 
        // 下载 url-loader file-loader 
        loader: 'url-loader',
        options: {
          // 图片大小小于 8kb，就会被 base64 处理 
          // 优点: 减少请求数量（减轻服务器压力） 
          // 缺点：图片体积会更大（文件请求速度更慢） 
          limit: 8 * 1024,
          // 问题： 因为url-loader默认使用es6模块化解析， 而html-withimg-loader引入图片是commonjs 
          // 解析时会出问题：[object Module] 
          // 解决：关闭 url-loader 的 es6 模块化，使用 commonjs 解析 
          esModule: false,
          // 给图片进行重命名 // [hash:10]取图片的 hash 的前 10 位 
          // [ext]取文件原来扩展名 
          name: '[hash:10].[ext]'
        }
      }, {
        // 解析 html中的图片资源
        test: /\.(html|htm)$/i,
        use: 'html-withimg-loader',
       }
    ]
  }, plugins: [new HtmlWebpackPlugin({ template: './src/index.html' })],
  mode: 'development'
}; 

4. 运行指令:webpack
3.5 打包其他资源
1. 创建文件

2. 修改配置文件 
const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'built.js',
    path: resolve(__dirname, 'build')
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      // 打包其他资源(除了 html/js/css 资源以外的资源) 
      {
        // 排除 css/js/html 资源 
        exclude: /\.(css|js|html|less|gif|img|png|jpg)$/,
        loader: 'file-loader',
        options: {
          name: '[hash:10].[ext]'
        }
      }
    ]
  },
  plugins: [new HtmlWebpackPlugin({ template: './src/index.html' })],
  mode: 'development'
}; 


4. 运行指令:webpack

备:资源类型1-5汇总:
const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'built.js',
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
          esModule: false
        }
      }, {
        exclude: /\.(css|js|html|less|gif|img|png|jpg)$/,
        loader: 'file-loader',
        options: {
          name: '[hash:10].[ext]'
        }
      }
    ]
  },
  plugins: [new HtmlWebpackPlugin({ template: './src/index.html' })],
  mode: 'development'
}


3.6 devserver
开发服务器 devServer：用来自动化，不用每次修改后都重新输入webpack打包一遍（自动编译，自动打开浏览器，自动刷新浏览器）
	特点：只会在内存中编译打包，不会有任何输出（不会像之前那样在外面看到打包输出的build包，而是在内存中，关闭后会自动删除）
启动devServer指令为：npx webpack-dev-server 或 npx webpack serve
1. 创建文件

2. 修改配置文件 
const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'built.js',
    path: resolve(__dirname, 'build')
  },
  module: {
    rules: [{
      test: /\.css$/, use: ['style-loader', 'css-loader']
    },
    // 打包其他资源(除了 html/js/css 资源以外的资源) 
    {
      // 排除 css/js/html/图片 资源 
      exclude: /\.(css|js|html|less|gif|img|png|jpg)$/,
      loader: 'file-loader',
      options: { name: '[hash:10].[ext]' }
    }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({ template: './src/index.html' })],
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
};

4. 运行指令:npx webpack-dev-server 或 npx webpack serve
3.7 开发环境配置
1.创建文件

2. 修改配置文件 
const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = { 
entry: './src/js/index.js', 
output: { 
filename: 'js/built.js', 
path: resolve(__dirname, 'build') }, 
module: { 
rules: [ 
// loader 的配置 
{ 
// 处理 less 资源
 test: /\.less$/,
  use: ['style-loader', 'css-loader', 'less-loader'] 
  },{ 
   // 处理 css 资源 
   test: /\.css$/, 
   use: ['style-loader', 'css-loader'] 
   }, { 
   // 处理图片资源 
   test: /\.(jpg|png|gif)$/, 
   loader: 'url-loader', 
   options: { 
   limit: 8 * 1024, 
   name: '[hash:10].[ext]',
    // 关闭 es6 模块化 
    esModule: false, 
    outputPath: 'imgs' 
    }
     }, { 
     // 处理 html 中 img 资源 
     test: /\.html$/, 
     loader: 'html-loader' }, { 
// 处理其他资源 
exclude: /\.(html|js|css|less|jpg|png|gif)/,
 loader: 'file-loader', 
 options: {
     name: '[hash:10].[ext]', outputPath: 'media'
}
}
]
}, plugins: [
 // plugins 的配置 
 new HtmlWebpackPlugin({ template: './src/index.html' })
  ],
  mode: 'development', 
  devServer: { 
  contentBase: resolve(__dirname, 'build'), 
  compress: true,
   port: 3000, 
   open: true 
   } 
   };


3. 运行指令:npxwebpack-dev-server 
 4 ：webpack 生产环境的基本配置
4.1 提取 css 成单独文件
1. 下载安装包

2.下载插件 
npm install--save-dev mini-css-extract-plugin 


const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
module.exports = {
  entry: './src/js/index.js',
  output: {
    filename: 'js/built.js',
    path: resolve(__dirname, 'build'),
    publicPath: '/build/'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          // 创建 style 标签，将样式放入
          // 'style-loader', 
          // 这个 loader 取代 style-loader。作用：提取 js 中的 css 成单独文件 
          MiniCssExtractPlugin.loader,
          'css-loader',
        ]
      },
      {
        test: /\.less$/,
        use: [
          // 'style-loader',
          MiniCssExtractPlugin.loader, 
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
  plugins: [
    new HtmlWebpackPlugin({ template: './src/index.html' }),
    new MiniCssExtractPlugin({ filename: 'css/built.css' })],
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

4.运行指令:
npx webpack  serve 



注意:我們在打包的资源中包含了图片,所以在output中需要配置公共路径publicPath: '/build/'
4.2css 兼容性处理
1.下载 loader 
npm install--save -dev postcss-loader postcss-preset-env 

2.修改配置文件 
const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

// 设置nodejs环境变量
process.env.NODE_ENV = 'development';
module.exports = {
  entry: './src/js/index.js',
  output: {
    filename: 'js/built.js',
    path: resolve(__dirname, 'build'),
    publicPath: '/build/'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          // 'style-loader',
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: { 
              postcssOptions: { 
                ident: "postcss", 
                plugins: [require("postcss-preset-env")()] } 
              }
          }
        ]
      },
      {
        test: /\.less$/,
        use: [
          // 'style-loader',
          MiniCssExtractPlugin.loader,
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
  plugins: [
    new HtmlWebpackPlugin({ template: './src/index.html' }),
    new MiniCssExtractPlugin({ filename: 'css/built.css' }),
  ],


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

3. 修改 package.json 
"browserslist": {
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ],
    "production": [
      ">0.1%",
      "not dead",
      "not op_mini all"
    ]
  }

4. 运行指令:
webpack

5.执行效果:
开发环境:

生产环境:

4.3 压缩 css
1. 下载安装包
 npm install--save -dev optimize-css-assets-webpack-plugin 

2. 修改配置文件 
const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
// 设置nodejs环境变量，默認是生产环境
process.env.NODE_ENV = 'development';
module.exports = {
  entry: './src/js/index.js',
  output: {
    filename: 'js/built.js',
    path: resolve(__dirname, 'build'),
    publicPath: '/build/'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          // 'style-loader',
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: { postcssOptions: { ident: "postcss", plugins: [require("postcss-preset-env")()] } }
          }
        ]
      },
      {
        test: /\.less$/,
        use: [
           //'style-loader',
           MiniCssExtractPlugin.loader,
          'css-loader',
           {
            loader: 'postcss-loader',
            options: { 
              postcssOptions: { 
                ident: "postcss", 
                plugins: [require("postcss-preset-env")()] } 
              }
          },
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
  plugins: [
    new HtmlWebpackPlugin({ template: './src/index.html' }),
    new MiniCssExtractPlugin({ filename: 'css/built.css' }),
    // 压缩css
    new OptimizeCssAssetsWebpackPlugin()
  ],


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

3. 运行指令:
webpack

4.效果:

4.4js 语法检查
1. 下载安装包
 npm install--save -dev eslint-loader eslint eslint-config-airbnb-base eslint-plugin-import

2. 修改配置文件 
const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
// 设置nodejs环境变量，默認是生产环境
// process.env.NODE_ENV = 'development';
module.exports = {
  entry: './src/js/index.js',
  output: {
    filename: 'js/built.js',
    path: resolve(__dirname, 'build'),
    publicPath: '/build/',
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          // 'style-loader',
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: { postcssOptions: { ident: 'postcss', plugins: [require('postcss-preset-env')()] } },
          },
        ],
      },
      {
        test: /\.less$/,
        use: [
           //'style-loader',
           MiniCssExtractPlugin.loader,
           'css-loader',
           {
            loader: 'postcss-loader',
            options: { 
              postcssOptions: { 
                ident: "postcss", 
                plugins: [require("postcss-preset-env")()] } 
              }
          },
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
          语法检查： eslint-loader eslint
          注意：只检查自己写的源代码，第三方的库是不用检查的
          设置检查规则： package.json 中 eslintConfig 中设置~
          "eslintConfig": {
            "extends": "airbnb-base"
          }
          airbnb 需要的语法依赖--> eslint-config-airbnb-base eslint-plugin-import eslint
      */
      {
        test: /\.js$/,
        // 不需要语法检查的路径
        exclude: /node_modules/,
        // 指定检查的目录
        include: [path.resolve(__dirname, 'src')],
        loader: 'eslint-loader',
        // 编译前检查
        enforce: 'pre'
        options: {
           // 自动修复
          fix: true,
        },,
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({ template: './src/index.html' }),
    new MiniCssExtractPlugin({ filename: 'css/built.css' }),
    // 压缩css
    new OptimizeCssAssetsWebpackPlugin(),
  ],

  mode: 'development',
  devServer: {
    // 项目构建后路径
    contentBase: resolve(__dirname, 'build'),
    // 启动 gzip 压缩
    compress: true,
    // 端口号
    port: 3000,
    // 自动打开浏览器
    open: true,
  },
};


3. 配置 package.json
"eslintConfig": {
    "extends": "airbnb-base",
    "env": {
      "browser": true
    }
  }

4. 运行指令:
webpack

备注:
1.当我们调试时无法避免会有一些eslint的警告,我们可以使用 //eslint-disable-next-line 来使下一行不进行eslint检查,如:

2.eslint详细配置:https://www.cnblogs.com/jackson1/p/12682664.html
4.5 js 兼容性处理
1. 下载安装包 
npm install --save -dev babel-loader @babel/core @babel/preset-env @babel/polyfill core-js

2. 修改配置文件 
const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
// 设置nodejs环境变量，默認是生产环境
// process.env.NODE_ENV = 'development';
module.exports = {
  entry: './src/js/index.js',
  output: {
    filename: 'js/built.js',
    path: resolve(__dirname, 'build'),
    publicPath: '/build/',
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          // 'style-loader',
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: { postcssOptions: { ident: 'postcss', plugins: [require('postcss-preset-env')()] } },
          },
        ],
      },
      {
        test: /\.less$/,
        use: [
          // 'style-loader',
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: { 
              postcssOptions: { 
                ident: "postcss", 
                plugins: [require("postcss-preset-env")()] } 
              }
          },
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
          语法检查： eslint-loader eslint
          注意：只检查自己写的源代码，第三方的库是不用检查的
          设置检查规则： package.json 中 eslintConfig 中设置~
          "eslintConfig": {
            "extends": "airbnb-base"
          }
          airbnb 需要的语法依赖--> eslint-config-airbnb-base eslint-plugin-import eslint
      */
      {
        test: /\.js$/,
        // 不需要语法检查的路径
        exclude: /node_modules/,
        // 指定检查的目录
        include: [resolve(__dirname, 'src')],
        loader: 'eslint-loader',
        // 编译前先检查
        enforce: 'pre',
        options: {
          // 自动修复
          fix: true,
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
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({ template: './src/index.html' }),
    new MiniCssExtractPlugin({ filename: 'css/built.css' }),
    // 压缩css
    new OptimizeCssAssetsWebpackPlugin(),
  ],

  mode: 'development',
  devServer: {
    // 项目构建后路径
    contentBase: resolve(__dirname, 'build'),
    // 启动 gzip 压缩
    compress: true,
    // 端口号
    port: 3000,
    // 自动打开浏览器
    open: true,
  },
};


4.执行
webpack

5.执行效果

4.6 js 压缩和HTML 压缩
4.6.1 js 压缩
生产环境下会自动压缩 js 代码;在webopack.config.js文件中直接修改mode即可
 mode: 'production' 

4.6.2 HTML 压缩
我们在使用HtmlWebpackPlugin 时候新增minify配置项即可
  new HtmlWebpackPlugin({
      template: './src/index.html',
      minify: {
        // 移除空格:
        collapseWhitespace: true,
        // 移除注释
        removeComments: true
      }
    }),


4.7总结:webpack生产环境配置总结:
1.文件目錄

2.webpack配置文件
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
  entry: './src/js/index.js',
  output: {
    filename: 'js/built.js',
    path: resolve(__dirname, 'build'),
    publicPath: '/build/',
  },
  module: {
    rules: [
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
          语法检查： eslint-loader eslint
          注意：只检查自己写的源代码，第三方的库是不用检查的
          设置检查规则： package.json 中 eslintConfig 中设置~
          "eslintConfig": {
            "extends": "airbnb-base"
          }
          airbnb 需要的语法依赖--> eslint-config-airbnb-base eslint-plugin-import eslint
      */
      {
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
  // 生产环境(production)下会压缩js文件
  mode: 'production',
  devServer: {
    // 项目构建后路径
    contentBase: resolve(__dirname, 'build'),
    // 启动 gzip 压缩
    compress: true,
    // 端口号
    port: 3000,
    // 自动打开浏览器
    open: true,
  },
};


3.package.json
"browserslist": {
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ],
    "production": [
      ">0.1%",
      "not dead",
      "not op_mini all"
    ]
  },
  "eslintConfig": {
    "extends": "airbnb-base",
    "env": {
      "browser": true
    }
  }

5.webpack 优化配置
优化分为以下几个方面:
webpack性能优化:开发环境和生产环境性能优化;
开发环境性能优化:优化打包构建速度,优化代码调试
生产环境性能优化:优化打包构建速度,优化代码运行性能
5.1 开发环境性能优化
5.1.1 HMR :
启用热替换模块(Hot Module Replacement)，也被称为 HMR。
作用：一个模块发生变化，只会重新打包构建这一个模块（而不是打包所有模块） ，极大提升构建速度	
代码：只需要在 devServer 中设置 hot 为 true，就会自动开启HMR功能（只能在开发模式下使用）
devServer: {
  contentBase: resolve(__dirname, 'build'),
  compress: true,
  port: 3000,
  open: true,
  // 开启HMR功能
  // 当修改了webpack配置，新配置要想生效，必须重启webpack服务
  hot: true
}

每种文件实现热模块替换的情况：
样式文件：可以使用HMR功能，因为开发环境下使用的 style-loader 内部默认实现了热模块替换功能
js 文件：默认不能使用HMR功能（修改一个 js 模块所有 js 模块都会刷新）
--> 实现 HMR 需要修改 js 代码（添加支持 HMR 功能的代码）
在index.js文件中:
// 绑定
if (module.hot) {
  // 一旦 module.hot 为true，说明开启了HMR功能。 --> 让HMR功能代码生效
  module.hot.accept('./print.js', function() {
    // 方法会监听 print.js 文件的变化，一旦发生变化，只有这个模块会重新打包构建，其他模块不会。
    // 会执行后面的回调函数
    print();
  });
}

注意：HMR 功能对 js 的处理，只能处理非入口 js 文件的其他文件。
html 文件: 默认不能使用 HMR 功能（html 不用做 HMR 功能，因为只有一个 html 文件，不需要再优化）
使用 HMR 会导致问题：html 文件不能热更新了（不会自动打包构建）
解决：修改 entry 入口，将 html 文件引入（这样 html 修改整体刷新）
entry: ['./src/js/index.js', './src/index.html']

5.1.2 source-map
source-map：
一种提供源代码到构建后代码的映射的技术 （如果构建后代码出错了，通过映射可以追踪源代码错误）
参数：
[inline-|hidden-|eval-][nosources-][cheap-[module-]]source-map

代码：
devtool: 'eval-source-map'

可选方案：[生成source-map的位置|给出的错误代码信息]
1.source-map :外部，错误代码准确信息 和 源代码的错误位置

2.inline-source-map：内联，只生成一个内联 source-map，错误代码准确信息 和 源代码的错误位置

3.hidden-source-map：外部，错误代码错误原因，但是没有错误位置（为了隐藏源代码），不能追踪源代码错误，只能提示到构建后代码的错误位置

4.eval-source-map：内联，每一个文件都生成对应的 source-map，都在 eval 中，错误代码准确信息 和 源代码的错误位

5.nosources-source-map：外部，错误代码准确信息，但是没有任何源代码信息（为了隐藏源代码）

6.cheap-source-map：外部，错误代码准确信息 和 源代码的错误位置，只能把错误精确到整行，忽略列

7.cheap-module-source-map：外部，错误代码准确信息 和 源代码的错误位置，module 会加入 loader 的 source-map

内联 和 外部的区别：
1. 外部生成了文件，内联没有
2. 内联构建速度更快

开发/生产环境可做的选择：
开发环境：
需要考虑速度快，调试更友好
速度快( eval > inline > cheap >... )
eval-cheap-souce-map
eval-source-map
调试更友好
souce-map
cheap-module-souce-map
cheap-souce-map
最终得出最好的两种方案 :
1. eval-source-map（完整度高，内联速度快,脚手架默认使用） /
2. eval-cheap-module-souce-map（错误提示忽略列但是包含其他信息，内联速度快）
生产环境：
需要考虑源代码要不要隐藏，调试要不要更友好
内联会让代码体积变大，所以在生产环境不用内联
隐藏源代码
nosources-source-map 全部隐藏
hidden-source-map 只隐藏源代码，会提示构建后代码错误信息
最终得出最好的两种方案 :
 		1.source-map（最完整） 
  2.cheap-module-souce-map（错误提示一整行忽略列）

5.2 生产环境性能优化
5.2.1 优化打包构建速度
5.2.1.1 oneOf
oneOf：匹配到 loader 后就不再向后进行匹配，优化生产环境的打包构建速度
代码：
module: {
  rules: [
    {
      // js 语法检查
      test: /\.js$/,
      exclude: /node_modules/,
      // 优先执行
      enforce: 'pre',
      loader: 'eslint-loader',
      options: {
        fix: true
      }
    },
    {
      // oneOf 优化生产环境的打包构建速度
      // 以下loader只会匹配一个（匹配到了后就不会再往下匹配了）
      // 注意：不能有两个配置处理同一种类型文件（所以把eslint-loader提取出去放外面）
      oneOf: [
        {
          test: /\.css$/,
          use: [...commonCssLoader]
        },
        {
          test: /\.less$/,
          use: [...commonCssLoader, 'less-loader']
        },
        {
          // js 兼容性处理
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
          options: {
            presets: [
              [
                '@babel/preset-env',
                {
                  useBuiltIns: 'usage',
                  corejs: {version: 3},
                  targets: {
                    chrome: '60',
                    firefox: '50'
                  }
                }
              ]
            ]
          }
        },
        {
          test: /\.(jpg|png|gif)/,
          loader: 'url-loader',
          options: {
            limit: 8 * 1024,
            name: '[hash:10].[ext]',
            outputPath: 'imgs',
            esModule: false
          }
        },
        {
          test: /\.html$/,
          loader: 'html-loader'
        },
        {
          exclude: /\.(js|css|less|html|jpg|png|gif)/,
          loader: 'file-loader',
          options: {
            outputPath: 'media'
          }
        }
      ]
    }
  ]
},

5.2.1.2 babel 缓存