## js
### 判断整数
- 任何整数都会被1整除，即余数是0。利用这个规则来判断是否是整数。
```
function isInteger(obj) {
  return typeof obj === 'number' && obj % 1 === 0;
}
```
- 使用Math.round、Math.ceil、Math.floor判断，整数取整后还是等于自己。利用这个特性来判断是否是整数。
```
function isInteger(obj) {
  return Math.floor(obj) === obj;
}
```
- 通过parseInt判断，某些场景不准确。
```
function isInteger(obj) {
  return parseInt(obj, 10) === obj;
}
```
- 通过位运算符
```
function isInteger(obj) {
  return (obj | 0) === obj;
}
```
- ES6提供了Number.isInteger
### dom节点平滑滚动到可视区域，顶部，底部
> 原生的scrollTo方法没有动画，类似于锚点跳转，比较生硬，可以通过scrollIntoView方法自带平滑的过度效果。

```
function scrollTo(element) {
  element.scrollIntoView({ behavior: "smooth", block: "start" }) // 顶部
  element.scrollIntoView({ behavior: "smooth", block: "end" }) // 底部
  element.scrollIntoView({ behavior: "smooth" }) // 可视区域
}
```