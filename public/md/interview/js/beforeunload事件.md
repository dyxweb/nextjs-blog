## beforeunload事件
- 当浏览器窗口关闭或者刷新时，会触发beforeunload事件。
- 当阻止beforeunload事件默认行为时当前页面不会直接关闭，可以点击确定按钮关闭或刷新，也可以取消关闭或刷新。
### 显示确认对话框
- 根据规范要显示确认对话框，事件处理程序需要在事件上调用preventDefault()。
- 并非所有浏览器都支持上述方法，有些浏览器需要事件处理程序实现两个遗留方法中的一个作为代替：
  1. 将字符串分配给事件的returnValue属性。
  2. 从事件处理程序返回一个字符串。
### 示例
- JS
```
window.addEventListener("beforeunload", (event) => {
  console.log('beforeunload event triggered');
  // Cancel the event as stated by the standard.
  event.preventDefault();
  // Chrome requires returnValue to be set.
  event.returnValue = "Are you sure you want to exit?";
});
```
- React
```
const App = () => {
  useEffect(() => {
    const handleTabClose = (event: any) => {
      console.log('beforeunload event triggered');
      // Cancel the event as stated by the standard.
      event.preventDefault();
      // Chrome requires returnValue to be set.
      event.returnValue = "Are you sure you want to exit?";
    };

    window.addEventListener('beforeunload', handleTabClose);
    return () => {
      window.removeEventListener('beforeunload', handleTabClose);
    };
  }, []);

  return (
    <div>hello world</div>
  );
};
```
### 浏览器窗口关闭或者刷新时发送接口请求
> 常用的异步ajax请求在unload/beforeunload事件内是不可靠的，浏览器可能会无视异步请求从而导致后端收不到。

#### sendBeacon
- sendBeacon设计就是用来解决页面卸载时发送请求的问题。它能保证在页面unload完成前请求能够被发送，并且由于其是异步且非阻塞的，并不会影响浏览器其它页面的显示效率。
- sendBeacon只能发送http post请求。
- sendBeacon无法自定义header信息。
```
window.addEventListener('beforeunload', () => {
  if (window.navigator?.sendBeacon) {
    const blob = new Blob([JSON.stringify(data)], {
      type: 'application/json; charset=UTF-8'
    });
    window.navigator.sendBeacon(url, blob);
  }
});
```
#### fetch + keepalive
- keepalive字段一次只能承载最大64KB的请求内容，且该限制是所有并行请求共享的，即页面卸载阶段所有fetch+keepalive请求的内容体总和不能超过64KB。
- 可以发送http get请求。
- 可以自定义header信息。
```
window.addEventListener('beforeunload', () => {
  fetch(url, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    }, 
    body: JSON.stringify(data),
    // 必须有
    keepalive: true,
  });
})
```