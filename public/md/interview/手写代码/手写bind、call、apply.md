## 手写bind、call、apply
### bind
- 形式一
```
Function.prototype.myBind = function(context) {
  var self = this;
  var args = Array.prototype.slice.call(arguments, 1);
  var fNOP = function () {};
  var fBound = function () {
    var bindArgs = Array.prototype.slice.call(arguments);
    var finalArgs = args.concat(bindArgs);
    return self.apply(this instanceof fNOP ? this : context, finalArgs);
  }

  fNOP.prototype = this.prototype;
  fBound.prototype = new fNOP();
  return fBound;
}
```
- 使用
```
const obj = { name: 'douyaxing' };
var name = 'dyx';
function exer(age, sex) {
  console.log(this.name, age, sex);
}
exer(18, 'man');
const newExer = exer.myBind(obj, 23);
newExer('man');
```
### call
- 形式一
```
Function.prototype.myCall = function(context) {
  var context = context || window;
  context.fn = this;
  var args = [];

  for(var i = 1, len = arguments.length; i < len; i++) {
    args.push('arguments[' + i + ']');
  }
  var result = eval('context.fn(' + args +')');

  delete context.fn;
  return result;
}
```
- 形式二
```
Function.prototype.myCall = function(context, ...args) {
  context = context || window;
  context.fn = this;
  let result = context.fn(...args);
  delete context.fn;
  return result;
}
```
- 使用
```
const obj = { name: 'douyaxing' };
const obj1 = { name: 'douyaxing23' };
var name = 'dyx';
function exer(age, sex) {
  console.log(this.name, age, sex);
}
exer(18, 'man');
exer.myCall(obj, '23', 'women');
exer.myCall(obj1, '2', 'women');
```
### apply
- 形式1
```
Function.prototype.myApply = function(context, arr) {
  var context = context || window;
  context.fn = this;

  var result;
  if (!arr) {
    result = context.fn();
  } else {
    var args = [];
    for (var i = 0, len = arr.length; i < len; i++) {
      args.push('arr[' + i + ']');
    }
    result = eval('context.fn(' + args + ')');
  }
  delete context.fn;
  return result;
}
```
- 形式2
```
Function.prototype.myApply = function(context) {
  context = context || window;
  context.fn = this;
  let result;
  if (arguments[1]) {
    result = context.fn(...arguments[1]);
  } else {
    result = context.fn();
  }
  delete context.fn;
  return result;
}
```
- 使用
```
const obj = { name: 'douyaxing' };
const obj1 = { name: 'douyaxing23' };
var name = 'dyx';
function exer(age, sex) {
  console.log(this.name, age, sex);
}
exer(18, 'man');
exer.myApply(obj, ['23', 'women']);
exer.myApply(obj1, ['2', 'women']);
```