## js
### 实用方法
#### 点击外部区域隐藏弹层
```
document.onclick = function(e) {
  const dom = document.getElementById('dyx');
  // 不是指定的节点以及不是指定节点的后代元素 el.contains(el)
  if (e.target !== dom && !dom.contains(e.target)) {
    // 隐藏操作
  }
}
```
#### 自定义锚点跳转(不会记入历史栈)
```
document.getElementById('a-box').addEventListener('click', function(e) {
  const ev = e || window.event;
  const target = ev.target || ev.srcElement;
  const anchorKey = target.getAttribute('href');
  if (target.nodeName.toLowerCase() == 'a' && anchorKey.startsWith('#')) {
    if(ev.preventDefault){
      ev.preventDefault();
    } else {
      window.event.returnValue == false;
    }
    window.location.replace(`${location.pathname}${anchorKey}`);
  }
})
```
#### 某一元素出现在视口中
```
dom.scrollIntoView(params); // params为true使为顶部对齐，false为尽可能的全部出现在视口中
```
#### 上传图片转为base64的形式实现预览
```
const imgReader = new FileReader();
imgReader.readAsDataURL(uploadFile[0]);
imgReader.onloadend = () => {
  // base64数据
  const base64Data = imgReader.result.replace(/^data:image\/\w+;base64,/, '');
}
```
#### 获取url的参数
```
const getRequest = () => {   
   const url = location.search;  
   const requestInfo = new Object();   
   if (url.includes("?")) {   
      const str = url.substr(1);   
      const strs = str.split("&");   
      for(var i = 0; i < strs.length; i ++) {   
        requestInfo[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
      }   
   }   
   return requestInfo;   
}   
```
#### 对象拼接到url上
```
const concatRequest = (url, params) => {
  if (params) {
    let paramsArray = [];
    //拼接参数
    Object.keys(params).forEach(key => paramsArray.push(key + '=' + params[key]))
    if (url.search(/\?/) === -1) {
      url += '?' + paramsArray.join('&');
    } else {
      url += '&' + paramsArray.join('&');
    }
  }
  return url;
}
```
#### 判断是否为json字符串
```
const isJson = str => {
  if (typeof str == 'string') {
    try {
      str=JSON.parse(str);
    } catch(e) {
      return false;
    }
  } else {
    return false;
  }
  // JSON.parse(null) = null
  return typeof str === 'object' && str !== null;
}
```

#### 根据毫秒数进行时间转换
```
const renderTimeDisplay = (time) => {
  const hour = Math.floor(time / (1000 * 60 * 60));
  const minute = Math.floor((time - hour * 3600000) / (1000 * 60));
  const second = Math.floor((time - (hour * 3600000) - (minute * 60000)) / 1000);
  const ms = time - (hour * 3600000) - (minute * 60000) - (second * 1000);
  return { hour, minute, second, ms };
}
```
#### 通过图片的url获取图片的宽高(可用于dialog显示图片，位置抖动的问题解决，在图片外部给一个元素（宽高和图片相同）)
```
let imgBoxStyle = {};
const img = new Image(); // 相当于创建img标签的构造函数,效果等同于createElement
img.src = url;
// 判断是否有缓存
if (img.complete) {
  imgBoxStyle = { width: img.width, height: img.height };
} else {
  // 加载完成执行
  img.onload = () => { // 异步的方法
    imgBoxStyle = { width: img.width, height: img.height };
  };
}
```
#### 判断图片是否加载完成
> jquery中有一个ready和window.onload的区别。ready只是dom结构加载完成，图片并没有加载完毕，而onload是dom生成和资源完全加载出来后才执行，这里也就包括图片已加载。IE8下版本不支持onload事件，但支持onreadystatechange事件，readyState是onreadystatechange事件的一个状态，值为loaded或complete的时候，表示已经加载完毕。

