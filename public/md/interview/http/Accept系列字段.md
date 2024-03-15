## Accept 系列字段
### 数据格式
> 类型体现在Content-Type这个字段，这是针对于发送端而言，接收端想要收到特定类型的数据，也可以用Accept字段。

- text： text/html, text/plain, text/css 等
- image: image/gif, image/jpeg, image/png 等
- audio/video: audio/mpeg, video/mp4 等
- application: application/json, application/javascript, application/pdf, application/octet-stream
### 压缩方式
> 体现在了发送方的Content-Encoding字段上，接收什么样的压缩方式体现在了接受方的Accept-Encoding字段上。

- gzip: 当今最流行的压缩格式
- deflate: 另外一种著名的压缩格式
- br: 一种专门为 HTTP 发明的压缩算法
### 支持语言
> 发送方Content-Language字段，接受方对应的字段为Accept-Language。

```
// 发送端
Content-Language: zh-CN, zh, en
// 接收端
Accept-Language: zh-CN, zh, en
```
### 字符集
> 接收端对应为Accept-Charset，指定可以接受的字符集，而在发送端并没有对应的Content-Charset, 而是直接放在了Content-Type中，以charset属性指定。

```
// 发送端
Content-Type: text/html; charset=utf-8
// 接收端
Accept-Charset: charset=utf-8
```