## Android使用WebView
### AndroidManifest.xml
- 加入联网的权限
```
<uses-permission android:name="android.permission.INTERNET"></uses-permission>
```
- 设置允许对app debug
```
<application
  android:debuggable="true"
  tools:ignore="HardcodedDebugMode"
>
</application>
```
### Activity
- 设置可运行JavaScript脚本
```
webView.settings.javaScriptEnabled=true
```
- 设置启用HTML5 DOM storage API
```
webView.settings.domStorageEnabled=true
```
- 设置启用调试模式
```
try {
  // 启用调试模式
  // 由于 WebView#setWebContentsDebuggingEnabled 函数不能直接访问，必须使用反射进行访问
  val method = Class.forName("android.webkit.WebView")
    .getMethod("setWebContentsDebuggingEnabled", java.lang.Boolean.TYPE)
  if (method != null) {
    method.isAccessible = true
    method.invoke(null, true)
  }
} catch (e: Exception) {
  // JavaScript出错处理 此处不进行任何操作
}
```
### 
### WebView加载的H5页面初始存在重定向时可能会导致最后无法退出应用的问题
- 可以调整加载的H5页面链接为重定向后的地址。
### WebView加载H5页面后返回键会关闭Activity的问题
- 通过监听返回键事件实现WebView内部后退逻辑
```
override fun onKeyDown(keyCode: Int, event: KeyEvent?): Boolean {
  val webView: WebView = findViewById(R.id.h5WebView)
  if (keyCode == KeyEvent.KEYCODE_BACK) { // 判断按下的是否为返回键
    if (webView.canGoBack()) {
      webView?.goBack() // 调用WebView的goBack()函数进行页面后退操作
      return true // 返回true表示已处理该事件
    } else {
      // WebView不能页面后退时调用默认的后退事件
      super.onBackPressed();
    }
  }
  return super.onKeyDown(keyCode, event)
}
```