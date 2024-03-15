## webpack5变化
### 模块联邦
### 更好的hash算法
> webpack4有hash、chunckhash、contenthash三种。在webpack5中，把hash改成了fullhash。webpack4对于添加注释和修改变量是会影响contenthash的计算，如果是webpack5的就不会影响contenthash的计算。

```
// before
const num = 1;
console.log('这里是输出', num);

// after
const str = 1;
console.log('这里是输出', str);
```
- hash/fullhash
> hash/fullhash是根据打包中的所有文件计算出来的 hash 值，在一次打包中，所有的资源出口文件的filename获得的 hash 都是一样的。

- chunckhash
> chunckhash是根据打包过程中当前 chunck 计算出来的 hash 值。

- contenthash
> contenthash是根据打包时的内容计算出的 hash 值。

### 持久性缓存来提高构建性能
> 在webpack5之前，webpack是没有提供持久化缓存，需要使用类似cache-loader、模块缓存插件hard-source-webpack-plugin来做缓存方面的处理。在webpack5中加入了持久化缓存，hard-source-webpack-plugin插件内置，缓存webpack生成的模块和chunk来改善构建速度。cache会在开发模式被设置成type: 'memory'，在生产模式中被禁用。

- cache.type: memory 表示会将打包生成的资源存放于内存中。
- cache.type: filesystem 表示开启了文件系统缓存。
```
// webpack 4
module.exports = {
  module: {
    rules: [
      {
        test: /.js$/,
        use: ['cache-loader', ...loaders],
        include: path.resolve('src'),
      },
    ],
  },
};

// webpack 5
module.exports = {
  cache: {
    type: 'filesystem',
  },
};
```
### Tree Shaking的改进
> Tree shaking是一个术语，通常用于移除 JavaScript 上下文中的未引用代码(dead-code)。它依赖于 ES2015 模块语法的静态结构特性，例如 import 和 export。在webpack4中，Tree Shaking对嵌套的导出模块未使用代码无法很好进行Tree Shaking，我们可以借助一些plugin来实现，但是到了webpack5得到了很大的改进。

```
// a.js
const name = 'dyxweb';
const age = 26;
export { name, age };

// b.js
import * as data from './a';
export { data };

// index.js
import * as common from './b';
// 只是使用了 age，而没有使用 name
console.log(common.data.age);

// webpack5打包会移除未使用的变量，但是webpack4没有移除
```
### Asset Modules资源模块
> 指的是图片和字体等这一类型文件模块，它们无须使用额外的预处理器，webpack 通过一些配置就可以完成对它们的解析。在webpack5之前，没有内置资源模块，所以我们通常使用file-loader、url-loader、raw-loader之类的loader去处理。

- asset/resource 发送一个单独的文件并导出 URL。之前通过使用 file-loader 实现。
- asset/inline 导出一个资源的 data URI。之前通过使用 url-loader 实现。
- asset/source 导出资源的源代码。之前通过使用 raw-loader 实现。
- asset 在导出一个 data URI 和发送一个单独的文件之间自动选择。之前通过使用 url-loader，并且配置资源体积限制实现。

### 自动清除上次打包内容
> webpack5配置output.clean: true可以自动清除上次打包内容。webpack4需要使用clean-webpack-plugin清除上次打包内容。

### 热更新
> webpack5设置devServer.hot为true即可实现热更新。webpack4需要使用webpack.HotModuleReplacementPlugin插件实现热更新，webpack5已经内置该插件。
