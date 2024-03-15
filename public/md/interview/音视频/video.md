## video
### autoplay
- 视频就绪后自动播放。
### controls
- 控制是否显示视频操作控件，默认为true。
### muted
- 是否禁音，默认为true。
### controlslist属性
- 三种属性值取值如下，空格隔开，可单独配置
  1. nodownload：取消更多控件弹窗的下载功能。
  2. nofullscreen：取消全屏功能。
  3. noremoteplayback：取消远程播放视频功能。
### 媒体事件
- 播放
```
video.play();
```
- 暂停
```
video.pause();
```
- 全屏
```
video.webkitRequestFullScreen();
```
- 获取播放进度时间
```
video.currentTime
```
- 获取播放总时长
```
video.duration
```
- 改变音量
```
// 设置为0 - 1的数字
video.volume = 0.5;
```
- 设置倍速播放
```
// rate一般在[2, 1.75, 1.5, 1.0, 0.75, 0.5]范围
video.playbackRate = rate;
```
### 媒体事件监听
- play：开始播放时触发
```
video.addEventListener('play', () => {});
```
- pause：暂停播放时触发
```
video.addEventListener('pause', () => {});
```
- waiting：视频加载中
```
video.addEventListener('waiting', () => {});
```
- ended：播放结束时触发
```
video.addEventListener('ended', () => {});
```
- timeupdate：播放时间发生变化时触发，可配合实现自定义进度条
```
video.addEventListener('timeupdate', () => {});
```
- canplay：可以开始播放时触发，表示已经加载到足够的数据供播放
```
video.addEventListener('canplay', () => {});
```
- loadedmetadata：当媒体的元数据加载完成时触发
```
video.addEventListener('loadedmetadata', () => {
  console.log(video.duration);
  console.log(video.videoWidth);
  console.log(video.videoHeight);
});
```
- seeking：用户开始移动/跳跃到新的音频/视频播放位置时触发，拖动进度条如果需要加载资源会触发seeking事件。
```
video.addEventListener('seeking', () => {});
```
- seeked：用户已移动/跳跃到音频/视频中的新位置时触发，拖动进度条如果可以直接播放会触发seeked事件。
```
video.addEventListener('seeked', () => {});
```
- error：当媒体加载或播放过程发生错误时触发
```
video.addEventListener('error', () => {});
```
### 控制video控件的显示
```
// 隐藏全屏按钮
video::-webkit-media-controls-fullscreen-button {
  display: none;
}
// 隐藏播放按钮
video::-webkit-media-controls-play-button {
  display: none;
}
// 隐藏进度条
video::-webkit-media-controls-timeline {
  display: none;
}
// 隐藏观看的当前时间
video::-webkit-media-controls-current-time-display {
  display: none;
}
// 隐藏剩余时间
video::-webkit-media-controls-time-remaining-display {
  display: none;
}
// 隐藏音量按钮
video::-webkit-media-controls-mute-button {
  display: none; 
}
// 隐藏音量的控制条
video::-webkit-media-controls-volume-slider {
  display: none;
}
// 隐藏所有控件
video::-webkit-media-controls-enclosure{ 
  display: none;
}
```