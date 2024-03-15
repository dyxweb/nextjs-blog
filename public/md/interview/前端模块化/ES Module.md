## ES Module
- ES6在语言标准的层面上，实现了模块功能，export命令用于规定模块的对外接口，import命令用于输入其他模块提供的功能。
- export、import命令可以出现在模块的任何位置，只要处于模块顶层就可以。如果处于块级作用域内就会报错，这是因为处于条件代码块之中就没法做静态优化了，违背了ES6模块的设计初衷。
```
// 导出模块
export function hello() {

};
export default {
  // ...
};

// 引入模块
import { readFile } from 'fs';
import React from 'react';
```
### export
- export导出的是变量的引用，下面这种方式会报错
```
// b.js
export { b: 1 };  // SyntaxError: Unexpected token ':'
```
- export导出常用方式
```
// a.js
export let a = 1;
```
- export另一种导出方式
```
// b.js
let b = 1;
export { b };
```
- 上述两种导出方式的导入方式一样
```
import { a } from 'xx/a.js';
import { b } from 'xx/b.js';
```
- 上述两种导出方式混用
> 会报重复导出的错误，这两种export导出方式是不会产生冲突覆盖的。

```
var b = 1;
export { b }
export var b = 2;  // SyntaxError: Duplicate export of 'b'
```
### import
- import准确来讲并没有创建新的变量，但是这个关键字导入了被导入模块的变量的引用，而在js引擎层面并没有声明新的变量。
### 导出从其它模块导入的内容
- 常用方式
```
// main.js
export { default as a } from 'xxx/a.xxx';
```
- 这种情况下，a这个变量在main.js这个模块中是访问不到的。如果想要在main.js这个模块中访问到a模块，需要使用import语句进行导入，再使用export暴露给外界。
```
// main.js
import a from 'xxx/a.xxx';
export a;
```