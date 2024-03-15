## docker部署项目
- 可以备份镜像，实现快速回滚。
### 基本流程
1. 在项目里维护Dockerfile及相关配置文件。
2. 执行docker build构建镜像。
3. push到镜像仓库。
4. 部署的时候pull下来镜像用docker run跑起来。
### 项目根目录添加nginx配置文件
```
// default.conf
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
### 项目根目录添加docker配置文件
> 定义构建镜像的时候基于 Dockerfile 来构建

```
// Dockerfile
# 该镜像是基于 nginx:latest 镜像而构建的
FROM nginx:latest

# 将项目根目录下build文件夹下的所有文件复制到镜像中 /home/admin/build/ 目录下
COPY build/ /home/admin/build/

# 将项目根目录下default.conf复制到镜像中 etc/nginx/conf.d/default.conf，用本地的 default.conf 配置来替换 Nginx 镜像里的默认配置。
COPY default.conf /etc/nginx/conf.d/default.conf
```
### 上传打包后的前端静态资源以及相关配置文件
> 将打包后的前端静态资源文件夹build、nginx配置文件default.conf、docker配置文件Dockerfile，使用ftp文件传输工具上传到 /home/admin/ 目录下。

### 构建镜像(添加镜像tag方便回滚)
```
// 镜像名admin，镜像tag 0.0.1
docker build -t admin:0.0.1 .
```
### 启动容器
- 将宿主的80端口映射到容器的80端口
- --name admin 容器名为admin
- admin:0.0.1 使用镜像名为admin的 0.0.1 tag版本
```
docker run -dp 80:80 --name admin admin:0.0.1
```
### 使用node脚本发布
- 安装ssh2-sftp-client ssh2依赖
```
npm install ssh2-sftp-client ssh2 -D
```
- deploy脚本
```
// deploy.js
const { Client } = require('ssh2');
const Sftp = require('ssh2-sftp-client');

const conn = new Client();
const sftp = new Sftp();

// 根据命令获取部署的版本
const params = process.argv || [];
const deployVersion = params[2];
const romotePath = '/home/admin/';
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

// docker部署
function dockerDeploy() {
  conn.on('ready', () => {
    console.log('部署准备');
    conn.shell((err, stream) => {
      if (err) {
        console.log('部署失败');
        conn.end();
        console.log('部署连接断开');
      };
      stream.on('close', () => {
        console.log('部署成功');
        conn.end();
        console.log('部署连接断开');
      }).on('data', (data) => {
        console.log('OUTPUT: ' + data);
      });
      stream.end(`cd /home/admin/
        docker build -t admin:${deployVersion} .
        docker rm -f admin
        docker run -dp 80:80 --name admin admin:${deployVersion}
        exit
      `);
    });
  }).connect(config.ssh);
}

function deploy() {
  console.log(`您选择了上传${config.name}`);
  // 更新前端静态资源以及相关配置文件
  sftp.connect(config.ssh).then(() => {
    console.log('连接成功，上传中..');
    return Promise.all([
      sftp.delete(`${config.romotePath}/default.conf`, true),
      sftp.delete(`${config.romotePath}/Dockerfile`, true),
      sftp.rmdir(`${config.romotePath}/build`, true),
    ]);
  }).then(() => {
    return Promise.all([
      sftp.uploadDir('./build', `${config.romotePath}/build`),
      sftp.fastPut('./default.conf', `${config.romotePath}/default.conf`),
      sftp.fastPut('./Dockerfile', `${config.romotePath}/Dockerfile`),
    ]);
  }).then(() => {
    console.log('上传成功');
    dockerDeploy();
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
- 使用部署脚本(添加版本参数)
```
npm run deploy 0.0.1
```