## export和export default的区别
1. export导出的是变量的引用，而export default导出的是变量的值。
2. 模块里面的内容只能在模块内部修改，模块外部只能使用。ES Module在语法层面做了一层浅层的保护（即将import导入的变量声明为常量）。
3. 而变量的引用必须通过var、let、const、function这些关键字声明才可以由js引擎生成，而变量的值（或者说数据）可以通过变量运算或者字面量直接生成。
### 测试案例
- a.js
```
export let a = 'a';
export let objA = { a: 'a' };

let defaultA = 1;
export default defaultA;

export function fn(str) {
  a = str;
  defaultA = str;
}
```
- test1.js
```
import b, { a, fn, objA } from './a.js';

console.log(a, '---', b, '---', objA.a, '---', 'test1.js');

setTimeout(() => {
  objA.a = 'hello world';
  fn('hello world');
  console.log(a, '---', b, '---', objA.a, '---', 'test1.js');
})
```
- test2.js
```
import b, { a, objA } from './a.js';

console.log(a, '---', b, '---', objA.a, '---', 'test2.js');

setTimeout(() => {
  console.log(a, '---', b, '---', objA.a, '---', 'test2.js');
}, 100)
```
- main.js
```
import './test1.js';
import './test2.js';
```
- 运行main.js，输出结果如下
```
a --- 1 --- a --- test1.js
a --- 1 --- a --- test2.js
hello world --- 1 --- hello world --- test1.js
hello world --- 1 --- hello world --- test2.js
```
### 测试案例分析
- 通过a值的变化可以看出，在test1.js中的修改会影响到test2.js中a的值，验证我们说的导出变量引用这个观点。
- 通过b的运行结果可以验证export default导出变量值的观点。
- 通过objA.a的运行结果可以验证浅层保护的观点，其实和引用类型变量是一样的逻辑，我们可以修改引用类型变量的属性，只要不对引用类型变量重新赋值都是允许的。

