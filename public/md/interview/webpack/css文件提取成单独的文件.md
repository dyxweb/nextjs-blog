## css文件提取成单独的文件
### webpack生产环境构建时为什么要将css文件提取成单独的文件
1. 更好的缓存，当CSS和JS分开时浏览器可以缓存CSS文件并重复使用，也不用因为js内容的变化，导致css缓存失效。
2. 更快的渲染速度，浏览器是同时可以并行加载多个静态资源，将css从js中抽离出来后能够加快js的加载与解析速度，最终加快页面的渲染速度。
3. 更好的代码可读性，独立的css文件更方便代码的阅读与调试。
### 使用mini-css-extract-plugin提取css文件
- 安装依赖
```
npm i mini-css-extract-plugin -D
```
- 修改webpack.common.js，根据环境变量设置开发环境使用style-loader，生产环境使用MiniCssExtractPlugin.loader抽离css。
```
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const isDev = process.env.NODE_ENV === 'development'; // 是否是开发模式

module.exports = {
  // ...
  module: {
    rules: [
      // ...
      {
        test: /\.css$/,
        use: [
          isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader'
        ]
      },
      // ...
    ]
  },
  // ...
}
```
- 修改webpack.prod.js, 打包时添加抽离css插件
```
const { merge } = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const commonConfig = require('./webpack.common.js');

module.exports = merge(commonConfig, {
  mode: 'production',
  plugins: [
    // 抽离css插件
    new MiniCssExtractPlugin({
      filename: 'static/css/[name].[contenthash:8].css' // 抽离css的输出目录和名称
    }),
  ]
})
```
### mini-css-extract-plugin流程
1. MiniCssExtractPlugin插件会先注册CssModuleFactory与CssDependency。
2. 然后在MiniCssExtractPlugin.loader使用child compiler(webpack5.33.2之后默认使用importModule方法)以css文件为入口进行子编译，子编译流程跑完之后，最终会得到CssDependency。
3. 然后webpack会根据模块是否有dependencies，继续解析子依赖，当碰到CssDenpendcy的时候会先找到CssModuleFactory，然后通过CssModuleFactory.create创建一个css module。
4. 当所有模块都处理完之后，会根据MiniCssExtractPlugin插件内注册的renderManifest hook callback，将当前chunk内所有的css module合并到一起，然后webpack会根据manifest创建assets。
5. 最终webpack会根据assets在生成最终的文件。