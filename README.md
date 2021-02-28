**第 1 章：webpack 简介**

**1.1webpack 是什么**

webpack 是一种前端资源构建工具，一个静态模块打包器(modulebundler)。 在 webpack 看来, 前端的所有资源文件(js/json/css/img/less/...)都会作为模块处理。 它将根据模块的依赖关系进行静态分析，打包生成对应的静态资源(**bundle**)。

![img](C:\Users\111\AppData\Local\YNote\data\weixinobU7VjgaqeWxTrL0pXURPznSRq6g\8f9921594a93448dadd5593e63a78b3d\clipboard.png)

**1.2webpack 五个核心概念**

   **1.2.1Entry**

入口(Entry)指示 webpack 以哪个文件为入口起点开始打包，分析构建内部依赖图。

   **1.2.2Output**

输出(Output)指示 webpack 打包后的资源 bundles 输出到哪里去，以及如何命名。

   **1.2.3Loader**

Loader 让 webpack 能够去处理那些非 JavaScript 文件(webpack 自身只理解 JavaScript),相当于一个翻译官

   **1.2.4Plugins**

插件(Plugins)可以用于执行范围更广的任务。插件的范围包括，从打包优化和压缩，一直到重新定义环境中的变量等

   **1.2.5Mode**

模式(Mode)指示 webpack 使用相应模式的配置。

| 选项        | 描述                                                         | 特点                        |
| ----------- | ------------------------------------------------------------ | --------------------------- |
| development | 会将 DefinePlugin 中 process.env.NODE_ENV 的值设置 为 development。启用 NamedChunksPlugin 和 NamedModulesPlugin。 | 能让代码本地调试 运行的环境 |
| production  | 会将 DefinePlugin 中 process.env.NODE_ENV 的值设置 为 production。启用 FlagDependencyUsagePlugin, FlagIncludedChunksPlugin,ModuleConcatenationPlugin, NoEmitOnErrorsPlugin,OccurrenceOrderPlugin, SideEffectsFlagPlugin 和 TerserPlugin。 | 能让代码优化上线 运行的环境 |



**第 2 章：webpack 的初体验**

  **2.1 初始化配置**

​    **1. 初始化 package.json 输入指令:** 

npm  init 

**2. 下载并安装 webpack 输入指令:** 

```nginx
npm  install  webpack  webpack-cli -g  npm  install  webpack  webpack-cli -D 
```

**2.2 编译打包应用**

**1. 创建文件** 

**2. 运行指令**

 **开发环境指令：**  

```node
webpack ./src/index.js -o ./build/built.js --mode=development 
```



功能：webpack会以 ./src/index.js 为入口文件开始打包，打包后输出到 ./build/built.js 整体打包环境，是开发环境;webpack 能够编译打包 js 和 json 文件，并且能将 es6 的模块化语法转换成浏览器能识别的语法。

**生产环境指令：**

```js
webpack ./src/index.js -o ./build/built.js --mode=production 
```

功能：webpack会以 ./src/index.js 为入口文件开始打包，打包后输出到 ./build/built.js 整体打包环境，是生产环境;在开发配置功能上多一个功能，压缩代码。

\3. 结论 

- webpack 本身能处理 js/json 资源，不能处理 css/img 等其他资源
- 生产环境和开发环境将 ES6 模块化编译成浏览器能识别的模块化，但是不能处理 ES6  的基本语法转化为 ES5（需要借助 loader）
- 生产环境比开发环境多一个压缩 js 代码

![img](C:\Users\111\AppData\Local\YNote\data\weixinobU7VjgaqeWxTrL0pXURPznSRq6g\c00054709f8b48729b5f1f6264dc51f5\clipboard.png)

**第 3 章：webpack 开发环境的基本配置**

**3.1 创建配置文件**

\1. 创建文件 webpack.config.js

\2. 配置内容如下

const { resolve } = require('path');/ /node内置核心模块,用来处理路径问题  module.exports = { entry: './src/js/index.js', / / 入 口 文 件 output: { / / 输 出 配 置 filename: './built.js', / / 输 出 文 件 名 path: resolve(__dirname, 'build/js') / / 输 出 文 件 路 径 配 置 }, mode: 'development' / / 开 发 环 境 };  

