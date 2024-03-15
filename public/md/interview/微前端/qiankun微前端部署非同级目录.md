## qiankun微前端部署非同级目录
> 主应用和微应用部署到同一个服务器（同一个 IP 和端口）。微应用都放在一个特殊名称的文件夹下，下面案例的文件夹名为child。

```
1. 主应用访问路径 http://ip
2. react子应用访问路径 http://ip/child/micro-react
3. vue子应用访问路径 http://ip/child/micro-vue

/home/micro  // 资源目录
    ├── main
        ├── build  // 主应用静态资源
    ├── child  // 微应用存放的文件夹
        ├── micro-react      
            ├── build       // react微应用静态资源
        ├── micro-vue      
            ├── build       // vue微应用静态资源
```
### 子应用配置webpack构建时的publicPath。
```
publicPath: process.env.NODE_ENV === 'development' ? '/' : '/child/micro-vue/build/',
```
### 子应用设置history路由base，用于微应用独立访问时使用。
> 独立访问时的base设置成/child/micro-vue/而不是/child/micro-vue/build/，是因为nginx的location配置成/child/micro-vue/，具体可见下方nginx配置。

```
base: window.__POWERED_BY_QIANKUN__ ? '/micro-vue/' : '/child/micro-vue/',
```
### 主应用中注册微应用的entry设置成微应用的部署路径，可以使用相对路径。
> entry路径最后面的 / 不可省略，否则 publicPath 会设置错误。注册微应用的activeRule不能和微应用的部署路径一样，否则在主应用页面刷新会直接变成微应用页面。

```
// 注册子应用
registerMicroApps([
  {
    name: 'micro-react',
    entry: process.env.NODE_ENV === 'development' ? '//localhost:8001' : '/child/micro-react/',
    container: '#microContainer',
    activeRule: '/micro-react',
  },
  {
    name: 'micro-vue',
    entry: process.env.NODE_ENV === 'development' ? '//localhost:8002' : '/child/micro-vue/',
    container: '#microContainer',
    activeRule: '/micro-vue',
  },
]);
```
### nginx配置
```
server {
  # 监听端口
  listen       80;

  # 服务ip
  server_name  ip;

  # 开启gzip压缩功能
  gzip on;

  # 指定会被压缩的文件类型
  gzip_types text/plain application/javascript application/x-javascript text/css application/xml text/javascript application/json;

  # 设置压缩级别，越高资源消耗越大，但压缩效果越好
  gzip_comp_level 5;

  # 在头部中添加Vary: Accept-Encoding（建议开启）
  gzip_vary on;
  
  # 处理压缩请求的缓冲区数量和大小
  gzip_buffers 16 8k;

  # 对于不支持压缩功能的客户端请求不开启压缩机制
  gzip_disable "MSIE [1-6]\."; # 低版本的IE浏览器不支持压缩

  # 设置压缩响应所支持的HTTP最低版本
  gzip_http_version 1.1;

  # 设置触发压缩的最小阈值
  gzip_min_length 2k;

  # 关闭对后端服务器的响应结果进行压缩
  gzip_proxied off;

  # 配置前端静态资源
  # 主应用
  location / {
    root   /home/micro/main/build;
    index  index.html index.htm;
    try_files $uri $uri/ /index.html;

    # index.html使用协商缓存
    add_header Cache-Control 'no-cache';

    if ($request_uri ~* .*[.](js|css|map|jpg|png|svg|ico)$) {
      # 非html资源强缓存1个月
      add_header Cache-Control "max-age=2592000";
    }

    if ($request_filename ~* ^.*[.](html|htm)$) {
      # html使用协商缓存
      add_header Cache-Control "no-cache";
    }
  }

  # react子应用
  location /child/micro-react {
    root   /home/micro;
    index  build/index.html build/index.htm;
    try_files $uri $uri/ /child/micro-react/build/index.html;

    # index.html使用协商缓存
    add_header Cache-Control 'no-cache';

    if ($request_uri ~* .*[.](js|css|map|jpg|png|svg|ico)$) {
      # 非html资源强缓存1个月
      add_header Cache-Control "max-age=2592000";
    }

    if ($request_filename ~* ^.*[.](html|htm)$) {
      # html使用协商缓存
      add_header Cache-Control "no-cache";
    }
  }

  # vue子应用
  location /child/micro-vue {
    root   /home/micro;
    index  build/index.html build/index.htm;
    try_files $uri $uri/ /child/micro-vue/build/index.html;

    # index.html使用协商缓存
    add_header Cache-Control 'no-cache';

    if ($request_uri ~* .*[.](js|css|map|jpg|png|svg|ico)$) {
      # 非html资源强缓存1个月
      add_header Cache-Control "max-age=2592000";
    }

    if ($request_filename ~* ^.*[.](html|htm)$) {
      # html使用协商缓存
      add_header Cache-Control "no-cache";
    }
  }
}
```

