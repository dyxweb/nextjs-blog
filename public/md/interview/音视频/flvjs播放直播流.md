## flvjs播放直播流
### 安装依赖
```
npm install flv.js
```
### 播放直播流
```
import flvjs from 'flv.js';

if (flvjs.isSupported()) {
  const videoDom = document.getElementById('video');
  const flvPlayer = flvjs.createPlayer({
    type: 'flv',
    isLive: true,
    cors: true,
    hasAudio: false,
    hasVideo: true,
    url: liveUrl
  }); // 创建flvPlayer
  flvPlayer.attachMediaElement(videoDom); // 挂载元素
  flvPlayer.load(); // 加载视频流
  flvPlayer.play(); // 播放视频流
}
```
### 销毁flv播放器
```
flvPlayer.pause();
flvPlayer.unload();
flvPlayer.detachMediaElement();
flvPlayer.destroy();
```
### 获取网速信息
```
flvPlayer.on('statistics_info', (res) => {
  console.log(res.speed); // KB/S
});
```
### 页面不可见时会暂停拉流
- 浏览器中当页面切换到后台或不可见状态时，浏览器会暂停视频和其他资源的播放以降低性能消耗。
- 当页面再次切换到前台或可见状态时，浏览器会自动恢复资源的播放。
- 这可能导致FLV视频流在切换页面时暂停播放，从而导致一段时间的延迟。
### The play() request was interrupted by a call to pause()错误
> 错误原因是因为在播放视频(play方法)之前被调用的pause方法中断了。

- 资源加载不成功(直播流链接错误)，导致没有资源可以播放。
- 时机不对，可添加定时器处理。
```
flvPlayer.load();
setTimeout(() => {
  flvPlayer.play();
}, '时间')
```
### 追帧
> 直播暂停后继续播放时切换到最新的画面帧。