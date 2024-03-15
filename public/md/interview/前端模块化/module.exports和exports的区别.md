## module.exports和exports的区别
> module.exports可以直接赋值，module.exports = function() {}; exports不可以直接赋值，只能添加方法或者属性，exports.add = function() {} ;

- module.exports 初始值为一个空对象{}
- exports 是指向的 module.exports 的引用
- require() 返回的是 module.exports 而不是 exports
- 两者的关系为var exports = module.exports = {}; 给exports直接赋值是无效的，因为赋值后，module.exports仍然是空对象{}，因为直接给exports赋值，会直接改变exports的指向，并不会改变module.exports的值，而require() 返回的是 module.exports 而不是 exports，所以给exports赋值是不允许的。但是由于exports是module.exports的一个引用，因为引用类型的特性，以添加属性的形式改变exports的值同时module.exports的值也会改变，因为两者指向同一地址，所以require返回的内容就是修改后的内容。
- 建议使用module.exports可以避免某些问题。
### exports
#### 使用exports添加属性的形式
```
// exportFile.js
const name = 'dyx';
const sayName = name => {
  console.log(name);
}
exports.name = name;
exports.sayName = sayName;

// requireFile.js
const requireData = require('./exportFile');
console.log(requireData); // { name: 'dyx', sayName: fn }
console.log(requireData.name); // dyx
```
#### 使用exports直接赋值形式
```
// exportFile.js
const name = 'dyx';
const sayName = name => {
  console.log(name);
}
exports = { name: name, sayName: sayName };

// requireFile.js
const requireData = require('./exportFile');
console.log(requireData); // {} 相当于引入了module.exports的初始值{}
console.log(requireData.name); // undefined
```
### module.exports
#### 使用module.exports添加属性的形式
```
// exportFile.js
const name = 'dyx';
const sayName = name => {
  console.log(name);
}
module.exports.name = name;
module.exports.sayName = sayName;

// requireFile.js
const requireData = require('./exportFile');
console.log(requireData); // { name: 'dyx', sayName: fn }
console.log(requireData.name); // dyx
```
#### 使用module.exports直接赋值形式
```
// exportFile.js
const name = 'dyx';
const sayName = name => {
  console.log(name);
}
module.exports = { name: name, sayName: sayName };

// requireFile.js
const requireData = require('./exportFile');
console.log(requireData); // { name: 'dyx', sayName: fn }
console.log(requireData.name); // dyx
```