## new操作符
### new操作符的流程
1. 创建一个新对象。
2. 为第一步创建的对象添加原型属性(`__proto__`)属性值等于构造函数的原型对象。
3. 将this指向这个新对象。
4. 执行构造函数，属性和方法被添加到this指向的对象中。
5. 如果构造函数返回非空对象，则返回该对象，否则返回刚创建的新对象。

### 实现new操作符
```
function myNew(Con, ...args) {
  // 创建空对象
  let obj = {};
  // 为对象添加原型属性
  obj._proto_ = Con.prototype;
  // 绑定 this 并执行构造函数(为对象设置属性)
  const res = Con.apply(obj, args);
  // 判断构造函数是否有返回值
  if (res && typeof res === 'object' || typeof res === 'function') {
    return res;
  }
  return obj;
}

// 构造函数
function Test(name, age) {
  this.name = name;
  this.age = age;
}
Test.prototype.sayName = function() {
  console.log(this.name);
}

// 实现一个 new 操作符
const a = myNew(Test, 'dyx', '26')
console.log(a.age) // '26'
```