## [Babel配置](https://juejin.cn/post/7197666704435920957)
### @bable/preset-env
#### modules
- 启用ES模块语法向另一种模块类型的转换。
- 默认值：auto。可取的值："amd" | "umd" | "systemjs" | "commonjs" | "cjs" | "auto" | false。
- 当我们设置成false的时候，Babel编译使用的一些辅助函数的引入方式会变成ES6模块方式import。可以对代码静态分析很好地tree shaking减少代码体积，所以我们配置Babel的时候建议设置modules: false。
#### targets
- 用来设置我们的代码需要兼容的目标环境，可以有效地减少ES6+的语法编译，也可以有效控制polyfill导入的多少。
- 如果没有设置这个配置项时会去Babel配置文件找顶层的targets。如果顶层没有设置targets则会去package.json里的browserslist或者根目录找.browserslistrc文件。如果还没有则默认值为{}。
- 如果没有设置这个配置项时Babel会假设我们要兼容的目标环境是最旧的浏览器，所以会将所有的ES6+语法代码转化为ES5。所以在配置Babel的时候，要设置targets以减少输出代码大小。
#### useBuiltIns
> 这个配置就是用来设置我们core-js的垫平方式的。

- entry
  - 我们需要手动import所有或者某块polyfill。
  - Babel会根据我们设置的targets(目标环境)，来判断我们手动import的所有或者某块polyfill是不是当前缺失的，如果是的话就会把我们手动import所有或者某块polyfill拆分成很多小模块，引入我们目标环境不支持的模块。
  - 为了避免一些奇奇怪怪的问题，我们手动import的polyfill应该统一在入口文件。
  - 如果我们想一劳永逸，直接把当前环境所有不支持的ES6+ API垫平，那我们就import 'core-js/stable'(这会垫平当前targets不支持的所有稳定版本的ES6+ API，所以也会导致包变大)。
  - 如果我们只想垫平某个ES6+ API(前提是targets不支持这个API，否则手动import了也没用)。例如只想垫平Promise那我们import 'core-js/es/promise就可以了。
  - 如果想垫平提案阶段的API，则也需要手动import对应提案的polyfill(import "core-js/proposals/string-replace-all)。
  - 垫平的polyfill都是注入到window全局的，或者是某个内置对象的原型(prototype)上，这影响到了全局。
- usage
  - 不需要手动import所有或者某块polyfill。
  - Babel会根据我们当前代码中用到的ES6+ API，并判断当前的targets支不支持我们用到的这个ES6+ API，如果不支持的话则自动导入这个ES6+ API对应的polyfill。
  - 如果第三方库用到了我们当前targets不支持的ES6+ API，但我们自己的代码没有用到这个API，那么这个API是不会被垫平的，这会导致我们项目报错。如果判断出哪块polyfill缺失，我们可以自己手动import去垫平。
  - 垫平的polyfill都是注入到window全局的，或者是某个内置对象的原型(prototype)上，这影响到了全局。
- false
  - 默认值，不会自动添加polyfill也不会根据targets判断缺不缺失，也不会将我们手动import所有或者某块polyfill拆分为单个polyfill引入。
  - 对我们的垫平方式没作用，源码是什么样，输出就是什么样。设置targets无效。
- entry VS usage
  - Promise还有很多例如Promise.any、Promise.all、Promise.finally的方法，示例代码只使用Promise不使用Promise的其它方法。
  - IE11不支持Promise，Chrome80中Promise大部分方法已经实现，只有Promise.any没有实现。
  - 使用entry手动导入import 'core-js/es/promise'的表现为：IE11下把Promise所有不支持的方法都垫平了；Chrome80下Promise大部分方法已经实现，只有Promise.any没有实现，所以此时只垫平了promise.any方法。
  - 使用usage自动导入的表现为：IE下只垫平了Promise这个对象，不会垫平它其它相关的方法，因为示例代码中只用到了单一的Promise对象没有用到其它相关方法；Chrome80下没有任何关于Promise的垫平，因为单一的Promise对象在Chrome80已经实现只有Promise.any没有实现，但是示例代码中没有用Promise.any方法，所以不会垫平Promise.any。
#### corejs
- 当我们的useBuiltIns不为false的时候，需要设置corejs这个配置项。
- 2版本的core-js已经不建议使用了，要尽可能的使用最新的版本。越新的包包含的polyfill才会越多。
- 我们设置corejs的版本号时，不要直接指定2或者3，它会被解析为2.0或者3.0。我们应该带上子版本号(3.27.2)，这样才会有最新的polyfill。
- core-js默认用稳定版的polyfill来垫平，但如果有时我们想用还处在提案阶段的API时
  - 如果我们配置的是useBuiltIns: entry，我们得手动引入core-js提案的polyfill来垫平。提案的polyfill放在core-js/proposals文件夹中(import 'core-js/proposals/array-last')。
  - 如果我们配置的是useBuiltIns: 'usage'，需要把corejs的proposals配置项设为true。
```
{
  useBuiltIns: 'usage',
  corejs: {
    version: '3.27.2',
    // 是否编译提案阶段ES6+ API
    proposals: true
  },
}
```
### @babel/plugin-transform-runtime
#### helpers
- 控制的是我们的辅助函数，是否不内联进我们的代码中。
- 默认值是true，true的话是不内联，而是引用@babel/runtime辅助函数集合包；false的话，则会内联。
#### regenerator
- 控制的是我们regenerator-runtime这个包的代码，是否不内联进我们的代码中。
- 默认值是true，true的话是不内联，而是引用@babel/runtime辅助函数集合包；false的话，则会内联。
#### corejs
> 不想以全局的方式、污染的方式垫平我们的ES6+ API，我们corejs就不能为false，并且优先使用@babel/runtime-corejs3这个包来垫平(设置为3)。

- corejs这个配置项一旦不为false，就是用来设置我们要垫平的ES6+ API以不污染全局的方式垫平。
- false：默认值，对应依赖@babel/runtime。
- 2：对应依赖@babel/runtime-corejs2，只能支持编译全局变量(如Promise)和静态属性(如Array.from)，不能编译实例相关方法([].includes)。
- 3：对应依赖@babel/runtime-corejs3，既能支持编译全局变量和静态属性，又能编译实例方法，开启proposals: true还可以编译提案阶段的API。
### 总结
- @babel/preset-env是以全局注入方式垫平，@babel/plugin-transform-runtime是以局部变量方式垫平，两者我们应该选择其一，不要又用@babel/preset-env配置方式，又用@babel/plugin-transform-runtime配置方式，这样会出现一些奇奇怪怪的问题。
- 因为使用@babel/plugin-transform-runtime垫平是以局部变量的方式来垫平，所以@babel/plugin-transform-runtime这种配置方式更适合来做三方库的开发。它可以很好的帮我们的库与使用者的项目解耦。
### 开发的项目是应用程序可以这么配置
- 安装依赖
```
npm install @babel/core @babel/preset-env @babel/plugin-transform-runtime @babel/runtime -D
npm install core-js -S
```
- babel.config.js
```
module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        modules: false,
        useBuiltIns: "usage",
        corejs: {
          version: '3.27.2',
          proposals: true
        }
      }
    ],
  ],
  plugins: [
    "@babel/plugin-transform-runtime",
  ]
}
```
- .browserslistrc
```
> 0.2% in CN
last 10 versions
```
- 入口文件(如果useBuiltIns设置为entry时需要引入以下)
```
// 垫平全部ES6+稳定版API
import 'core-js/stable';

// 垫平所有ES6+ API，包括提案阶段
import 'core-js';
```
- 如果useBuiltIns设置为usage时在某些浏览器下特殊的API无法使用使用时可以单独在入口文件垫平特殊的API
```
// 特殊垫平Object.hasOwn方法
import 'core-js/stable/object/has-own';
```
### 开发一个第三方库可以这样配置
- 安装依赖
```
npm install @babel/core @babel/preset-env @babel/plugin-transform-runtime @babel/runtime -D
npm install @babel/runtime-corejs3 -S
```
- babel.config.js
```
module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        modules: false,
      }
    ],
  ],
  plugins: [
    [
      '@babel/plugin-transform-runtime',
      {
        corejs: {
          version: 3,
          proposals: true
        }
      }
    ]
  ]
}
```
- .browserslistrc
```
> 0.2% in CN
last 10 versions
```