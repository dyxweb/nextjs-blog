## 事件流
> 满足同时触发多个事件时(一次点击会触发多个不同DOM上的事件)的执行顺序：一个完整的事件流是从window开始，最后回到window的过程。并且被分为捕获阶段、目标阶段、冒泡阶段。

- 捕获阶段：触发的事件从window发出，不断经过下级节点直到触发的目标节点。在到达目标节点之前的过程就是捕获阶段。
- 目标阶段：触发的事件不断的传递直到目标节点的时候，最终在目标节点上触发这个事件，就是目标阶段。
- 冒泡阶段：触发的事件由最精确的元素(事件发生所在的节点)然后逐级传播到较为不精确的节点的过程就是冒泡阶段。
### 事件级别
> DOM级别一共可以分为四个级别：DOM0级、DOM1级、DOM2级和DOM3级。而DOM事件分为3个级别：DOM0级事件处理、DOM2级事件处理和DOM3级事件处理。因为DOM1级标准没有定义事件相关的内容，所以没有所谓的1级DOM事件模型。

### DOM0级事件处理
> 将一个函数赋值给一个事件处理属性。

```
<body>
	<div></div>
</body>

<script type="text/javascript">
  const div = document.querySelector("div");
  div.onclick = function(){}
</script>
```
### DOM2级处理事件
> 定义了addEventListener和removeEventListener两个方法分别用来绑定和解绑事件。方法中包含三个参数分别是绑定的事件处理的属性名称、处理函数、是否在捕获时候执行事件处理函数。默认使用冒泡流，第三个参数设为true时使用捕获流。

```
<body>
	<div></div>
</body>

<script type="text/javascript">
  const div = document.querySelector("div");
  div.addEventListener('click', function(){}, false);
</script>
```
### DOM3级处理事件
> 在DOM2级事件的基础上添加了更多的事件类型，如滚动事件、触摸事件、过渡事件等。

### 总结
- 0级只能定义一个事件，多事件会相互覆盖。
- 2级多了自定义事件，并且还有事件冒泡和捕获；可以给一个事件添加多个处理函数。
- 3级添加了更多的事件类型。
### 事件冒泡和事件捕获
- 事件冒泡：事件按照从最精确的事件目标到最不精确的事件目标的顺序触发。
```
<div id='one'>
  <div id='two'>
    <div id='three'>
      <div id='four'>
        Event
      </div>
    </div>
  </div>
</div>

<script type='text/javascript'>
  const one=document.getElementById('one');
  const two=document.getElementById('two');
  const three=document.getElementById('three');
  const four=document.getElementById('four');

  one.addEventListener('click', function() {
    alert('one');
  }, false);

  two.addEventListener('click', function() {
    alert('two');
  }, false);

  three.addEventListener('click', function() {
    alert('three');
  }, false);

  four.addEventListener('click', function() {
    alert('four');
  }, false);
</script>
// 点击之后弹框顺序是four、three、two、one。
```
- 事件捕获：事件按照从最不精确的事件目标到最精确的事件目标的顺序触发。
```
<div id='one'>
  <div id='two'>
    <div id='three'>
      <div id='four'>
        Event
      </div>
    </div>
  </div>
</div>

<script type='text/javascript'>
  const one=document.getElementById('one');
  const two=document.getElementById('two');
  const three=document.getElementById('three');
  const four=document.getElementById('four');

  one.addEventListener('click', function() {
    alert('one');
  }, true);

  two.addEventListener('click', function() {
    alert('two');
  }, true);

  three.addEventListener('click', function() {
    alert('three');
  }, true);

  four.addEventListener('click', function() {
    alert('four');
  }, true);
</script>
// 点击之后弹框顺序是one、two、three、four。
```
### 事件对象
> 在触发DOM上的某个事件时，会产生一个事件对象event，这个对象中包含着所有与事件有关的信息。只有在事件处理程序执行期间，event对象才会存在。一旦事件处理程序执行完成，event对象就会被销毁。

- currentTarget、target
> target指向事件流的目标阶段对象，currentTarget指向事件流在捕获、目标、冒泡阶段事件活动的对象。只有当事件流处在目标阶段的时候，两个的指向才是一样的，而当处于捕获和冒泡阶段的时候，target指向被触发的对象而currentTarget指向当前事件活动的对象。

- event.type代表事件的类型如click
- event.preventDefault()阻止事件的默认事件
- stopPropagation()用于立即停止事件在DOM层次中的传播，即取消进一步的事件捕获或冒泡
- e.persist() // 异步回调后事件对象的继续使用
- eventPhase
    - 用来确定事件当前正位于事件流的哪个阶段。捕获阶段：eventPhase = 1；处于目标对象上：eventPhase = 2；冒泡阶段：eventPhase = 3；
    - 当eventPhase等于2时，this、target、currentTarget始终是相等的。
```
// 首先执行的事件是在捕获阶段触发的添加到document.body中的那一个，eventPhase为1。
// 其次会触发在按钮上注册的事件处理程序(因为第三个参数设置为true，表示使用捕获流)，eventPhase为2。
// 最后在冒泡阶段触发添加到document.body中的那一个，eventPhase为3。 
btn.onclick = function(event) {
  alert(event.eventPhase); // 2
}
document.body.addEventListener("click", function(event) {
   alert(event.eventPhase); // 1
}, true);
document.body.onclick = function(event) {
  alert(event.eventPhase); // 3
}
```
### 自定义事件
- 监听自定义prize事件
```
document.addEventListener('prize', () => {
  // 监听prize事件
})
```
- 触发自定义prize事件
```
document.dispatchEvent(new CustomEvent('prize'))
```
### 同一个元素既有click事件又有addEventListener事件，点击之后两个事件都会触发，且先执行addEventListener的事件后执行click的事件。
### 阻止事件传播
1. 阻止冒泡：stopPropagation()；IE下：cancelBubble = true。
2. 默认事件阻止：preventDefault()；IE下：window.event.returnValue = false。
### 获取元素绑定的事件getEventListeners
- getEventListeners(window) 获取window上绑定的事件。