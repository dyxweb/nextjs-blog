## proxy
> webpack proxy，即webpack提供的代理服务，基本行为就是接收客户端发送的请求后转发给其他服务器，目的是为了便于开发者在开发模式下解决跨域问题，想要实现代理首先需要一个中间服务器，webpack中提供服务器的工具为webpack-dev-server。

### proxy配置
> 属性的名称是需要被代理的请求路径前缀，一般为了辨别都会设置前缀为/api，值为对应的代理匹配规则，对应如下。

- target：表示的是代理到的目标地址。
- pathRewrite：默认情况下，我们的 /api-hy 也会被写入到URL中，如果希望删除，可以使用pathRewrite
- secure：默认情况下不接收转发到https的服务器上，如果希望支持，可以设置为false
- changeOrigin：它表示是否更新代理后请求的 headers 中host地址
```
// webpack.config.js
const path = require('path');

module.exports = {
  // ...
  devServer: {
    port: 8000,
    proxy: {
      '/api': {
        target: 'https://api.com'
      }
    }
    // ...
  }
}
```
### 工作原理
> proxy工作原理实质上是利用 http-proxy-middleware 这个http代理中间件，实现请求转发给其他服务器。在开发阶段，本地地址为http://localhost:3000，该浏览器发送一个前缀带有/api标识的请求到服务端获取数据，但响应这个请求的服务器只是将请求转发到另一台服务器中。

```
const express = require('express');
const proxy = require('http-proxy-middleware');

const app = express();

app.use('/api', proxy({ target: 'http://www.example.org', changeOrigin: true }));
app.listen(3000);

// http://localhost:3000/api/foo/bar -> http://www.example.org/api/foo/bar
```
### 解决开发时的跨域问题
> 在开发阶段， webpack-dev-server 会启动一个本地开发服务器，所以我们的应用在开发阶段是独立运行在 localhost的一个端口上，而后端服务又是运行在另外一个地址上，所以在开发阶段中，由于浏览器同源策略的原因，当本地访问后端就会出现跨域请求的问题，通过设置webpack proxy实现代理请求后，相当于浏览器与服务端中添加一个代理者，当本地发送请求的时候，代理服务器响应该请求，并将请求转发到目标服务器 (服务器与服务器之间请求数据并不会存在跨域行为，跨域行为是浏览器安全策略限制)，目标服务器响应数据后再将数据返回给代理服务器，最终再由代理服务器将数据响应给本地，在代理服务器传递数据给本地浏览器的过程中，两者同源，并不存在跨域行为，这时候浏览器就能正常接收数据。
