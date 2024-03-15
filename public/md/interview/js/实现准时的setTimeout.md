## 实现准时的setTimeout
- setTimeout是不准的，因为setTimeout是一个宏任务，它的指定时间指的是进入主线程的时间。
- 什么时候可以执行callback，需要看主线程前面还有多少任务待执行。
```
setTimeout(callback, 进入主线程的时间)
```
### setTimeout不准时的案例
- 如果在setTimeout还未执行期间加入一些额外的代码逻辑会加剧时间误差。
```
function timer() { 
  var speed = 50, // 设定间隔 
  counter = 1,  // 设定间隔  
  start = new Date().getTime(); 
  
  function instance() { 
    var ideal = counter * speed, // 定时器理想正常的时间间隔
    real = new Date().getTime() - start; // 定时器实际运行的时间间隔
    counter++; 
    var diff = real - ideal; 
    window.setTimeout(function() { instance(); }, speed); 
  }; 
  
  window.setTimeout(function() { instance(); }, speed); 
} 
timer(); 
```
### requestAnimationFrame模拟setTimeout
- requestAnimationFrame方法需要传入一个回调函数作为参数，该回调函数会在浏览器下一次重绘之前执行，回调函数执行次数通常是每秒60次，也就是每16.7ms执行一次，但是并不一定保证为16.7ms。
- 由于16.7ms间隔执行，在使用间隔很小的定时器，很容易导致时间的不准确。
```
function setTimeout2 (cb, delay) { 
  let startTime = Date.now() 
  loop() 
  
  function loop () { 
    const now = Date.now() 
    if (now - startTime >= delay) { 
      cb(); 
      return; 
    } 
    requestAnimationFrame(loop) 
  } 
} 
```
### while模拟setTimeout
- 主动去触发获取到最开始的时间，以及不断去轮询当前时间，如果差值是预期的时间，那么这个定时器肯定是准确的，使用while可以实现这个功能。
- js是单线程运行，使用这样的方式强行霸占线程会使得页面进入卡死状态，这样的结果显然是不合适的。
```
function timer(time) { 
  const startTime = Date.now(); 
  while(true) {
    const now = Date.now(); 
    if (now - startTime >= time) {
      console.log('误差', now - startTime - time); 
      return; 
    } 
  } 
}
timer(5000); 
```
### setTimeout系统时间补偿
- 当每一次定时器执行时后，都去获取系统的时间来进行修正，虽然每次运行可能会有误差，但是通过系统时间对每次运行的修复，能够让后面每一次时间都得到一个补偿。
```
function timer() { 
  var speed = 500, // 设定间隔 
  counter = 1,  // 设定间隔 
  start = new Date().getTime(); 
  
  function instance() { 
    var ideal = counter * speed, // 定时器理想正常的时间间隔
    real = new Date().getTime() - start; // 定时器实际运行的时间间隔
    counter++; 
    var diff = real - ideal; 
    window.setTimeout(function() { instance(); }, (speed - diff)); // 通过系统时间进行修复 
  }; 
  
  window.setTimeout(function() { instance(); }, speed); 
} 
```