```
const loadImg = document.getElementById('loadimg');
loadImg.onload = loadImg.onreadystatechange = function () {
  if (!this.readyState || this.readyState == 'loaded' || this.readyState == 'complete') {
    console.log('加载完成)
  }
}
```
#### 美观的展示json数据
```
<pre>
  {JSON.stringify(data, null, 2)}
</pre>
```
#### 自实现简单flat
```
const arrayFlat = (arr) => {
  const newArr = [];
  const deep = (data) => {
    data.map(
      item => Array.isArray(item) && item.length > 0 ? deep(item) : newArray.push(item)
    )
  }
  deep(arr);
  return newArr;
}
```
#### setTimeout实现setInterval
```
// count为允许执行的次数
function mySetInterval(fn, time, count){
  function interval(){
    if(typeof count === 'undefined' || count-- > 0) {
      setTimeout(interval, time);
      try {
        fn()
      } catch(e) {
        t = 0;
        throw e.toString();
      }
    }
  }
  setTimeout(interval, time)
}
```
#### rate评分
```
const rate = score => {
  const star = '★★★★★☆☆☆☆☆';
  return star.slice(5 - score, 10 - score);
}
rate(5);
rate(1);
```
### 易混淆的概念
#### 减少数组的length属性会删除索引位于新旧长度值之间的元素
```
const name = ['dyx', 'douyaxiang'];
name.length = 1;
console.log(name); // ['dyx']
```
#### 函数形参与局部变量重名情况
> 当局部变量未声明或只声明而未赋值时，内存中还没有这个变量，这时候调用的同名变量是形参。当局部变量赋值完成后，内存中已经存在这个变量，并且覆盖了同名的形参。后面再调用该变量时，就指的的局部变量了。

```
const myfunc = a => {
  alert(a);  // hello
  const a = a+'world';
  const b = a; 
  alert(a);  // helloworld
  alert(b);  // helloworld
}
myfunc("hello");
```
#### 变量声明
```
let i;
for (i = 0; i < 3; i++) {
  const log = () => {
    console.log(i); 
  }
  setTimeout(log, 100);
} // 3 3 3

for (let i = 0; i < 3; i++) {
  const log = () => {
    console.log(i); 
  }
  setTimeout(log, 100);
} // 0 1 2

(() => {
  let x = (y = 10); // y = 10; x = y; 
})();
console.log(y); // 10 y前面没有声明语句，相当于全局声明
console.log(x); // not defined  注意作用域的问题，函数内部作用域

var array = [];
for(var i = 0; i < 3; i++) {
  array.push(() => i); // push 进去三个箭头函数(三个箭头函数都指向同一个i变量)
}
var newArray = array.map(item => item());
console.log(newArray); [3, 3, 3]

// 立即执行函数
var array = [];
for(var i = 0; i < 3; i++) {
  ((i) => {
    array.push(() => i); 
  })(i);
}
var newArray = array.map(item => item());
console.log(newArray); [0, 1, 2]

// 使用局部作用域变量
var array = [];
for(let i = 0; i < 3; i++) {
  array.push(() => i);
}
var newArray = array.map(item => item());
console.log(newArray); // [0, 1, 2]
```
#### 当设置两个对象彼此相等时，它们会通过引用进行交互。但是当你将引用从一个变量分配至另一个变量时，其实只是执行了一个 复制操作
```
let person = { name: 'dyx' };
const arr = [ person ];
person = null;
console.log(arr); // [{ name: 'dyx' }]

let person = { name: 'dyx' };
const arr = [ person ];
person.name = "douyaxing";
console.log(arr); // [{ name: 'douyaxing' }]
```
#### for in可以循环对象
```
const obj = { name: 'dyx', age: 1 };
// for in 可以循环对象
for (const item in obj) {
console.log(item); // 'name', 'age'
}
```
#### 不同类型的变量作为函数参数的区别
```
function exer(obj, number) {
  obj.name = 'douyaxing';
  number = 24;
}

const obj = { name: 'dyx' };
const number = 23;
exer(obj, number);
console.log(obj); // { name: 'douyaxing' }
console.log(number); // 23
```
#### Set 可以简单去重但是返回的不是数组
```
console.log(new Set([1, 2, 2, 3, 4])) //  Set { 1, 2, 3, 4 }
```
#### reduce的返回值会作为下次循环的参数
```
[1, 2, 3, 4].reduce((x, y) => console.log(x, y))
// 1 2
// undefined 3
// undefined 4
```
#### yield 的参数传递
```
function* start() {
  const one = yield "one";
  if(one ==='two') {
    return 'two';
  }
  return 'three';
} 
const result = start();
console.log(result.next().value); // one
// next方法可以带一个参数，该参数会被当作上一个 yield 表达式的返回值。调用 result.next("two").value时，先前的 yield 的返回值将被替换为传递给 next()函数的参数 "two"。此时变量 one 被赋值为 "two"
console.log(result.next('two').value); // two
```
#### async 函数始终返回一个Promise
```
async function getData() {
  return await Promise.resolve('123');
}
const data = getData();
console.log(data); // Promise pending
data.then(res => console.log(res)) // 123

async function getData() {
  const a = await Promise.resolve('123');
  return a;
}
const data = getData();
// 异步函数始终返回一个promise
console.log(data); // Promise pending
data.then(res => console.log(res)) // 123
```
#### 闭包
```
var func = (function () {
  var count = 0;
  // 返回一个命名函数表达式
  function innerFunc() {
    count = count + 1;
    return count;
  };
  return innerFunc;
})();
var x = func();
console.log(x); // 1
var y = func();
console.log(y); // 2
```
#### 堆栈溢出
> 不会堆栈溢出，因为setTimeout是异步的，会有执行栈和事件队列的的一个循环机制，所以不会溢出

