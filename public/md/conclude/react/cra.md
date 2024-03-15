## cra
### 暴露webpack配置文件
> 没有未提交的代码，运行 npm run eject

### script的homepage属性
> 不配置 homepage 属性时，build 打包之后的html文件资源应用路径默认是 /，如果想要使用相对当前html的相对路径设置  "homepage": "." 即可。

### [修改为多页应用](https://juejin.cn/post/6899644818029445128)
### 修改本地服务的启动端口
```
"scripts": {
  "start": "set PORT=5000 && node scripts/start.js",
},
```