## Map
> 它类似于对象，也是键值对的集合，但是“键”的范围不限于字符串，各种类型的值（包括对象）都可以当作键。也就是说，Object 结构提供了“字符串—值”的对应，Map 结构提供了“值—值”的对应，是一种更完善的 Hash 结构实现。如果你需要“键值对”的数据结构，Map 比 Object 更合适。

### 属性
- size属性返回 Map 结构的成员总数。
```
const map = new Map();
map.set('foo', true);
map.set('bar', false);

map.size // 2
```
### 方法
- set(key, value)  set方法设置键名key对应的键值为value，然后返回整个 Map 结构。如果key已经有值，则键值会被更新，否则就新生成该键。
- get(key)  get方法读取key对应的键值，如果找不到key，返回undefined。
- has(key)  has方法返回一个布尔值，表示某个键是否在当前 Map 对象之中。
- delete(key)  delete方法删除某个键，返回true。如果删除失败，返回false。
- clear()   clear方法清除所有成员，没有返回值。

### 遍历方法
> Map 的遍历顺序就是插入顺序。

- keys()，values()，entries()
```
const map = new Map([
  ['F', 'no'],
  ['T',  'yes'],
]);

for (let key of map.keys()) {
  console.log(key);
}
// "F"
// "T"

for (let value of map.values()) {
  console.log(value);
}
// "no"
// "yes"

for (let item of map.entries()) {
  console.log(item[0], item[1]);
}
// "F" "no"
// "T" "yes"
```
- forEach()，与数组的forEach方法类似
### Map获取最先存入Map的键
```
map.keys().next().value 获取第一个键（最先存入map集合的键）
map.delete(map.keys().next().value) 删除第一个键
```
### Map转数组
> Map 转为数组最方便的方法，就是使用扩展运算符。

```
const myMap = new Map().set(true, 7).set({foo: 3}, ['abc']);

// [
//   [ true, 7 ],
//   [
//     { foo: 3 },
//     ['abc'] 
//   ]
// ]
[...myMap]
```
### 数组转Map
> 将数组传入 Map 构造函数，就可以转为 Map。

```
new Map([
  [true, 7],
  [{foo: 3}, ['abc']]
])
// Map {
//   true => 7,
//   Object {foo: 3} => ['abc']
// }
```
### Map转对象
> 如果所有 Map 的键都是字符串，它可以无损地转为对象。如果有非字符串的键名，那么这个键名会被转成字符串，再作为对象的键名。

```
function strMapToObj(strMap) {
  let obj = Object.create(null);
  for (let [k,v] of strMap) {
    obj[k] = v;
  }
  return obj;
}

const myMap = new Map().set('yes', true).set('no', false);

// { yes: true, no: false }
strMapToObj(myMap)
```
### 对象转Map
> 对象转为 Map 可以通过Object.entries()。也可以自己实现一个转换函数。

```
let obj = {"a":1, "b":2};
let map = new Map(Object.entries(obj));

// 自定义转化方法
function objToStrMap(obj) {
  let strMap = new Map();
  for (let k of Object.keys(obj)) {
    strMap.set(k, obj[k]);
  }
  return strMap;
}

objToStrMap({yes: true, no: false})
// Map {"yes" => true, "no" => false}
```
### WeakMap
> WeakMap结构与Map结构类似，也是用于生成键值对的集合。但是它与 Map 有一些区别。

1. WeakMap只接受对象作为键名（null除外），不接受其他类型的值作为键名。
2. WeakMap的键名所指向的对象，不计入垃圾回收机制。
3. WeakMap不可遍历。

```
// Map
let dyx = { name: "dyx" };
let map = new Map();
map.set(dyx, "test");

// dyx 被存储在 map 中，我们可以使用 map.keys() 来获取它
dyx = null; // 覆盖引用


// WeakMap
let dyx = { name: "dyx" };
let weakMap = new WeakMap();
weakMap.set(dyx, "test");

// john 被从内存中删除了！
dyx = null; // 覆盖引用
```
### JSON.stringify方法不能转化Map数据类型。

