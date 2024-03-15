## [xgPlayer](https://h5player.bytedance.com/)
### 使用xgplayer-flv播放直播流
- 播放直播流时不支持显示播放进度条和播放时间。
- 在播放回放直播时推流速度快于播放速度时会自动追帧。
- 默认点击暂停按钮会停止拉流、重新播放后重新开始拉流。
- 页面最小化时会触发pause事件，页面最大化后会触发play事件。
### 设置播放事件前置处理
```
player.setEventsMiddleware({
  play: async (e: any, callback: any) => {
    if (canPlay) {
      // 可直接播放时callback
      callback(e.eventName, e);
    } else {
      // 不可播放时请求接口后再callback
      // ...
      callback(e.eventName, e);
    }
  }
})
```