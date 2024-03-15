## 统一npm版本
### 锁定npm版本
> 利用only-allow工具包、npm scripts快速实现锁定。

- 安装only-allow依赖
```
npm install only-allow -D
```
- 在package.json文件中配置scripts.preinstall，允许输入的值为only-allow npm、only-allow pnpm、only-allow yarn。
```
// package.json
"scripts": {
  "preinstall": "only-allow npm",
}
```
