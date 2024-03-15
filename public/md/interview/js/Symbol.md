## [Symbol](https://mp.weixin.qq.com/s/qSo66z9mQ4CwY6E5gfDmjw)
- Symbol是一种基本数据类型。Symbol()函数返回symbol类型的值。
- 通过Symbol创建返回的symbol值都是唯一的。一个symbol值能作为对象属性的标识符，这是该数据类型仅有的目的。
### 创建symbol值
```
const symbol1 = Symbol();
const symbol2 = Symbol(123);
const symbol3 = Symbol('test');

console.log(symbol2); // Symbol(123)
console.log(typeof symbol1); // symbol
console.log(symbol2 === 123); // 永远输出是false
console.log(Symbol('test') === Symbol('test')); // 永远输出是false
```
### Symbol特点
- Symbol不可以使用new创建，使用new创建会抛出TypeError错误。
- Symbol创建的值是不可枚举的。
- for in循环会遍历对象的可枚举属性，会忽略不可枚举的属性。
```
const symbol = Symbol('test');
const obj = {[symbol]: 123};
for (const key in obj) {
  console.log(key); // 无打印信息
}
```
- Object.keys()方法返回一个数组，其中包含对象的所有可枚举属性的名称。不可枚举的属性不会被包含在返回的数组中。
```
const symbol = Symbol('test');
const obj = {[symbol]: 123};
console.log(Object.keys(obj)); // []
```
- Object.getOwnPropertySymbols、Reflect.ownKeys方法可以获取指定对象的所有Symbol属性名。
```
const symbol = Symbol('test');
const obj = {[symbol]: 123};
console.log(Object.getOwnPropertySymbols(obj)); // [Symbol(test)]
console.log(Reflect.ownKeys(obj)); // [Symbol(test)]
```
- Object.assign()将源对象中可枚举属性复制到目标对象，但会包含Symbol类型作为key的属性。
```
const symbolKey = Symbol('key');
const source = {
  [symbolKey]: 'Symbol Property',
  regularProperty: 'Regular Property'
};
Object.defineProperty(source, "w", {
  value: 456,
  enumerable: true,
  configurable: true,
  writable: true
})
Object.defineProperty(source, "r", {
  value: 123,
  enumerable: false,
  configurable: false,
  writable: false
})

const target = {};
Object.assign(target, source);
// Symbol(key)类型会被打印，但是不可枚举属性不会打印
console.log(target); // {regularProperty: "Regular Property", w: 456, Symbol(key): 'Symbol Property'}
```
- JSON.stringify()只会序列化对象的可枚举属性，不会包含不可枚举属性。
  - JSON.stringify()转换的是一个对象时无论key还是value中有symbol类型，都会忽略掉。
  - JSON.stringify()直接转换symbol类型数据，转换后的结果为undefined。
  ```
  const symbol = Symbol('test');
  const obj = {name: symbol};
  const obj1 = {[symbol]: 123};
  console.log(JSON.stringify(symbol)); // undefined
  console.log(JSON.stringify(obj)); // {}
  console.log(JSON.stringify(obj1)); // {}
  ```
- 对象中声明的Symbol属性获取必须使用[]方式获取属性。
```
const symbol = Symbol('test');
const obj = {[symbol]: 123};
console.log(obj[symbol]); // 123
```
- 使用Symbol直接传入一个函数，会调用toString函数，将函数内容转换为字符串。
```
const a = function() {
  console.log('哈哈哈');
}
console.log(Symbol(a)); // Symbol(function() { console.log('哈哈哈'); })
console.log(typeof Symbol(a)); // symbol
```
- Object.getOwnPropertyNames()返回一个数组，其中包含对象的所有属性（包括不可枚举属性）的名称，但是不包括使用symbol值作为名称的属性。
```
const symbolKey = Symbol('key');
const obj = {
  [symbolKey]: 'Symbol Property',
  regularProperty: 'Regular Property'
};
Object.defineProperty(obj, "w", {
  value: 456,
  enumerable: true,
  configurable: true,
  writable: true
})
Object.defineProperty(obj, "r", {
  value: 123,
  enumerable: false,
  configurable: false,
  writable: false
})
console.log(Object.getOwnPropertyNames(obj))
```
### Symbol.For 
- 如果想要使用同一个Symbol值，可以使用Symbol.for。
- 它接受一个字符串作为参数，用Symbol.for()方法创建的symbol会被放入一个全局的symbol注册表。Symbol.for()不是每次都创建新的symbol，会先搜索有没有以该参数作为名称的Symbol值。如果有就返回这个Symbol值，否则就新建并返回一个以该字符串为名称的Symbol值。
```
console.log(Symbol.for('test') === Symbol.for('test')); // true
console.log(Symbol("test") === Symbol("test")); // false
```
### Symbol 应用场景
> 应用场景不止针对的symbol这个基础的数据类型，还会针对Symbol中提供的一些函数，比如Symbol.iterator, Symbol.toStringTag等。

#### 自定义迭代器之Symbol.iterator
- 使用Symbol实现普通对象迭代器，普通的对象是不支持迭代器功能的，也就是普通对象不能直接使用for of功能，有了它可以让一个普通对象支持for of遍历。
```
const symbolObjTest1 = {
  0: "a",
  1: "b",
  2: "c",
  length: 3,
  [Symbol.iterator]: function() {
    let index = 0;
    return {
      next() { // 迭代器返回的对象需要有next函数
        return {
          value: symbolObjTest1[index++], // value为迭代器生成的值
          done: index>symbolObjTest1.length // 迭代器的终止条件，done为true时终止遍历
        }
      }
    }
  }
}

for (const iterator1 of symbolObjTest1) {
  console.log(iterator1); // 打印 a b c
}
```
#### Symbol.toStringTag
- Symbol.toStringTag官方描述是一个字符串值属性，用于创建对象的默认字符串描述。由Object.property.toString()方法内部访问。
- Object.property.toString()方法在开发过程中最常用场景是判断数据类型。
- 自己创建的类，toString()方法只会默认返回Object标签。给类增加一个toStringTag属性，自定义的类也就拥有了自定义的类型标签。
```
class TestClass {}
console.log(Object.prototype.toString.call(new TestClass())); // '[object Object]'

class TestClass {
  get [Symbol.toStringTag]() {
    return "TestToStringTag";
  }
}
console.log(Object.prototype.toString.call(new TestClass())); // '[object TestToStringTag]'
```