\3. 运行指令:webpack 

\4. 结论: 此时功能与上节一致

**3.2 打包样式资源**

\1. 创建文件

![img](C:\Users\111\AppData\Local\YNote\data\weixinobU7VjgaqeWxTrL0pXURPznSRq6g\f7e8e0a208ba40a2a3987ed12935a985\clipboard.png)

\2. 下载安装 loader 包 

npm i css-loader style-loader less-loader less -D 

\3. 修改配置文件 

// resolve 用来拼接绝对路径的方法 const { resolve } = require('path'); module.exports = {   // webpack 配置 // 入口起点    entry: './src/index.js',   // 输出    output: {     // 输出文件名 filename: 'built.js',     // 输出路径      // __dirname nodejs 的变量，代表当前文件的目录绝对路径      path: resolve(__dirname, 'build')   },   // loader 的配置   module: {     rules: [       // 详细 loader 配置       // 不同文件必须配置不同 loader 处理        {         // 匹配哪些文件          test: /\.css$/,         // 使用哪些 loader 进行处理          use: [           // use 数组中 loader 执行顺序：从右到左，从下到上 依次执行           // 创建 style 标签，将 js 中的样式资源插入进行，添加到 head 中生效           'style-loader',           // 将 css 文件变成 commonjs 模块加载 js 中，里面内容是样式字符串            'css-loader'         ]       }, {         test: /\.less$/,         use: ['style-loader', 'css-loader',           // 将 less 文件编译成 css 文件            // 需要下载 less-loader 和 less           'less-loader'         ]       }     ]   },   // plugins 的配置    plugins: [     // 详细 plugins 的配置   ],   // 模式   mode: 'development',   // 开发模式    // mode: 'production' } 

\4. 运行指令:webpack

**3.3 打包 HTML 资源**

\1. 创建文件

![img](C:\Users\111\AppData\Local\YNote\data\weixinobU7VjgaqeWxTrL0pXURPznSRq6g\3fb8edfc39f24a019f141f84c780328a\clipboard.png)

\2. 下载安装 plugin 包 

npm install --save -dev html-webpack-plugin  

\3. 修改配置文件

