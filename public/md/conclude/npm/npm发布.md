## npm发布
- npm login 登录
- npm publish 发布
> 发布的包的名字不能有重复，如果更新包，每一次发布必须更新版本。package.json的name对应包的名字;version对应包的版本; main对应包的入口文件。入口文件应该是babel转化之后的文件地址。

- npm unpublish npm-exer@1.0.0 删除发布的内容(发布72小时之内)

### 发布前babel转化原文件
```
"scripts": {
  // 将src的文件内容转化生成在lib文件夹下。同步文件结构
  "transpile": "babel src -d lib --copy-files",
  // 发布前会执行的命令
  "prepublishOnly": "npm run transpile"
},
```
### 使用antd的UI组件发布时使用babel生成源文件要将babel的antd按需加载插件放在babelrc中生成的源文件才可以有样式，放在webpack的配置文件中不行
```
// .babelrc
{
  "presets": ["env", "react", "stage-0"],
  "plugins": [
    ["import", { "libraryName": "antd", "libraryDirectory": "es", "style": "css" }]
  ]
}
```
### node早先只支持CommonJS的模块化方案，所以ES6的模块化特性用不了。但是在Node V13.2.0之后开始实验性的支持ESM模块化，不过需要创建package.json文件指明type类型为module。
