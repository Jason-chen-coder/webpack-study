# 1 webpack 简介
## 1.1webpack 是什么
webpack 是一种前端资源构建工具，一个静态模块打包器(modulebundler)。 在 webpack 看来, 前端的所有资源文件(js/json/css/img/less/...)都会作为模块处理。 它将根据模块的依赖关系进行静态分析，打包生成对应的静态资源(bundle)。
![在这里插入图片描述](https://img-blog.csdnimg.cn/538ee5f3844d4d858ddbcbd2df55fa10.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl8zOTA4NTgyMg==,size_16,color_FFFFFF,t_70)

## 1.2webpack 五个核心概念
   ### 1.2.1Entry
入口(Entry)指示 webpack 以哪个文件为入口起点开始打包，分析构建内部依赖图。
   ### 1.2.2Output
输出(Output)指示 webpack 打包后的资源 bundles 输出到哪里去，以及如何命名。
   ###  1.2.3Loader
Loader 让 webpack 能够去处理那些非 JavaScript 文件(webpack 自身只理解 JavaScript),相当于一个翻译官
   ### 1.2.4Plugins
插件(Plugins)可以用于执行范围更广的任务。插件的范围包括，从打包优化和压缩，一直到重新定义环境中的变量等
   ### 1.2.5Mode
   模式(Mode)指示 webpack 使用相应模式的配置。

|选项   |  描述| 特点|
|--|--|--|
| development| 会将 DefinePlugin 中 process.env.NODE_ENV 的值设置 为 development。启用 NamedChunksPlugin 和 NamedModulesPlugin。 |  能让代码本地调试 运行的环境 |
| production| 会将 DefinePlugin 中 process.env.NODE_ENV 的值设置 为 production。 启用 FlagDependencyUsagePlugin, FlagIncludedChunksPlugin,ModuleConcatenationPlugin,NoEmitOnErrorsPlugin,OccurrenceOrderPlugin, SideEffectsFlagPlugin 和 TerserPlugin。 |  能让代码优化上线 运行的环境  

# 2：webpack 的初体验
 ## 2.1 初始化配置
   1. 初始化 package.json 输入指令:
```cmd
npm  init
```
   2. 下载并安装 webpack 输入指令: 
```cmd
npm  install  webpack  webpack-cli -g 
npm  install  webpack  webpack-cli -D
```

## 2.2 编译打包应用
##### 1. 创建文件 
##### 2. 运行指令
 开发环境指令：  
 ```cmd
webpack ./src/index.js -o ./build/built.js --mode=development
```

功能：
webpack会以 ./src/index.js 为入口文件开始打包，打包后输出到 ./build/built.js 整体打包环境，是开发环境;webpack 能够编译打包 js 和 json 文件，并且能将 es6 的模块化语法转换成浏览器能识别的语法。
生产环境指令：
```cmd
webpack ./src/index.js -o ./build/built.js --mode=production
```

功能：
 webpack会以 ./src/index.js 为入口文件开始打包，打包后输出到 ./build/built.js 整体打包环境，是生产环境;在开发配置功能上多一个功能，压缩代码。
 ![在这里插入图片描述](https://img-blog.csdnimg.cn/dc59b843ba6d49b9b2a73dc4b2299587.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl8zOTA4NTgyMg==,size_16,color_FFFFFF,t_70)

##### 3. 结论 
webpack 本身能处理 js/json 资源，不能处理 css/img 等其他资源
生产环境和开发环境将 ES6 模块化编译成浏览器能识别的模块化，但是不能处理 ES6  的基本语法转化为 ES5（需要借助 loader）
生产环境比开发环境多一个压缩 js 代码

#  3：webpack 开发环境的基本配置
## 3.1 创建配置文件
##### 1. 创建文件 webpack.config.js
##### 2. 配置内容如下
```js
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
```

##### 3. 运行指令:   
```cmd
webpack 
```
##### 4. 结论: 此时功能与上节一致
## 3.2 打包样式资源
##### 1. 创建文件
![在这里插入图片描述](https://img-blog.csdnimg.cn/94dec28306d04cf38284f652ead91e8c.png)

##### 2. 下载安装 loader 包 
```cmd
npm i css-loader style-loader less-loader less -D
```
##### 3. 修改配置文件 
```js
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
```
4. 运行指令:webpack
```cmd
webpack
```
## 3.3 打包 HTML 资源
##### 1. 创建文件
![在这里插入图片描述](https://img-blog.csdnimg.cn/2781a184a1d1428590763b7e2b8100ba.png)

##### 2. 下载安装 plugin 包 
```cmd
npm install --save -dev html-webpack-plugin 
```
##### 3. 修改配置文件
```js
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
```
4.运行指令:
```cmd
webpack
```
## 3.4 打包图片资源
##### 1. 创建文件
![在这里插入图片描述](https://img-blog.csdnimg.cn/0da2ce2f6fcf4f53abf8dce62f604c17.png)

##### 2. 下载安装 loader 包 
```cmd
npm  install --save-dev html-withimg-loader url-loader file-loader
```

##### 3. 修改配置文件
```js
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
```
##### 4. 运行指令:
```
webpack
```

## 3.5 打包其他资源
##### 1. 创建文件
![在这里插入图片描述](https://img-blog.csdnimg.cn/357bc5e524be40e582dd1e6f61c69adb.png)

##### 2. 修改配置文件 
```js
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
```

##### 3. 运行指令:
```
webpack
```
**备:以上资源类型1-5汇总:**
```js
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
```

## 3.6 devserver
开发服务器 devServer：用来自动化，不用每次修改后都重新输入webpack打包一遍（自动编译，自动打开浏览器，自动刷新浏览器）
	特点：只会在内存中编译打包，不会有任何输出（不会像之前那样在外面看到打包输出的build包，而是在内存中，关闭后会自动删除）
启动devServer指令为：npx webpack-dev-server 或 npx webpack serve
##### 1. 创建文件
![在这里插入图片描述](https://img-blog.csdnimg.cn/11428cb50dfe4e94ae02af66f8c5f6f1.png)

##### 2. 修改配置文件 
 ```js
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
```
##### 3. 运行指令:
 ```
 npx webpack-dev-server 或 npx webpack serve
 ```
## 3.7 开发环境配置

##### 1.创建文件
![在这里插入图片描述](https://img-blog.csdnimg.cn/f3b0f08f184d4f90a15ada872aabcec6.png)

##### 2. 修改配置文件 
```js
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
```

##### 9. 运行指令:
```
npx webpack-dev-server 
```
# 4 webpack 生产环境的基本配置
## 4.1 提取 css 成单独文件
### 4.1.1. 下载安装包
![在这里插入图片描述](https://img-blog.csdnimg.cn/c374f101bc5e47c680bab5ff2ff36e57.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl8zOTA4NTgyMg==,size_16,color_FFFFFF,t_70)

### 4.1.2.下载插件 
```
npm install--save-dev mini-css-extract-plugin 
```

```js
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
```
### 4.1.3.运行指令:
```
npx webpack  serve 
```
![在这里插入图片描述](https://img-blog.csdnimg.cn/e88f7b998346440d95a0a79ea25ae09a.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl8zOTA4NTgyMg==,size_16,color_FFFFFF,t_70)

**注意:** 我們在打包的资源中包含了图片,所以在output中需要配置公共路径publicPath: '/build/'

## 4.2css 兼容性处理
### 4.2.1.下载 loader 
```
npm install--save -dev postcss-loader postcss-preset-env 
```

### 4.2.2.修改配置文件 
```js
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
```
### 4.2.3. 修改 package.json 
 ```json
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
```
### 4.2.4. 运行指令:
 ```
webpack
```
### 4.2.5.执行效果:
开发环境:
![在这里插入图片描述](https://img-blog.csdnimg.cn/f7302b66a0ee4aa7a83990e75a71d9fa.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl8zOTA4NTgyMg==,size_16,color_FFFFFF,t_70)


生产环境:![在这里插入图片描述](https://img-blog.csdnimg.cn/34489741bc00428a9ae3408b6d250f2d.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl8zOTA4NTgyMg==,size_16,color_FFFFFF,t_70)


## 4.3 压缩 css
###### 1. 下载安装包
 ```
 npm install--save -dev optimize-css-assets-webpack-plugin 
```
###### 2. 修改配置文件 
 ```js
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
```
###### 3. 运行指令:
```
webpack
```
###### 4.效果:
![在这里插入图片描述](https://img-blog.csdnimg.cn/273ce660c325486e9b8e65693d53658f.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl8zOTA4NTgyMg==,size_16,color_FFFFFF,t_70)

## 4.4 JS语法检查
###### 1. 下载安装包
```
 npm install--save -dev eslint-loader eslint eslint-config-airbnb-base eslint-plugin-import
```
###### 2. 修改配置文件 
```js
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
```

###### 3. 配置 package.json
```json
"eslintConfig": {
    "extends": "airbnb-base",
    "env": {
      "browser": true
    }
  }
```
###### 4. 运行指令:
```
webpack
```
备注:

 - 1.当我们调试时无法避免会有一些eslint的警告,我们可以使用 //eslint-disable-next-line 来使下一行不进行eslint检查,如:
   ![在这里插入图片描述](https://img-blog.csdnimg.cn/d1260d337bb94bfbb0ba4a5e7e4d3714.png)
   
 
 - 2.eslint详细配置:https://www.cnblogs.com/jackson1/p/12682664.html

## 4.5 js 兼容性处理
###### 1. 下载安装包 
```
npm install --save -dev babel-loader @babel/core @babel/preset-env @babel/polyfill core-js
```
###### 2. 修改配置文件 
 ```js
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
```

###### 3.执行
```
webpack
```
###### 4.执行效果
![在这里插入图片描述](https://img-blog.csdnimg.cn/eeaf4a78793748e2bfafc2c82c50c6c9.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl8zOTA4NTgyMg==,size_16,color_FFFFFF,t_70)

## 4.6 js 压缩和HTML 压缩
### 4.6.1 js 压缩
生产环境下会自动压缩 js 代码;在webopack.config.js文件中直接修改mode即可
```
 mode: 'production' 
```
### 4.6.2 HTML 压缩
我们在使用HtmlWebpackPlugin 时候新增minify配置项即可
```js
  new HtmlWebpackPlugin({
      template: './src/index.html',
      minify: {
        // 移除空格:
        collapseWhitespace: true,
        // 移除注释
        removeComments: true
      }
    }),
```

## 4.7总结:webpack生产环境配置总结:
###### 1.文件目錄
![在这里插入图片描述](https://img-blog.csdnimg.cn/f502d9111ec44d4882e537e4598f6e23.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl8zOTA4NTgyMg==,size_16,color_FFFFFF,t_70)

###### 2.webpack配置文件
```js
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
```

###### 3.package.json
```json
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
```
# 5.webpack 优化配置
###### 优化分为以下几个方面:

 - webpack性能优化:开发环境和生产环境性能优化;
 - 开发环境性能优化:优化打包构建速度,优化代码调试
 - 生产环境性能优化:优化打包构建速度,优化代码运行性能

## 5.1 开发环境性能优化
### 5.1.1 HMR :
启用热替换模块(Hot Module Replacement)，也被称为 HMR。
作用：一个模块发生变化，只会重新打包构建这一个模块（而不是打包所有模块） ，极大提升构建速度	
代码：只需要在 devServer 中设置 hot 为 true，就会自动开启HMR功能（只能在开发模式下使用）
```js
devServer: {
  contentBase: resolve(__dirname, 'build'),
  compress: true,
  port: 3000,
  open: true,
  // 开启HMR功能
  // 当修改了webpack配置，新配置要想生效，必须重启webpack服务
  hot: true
}
```
每种文件实现热模块替换的情况：
样式文件：可以使用HMR功能，因为开发环境下使用的 style-loader 内部默认实现了热模块替换功能
js 文件：默认不能使用HMR功能（修改一个 js 模块所有 js 模块都会刷新）
--> 实现 HMR 需要修改 js 代码（添加支持 HMR 功能的代码）
在index.js文件中:
```js
// 绑定
if (module.hot) {
  // 一旦 module.hot 为true，说明开启了HMR功能。 --> 让HMR功能代码生效
  module.hot.accept('./print.js', function() {
    // 方法会监听 print.js 文件的变化，一旦发生变化，只有这个模块会重新打包构建，其他模块不会。
    // 会执行后面的回调函数
    print();
  });
}
```
注意：HMR 功能对 js 的处理，只能处理非入口 js 文件的其他文件。
html 文件: 默认不能使用 HMR 功能（html 不用做 HMR 功能，因为只有一个 html 文件，不需要再优化）
使用 HMR 会导致问题：html 文件不能热更新了（不会自动打包构建）
解决：修改 entry 入口，将 html 文件引入（这样 html 修改整体刷新）
entry: ['./src/js/index.js', './src/index.html']

### 5.1.2 source-map
source-map：
一种提供源代码到构建后代码的映射的技术 （如果构建后代码出错了，通过映射可以追踪源代码错误）
参数：
[inline-|hidden-|eval-][nosources-][cheap-[module-]]source-map

代码：
```js
devtool: 'eval-source-map'
```
可选方案：[生成source-map的位置|给出的错误代码信息]
1 **.source-map**  :外部，错误代码准确信息 和 源代码的错误位置
![在这里插入图片描述](https://img-blog.csdnimg.cn/9c9aac7234e04f4da1a4cb4fb134c63f.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl8zOTA4NTgyMg==,size_16,color_FFFFFF,t_70)

2.**inline-source-map**：内联，只生成一个内联 source-map，错误代码准确信息 和 源代码的错误位置
![在这里插入图片描述](https://img-blog.csdnimg.cn/48af9543602d4693a54e6cae370844a7.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl8zOTA4NTgyMg==,size_16,color_FFFFFF,t_70)

3.**hidden-source-map**：外部，错误代码错误原因，但是没有错误位置（为了隐藏源代码），不能追踪源代码错误，只能提示到构建后代码的错误位置
![在这里插入图片描述](https://img-blog.csdnimg.cn/f59d963fe41c4e54b13d8eefb5646155.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl8zOTA4NTgyMg==,size_16,color_FFFFFF,t_70)

4.**eval-source-map**：内联，每一个文件都生成对应的 source-map，都在 eval 中，错误代码准确信息 和 源代码的错误位
![在这里插入图片描述](https://img-blog.csdnimg.cn/0d009ada0e554f1e98ad988ccf9f1fe1.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl8zOTA4NTgyMg==,size_16,color_FFFFFF,t_70)

5.**nosources-source-map**：外部，错误代码准确信息，但是没有任何源代码信息（为了隐藏源代码）
![在这里插入图片描述](https://img-blog.csdnimg.cn/464b4ccec39a43d29dd11bdbb9988f9c.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl8zOTA4NTgyMg==,size_16,color_FFFFFF,t_70)

6.**cheap-source-map**：外部，错误代码准确信息 和 源代码的错误位置，只能把错误精确到整行，忽略列
![在这里插入图片描述](https://img-blog.csdnimg.cn/d053518434184132919b4ac4cadc81af.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl8zOTA4NTgyMg==,size_16,color_FFFFFF,t_70)

7.**cheap-module-source-map**：外部，错误代码准确信息 和 源代码的错误位置，module 会加入 loader 的 source-map

**内联 和 外部的区别：**

 1. 外部生成了文件，内联没有
 2. 内联构建速度更快

开发/生产环境可做的选择：

 ###### 开发环境 ：
    需要考虑速度快，调试更友好:
      速度快( eval > inline > cheap >... )
     eval-cheap-souce-map
     eval-source-map
    *调试更友好:
     souce-map
     cheap-module-souce-map
     cheap-souce-map
    
**最终得出最好的两种方案 :**
 1.eval-source-map（完整度高，内联速度快,脚手架默认使用） /
 2.eval-cheap-module-souce-map（错误提示忽略列但是包含其他信息，内联速度快）

 ###### 生产环境：
```
需要考虑源代码要不要隐藏，调试要不要更友好
内联会让代码体积变大，所以在生产环境不用内联
隐藏源代码
nosources-source-map 全部隐藏
hidden-source-map 只隐藏源代码，会提示构建后代码错误信息
```
**最终得出最好的两种方案 :**
 1.source-map（最完整） 
  2.cheap-module-souce-map（错误提示一整行忽略列）

## 5.2 生产环境性能优化

### 5.2.1 优化打包构建速度
#### 5.2.1.1 oneOf
**oneOf**：匹配到 loader 后就不再向后进行匹配，优化生产环境的打包构建速度
代码：
```js
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
```

#### 5.2.1.2 babel 缓存
babel 缓存：类似 HMR，将 babel 处理后的资源缓存起来（哪里的 js 改变就更新哪里，其他 js 还是用之前缓存的资源），让第二次打包构建速度更快
代码：
```js
{
  test: /\.js$/,
  exclude: /node_modules/,
  loader: 'babel-loader',
  options: {
    presets: [
      [
        '@babel/preset-env',
        {
          useBuiltIns: 'usage',
          corejs: { version: 3 },
          targets: {
            chrome: '60',
            firefox: '50'
          }
        }
      ]
    ],
    // 开启babel缓存
    // 第二次构建时，会读取之前的缓存
    cacheDirectory: true
  }
},
```

#### 5.2.1.3 文件资源缓存
文件名不变，就不会重新请求，而是再次用之前缓存的资源
1.hash: 每次 wepack 打包时会生成一个唯一的 hash 值。
```js
output: {
    // 文件名加hash值可防止缓存
    filename: 'js/built.[hash:10].js',
    path: resolve(__dirname, 'build'),
    publicPath: '/build/',
  },
```
```js
new MiniCssExtractPlugin({ filename: 'css/built.[hash:10].css' }),
```

​ 问题：重新打包，所有文件的 hsah 值都改变，会导致所有缓存失效。（可能只改动了一个文件）
2.chunkhash：根据 chunk 生成的 hash 值。来源于同一个 chunk的 hash 值一样
​ 问题：js 和 css 来自同一个chunk，hash 值是一样的（因为 css-loader 会将 css 文件加载到 js 中，所以同属于一个chunk）
```js
output: {
    // 文件名加hash值可防止缓存
    filename: 'js/built.[chunkhash:10].js',
    path: resolve(__dirname, 'build'),
    publicPath: '/build/',
  },
```
```js
new MiniCssExtractPlugin({ filename: 'css/built.[chunkhash:10].css' }),
```
3.contenthash: 根据文件的内容生成 hash 值。不同文件 hash 值一定不一样(文件内容修改，文件名里的 hash 才会改变)
修改 css 文件内容，打包后的 css 文件名 hash 值就改变，而 js 文件没有改变 hash 值就不变，这样 css 和 js 缓存就会分开判断要不要重新请求资源 --> 让代码上线运行缓存更好使用
```js
output: {
    // 文件名加hash值可防止缓存
    filename: 'js/built.[contenthash:10].js',
    path: resolve(__dirname, 'build'),
    publicPath: '/build/',
  },
```
```js
new MiniCssExtractPlugin({ filename: 'css/built.[contenthash:10].css' }),
```
打包后文件名:
![在这里插入图片描述](https://img-blog.csdnimg.cn/9660c561738c4e7ca195f43bcc5a73be.png)

修改index.js代码再打包,不修改css代码
![在这里插入图片描述](https://img-blog.csdnimg.cn/4f668497727f46ef8b47c4636e2b4468.png)


#### 5.2.1.4 tree shaking 树摇
前提：
1. 必须使用 ES6 模块化
 2. 开启 production 环境,会自动使用树摇（这样就自动会把无用代码去掉）
作用：去除无用代码,减少代码体积
在 package.json 中配置：
```json
"sideEffects": false
```
 表示所有代码都没有副作用（都可以进行 tree shaking）
这样会导致的问题：可能会把 css / @babel/polyfill 文件干掉（副作用）;这些文件都只是引入,没有使用,所以因为树摇这些文件就不会被打包了
所以可以配置：
```json
"sideEffects": ["*.css", "*.less"] 
```
不会对css/less文件tree shaking处理

#### 5.2.1.5 code split（代码分割）
代码分割。将打包输出的一个大的 bundle.js 文件拆分成多个小文件，这样可以并行加载多个文件，比加载一个文件更快。
1.多入口拆分(多页面应用可以使用此方法)
```js
entry: {
    // 多入口：有一个入口，最终输出就有一个bundle
    index: './src/js/index.js',
    test: './src/js/test.js'
  },
  output: {
    // [name]：取文件名
    filename: 'js/[name].[contenthash:10].js',
    path: resolve(__dirname, 'build')
  },
```
 打包后输出文件
![在这里插入图片描述](https://img-blog.csdnimg.cn/0c67e3de93dd4e5c9c81e48eb68ddbca.png)

2.optimization：
```js
optimization: {
    splitChunks: {
      chunks: 'all'
    }
  },
```
将 node_modules 中的代码单独打包（大小超过30kb）
自动分析多入口chunk中，有没有公共的文件。如果有会打包成单独一个chunk(比如两个模块中都引入了jquery会被打包成单独的文件)（大小超过30kb）,
例子
如果我们在index.js中引入jquery第三方工具后打包:
不加optimization配置打包:
![在这里插入图片描述](https://img-blog.csdnimg.cn/98d06a004ed04dbbbb1f386ca575d1cf.png)

加optimization配置打包:
![在这里插入图片描述](https://img-blog.csdnimg.cn/99be445df2fd43da9bb2a951a235905e.png)

其中86kb就是我们引入的jquery代码;就算有多个入口文件都引用了jquery,jquery也只会被打包一次
3.import 动态导入语法：通过js代码，让某个文件被单独打包成一个chunk
```js
/*
  import动态导入语法：能将某个文件单独打包(test文件不会和index打包在同一个文件而是单独打包)
  webpackChunkName:指定test单独打包后文件的名字
*/
import(/* webpackChunkName: 'test' */'./test')
  .then(({ mul, count }) => {
    // 文件加载成功~
    // eslint-disable-next-line
    console.log(mul(2, 5));
  })
  .catch(() => {
    // eslint-disable-next-line
    console.log('文件加载失败~');
  });
```
4.总结:常用方案是 单入口文件+optimization

#### 5.2.1.6 lazy loading（懒加载/预加载）
1.懒加载：当文件需要使用时才加载（需要代码分割）。但是如果资源较大，加载时间就会较长，有延迟。
2.正常加载：可以认为是并行加载（同一时间加载多个文件）没有先后顺序，先加载了不需要的资源就会浪费时间。
3.预加载 prefetch（兼容性很差）：会在使用之前，提前加载。等其他资源加载完毕，浏览器空闲了，再偷偷加载这个资源。这样在使用时已经加载好了，速度很快。所以在懒加载的基础上加上预加载会更好。

代码：
index.js文件中
```js
document.getElementById('btn').onclick = function() {
  // 将import的内容放在异步回调函数中使用，点击按钮，test.js才会被加载(不会重复加载)
  // webpackPrefetch: true表示开启预加载
  import(/* webpackChunkName: 'test', webpackPrefetch: true */'./test').then(({ mul }) => {
    console.log(mul(4, 5));
  });
  import('./test').then(({ mul }) => {
    console.log(mul(2, 5))
  })
};
```
分析:点击了btn按钮之后就回去加载test.js文件再调用mul()函数,当第二次点击时就直接从缓存中取并调用mul()函数
注意:
webpack懶加載打包时会報錯'import' and 'export' may only appear at the top level
![在这里插入图片描述](https://img-blog.csdnimg.cn/c1f5c468fbef484fb2be69f597ca8b7a.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl8zOTA4NTgyMg==,size_16,color_FFFFFF,t_70)

解决方案:
1.安装babel-eslint
```
npm install --save-dev babel-eslint
```
2.新建 .eslintrc文件 
```js
{
  "parser": "babel-eslint",
  "parserOptions": {
      "sourceType": "module",
      "allowImportExportEverywhere": true
  }
}
```

#### 5.2.1.7  pwa（离线可访问技术）
pwa：离线可访问技术（渐进式网络开发应用程序），使用 serviceworker 和 workbox 技术。优点是离线也能访问，缺点是兼容性差。
webpack.config.js 中配置：
1.安装:workbox-webpack-plugin:
```
npm install workbox-webpack-plugin --save-dev
```
2.使用
```js
const WorkboxWebpackPlugin = require('workbox-webpack-plugin'); // 引入插件

// plugins中加入：
new WorkboxWebpackPlugin.GenerateSW({
  /*
    1. 帮助serviceworker快速启动
    2. 删除旧的 serviceworker

    生成一个 serviceworker 配置文件
  */
  clientsClaim: true,
  skipWaiting: true
})
```
3.修改package.json中eslintConfig配置(eslint不认识 window、navigator全局变量)
```js
"eslintConfig": {
    ......
    "env": {
      "browser": true
    }
  }
```
4.1. serviceWorker代码必须运行在服务器上
```
 npm i serve -g
```
4.2,启动服务器，将打包输出的build目录下所有资源作为静态资源暴露出去
```
serve -s build 
```
5.注册serviceWorker:index.js 中还需要写一段代码来激活它的使用
```js
if ('serviceWorker' in navigator) { // 处理兼容性问题
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js') // 注册serviceWorker
      .then(() => {
        console.log('sw注册成功了~');
      })
      .catch(() => {
        console.log('sw注册失败了~');
      });
  });
}
```


#### 5.2.1.8 多进程打包
多进程打包：某个任务消耗时间较长会卡顿，多进程可以同一时间干多件事，效率更高。
优点:是提升打包速度，
缺点:是每个进程的开启和交流都会有开销（babel-loader消耗时间最久，所以使用thread-loader针对其进行优化）
js代码非常多时,使用多进程打包效果会很明显
```js
{
  test: /\.js$/,
  exclude: /node_modules/,
  use: [
    /* 
      thread-loader会对其后面的loader（这里是babel-loader）开启多进程打包。 
      进程启动大概为600ms，进程通信也有开销。(启动的开销比较昂贵，不要滥用)
      只有工作消耗时间比较长，才需要多进程打包
    */
    {
      loader: 'thread-loader',
      options: {
        workers: 2 // 进程2个
      }
    },
    {
      loader: 'babel-loader',
      options: {
        presets: [
          [
            '@babel/preset-env',
            {
              useBuiltIns: 'usage',
              corejs: { version: 3 },
              targets: {
                chrome: '60',
                firefox: '50'
              }
            }
          ]
        ],
        // 开启babel缓存
        // 第二次构建时，会读取之前的缓存
        cacheDirectory: true
      }
    }
  ]
},
```
在简单的项目中使用多线程打包:
![在这里插入图片描述](https://img-blog.csdnimg.cn/6b499a8fc86a4f01b1aced926033c296.png)

不使用多线程打包:
![在这里插入图片描述](https://img-blog.csdnimg.cn/88cd09ceb44447b982661205195bf556.png)

####  5.2.1.9 externals
```js
externals：让某些库不打包，通过 cdn 引入
webpack.config.js 中配置：
externals: {
  // 拒绝jQuery被打包进来(通过cdn引入，速度会快一些)
  // 忽略的库名 -- npm包名
  jquery: 'jQuery'
}
```
需要在 index.html 中通过 cdn 引入：
```html
<script src="https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js"></script>
```

####  5.2.1.10 dll
dll：让某些库单独打包，后直接引入到 build 中。可以在 code split 分割出 node_modules 后再用 dll 更细的分割，优化代码运行的性能。
1.新增 webpack.dll.js文件,并配置：(将 jquery 单独打包)
```js
/*
  node_modules的库会打包到一起，但是很多库的时候打包输出的js文件就太大了
  使用dll技术，对某些库（第三方库：jquery、react、vue...）进行单独打包
  当运行webpack时，默认查找webpack.config.js配置文件
  需求：需要运行webpack.dll.js文件
    --> webpack --config webpack.dll.js（运行这个指令表示以这个配置文件打包）
*/
const { resolve } = require('path');
const webpack = require('webpack');

module.exports = {
  entry: {
    // 最终打包生成的[name] --> jquery
    // ['jquery] --> 要打包的库是jquery
    jquery: ['jquery']
  },
  output: {
    // 输出出口指定
    filename: '[name].js', // name就是jquery
    path: resolve(__dirname, 'dll'), // 打包到dll目录下
    library: '[name]_[hash]', // 打包的库里面向外暴露出去的内容叫什么名字
  },
  plugins: [
    // 打包生成一个manifest.json --> 提供jquery的映射关系（告诉webpack：jquery之后不需要再打包和暴露内容的名称）
    new webpack.DllPlugin({
      name: '[name]_[hash]', // 映射库的暴露的内容名称
      path: resolve(__dirname, 'dll/manifest.json') // 输出文件路径
    })
  ],
  mode: 'production'
};
```
2.运行这个指令表示以这个配置文件打包 (即单独打包node_module里的 依赖)
```
webpack --config webpack.dll.js
```
3.webpack.config.js 配置：(告诉 webpack 不需要再打包 jquery，并将之前打包好的 jquery 跟其他打包好的资源一同输出到 build 目录下)
```js
// 引入插件
const webpack = require('webpack');
const AddAssetHtmlWebpackPlugin = require('add-asset-html-webpack-plugin');

// plugins中配置：
plugins: [
  new HtmlWebpackPlugin({
    template: './src/index.html'
  }),
  // 告诉webpack哪些库不参与打包，同时使用时的名称也得变
  new webpack.DllReferencePlugin({
    manifest: resolve(__dirname, 'dll/manifest.json')
  }),
  // 将某个文件打包输出到build目录下，并在html中自动引入该资源
  new AddAssetHtmlWebpackPlugin({
    filepath: resolve(__dirname, 'dll/jquery.js')
  })
],
```
4.打包
```
webpack
```
5.总结:
    1.配置好webpack.dll.js  文件告诉webpack那些依赖包需要单独打包
    2.执行:webpack --config webpack.dll.js,单独打包,并单独被打包的资源路径记录在manifest.json资源映射文件中
    ![在这里插入图片描述](https://img-blog.csdnimg.cn/0eab3cb77031415682ea644a6a3d4ab7.png)
    3.执行 webpack 开始项目打包,打包过程中manifest.json拿到单独被打包的资源路径并引入到index.html文件中
![在这里插入图片描述](https://img-blog.csdnimg.cn/5ac1b481da3f409f8122a16712a78196.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl8zOTA4NTgyMg==,size_16,color_FFFFFF,t_70)

# 6.webpack配置详解
```js
entry: 入口起点
string --> './src/index.js'，单入口
打包形成一个 chunk。 输出一个 bundle 文件。此时 chunk 的名称默认是 main
array --> ['./src/index.js', './src/add.js']，多入口
所有入口文件最终只会形成一个 chunk，输出出去只有一个 bundle 文件。
（一般只用在 HMR 功能中让 html 热更新生效）
object，多入口
有几个入口文件就形成几个 chunk，输出几个 bundle 文件，此时 chunk 的名称是 key 值
--> 特殊用法：
entry: {
  // 最终只会形成一个chunk, 输出出去只有一个bundle文件。
  index: ['./src/index.js', './src/count.js'], 
  // 形成一个chunk，输出一个bundle文件。
  add: './src/add.js'
}
```
## 6.2 output
```js
output: {
  // 文件名称（指定名称+目录）
  filename: 'js/[name].js',
  // 输出文件目录（将来所有资源输出的公共目录）
  path: resolve(__dirname, 'build'),
  // 所有资源引入公共路径前缀 --> 'imgs/a.jpg' --> '/imgs/a.jpg'
  publicPath: '/',
  chunkFilename: 'js/[name]_chunk.js', // 指定非入口chunk的名称
  library: '[name]', // 打包整个库后向外暴露的变量名
  libraryTarget: 'window' // 变量名添加到哪个上 browser：window
  // libraryTarget: 'global' // node：global
  // libraryTarget: 'commonjs' // conmmonjs模块 exports
},
```
## 6.3 module
```js
module: {
  rules: [
    // loader的配置
    {
      test: /\.css$/,
      // 多个loader用use
      use: ['style-loader', 'css-loader']
    },
    {
      test: /\.js$/,
      // 排除node_modules下的js文件
      exclude: /node_modules/,
      // 只检查src下的js文件
      include: resolve(__dirname, 'src'),
      enforce: 'pre', // 优先执行
      // enforce: 'post', // 延后执行
      // 单个loader用loader
      loader: 'eslint-loader',
      options: {} // 指定配置选项
    },
    {
      // 以下配置只会生效一个
      oneOf: []
    }
  ]
},
```
## 6.4 resolve
```js
// 解析模块的规则
resolve: {
  // 配置解析模块路径别名: 优点：当目录层级很复杂时，简写路径；缺点：路径不会提示
  alias: {
    $css: resolve(__dirname, 'src/css')
  },
  // 配置省略文件路径的后缀名（引入时就可以不写文件后缀名了）
  extensions: ['.js', '.json', '.jsx', '.css'],
  // 告诉 webpack 解析模块应该去找哪个目录
  modules: [resolve(__dirname, '../../node_modules'), 'node_modules']
}
```
这样配置后，引入文件就可以这样简写：import '$css/index';
## 6.5 dev server
```js
devServer: {
  // 运行代码所在的目录
  contentBase: resolve(__dirname, 'build'),
  // 监视contentBase目录下的所有文件，一旦文件变化就会reload
  watchContentBase: true,
  watchOptions: {
    // 忽略文件
    ignored: /node_modules/
  },
  // 启动gzip压缩
  compress: true,
  // 端口号
  port: 5000,
  // 域名
  host: 'localhost',
  // 自动打开浏览器
  open: true,
  // 开启HMR功能
  hot: true,
  // 不要显示启动服务器日志信息
  clientLogLevel: 'none',
  // 除了一些基本信息外，其他内容都不要显示
  quiet: true,
  // 如果出错了，不要全屏提示
  overlay: false,
  // 服务器代理，--> 解决开发环境跨域问题
  proxy: {
    // 一旦devServer(5000)服务器接收到/api/xxx的请求，就会把请求转发到另外一个服务器3000
    '/api': {
      target: 'http://localhost:3000',
      // 发送请求时，请求路径重写：将/api/xxx --> /xxx （去掉/api）
      pathRewrite: {
        '^/api': ''
      }
    }
  }
}
```
其中，跨域问题：同源策略中不同的协议、端口号、域名就会产生跨域。
正常的浏览器和服务器之间有跨域，但是服务器之间没有跨域。代码通过代理服务器运行，所以浏览器和代理服务器之间没有跨域，浏览器把请求发送到代理服务器上，代理服务器替你转发到另外一个服务器上，服务器之间没有跨域，所以请求成功。代理服务器再把接收到的响应响应给浏览器。这样就解决开发环境下的跨域问题。
## 6.6 optimization
contenthash 缓存会导致一个问题：修改 a 文件导致 b 文件 contenthash 变化。
因为在 index.js 中引入 a.js，打包后 index.js 中记录了 a.js 的 hash 值，而 a.js 改变，其重新打包后的 hash 改变，导致 index.js 文件内容中记录的 a.js 的 hash 也改变，从而重新打包后 index.js 的 hash 值也会变，这样就会使缓存失效。（改变的是a.js文件但是 index.js 文件的 hash 值也改变了）
解决办法：runtimeChunk --> 将当前模块记录其他模块的 hash 单独打包为一个文件 runtime，这样 a.js 的 hash 改变只会影响 runtime 文件，不会影响到 index.js 文件
```js
output: {
  filename: 'js/[name].[contenthash:10].js',
  path: resolve(__dirname, 'build'),
  chunkFilename: 'js/[name].[contenthash:10]_chunk.js' // 指定非入口文件的其他chunk的名字加_chunk
},
optimization: {
  splitChunks: {
    chunks: 'all',
    /* 以下都是splitChunks默认配置，可以不写
    miniSize: 30 * 1024, // 分割的chunk最小为30kb（大于30kb的才分割）
    maxSize: 0, // 最大没有限制
    minChunks: 1, // 要提取的chunk最少被引用1次
    maxAsyncRequests: 5, // 按需加载时并行加载的文件的最大数量为5
    maxInitialRequests: 3, // 入口js文件最大并行请求数量
    automaticNameDelimiter: '~', // 名称连接符
    name: true, // 可以使用命名规则
    cacheGroups: { // 分割chunk的组
      vendors: {
        // node_modules中的文件会被打包到vendors组的chunk中，--> vendors~xxx.js
        // 满足上面的公共规则，大小超过30kb、至少被引用一次
        test: /[\\/]node_modules[\\/]/,
        // 优先级
        priority: -10
      },
      default: {
        // 要提取的chunk最少被引用2次
        minChunks: 2,
        prority: -20,
        // 如果当前要打包的模块和之前已经被提取的模块是同一个，就会复用，而不是重新打包
        reuseExistingChunk: true
      }
    } */
  },
  // 将index.js记录的a.js的hash值单独打包到runtime文件中,防止修改a文件导致b文件的hash值变化,最后index.js文件里的应用b的文件名没变会出问题
  runtimeChunk: {
    name: entrypoint => `runtime-${entrypoint.name}`
  },
  minimizer: [
    // 配置生产环境的压缩方案：js/css
    new TerserWebpackPlugin({
      // 开启缓存
      cache: true,
      // 开启多进程打包
      parallel: true,
      // 启用sourceMap(否则会被压缩掉)
      sourceMap: true
    })
  ]
}
```
