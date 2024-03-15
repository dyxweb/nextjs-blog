#### qiankun微前端各应用分别部署
> 主应用和微应用分别部署（不同ip或不同端口）。

```
1. 主应用访问路径 http://ip
2. react子应用访问路径 http://ip:8001
3. vue子应用访问路径 http://ip:8002

/home/micro  // 资源目录
    ├── main
        ├── build  // 主应用静态资源
    ├── microReact     
        ├── build       // react微应用静态资源
    ├── microVue      
        ├── build       // vue微应用静态资源
```
### 子应用配置webpack构建时的publicPath。
```
publicPath: process.env.NODE_ENV === 'development' ? '/' : '/microVue/',
```
### 主应用中注册微应用的entry设置成微应用的部署路径，可以使用相对路径。
> entry路径最后面的 / 不可省略，否则 publicPath 会设置错误。注册微应用的activeRule不能和微应用的部署路径一样，否则在主应用页面刷新会直接变成微应用页面。

```
// 注册子应用
registerMicroApps([
  {
    name: 'micro-react',
    entry: process.env.NODE_ENV === 'development' ? '//localhost:8001' : '/microReact/',
    container: '#microContainer',
    activeRule: '/micro-react',
  },
  {
    name: 'micro-vue',
    entry: process.env.NODE_ENV === 'development' ? '//localhost:8002' : '/microVue/',
    container: '#microContainer',
    activeRule: '/micro-vue',
  },
]);
```
### nginx配置
```
# 主应用
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

  # react子应用的转发
  location /microReact {
    proxy_pass http://ip:8001/;
    proxy_set_header Host $host:$server_port;
  }

  # vue子应用的转发
  location /microVue {
    proxy_pass http://ip:8002/;
    proxy_set_header Host $host:$server_port;
  }
}

# react子应用
server {
  # 监听端口
  listen       8001;

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
  location / {
    root   /home/micro/microReact/build;
    index  index.html index.htm;
    try_files $uri $uri/ /index.html;

    # # index.html使用协商缓存
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

  # 兼容子应用独立访问
  location /microReact {
    proxy_pass http://ip:8001/;
  }
}

# vue子应用
server {
  # 监听端口
  listen       8002;

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
  location / {
    root   /home/micro/microVue/build;
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

  # 兼容子应用独立访问
  location /microVue {
    proxy_pass http://ip:8002/;
  }
}
```