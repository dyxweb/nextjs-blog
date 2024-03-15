## CLI
> CLI全称Command Line Interface，是一类通过命令行交互的终端工具。CLI可以帮助我们更高效的操作计算机系统，我们可以将有规律可循的、重复的、繁琐的、模板化的工作集成到CLI工具中。一个命令即可快速的完成一些列操作。

- GUI：更侧重易用性，用户通过点击图形界面，完成相关操作。
- CLI：更侧重操作效率，通过命令组合自动化操作、批量操作等。
### Node CLI开发
1. npm init初始化项目。
2. 定义js命令文件
> 文件头部必须有#!/usr/bin/env node，告诉系统使用NodeJS执行脚本，如不声明默认按shell去解析执行。

```
#!/usr/bin/env node

console.log('Hello Node CLI');
```
3. 定义终端命令
> package.json文件中声明bin字段；格式为："command": "js file"。

```
// package.json
{
  "bin": {
    "test-cli": "./bin/command.js"
  }
}
```
4. 调试CLI工具
> 通过软链接进行本地调试，在CLI根目录下执行npm link创建软链接，终端运行命令test-cli即可调试。

5. 发布CLI工具
> 登录npm：npm login；发布CLI：npm publish。