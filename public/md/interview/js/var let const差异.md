## var let const差异
### var声明的变量会挂载在window上，而let和const声明的变量不会。
```
var name = 'dyx';
let name1 = 'dyx1';
const name2 = 'dyx2';
console.log(window.name);  // dyx
console.log(window.name1); // undefined
console.log(window.name2); // undefined
```
### var声明变量存在变量提升，let和const不存在变量提升。
```
console.log(name); // undefined 
var name = 'dyx';

console.log(name1); //  Cannot access 'name1' before initialization
let name1 = 'dyx1';

console.log(name2); //  Cannot access 'name2' before initialization
const name2 = 'dyx2';
```
### let和const声明形成块作用域。
```
if (true) {
  var name = 'dyx';
  let name1 = 'dyx1';
  const name2 = 'dyx2';
}
console.log(name); // dyx 
console.log(name1); // name1 is not defined
console.log(name2); // name2 is not defined 
```
### 同一作用域下let和const不能声明同名变量，而var可以。
```
var name = 'dyx';
var name = 'dyx1';
let name1 = 'dyx2';
let name1 = 'dyx3'; // name1 has already been declared
const name2 = 'dyx4';
const name2 = 'dyx5'; // name2 has already been declared
```
### 暂时性死区。
```
var name = 'dyx';

if (true) {
  // let创建的name变量创建过程被提升了，但是初始化没有提升。变量未初始化或赋值前不允许访问。
  name = 'douyaxing'; // Cannot access 'name' before initialization
  let name = 'dyxweb';
}
```
### const一旦声明必须赋值，声明后不能再修改，如果声明的是复合类型数据，可以修改其属性。
```
const name = 'dyx';
name = 'dyx1'; // Assignment to constant variable

const info = {
  name: 'dyx',
}
info.name = 'douyaxing';
console.log(info); // { name: 'douyaxing' }
```
### 暂时性死区的原因
- 变量的赋值可以分为三个阶段：
   1. 创建变量，在内存中开辟空间。
   2. 初始化变量，将变量初始化为undefined。
   3. 真正赋值。
- let 的「创建」过程被提升了，但是初始化没有提升。存在暂时死区，在变量未初始化或赋值前不允许访问。
- var 的「创建」和「初始化」都被提升了。
- function 的「创建」「初始化」和「赋值」都被提升了。