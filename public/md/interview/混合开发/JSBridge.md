## JSBridge
> Web端和Native端得以实现双向通信。

### WebView
> WebView是移动端中的一个控件，它为JS运行提供了一个沙箱环境。WebView能够加载指定的url，拦截页面发出的各种请求等各种页面控制功能，JSBridge的实现就依赖于WebView暴露的各种接口。

| 平台和版本 | WebView 内核	|
| --- | --- |
| iOS 8+ | WKWebView |
| iOS 2-8 |	UIWebView |
| Android 4.4+ | Chrome |
| Android 4.4- | Webkit |

### Native向Web发送消息
> Native向Web发送消息基本原理上是在WebView容器中动态地执行一段JS脚本，通常情况下是调用一个挂载在全局上下文的方法。Native端可以直接调用挂载在window上的全局方法并传入相应的函数执行参数，并且在函数执行结束后Native端可以直接拿到执行成功的返回值。

1. Web端提前subscribe订阅事件（存储事件处理函数）。
2. 原生调用一个挂载在全局上下文的方法，此事件处理中emit发布事件，执行之前Web端subscribe订阅时存储的事件处理函数。
### Web向Native发送消息
> Web向Native发送消息本质上就是某段JS代码的执行端上是可感知的。

### 拦截式
> 和浏览器类似WebView中发出的所有请求都是可以被Native容器感知到的，因此拦截式具体指的是Native拦截Web发出的URL请求，双方在此之前约定一个JSB请求格式，如果该请求是JSB则进行相应的处理，若不是则直接转发。

#### 发送请求的方式
> Web端发出请求的方式非常多样，例如a标签、iframe.src、location.href、ajax等，但a标签需要用户手动触发，location.href可能会导致页面跳转，安卓端拦截 ajax的能力有所欠缺，因此绝大多数拦截式实现方案均采用iframe来发送请求。

#### 拦截式劣势
> 拦截式在双端都具有非常好的向下兼容性，曾经是最主流的JSB实现方案，但目前在高版本的系统中已经逐渐被淘汰。

- 连续发送时可能会造成消息丢失（可以使用消息队列解决该问题）
- URL字符串长度有限制
- 性能一般，URLreques 创建请求有一定的耗时（Android 端 200-400ms）
### 注入式
> 这种方式简单而直观，并且不存在参数长度限制和性能瓶颈等问题，目前主流的JSBridge SDK都将注入式方案作为优先使用的对象。

#### 原生应用调用h5方法
> h5端在全局上下文对象(window)中注入方法，原生应用可以通过evaluateJavascript调用h5在window上注入的方法。

```
// h5端注入h5MinusCount方法
window.h5MinusCount = (minusNum: number) => {
  setCount((prev: number) => prev - minusNum);
  return 'h5MinusCountValue';
};

// 原生应用调用h5MinusCount方法
h5MinusCountButton.setOnClickListener {
  val minusNum: Number = 3
  // 调用H5的h5MinusCount方法
  myWebView.evaluateJavascript("javascript:h5MinusCount(${minusNum})", ValueCallback<String>() {
    Toast.makeText(this, it, Toast.LENGTH_SHORT).show()
  })
}
```
#### h5端调用原生应用方法
> 原生应用通过addJavascriptInterface可以在h5端的全局上下文对象(window)中注入方法，h5端直接调用原生应用在window上注入的方法。

```
// 原生应用注入showNativeToast方法
myWebView.addJavascriptInterface(WebAppInterface(this), "jsbridge")
class WebAppInterface(private val mContext: Context) {
  @JavascriptInterface
  fun showNativeToast(toast: String): String {
    Toast.makeText(mContext, toast, Toast.LENGTH_SHORT).show()
    return "showNativeToast return value"
  }
}

// h5端调用showNativeToast方法
window.jsbridge?.showNativeToast('h5 click showNativeToast');
```
### 两种方案对比
| 方案 | 兼容性 | 性能 | 参数长度限制 |
| --- | --- | --- | --- |
| 拦截式 | 无兼容性问题	| 较差，安卓端尤为明显 | 有限制 |
| 注入式 | 安卓4.2+ 和 iOS 7+以上可用 |	较好 | 无 |