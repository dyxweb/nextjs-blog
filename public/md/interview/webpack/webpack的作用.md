## webpack的作用
> webpack是一个用于现代JavaScript应用程序(支持ESM和CommonJS)的静态模块打包工具，可以支持许多不同的静态资源，例如：images, fonts和stylesheets。当 webpack处理应用程序时，它会在内部从一个或多个入口点构建一个依赖图(dependency graph)，然后将你项目中所需的每一个模块组合成一个或多个bundles，它们均为静态资源，用于展示你的内容。

- Entry：编译入口，webpack编译的起点。
- Compiler：编译管理器，webpack启动后会创建compiler对象，该对象一直存活直到结束退出。
- Compilation：单次编辑过程的管理器，比如watch=true时，运行过程中只有一个compiler但每次文件变更触发重新编译时，都会创建一个新的 compilation对象。
- Dependence：依赖对象，webpack基于该类型记录模块间依赖关系。
- Module：webpack内部所有资源都会以“module”对象形式存在，所有关于资源的操作、转译、合并都是以“module”为基本单位进行的。
- Chunk：编译完成准备输出时，webpack会将module按特定的规则组织成一个一个的chunk，这些chunk某种程度上跟最终输出一一对应。
- Loader：资源内容转换器，其实就是实现从内容A转换B的转换器。
- Plugin：webpack构建过程中，会在特定的时机广播对应的事件，插件监听这些事件，在特定时间点介入编译过程。
### webpack配置大体框架
```
module.exports = {
  // 模式
  mode: 'development',

  // 入口
  entry: {},

  // 打包输出
  output: {},

  // 配置模块如何解析
  resolve: {},

  // 配置各种loader
  module: {},

  // 配置插件
  plugins: [],

  // 优化（可以进行代码分割）
  optimization: {},

  // webpack-dev-server 开发时的配置，一般用于development模式
  devServer: {}
};
```
### mode
> 告知webpack使用相应模式的内置优化。默认值为production。

- development开发模式，打包更加快速，省了代码优化步骤。
- production生产模式，打包比较慢，会开启tree-shaking和代码压缩。
- none不使用任何默认优化选项。
```
module.exports = {
  mode: 'development',
};

// 打包命令中传递参数
webpack --mode=development
```
