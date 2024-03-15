## this
> this在javascript中十分常用且重要。

### this的作用
> 提供了一个便捷的方式传递一个隐式的引用让代码变得更加简洁同时也会让代码更好的复用。

### this的指向
#### 普通函数的this指向
> 谁调用函数，this指向谁。

- 全局调用
```
function test() {
 const name = "dyx";
 console.log(this.name);
 console.log(this);
}
test(); // undefined，window。this指向调用它的那个对象，在这里相当于window.test()；所以this指向window。
```
- 对象的方法形式调用
```
const obj = {
  name: "dyx",
  test: function() {
    console.log(this.name);
    console.log(this);
  }
}
obj.test(); // dyx，obj。此时this指向的是调用函数的对象obj。
const fn = obj.test;
fn(); // undefined，window。此时test的调用相当于全局调用所以this指向window。
```
- 深层次对象的方法调用
```
const obj = {
  name: "dyx",
  innerObj: {
    test: function() {
      console.log(this.name);
    }
  },
  test1: function() {
    console.log(this.name);
  }
}
obj.test1(); // dyx
obj.innerObj.test(); // undefined，调用函数的对象为innerObj，在该作用域中找不到声明的name变量。
```
- 特殊形式
```
let len = 10;
function fn() {
  console.log(this.len);
}
fn(); // undefined，let不会在window上添加属性。

let person = {
  len: 5,
  say: function() {
    fn();
  }
}
person.say(); // undefined，调用fn的this还是指向window。
```
#### 构造函数的this指向
> 构造函数有return的内容this指向return的内容。没有return指向new出来的新对象。

- 构造函数有return的形式
```
function Test() { 
  this.name = 'dyx';
  return {}; 
}
var obj = new Test(); // {}
console.log(obj.name); // undefined，这里的this指向的是return返回的对象，是一个空对象，并没有name变量。
```
- 构造函数没有return的形式
```
function Test() { 
  this.name = 'dyx';
}
var obj = new Test(); // { name: 'dyx' }
console.log(obj.name); // dyx，这里的this指向的是new出来的新对象。
```
#### DOM事件绑定
> onclick和addEventerListener中this默认指向绑定事件的元素。IE比较奇怪使用attachEvent里面的this默认指向window。

#### 箭头函数this的指向
> 箭头函数没有自己的this，如果箭头函数外层有函数，外层函数的this就是内部箭头函数的this，否则this就是window。箭头函数的this指向该函数定义时的作用域，而非指向调用函数的对象。

```
// 当我们创建对象的时候，是在全局作用域下创建的，而对象中的方法也是这时候创建的，所以这时候的this是指向全局的，而我们在fn2里面创建的对象，这个对象的方法的this就指向他被创建时的词法作用域obj了。
var str = 'window';   
const obj = {    
  str: 'obj',    
  fn: () => console.log(this.str),   
  fn2: function() {	
    console.log(this.str);
    return { 
      str: 'newObj',	    
      fn: () => console.log(this.str)
    }
  },  
}
 
obj.fn(); // window
 
var newObj = obj.fn2(); // obj
newObj.fn(); // obj
```
### 改变函数this的指向
> call、apply、bind方法都可以改变this指向, this指向传入的第一个参数。bind方法改变后的函数想什么时候调用就什么时候调用，执行bind之后返回的是一个函数，bind方法也可以接收多个参数，并且参数可以执行的时候再次添加，但是要注意的是，参数是按照形参的顺序进行的，call和apply都是改变指向后立即调用此方法。apply的使用同call不同的是传入的参数需要是数组形式或者类数组形式。

- bind
> 改变之后可以自定义函数何时调用，bind方法会创建一个函数实例，this会指向传给bind方法的第一个参数。

```
var obj = {
 name: "dyx",
 test: function(num1, num2, num3) {
   console.log(this); // obj1
   console.log(this.name); // douyaxing
   console.log(num1, num2, num3); // 10 1 2
 }
}
var obj1 = {
  name: 'douyaxing'
}
var fn = obj.test.bind(obj1, 10); // this将会指向obj1
fn(1, 2);
```
- call
> 方法立即执行，参数一个一个传入。

```
var obj = {
  name: "dyx",
  test: function(c, d) {
    console.log(this); // obj1
    console.log(this.name); // douyaxing
    console.log(c + d); // 3
  }
}
var obj1 = {
  name: 'douyaxing'
}
var fn = obj.test;
fn.call(obj1, 1, 2); // 参数一个一个传入
```
- apply
> 方法立即执行，传入一个数组或者类数组作为参数，可以直接使用函数的arguments对象作为参数传递。

```
var obj = {
  name: "dyx",
  test: function(c, d) {
    console.log(this); // obj1
    console.log(this.name); // douyaxing
    console.log(c + d); // 3
  }
}
var obj1 = {
  name: 'douyaxing'
}
var fn = obj.test;
fn.apply(obj1, [1, 2]); // 参数以数组形式传入
```
### 示例
- 加括号的形式
```
var x = 10;
var foo = {
  x: 20,
  bar: function () {
    var x = 30;
    return this.x;
  }
};

console.log(foo.bar());   // 20
console.log((foo.bar)());  // 20
console.log((foo.bar = foo.bar)()); // 10
console.log((foo.bar, foo.bar)()); // 10
console.log(foo.bar.call(window)); // 10
console.log(foo.bar.call(foo)); // 20
```