const { resolve } = require('path');  const HtmlWebpackPlugin = require('html-webpack-plugin'); module.exports = {   entry: './src/index.js',   output: {     filename: 'built.js',     path: resolve(__dirname, 'build')   },   module: {     rules: [       // loader 的配置      ]   }, plugins: [     // plugins 的配置      // html-webpack-plugin      // 功能：默认会创建一个空的 HTML，自动引入打包输出的所有资源（JS/CSS）      // 需求：需要有结构的 HTML 文件      new HtmlWebpackPlugin({       // 复制 './src/index.html' 文件，并自动引入打包输出的所有资源（JS/CSS）        template: './src/index.html'     })   ],   mode: 'development' }; 

4.运行指令:webpack

**3.4 打包图片资源**

\1. 创建文件

![img](C:\Users\111\AppData\Local\YNote\data\weixinobU7VjgaqeWxTrL0pXURPznSRq6g\ba56f9e52a844fc29156e75501c641b8\clipboard.png)

\2. 下载安装 loader 包 

npm  install --save-dev html-withimg-loader url-loader file-loader 

\3. 修改配置文件

const { resolve } = require('path'); const HtmlWebpackPlugin = require('html-webpack-plugin'); module.exports = {   entry: './src/index.js',   output: {     filename: 'built.js',     path: resolve(__dirname, 'build')   }, module: {     rules: [       {         test: /\.less$/,         // 要使用多个 loader 处理用 use         use: ['style-loader', 'css-loader', 'less-loader']       }, {         // 问题：默认处理不了 html 中 img 图片          // 处理图片资源          test: /\.(jpg|png|gif)$/,         // 使用一个 loader          // 下载 url-loader file-loader          loader: 'url-loader',         options: {           // 图片大小小于 8kb，就会被 base64 处理            // 优点: 减少请求数量（减轻服务器压力）            // 缺点：图片体积会更大（文件请求速度更慢）            limit: 8 * 1024,           // 问题： 因为url-loader默认使用es6模块化解析， 而html-withimg-loader引入图片是commonjs            // 解析时会出问题：[object Module]            // 解决：关闭 url-loader 的 es6 模块化，使用 commonjs 解析            esModule: false,           // 给图片进行重命名 // [hash:10]取图片的 hash 的前 10 位            // [ext]取文件原来扩展名            name: '[hash:10].[ext]'         }       }, {         // 解析 html中的图片资源         test: /\.(html|htm)$/i,         use: 'html-withimg-loader',        }     ]   }, plugins: [new HtmlWebpackPlugin({ template: './src/index.html' })],   mode: 'development' };  

\4. 运行指令:webpack

**3.5 打包其他资源**

\1. 创建文件

![img](C:\Users\111\AppData\Local\YNote\data\weixinobU7VjgaqeWxTrL0pXURPznSRq6g\7ffa31f1a2f64fc89009f30f4fdcd5e9\clipboard.png)

\2. 修改配置文件 

const { resolve } = require('path'); const HtmlWebpackPlugin = require('html-webpack-plugin'); module.exports = {   entry: './src/index.js',   output: {     filename: 'built.js',     path: resolve(__dirname, 'build')   },   module: {     rules: [       {         test: /\.css$/,         use: ['style-loader', 'css-loader']       },       // 打包其他资源(除了 html/js/css 资源以外的资源)        {         // 排除 css/js/html 资源          exclude: /\.(css|js|html|less|gif|img|png|jpg)$/,         loader: 'file-loader',         options: {           name: '[hash:10].[ext]'         }       }     ]   },   plugins: [new HtmlWebpackPlugin({ template: './src/index.html' })],   mode: 'development' };  



\4. 运行指令:webpack



**备:资源类型1-5汇总:**

const { resolve } = require('path'); const HtmlWebpackPlugin = require('html-webpack-plugin') module.exports = {   entry: './src/index.js',   output: {     filename: 'built.js',     path: resolve(__dirname, 'build')   },   module: {     rules: [       {         test: /\.css$/,         use: [           'style-loader',           'css-loader',         ]       },       {         test: /\.less$/,         use: [           'style-loader',           'css-loader',           'less-loader'         ]       },       {         test: /\.(gif|img|png|jpg)$/,         loader: 'url-loader',         options: {           limit: 8 * 1024,           name: '[hash:10].[ext]',           esModule: false         }       }, {         exclude: /\.(css|js|html|less|gif|img|png|jpg)$/,         loader: 'file-loader',         options: {           name: '[hash:10].[ext]'         }       }     ]   },   plugins: [new HtmlWebpackPlugin({ template: './src/index.html' })],   mode: 'development' } 



**3.6devserver**

**开发服务器 devServer**：用来自动化，不用每次修改后都重新输入webpack打包一遍（自动编译，自动打开浏览器，自动刷新浏览器） 	**特点：**只会在内存中编译打包，不会有任何输出（不会像之前那样在外面看到打包输出的build包，而是在内存中，关闭后会自动删除）

**启动devServer**指令为：npx webpack-dev-server 或 npx webpack serve

\1. 创建文件

![img](C:\Users\111\AppData\Local\YNote\data\weixinobU7VjgaqeWxTrL0pXURPznSRq6g\c613316a115348ffb9f639002a320077\clipboard.png)

\2. 修改配置文件 

const { resolve } = require('path'); const HtmlWebpackPlugin = require('html-webpack-plugin'); module.exports = {   entry: './src/index.js',   output: {     filename: 'built.js',     path: resolve(__dirname, 'build')   },   module: {     rules: [{       test: /\.css$/, use: ['style-loader', 'css-loader']     },     // 打包其他资源(除了 html/js/css 资源以外的资源)      {       // 排除 css/js/html/图片 资源        exclude: /\.(css|js|html|less|gif|img|png|jpg)$/,       loader: 'file-loader',       options: { name: '[hash:10].[ext]' }     }     ]   },   plugins: [     new HtmlWebpackPlugin({ template: './src/index.html' })],   mode: 'development',   devServer: {     // 项目构建后路径      contentBase: resolve(__dirname, 'build'),     // 启动 gzip 压缩      compress: true,     // 端口号      port: 3000,     // 自动打开浏览器      open: true   } }; 

\4. 运行指令:npx webpack-dev-server 或 npx webpack serve