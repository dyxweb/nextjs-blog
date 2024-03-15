## WebView
### Android WebView
- 在Android4.4以前，WebView是Android webkit浏览器内核，很多HTML5标准语法不支持，canvas性能也非常差。
- Android4.4起，WebView变成了chromium内核，内核版本是chrome30，性能和现代语法支持大幅提升。
- 从Android5开始，WebView脱离rom可单独更新，伴随着chrome的发版，google会在google play store上同步更新Android system webview。
### Android system webview
- 它自带于手机rom中，所有依赖系统WebView的应用都调用这个WebView。
