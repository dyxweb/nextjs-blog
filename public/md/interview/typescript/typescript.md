## TypeScript
> TypeScript是一种基于JavaScript的强类型编程语言。TypeScript是添加了类型系统的JavaScript。

### 类型系统
- 动态类型是指在运行时才会进行类型检查，这种语言的类型错误往往会导致运行时错误，JavaScript属于动态类型，它是一门解释型语言，没有编译阶段。
- 静态类型是指编译阶段就能确定每个变量的类型，这种语言的类型错误往往会导致语法错误。由于TypeScript在运行前需要先编译为JavaScript，而在编译阶段就会进行类型检查，所以TypeScript属于静态类型。
### 使用TypeScript的好处
- TypeScript增强了编辑器(IDE)的功能，包括代码补全、接口提示、跳转到定义、代码重构等，这在很大程度上提高了开发效率。
- TypeScript的类型系统可以提升程序的健壮性为大型项目带来更高的可维护性，从开发过程中减少BUG出现的概率。
### tsc
> tsc的全称是TypeScript Compiler，是将TypeScript转码为JavaScript代码的编译器。TSC的编译结果只有部分特性做了pollyfill处理，ES6的一些特性仍然被保留，想要支持完全的降级到ES5还是需要额外引入pollyfill（也就是我们在项目的入口文件处 import 'core-js'），但建议是将target字段值设置为ES6，提升TSC的速度。不应该将TSC作为编译项目的工具，应该将TSC作为类型检查工具，代码编译的工作尽量交给Rollup、Webpack、Babel等打包工具。

```
// 全局安装
npm install typescript -g

// 编译index.ts文件，使用下面的命令可以得到一份编译成为JavaScript代码的./index.js文件
tsc ./index.ts
```