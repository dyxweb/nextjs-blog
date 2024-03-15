## 手写instanceof
> 递归获取实例的原型，判断其是否和构造函数的原型对象相等。

```
const myInstanceof = (left, right) => {
  // 边界判断
  if (typeof left !== 'object' && typeof left !== 'function' || left === null) return false;
  let proto = Object.getPrototypeOf(left);   // 获取左侧对象实例的原型
  while (proto !== right.prototype) {  // 找到了就终止循环
    if (proto === null) return false;    // 找不到返回false
    proto = Object.getPrototypeOf(proto);   // 沿着原型链继续获取原型
  }
  return true;
}
```