## iconfont使用
> 在React Native中使用Text标签直接饮用iconfont比较直接简单。

- iconfont下载对应icon的项目。
- 将下载下来的ttf后缀文件放到根工程目录下的assets/fonts/文件夹（没有此文件夹则新建）。
- 将下载下来的ttf后缀文件放到android/app/src/main/assets/fonts文件夹（没有此文件夹则新建）。
- 使用Text标签渲染图标。
> fontFamily: iconfont 必须设置。文字内容将iconfont图标的后四位exxx与\u拼接即可使用。

```
<Text style={{ fontFamily: "iconfont" }}>{'\ue82b'}</Text>
```