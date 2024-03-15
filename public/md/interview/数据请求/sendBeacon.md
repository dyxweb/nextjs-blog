## sendBeacon
> navigator.sendBeacon()方法可用于通过HTTP POST将少量数据异步传输到Web服务器。

- url：data将要被发送到的网络地址。
- data：将要发送的ArrayBuffer、ArrayBufferView、Blob、DOMString、FormData或URLSearchParams类型的数据。
- 返回值：当用户代理成功把数据加入传输队列时，sendBeacon()方法将会返回true，否则返回false。
```
navigator.sendBeacon(url, data);
```
### 优点
- 异步和非阻塞：navigator.sendBeacon是异步的，它不会阻塞浏览器的其他操作，不会影响到页面的性能。
- 数据发送可靠：在页面卸载时仍然可以发送数据，当用户离开页面(例如关闭页面或者导航到其他页面)时，navigator.sendBeacon仍然可以发送数据。
- 低优先级：navigator.sendBeacon发送的请求是低优先级的，它不会影响到页面的其他网络请求。
- 简单易用：navigator.sendBeacon的API非常简单，只需要提供上报的URL和数据，就可以发送请求。
- 支持跨域请求。
- 不影响下一导航的载入。
### 缺点
- 只能发送POST请求，不能发送GET请求。
- 发送的请求不能接收服务器的响应。
- 一些旧的浏览器可能不支持navigator.sendBeacon。在使用navigator.sendBeacon时需要根据实际情况进行兼容性处理。
- 不支持自定义headers请求头。
### 文档卸载期间发送数据
> 保证在文档卸载期间发送数据一直是一个困难。因为用户代理通常会忽略在unload事件处理器中产生的异步XMLHttpRequest。下述方法都会迫使用户代理延迟卸载文档，并使得下一个导航出现的更晚。下一个页面对于这种较差的载入表现无能为力。

- 发起一个同步XMLHttpRequest来发送数据。
- fetch + keepalive。
- 创建一个`<img>`元素并设置src，大部分用户代理会延迟卸载（unload）文档以加载图像。
- 创建一个几秒的 no-op 循环。
### 在visibilitychange事件发生时发送数据
- 避免使用unload和beforeunload，在许多情况下（尤其是移动设备）浏览器不会产生unload、beforeunload或pagehide事件。
```
window.addEventListener('beforeunload', (event) => {
  // 执行API请求
});
```
- unload事件与现代浏览器实现的往返缓存（bfcache）不兼容。
- 可使用pagehide事件来代替部分浏览器未实现的visibilitychange事件。和beforeunload与unload事件类似，这一事件不会被可靠地触发（特别是在移动设备上），但它与bfcache兼容。
```
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") {
    // sendBeacon发送json格式数据
    const blob = new Blob([JSON.stringify(data)], {
      type: 'application/json; charset=UTF-8'
    });
    window.navigator.sendBeacon(url, blob);
  }
});
```
