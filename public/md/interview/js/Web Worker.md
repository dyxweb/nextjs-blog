## Web Worker
- 由于JavaScript是单线程的，当执行比较耗时的任务时，就会阻塞主线程并导致页面无法响应。
- Web Worker允许在一个单独的线程中执行耗时的任务，这使得JavaScript代码可以在后台执行，而不会阻塞主线程并导致页面无响应。
- Web Worker是一个作为后台线程运行的脚本，具有自己的引擎实例和事件循环。它与主执行线程并行运行，并且不会阻塞事件循环。
### Web Worker与主线程的区别
- Web Worker没有访问DOM的权限，这意味着它不能直接操作页面上的HTML元素与用户交互。Web Worker被设计用于执行不需要直接访问UI的任务，例如数据处理、图像操作或计算。
- Web Worker被设计为在与主线程分离的沙箱环境中运行，这意味着它们对系统资源的访问受到限制，并且不能访问某些API如localStorage或sessionStorageAPI。Web Worker可以通过消息传递系统与主线程进行通信，从而允许两个线程之间交换数据。

### Web Worker客户端使用
1. 创建一个新的JavaScript文件，其中包含要运行的代码(耗时任务)。该文件不应包含对DOM的引用，因为在Web Worker中无法访问DOM。
2. 在主JavaScript文件中，使用Worker构造函数创建一个新的worker对象。此构造函数接收一个参数，即在步骤1中创建的JavaScript文件的URL。
```
const worker = new Worker('worker.js');
```
3. 向worker对象添加事件监听以处理主线程和Web Worker之间发送的消息。onmessage用于处理从Web Worker发送来的消息，postMessage用于向Web Worker发送消息。
```
worker.onmessage = function(event) {
  console.log('Worker: ' + event.data);
};

worker.postMessage('Hello, worker!');
```
4. 在Web Worker的JavaScript文件中，使用self对象的onmessage属性添加事件监听来处理从主线程发来的消息，postMessage用于向主线程发送消息。
```
self.onmessage = function(event) {
  console.log('Main: ' + event.data);
  self.postMessage('Hello, Main!');
};
```
### 终止Web Worker
- 使用terminate()函数来终止。
```
// 主JavaScript文件中终止Web Worker
worker.terminate();
```
- 通过调用self上的close()函数使其自行终止。
```
// Web Worker自行终止
self.close();
```
### 使用onerror函数来处理Web Worker抛出的错误
```
worker.onerror = function(err) {
  console.log("遇到错误")
}
```
### JS引擎计算
> 点击btn1时，js会进行大量计算，发现页面卡死了，点击input不会有任何反应。

```
<button id="btn1">js</button>
<button id="btn2">worker</button>
<input type="text">

const btn1 = document.getElementById('btn1');
btn1.addEventListener('click', function() {
  let total = 1;
  for (let i = 0; i < 5000000000; i++) {
    total += i;
  }
  console.log(total);
})
```
### 使用Web Worker
> 点击btn2时，页面并不会卡死，可以正常的对input进行输入操作。开启了一个单独的worker线程来进行复杂操作，通过postMessage和onmessage来进行两个线程间的通信。

```
<button id="btn1">js</button>
<button id="btn2">worker</button>
<input type="text">

if (window.Worker) {
  const myWorker = new Worker('./worker.js');
  myWorker.onmessage = function (e) {
    // e.data就是postMessage传递的数据
    console.log('total', e.data);
  };
  const btn1 = document.getElementById('btn1');
  const btn2 = document.getElementById('btn2');

  btn1.addEventListener('click', function () {
    let total = 1;
    for (let i = 0; i < 5000000000; i++) {
      total += i;
    }
    console.log('total', total);
  })

  btn2.addEventListener('click', function () {
    myWorker.postMessage('total');
  });
}


// worker.js
onmessage = function(e) {
  // e.data就是postMessage传递的数据
  if (e.data === 'total') {
    let total = 1;
    for (let i = 0; i < 5000000000; i++) {
      total += i;
    }
    postMessage(total);
  }
}
```
### Web Worker与Shared Worker
> 本质上就是进程和线程的区别。Shared Worker由独立的进程管理，Web Worker只是属于某个渲染进程(浏览器内核进程)下的一个线程。

- Web Worker只属于某个页面，不会和其他页面的渲染进程(浏览器内核进程)共享，所以Chrome会在渲染进程(浏览器内核进程)中（每一个Tab页就是一个渲染进程）创建一个新的线程来运行Worker中的JavaScript程序。
- Shared Worker是浏览器所有页面共享的，不能采用与Worker同样的方式实现，因为它不隶属于某个渲染进程(浏览器内核进程)，可以为多个渲染进程(浏览器内核进程)共享使用，所以Chrome浏览器为Shared Worker单独创建一个进程来运行JavaScript程序，在浏览器中每个相同的JavaScript只存在一个SharedWorker进程，不管它被创建多少次。
