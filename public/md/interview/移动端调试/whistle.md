## [whistle](http://wproxy.org/whistle/)
> 跨平台抓包调试代理工具。

### 安装启动
- 全局安装：npm install whistle -g
- 启动：w2 start
- 关闭：w2 stop
### 移动端配置代理抓包
1. 电脑安装证书，手机也要安装证书。
2. 手机WIFI的代理设置改为手动，设置主机名和端口(whistle的online选项查看即可)。此时就可以正常抓包。
### 设置域名映射，应用本地代码进行实时调试。
1. rules中新建类目。
2. 添加对应映射规则，比如将百度的网址映射为本地，添加https://baidu.com/  http://localhost:3000/即可。