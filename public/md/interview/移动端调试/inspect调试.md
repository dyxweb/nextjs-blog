## inspect调试
1. 手机开启开发者模式，打开USB调试功能，手机通过USB数据线连接电脑。
2. 电脑上打开Chrome浏览器，打开地址[chrome://inspect](chrome://inspect)。
3. 在浏览器中的Devices下方能够找到连接的手机设备。确保已勾选"Discover USB Devices"或"Discover network targets"。（根据连接方式不同，可能有所不同）。
4. 在手机浏览器打开H5页面或者打开APP WebView中加载的H5页面。在浏览器中能够看到手机设备下方出现的网页链接，点击"inspect"来打开开发者工具进行调试。
### 问题记录
- 手机网页需要是在chrome内核的浏览器中打开，只有chrome内核（Android浏览器和Android WebView大多都是chrome内核）打开的H5页面才支持inspect，比如微信的浏览器内核是X5，是不支持inspect的。
- 电脑chrome打开chrome://inspect页面，手机通过USB连接电脑，注意需要是数据线，有的USB只支持充电不支持传输数据。
- 手机打开USB调试，USB连接需要选择传输文件。
- 如果点击inspect显示HTTP/1.1 404 Not Found是因为网络限制，需要使用VPN或者使用edge浏览器调试[edge://inspect/#devices](edge://inspect/#devices)。 
- 如果一切正常，手机会弹出是否允许调试弹窗，选择允许。
- 如果不是常用设备选择始终允许调试可能会导致inspect能够找到连接的手机设备但是显示offline，这是因为手机无法弹出调试弹窗导致的，需要打开终端安装adb并运行以下命令。
```
adb kill-server

adb start-server

// 以下命令查看手机设备连接情况
adb devices
```
### Android WebView支持通过chrome://inspect调试H5页面
1. 首先在app/src/main/AndroidManifest.xml设置允许对app debug。
```
<!--添加以下两个属性-->
<application
  android:debuggable="true"
  tools:ignore="HardcodedDebugMode"
>
```
2. 使用setWebContentsDebuggingEnabled方法在WebView中启用调试模式。
