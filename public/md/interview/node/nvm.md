## nvm
- [下载地址](https://github.com/coreybutler/nvm-windows/releases)
- nvm下载安装后，windows下需要在CMD或PowerShell中使用命令。
- node版本管理工具，开发环境建议先安装nvm，使用nvm安装各个版本node，避免先安装node再安装nvm的各种问题。
- 手动安装的node使用nvm ls查找不到，建议使用nvm安装各个版本的node。
- 在安装nvm之前要将现有的node以及目录下的npm等文件全部删除，然后按照步骤安装nvm即可，使用nvm -v命令检查是否安装成功。
- 当前node版本全局安装的内容只作用于当前版本。
### 常用命令
- nvm ls 查看已安装的版本
- nvm install 6.10.0 安装指定版本
- nvm uninstall 6.10.0 卸载指定版本
- nvm use 6.10.0 使用指定版本
### 配置镜像
- 进入nvm的安装路径，在setting.txt文件中添加以下代码。
```
node_mirror: https://npm.taobao.org/mirrors/node/
npm_mirror: https://npm.taobao.org/mirrors/npm/
```