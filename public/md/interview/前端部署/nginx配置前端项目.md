## nginx配置前端项目
### 服务器安装nginx，安装后的默认目录假设如下
```
存放前端项目目录  /usr/share/nginx/html 
存放配置文件  /etc/nginx/conf.d/default.conf
```
### 上传打包后的前端静态资源
> 将打包后的前端静态资源文件夹build使用ftp文件传输工具上传到 /home/admin 目录下（admin为项目名称）。

### 配置nginx文件
> 修改 /etc/nginx/conf.d/default.conf 配置文件。

```
server {
  # 监听端口
  listen       80;

  # 配置服务ip
  server_name  ip;

  # nginx默认request header中包含的下划线_的请求头会自动忽略。
  underscores_in_headers on;

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

  # 配置前端静态资源http缓存
  location / {
    # 指定根目录
    root   /home/admin/build;
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

  # 接口请求代理
  location /api {
    proxy_pass http://ip;
  }
}
```
### 启动nginx服务
```
service nginx start
```
### 使用node脚本将打包后的文件夹build上传到服务器
- 安装ssh2-sftp-client依赖
```
npm install ssh2-sftp-client -D
```
- deploy脚本
```
// deploy.js
const Sftp = require('ssh2-sftp-client');

const sftp = new Sftp();
const romotePath = '/home/admin/build/';
const config = {
  name: 'admin',
  ssh: {
    host: '服务ip',
    port: 22,
    username: 'root',
    password: 'password',
  },
  romotePath,
  localPath: './build',
};

function deploy() {
  console.log(`您选择了上传${config.name}`);
  sftp.connect(config.ssh).then(() => {
    console.log('连接成功，上传中..');
    return sftp.rmdir(config.romotePath, true);
  }).then(() => {
    return sftp.uploadDir(config.localPath, config.romotePath);
  }).then(() => {
    console.log('上传成功');
  }).catch(err => {
    console.log(err, '上传失败');
  }).finally(() => {
    sftp.end(); // 断开连接
    console.log('上传连接断开');
  })
}

deploy();
```
- 添加npm脚本
```
// package.json
"scripts": {
  "deploy": "npm run build && node deploy.js"
}
```
- 使用部署脚本
```
npm run deploy
```


