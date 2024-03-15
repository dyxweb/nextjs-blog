## esModule和CommonJS的区别
- ES6 模块的设计思想是尽量的静态化，使得编译时就能确定模块的依赖关系，以及输入和输出的变量。CommonJS 属于运行时加载，都只能在运行时确定这些东西。
- ES6 模块可以加载模块的部分内容，CommonJS需要加载模块整个对象。
- ES6 模块输出的是值的引用，CommonJS输出的是值的拷贝(浅拷贝)。
  1. CommonJS 模块输出的是值的拷贝，一旦输出一个值，模块内部的变化就影响不到这个值。由于是值的拷贝所以是深拷贝还是浅拷贝的效果存在差异。
  ```
  // lib.js
  var counter = 3;
  function incCounter() {
    counter++;
  }
  module.exports = {
    counter: counter,
    incCounter: incCounter,
  };
  // main.js
  var mod = require('./lib');

  console.log(mod.counter);  // 3
  mod.incCounter();
  console.log(mod.counter); // 3
  ```
  2. ES6 模块的运行机制与 CommonJS 不一样。JS 引擎对脚本静态分析的时候，遇到模块加载命令import，就会生成一个只读引用。等到脚本真正执行时，再根据这个只读引用，到被加载的那个模块里面去取值。原始值变了，import加载的值也会跟着变。
  ```
  // lib.js
  export let counter = 3;
  export function incCounter() {
    counter++;
  }

  // main.js
  import { counter, incCounter } from './lib';
  console.log(counter); // 3
  incCounter();
  console.log(counter); // 4

  // m1.js
  export var foo = 'bar';
  setTimeout(() => foo = 'baz', 500);

  // m2.js
  import { foo } from './m1.js';
  console.log(foo); // bar
  setTimeout(() => console.log(foo), 500); // baz
  ```
- ES6模块属于编译时加载，无法像CommonJS一般，做到运行时加载。所以有一个提案，引入import()函数，完成运行时加载，或者叫动态加载。import()和require()相同点都是运行时加载；区别在于import()属于异步加载，require()属于同步加载。
### 模块循环依赖不会死循环(入口文件引用了a模块，a模块引用了b模块，b模块却又引用了a模块)
- CommonJS
> 循环引用要解决两个问题，避免死循环以及确定输出的值。CommonJS通过模块缓存来解决，每一个模块都先加入缓存再执行，每次遇到require都先检查缓存，这样就不会出现死循环；借助缓存输出的值也很简单就能找到了。

  1. 【入口模块】开始执行，把入口模块加入缓存。
  2. var a = require('./a') 执行 将a模块加入缓存，进入a模块。
  3. 【a模块】exports.a = '原始值-a模块内变量'执行，a模块的缓存中给变量a初始化，为原始值。
  4. 执行var b = require('./b')，将b模块加入缓存，进入b模块。
  5. 【b模块】exports.b ='原始值-b模块内变量'，b模块的缓存中给变量b初始化，为原始值。
  6. var a = require('./a')，尝试导入a模块，发现已有a模块的缓存，所以不会进入执行，而是直接取a模块的缓存，此时打印{ a: '原始值-a模块内变量' }。
  7. exports.b = '修改值-b模块内变量 执行，将b模块的缓存中变量b替换成修改值。
  8. 【a模块】console.log('a模块引用b模块：',b) 执行，取缓存中的值，打印{ b: '修改值-b模块内变量' }。
  9. exports.a = '修改值-a模块内变量' 执行，将a模块缓存中的变量a替换成修改值。
  10. 【入口模块】console.log('入口模块引用a模块：',a) 执行，取缓存中的值，打印{ a: '修改值-a模块内变量' }。
