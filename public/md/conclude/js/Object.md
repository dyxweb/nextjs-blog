## Object
### Object.freeze
> 冻结指定对象，不能添加对象的属性、删除对象的属性、修改对象的属性值。当属性值为对象的时候，可以修改该属性值对象的属性间接修改冻结对象的属性,但依旧不可以直接修改冻结对象的属性值。

```
const person = {name: 'dyx', sex: 'man'};
Object.freeze(person);
person.name = "douyaxing";
person.age = 22;
delete person.sex;
console.log(Object.isFrozen(person)); // 检验某一对象是否被冻结  true
console.log(person); // {name: 'dyx', sex: 'man'}

// 属性值为对象的情况
const person = {name: 'dyx', sex: 'man', other: {age: 18}};
Object.freeze(person);
person.name = "douyaxing";
person.other.age = 22;
console.log(Object.isFrozen(person)); // 检验某一对象是否被冻结  true
console.log(person); // {name: 'dyx', sex: 'man', other: {age: 22}}
```
### Object.keys
> 将对象的key值组成数组

```
const obj = { name: 'dyx', sex: 'man' };
console.log(Object.keys(obj)); // console: ['name', 'sex']
```
### Object.values
> 将对象的value值组成数组

```
const obj = { name: 'dyx', sex: 'man' };
console.log(Object.values(obj)); // console: ['dyx', 'man']
```
### Object.entries
> 将对象的key和value值组成数组

```
const obj = { name: 'dyx', sex: 'man' };
console.log(Object.entries(obj)); // console: [['name', 'dyx'], ['sex', 'man']]
```
### Object.create
- Object.create 允许您创建一个对象，该对象将在查找失败时委托给另一个对象

```
const info = {
  name: 'dyx',
  age: 24,
  sex: 'man'
}
 
const newOnfo = Object.create(info)
newOnfo.name = 'douyaxing'
newOnfo.age = 25
 
console.log(newOnfo.name) // douyaxing
console.log(newOnfo.age) // 25
console.log(newOnfo.sex) // man
```
- 可以通过{}来创建空对象，通过此方法创建的对象，proto、hasOwnProperty等对象方法仍然是存在的，这是因为使用{}将创建一个继承自Object类的对象。如果需要创建一个绝对空的对象，最好使用Object.create(null)，它将创建一个不从任何对象继承且没有属性的对象。
```
const vehical = Object.create(null);

// vehicle.__proto__ === "undefined"
```
