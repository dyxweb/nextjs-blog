## [Babel](https://juejin.cn/post/7190312484492804156)
> Babel是一个JavaScript编译器，主要用于将使用ECMAScript 2015+(ES6+)语法编写的代码转换为向后兼容的JavaScript语法，以便能够运行在当前和旧版本的浏览器或其他环境中。

- ES6+最新语法转化(let、class、箭头函数等)。
- 实现旧版本浏览器不支持的ES6+的API(Promise、Symbol、Array.prototype.includes等)。
- 实现ES6+最新语法转化只需要使用@babel/preset-env就可以。
- 实现旧版本浏览器不支持的ES6+的API就需要用core-js这个包来提供polyfill，并与@babel/preset-env或者@babel/plugin-transform-runtime的配置功能相互配合使用。
### Babel配置文件大致架构
> 一般主要用到的是presets、plugins这两个配置。

```
// babel.config.js
module.exports = {
  ...,
  sourceType: "unambiguous",
  envName: "development",
  presets: [],
  plugins: [],
  passPerPreset: false,
  targets: {},
  browserslistConfigFile: true,
  browserslistEnv: undefined,
  inputSourceMap: true
  ...
}
```
### @babel/core
> Babel实现编译的核心库。要使用Babel，@babel/core一定是必不可少的。平常说的babel版本指的就是@babel/core的版本。

```
npm install @babel/core -D
```
### @babel/cli
> cli命令行工具，可通过命令行编译文件。

### @babel/preset-env
- @babel/preset-env是一个智能预设，通过@babel/preset-env我们可以使用最新的JavaScript，而无需微观管理目标环境需要哪些语法转换(以及可选的浏览器polyfill)，也可以让JavaScript的包更小。
- @babel/preset-env只编译ES6+语法并不提供polyfill，但是可以通过配置我们代码运行的目标环境，从而控制polyfill的导入跟语法编译，使ES6+的新特性可以在我们想要的目标环境中顺利运行。
- 可以通过@babel/preset-env --> package.json --> dependencies查看@babel/preset-env包含了哪些预设。
```
npm install @babel/preset-env -D
```
#### preset预设
- Babel编译ES6+语法是通过一个个plugin去实现的，@babel/preset-env是一个语法插件集合包，通过@babel/preset-env我们只用安装这一个包，不需要一个个配插件，就可以编译ES6+语法了。
#### env环境
- @babel/preset-env还有一个配置功能，我们可以通过配置我们代码运行的目标环境，来控制polyfill(一个提供低版本浏览器缺失的ES6+新特性的方法与实现的集合)的导入跟语法编译，从而使ES6+新的特性可以在我们想要的目标环境中顺利运行。
### polyfill
- ES6+除了提供很多简洁的语法(let、class、箭头函数等)外，还为我们提供了很多便捷的API(Promise、Symbol、Array.prototype.includes等)。但旧版本浏览器是不支持这些API的，而polyfill存放了这些API方法的实现，所以通过polyfill可以在不支持ES6+ API的浏览器中正常使用这些API。这种存放了ES6+的API方法实现的集合叫做polyfill，也就是我们经常说的垫片。
- polyfill分很多种，像core-js是会提供旧版本浏览器缺失的所有的API。还有一些只提供某个API的polyfill，例如promise-polyfill、proxy-polyfill等。
- Babel配置polyfill的过程就是实现旧版本浏览器对这些API支持的过程。
### @babel/polyfill
```
npm install @babel/polyfill -S
```
- 这个包由core-js(版本为2.x.x，放了很多ES6+ API的实现)与regenerator-runtime(Async、Generator函数使用)两个包组成。
- 这个包在Babel 7.4.0以后就废弃了，所以在Babel 7.4.0以后，想让一些不支持ES6+ API的旧版本浏览器支持这些API，直接安装core-js@3.x.x的包即可。
- 在Babel 7.18.0及其以后的版本，regenerator-runtime包里面的内容会以局部变量的方式内联注入到我们的代码中，所以我们只用引入import "core-js/stable"这一个包就可以了。
- Babel 7.4.0版本之前引入polyfill
```
import '@babel/polyfill';
```
- Babel 7.18.0版本之前引入polyfill形式
```
import "core-js/stable"; // core-js必须是3.x.x版本，因为2.x.x版本，不包含stable文件夹
import "regenerator-runtime/runtime";
```
- Babel 7.18.0及其以后的版本引入polyfill形式
```
// 不需要再 import "regenerator-runtime/runtime";
import "core-js/stable"; // core-js必须是3.x.x版本，因为2.x.x版本，不包含stable文件夹
```
### core-js
> 会提供旧版本浏览器缺失的所有的ES6+的API。

```
npm install core-js -S
```
- 当我们想垫平所有的ES6+的API(包括提案阶段)，可以导入core-js所有内容。
```
import 'core-js';
```
- 当需要垫平所有稳定版本的ES6+的API，可以导入stable文件夹。
```
import 'core-js/stable';
```
- 当只需要垫平某个稳定的ES6+的API，可以导入es这个文件夹里的polyfill来垫平。
```
import X from 'core-js/es/xx';
```
- 当需要用到提案阶段的API时，可以导入proposals这个文件夹里的polyfill来垫平。
```
import X from 'core-js/proposals/xx';
```
### @babel/runtime
> 在Babel编译的时候，编译以后会生成很多辅助函数，这些函数就是ES6+一些语法糖的实现，并且会以内联的方式插入到我们的代码中。@babel/runtime是存放了Babel辅助函数的一个集合包。

```
npm install @babel/runtime -S
```
### @babel/plugin-transform-runtime
- @babel/plugin-transform-runtime会将我们用到的辅助函数，从@babel/runtime中以require的方式引入到我们的文件中实现复用，避免多个文件使用ES6+语法糖辅助函数生成多次内联插入多次的问题，从而减小我们最终输出包的体积。
- @babel/runtime跟@babel/plugin-transform-runtime通常是配合一起使用。
- 也有一个配置功能，用来处理polyfill如何垫平。
```
npm install @babel/plugin-transform-runtime -D
```
### @babel/preset-react
> 使用@babel/preset-react转化jsx语法。

```
npm install @babel/preset-react -D
```
### @babel/preset-typescript
> 使用@babel/preset-typescript将ts语法转化为js语法。

```
npm install @babel/preset-typescript -D
```

### babel-loader
> webpack中loader的本质就是一个函数，接受我们的源代码作为入参同时返回新的内容。babel-loader的作用就是将匹配到的js相关文件进行编译。babel-loader支持直接通过loader的参数形式注入，同时也支持在loader函数内部自动读取`.babelrc、babel.config.js、babel.config.json`等文件配置。

```
npm install babel-loader -D
```