```
//index.js
var a = require('./a')
console.log('入口模块引用a模块', a)

// a.js
exports.a = '原始值-a模块内变量'
var b = require('./b')
console.log('a模块引用b模块', b)
exports.a = '修改值-a模块内变量'

// b.js
exports.b ='原始值-b模块内变量'
var a = require('./a')
console.log('b模块引用a模块', a)
exports.b = '修改值-b模块内变量'

// 输出
b模块引用a模块 {a: 原始值-a模块内变量}
a模块引用b模块 {b: 修改值-b模块内变量}
入口模块引用a模块 {a: 修改值-a模块内变量}
```
- ES Module
> 借助模块地图，已经进入过的模块标注为获取中，遇到import语句会去检查这个地图，已经标注为获取中的则不会进入，地图中的每一个节点是一个模块记录，上面有导出变量的内存地址，导入时会做一个连接——即指向同一块内存。

  1. 【入口模块】首先进入入口模块，在模块地图中把入口模块的模块记录标记为“获取中”（Fetching），表示已经进入，但没执行完毕。
  2. import * as a from './a.mjs' 执行，进入a模块，此时模块地图中a的模块记录标记为“获取中”。
  3. 【a模块】import * as b from './b.mjs' 执行，进入b模块，此时模块地图中b的模块记录标记为“获取中”。
  4. 【b模块】import * as a from './a.mjs' 执行，检查模块地图，模块a已经是Fetching态，不再进去。
  5. let b = '原始值-b模块内变量' 模块记录中，存储b的内存块初始化。
  6. console.log('b模块引用a模块：', a) 根据模块记录到指向的内存中取值，是{ a:}。
  7. b = '修改值-b模块内变量' 模块记录中，存储b的内存块值修改。
  8. 【a模块】let a = '原始值-a模块内变量' 模块记录中，存储a的内存块初始化。
  9. console.log('a模块引用b模块：', b) 根据模块记录到指向的内存中取值，是{ b: '修改值-b模块内变量' }。
  10. a = '修改值-a模块内变量' 模块记录中，存储a的内存块值修改。
  11. 【入口模块】console.log('入口模块引用a模块：',a) 根据模块记录，到指向的内存中取值，是{ a: '修改值-a模块内变量' }。
```
//index.js
var a = require('./a')
console.log('入口模块引用a模块', a)

// a.js
exports.a = '原始值-a模块内变量'
var b = require('./b')
console.log('a模块引用b模块', b)
exports.a = '修改值-a模块内变量'

// b.js
exports.b ='原始值-b模块内变量'
var a = require('./a')
console.log('b模块引用a模块', a)
exports.b = '修改值-b模块内变量'

// 输出
b模块引用a模块 uninitialized
a模块引用b模块 {b: 修改值-b模块内变量}
入口模块引用a模块 {a: 修改值-a模块内变量}
```
### 多次引用(入口模块引用了a、b两个模块，a、b这两个模块又分别引用了c模块，此时并不存在循环引用，但是c模块被引用了两次。)
- CommonJs
> c模块只被执行了一次，当第二次引用c模块时，发现已经有缓存，则直接读取，而不会再去执行一次。

```
//index.js
var a = require('./a')
var b= require('./b')

// a.js
module.exports.a = '原始值-a模块内变量'
console.log('a模块执行')
var c = require('./c')

// b.js
module.exports.b = '原始值-b模块内变量'
console.log('b模块执行')
var c = require('./c')

// c.js
module.exports.c = '原始值-c模块内变量'
console.log('c模块执行')

// 输出
a模块执行
c模块执行
b模块执行
```
### tree shaking
> tree shaking通常用于描述移除JavaScript上下文中的未引用代码（dead-code）。如果是使用模块化开发的话，就可以删除那些引入某个模块中用不到的函数。tree shaking的实现依赖于ESM的静态分析能力，会在编译过程中静态分析模块之间的导入导出，确定ESM模块中哪些导出值未曾其它模块使用，并将其删除，以此实现打包产物的优化。import和export可以实现tree shaking，但是直接export default整个对象或者使用CommonJS的语法是无法实现的。