```
function foo() {
 setTimeout(foo, 0);
};
```
#### 页面不再响应
> 宏任务一次事件循环只会执行一个，一次事件循环会将所有微任务会全部执行包括执行过程中新添加的微任务，所以下方的函数会一直执行微任务。

```
function foo() {
 return Promise.resolve().then(foo);
};
```
## css
#### 瀑布流
- 使用multi-column
```
// 最外层盒子设置列数
.box {
  column-count: 5;
}

// 内部区域的盒子，设置不允许在内部自动断开
.block {
  break-inside: avoid;
}

<div class="box">
  <div class="block">...</div>
  <div class="block">...</div>
  <div class="block">...</div>
  <div class="block">...</div>
  ...
</div>
```
- [使用flex](https://juejin.im/post/6844904089709445133)

#### sticky 定位
> sticky必须搭配top、bottom、left、right这四个属性之一使用；当页面滚动，使用sticky定位的元素的父元素开始脱离视口时（即部分不可见），只要与sticky元素的距离小于设置的值时(如top : 0)，relative定位自动切换为fixed定位；等到父元素完全脱离视口时（即完全不可见），fixed定位自动切换回relative定位。Safari 浏览器需要加上浏览器前缀-webkit-, position: -webkit-sticky;

```
// css
div {
  position: sticky;
  top: 0;
  width: 400px;
  height: 400px;
  background: red;
}

// html
<div>1</div>
<div>2</div>
<div>3</div>
<div>4</div>


.top {
  height: 60px;
  background: green;
}
.nav {
  position: sticky;
  top: 0px;
  line-height: 40px;
  border: 1px solid #eeeeee;
  margin-top: 20px;
}
.content {
  height: 2000px;
}

<div class="top">12</div>
<div class="nav">nav</div>
<div class="content"></div>
```
#### 图片自适应，不失真
> 对于 img 标签而言，如果只规定高度和宽度中的一个的话，没有规定的那一个属性会根据图片本身的比例进行自适应，也就是说可以保证图片的比例不变，css设置图片的宽高可以覆盖img的属性的宽高值。

```
img {
  width: 100%;
  max-width: 100%;
  height: auto;
  overflow: hidden;
}
```
#### 中文文本的不同状态显示效果,英文与数字显示效果与中文不同
```
// 单行文本强制显示不换行
white-space:nowrap;
// 固定宽度显示，用于单行文字溢出省略号效果
{ 
  white-space:nowrap;
  text-overflow:ellipsis;
  overflow:hidden;
}
// 移动端水平列表滑动切换 
{
  white-space:nowrap;
  overflow:auto;	
}
// 多行文本，显示省略号
{
 display:-webkit-box;
 -webkit-line-clamp:2;
 text-overflow:ellipsis;
 overflow:hidden;
 -webkit-box-orient:vertical;
}
```
#### 文字两端对齐
```
width: 100px;
text-align: justify;
text-align-last: justify;
```
#### 选中文本自定义样式
```
<div class="a">1234567sdsfd</div>
.a::selection{
  background:red;
}
```
#### 记录一个按钮的点击使用css实现埋点
```
.button:active::after {
  content: url('统计埋点的地址');
  display: none;
}
```