## 运行npm run xxx的时候发生了什么
### 简短方便的执行命令
> npm run xxx的时候首先会去项目的package.json文件的scripts里找对应的命令，然后执行对应的命令，例如启动vue项目npm run serve的时候，实际上就是执行了vue-cli-service serve这条命令。

### 直接执行package.json中对应的命令时系统并不存在此命令
> 直接执行vue-cli-service serve会报错，因为操作系统中没有存在vue-cli-service这一条指令。

### npm run xxx的时候为什么不报指令不存在的错误
- 安装依赖的时候是通过 npm i xxx 来执行的，例如 npm i @vue/cli-service，npm在安装这个依赖的时候，就会node_modules/.bin/ 目录中创建好 vue-cli-service 为名的几个可执行文件了。.bin目录不是任何一个npm包。目录下的文件表示这是一个个软链接，打开文件可以看到文件顶部写着 #!/bin/sh ，表示这是一个脚本。
- 当使用 npm run serve 执行 vue-cli-service  serve 时，虽然没有安装 vue-cli-service的全局命令，但是 npm 会到 ./node_modules/.bin 中找到 vue-cli-service 文件作为脚本来执行，则相当于执行了 ./node_modules/.bin/vue-cli-service serve（最后的 serve 作为参数传入）。
- 所以在 npm install 时，npm读到该配置后，就将该文件软链接到 ./node_modules/.bin 目录下，而 npm 还会自动把node_modules/.bin加入$PATH，这样就可以直接作为命令运行依赖程序和开发依赖程序，不用全局安装了。
- 假如我们在安装包时，使用 npm install -g xxx 来安装，那么会将其中的 bin 文件加入到全局，比如 create-react-app 和 vue-cli ，在全局安装后，就可以直接使用如 vue-cli projectName 这样的命令来创建项目了。
### 为什么node_modules/bin中有三个vue-cli-service文件
> 如果我们在 cmd 里运行的时候，windows一般是调用了 vue-cli-service.cmd 这个文件。所以当我们运行vue-cli-service serve这条命令的时候，就相当于运行 node_modules/.bin/vue-cli-service.cmd serve。然后这个脚本会使用 node 去运行 vue-cli-service.js这个 js 文件。

```
# unix 系默认的可执行文件，必须输入完整文件名
vue-cli-service

# windows cmd 中默认的可执行文件，当我们不添加后缀名时，自动根据 pathext 查找文件
vue-cli-service.cmd

# Windows PowerShell 中可执行文件，可以跨平台
vue-cli-service.ps1
```
### 整体流程
- 运行 npm run xxx的时候，npm 会先在当前目录的 node_modules/.bin 查找要执行的程序，如果找到则运行。
- 没有找到则从全局的 node_modules/.bin 中查找，npm i -g xxx就是安装到到全局目录。
- 如果全局目录还是没找到，那么就从 path 环境变量中查找有没有其他同名的可执行程序。
