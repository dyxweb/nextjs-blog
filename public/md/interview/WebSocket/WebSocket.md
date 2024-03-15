## WebSocket
- WebSocket是一种在单个TCP连接上进行全双工通信的协议，它可以让客户端和服务器之间进行实时的双向通信，客户端和服务器之间可以互相发送消息。
- 与传统的HTTP请求不同，WebSocket使用了一个长连接，在客户端和服务器之间保持持久的连接，从而可以实时地发送和接收数据。
- WebSocket不存在跨域问题。
### WebSocket与HTTP的区别
- WebSocket是一种双向通信的协议，通过一次握手即可建立持久性的连接，服务器和客户端可以随时发送和接收数据。
- HTTP协议是一种请求-响应模式的协议，每次通信都需要发送一条请求并等待服务器的响应。
- WebSocket的实时性更好，延迟更低，并且在服务器和客户端之间提供双向的即时通信能力，适用于需要实时数据传输的场景。
### 前端使用WebSocket
- 创建WebSocket对象
> 通过JavaScript中的new WebSocket(URL)方法创建WebSocket对象，其中URL是WebSocket服务器的地址。

```
const socket = new WebSocket('ws://localhost:8000');
```
- 监听WebSocket事件
  1. open：当与服务器建立连接时触发。
  2. message：当收到服务器发送的消息时触发。
  3. close：当与服务器断开连接时触发。
  4. error：当连接或通信过程中发生错误时触发。
```
socket.addEventListener('open', () => {
  console.log('WebSocket连接已建立');
});

socket.addEventListener('message', (event) => {
  const message = event.data;
  console.log('收到消息：', message);
});

socket.addEventListener('close', () => {
  console.log('WebSocket连接已断开');
});

socket.addEventListener('error', (error) => {
  console.error('发生错误：', error);
});
```
- 发送消息
> 通过WebSocket对象的send(data)方法发送消息，其中data是要发送的数据，可以是字符串、JSON对象等。

```
const message = 'Hello, server!';
socket.send(message);
```
- 关闭WebSocket连接
> 当通信结束或不再需要与服务器通信时，需要关闭WebSocket连接以释放资源。通过调用WebSocket对象的close()方法可以主动关闭连接。

```
socket.close();
```
### WebSocket的应用场景
- 实时聊天应用：WebSocket能够提供双向、实时的通信机制，使得实时聊天应用能够快速、高效地发送和接收消息，实现即时通信。
- 实时协作应用：WebSocket可以用于实时协作工具，如协同编辑文档、白板绘画、团队任务管理等，团队成员可以实时地在同一页面上进行互动和实时更新。
- 实时数据推送：WebSocket可以用于实时数据推送场景，如股票行情、新闻快讯、实时天气信息等，服务器可以实时将数据推送给客户端，确保数据的及时性和准确性。
- 在线客服和客户支持：WebSocket可以用于在线客服和客户支持系统，实现实时的客户沟通和问题解决，提供更好的用户体验，减少等待时间。
### WebSocket的缺点和不足
- WebSocket需要浏览器和服务器端都支持该协议。
- WebSocket会增加服务器的负担，不适合大规模连接的应用场景。



