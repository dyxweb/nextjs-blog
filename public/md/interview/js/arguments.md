## arguments
> arguments对象不能显式的创建，它只有在函数中才可用，表示当前函数的实参。它可以像访问数组那样去访问每一个子元素。arguments[0],arguments[1],....arguments[n]；通过arguments.length与funcName.length(函数的length属性表示函数形参的个数)进行比较可以判断形参与实参个数是否相等。arguments不是数组而是一个类似数组的对象。类数组只能使用for循环，不能调用数组的API。

1. arguments.length 为函数实参个数。
2. arguments.callee 获取函数名字，引用函数自身。使用该方法调用函数本身不用考虑函数名字变化的问题，可以用此属性实现递归，详情见下。arguments.callee.length为形参的个数。
```
var sum = function(n) {
  if (n === 1) {
    return 1
  } else {
    return n + arguments.callee(n - 1)
  }
}
console.log(sum(5)) // 15
```
### 将arguments转为数组形式
- [...arguments]
```
function test(num1, num2) {
  console.log(arguments); // [1, 2]
  const args = [...arguments];
  args.push(3);
  console.log(args); // [1, 2, 3]
}
test(1,2);
```
- Array.from(arguments)
```
function test(num1, num2) {
  console.log(arguments); // [1, 2]
  const args = Array.from(arguments);
  args.push(3);
  console.log(args); // [1, 2, 3]
}
test(1,2);
```
- Array.prototype.slice.call()
```
function test(num1, num2) {
  console.log(arguments); // [1, 2]
  const args = Array.prototype.slice.call(arguments);
  args.push(3);
  console.log(args); // [1, 2, 3]
}
test(1,2);
```
### 箭头函数不能使用arguments,箭头函数使用剩余参数获取实参
> 箭头函数无法获取arguments对象,使用剩余参数(rest)来达到获取所有形参的目的,如果没有剩余参数,rest为空数组

```
// ...rest表示剩余参数
const test = (...rest) => {
  console.log(rest); // [1, 2]
}
test(1,2)

// 必须写在形参的后面，否则会报错
const test = (num1, ...rest) => {
  console.log(rest); // [2]
}
test(1,2)
```
### 类数组
- 用getElementsByTagName/ClassName()获得的HTMLCollection
- 用querySelector获得的nodeList