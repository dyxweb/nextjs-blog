## SSE(服务器发送事件)
- 服务器发送事件部署在EventSource对象上，除了IE其它主流浏览器都支持。
- 浏览器向服务器发送一个HTTP请求，然后服务器不断单向地向浏览器推送“信息”。这种信息在格式上很简单，就是“信息”加上前缀“data: ”，然后以“\n\n”结尾。
### SSE与WebSocket
- WebSocket是全双工通道，可以双向通信，功能更强；SSE是单向通道，只能服务器向浏览器端发送。
- WebSocket是一个新的协议，需要服务器端支持；SSE则是部署在HTTP协议之上的，现有的服务器软件都支持。
- SSE是一个轻量级协议，相对简单；WebSocket是一种较重的协议，相对复杂。
- SSE默认支持断线重连，WebSocket则需要额外部署。
- SSE支持自定义发送的数据类型。
### 建立连接
```
if (!!window.EventSource) {
  const source = new EventSource('http://127.0.0.1/sse');
}
```
### 关闭连接
```
source.close();
```
### readyState属性
- 0：相当于常量EventSource.CONNECTING，表示连接还未建立，或者连接断线。
- 1：相当于常量EventSource.OPEN，表示连接已经建立，可以接受数据。
- 2：相当于常量EventSource.CLOSED，表示连接已断，且不会重连。
### open事件
- 连接一旦建立，就会触发open事件，可以定义相应的回调函数。
```
source.onopen = function(event) {
  // handle open event
};

// 或者
source.addEventListener("open", function(event) {
  // handle open event
}, false);
```
### message事件
- 收到数据就会触发message事件。
- data：服务器端传回的数据（文本格式）。
- origin：服务器端URL的域名部分，即协议、域名和端口。
- lastEventId：数据的编号，由服务器端发送。如果没有编号，这个属性为空。
```
source.onmessage = function(event) {
  var data = event.data;
  var origin = event.origin;
  var lastEventId = event.lastEventId;
  // handle message
};

// 或者
source.addEventListener("message", function(event) {
  var data = event.data;
  var origin = event.origin;
  var lastEventId = event.lastEventId;
  // handle message
}, false);
```
### error事件
- 如果发生通信错误（比如连接中断），就会触发error事件。
```
source.onerror = function(event) {
  // handle error event
};

// 或者
source.addEventListener("error", function(event) {
  // handle error event
}, false);
```