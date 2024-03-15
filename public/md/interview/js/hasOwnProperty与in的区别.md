## hasOwnProperty与in的区别
### 相同点
- hasOwnProperty与in都可以检测一个对象上是否有某个属性。
### 区别
- in是判断对象本身和对象原型链上是否有这个属性。
- hasOwnProperty是判断对象本身是否有这个属性，不会去原型链上查找。
```
const Person = function(age) {
  this.age = age;
}
Person.prototype.name = 'dyx';

const p1 = new Person(26);

console.log('age' in p1);  // true 
console.log('name' in p1); // true
console.log('toString' in p1); // true

console.log(p1.hasOwnProperty('age')); // true
console.log(p1.hasOwnProperty('name')); // false，原型链上的name属性检测不到
console.log(p1.hasOwnProperty('toString')); // false，原型链上的toString属性检测不到
```
### eslint报错Do not access Object.prototype method 'hasOwnProperty' from target object
- eslint提示
```
obj.hasOwnProperty(key);
```
- eslint不提示
```
Object.prototype.hasOwnProperty.call(obj, key);
```