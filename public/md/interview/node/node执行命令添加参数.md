## node执行命令添加参数
- node index.js dyx douyaxing
```
console.log(process.argv) // 输出数组。第三个值是dyx 第四个值是douyaxing
```
- package.json的命令使用
```
"scripts": {
  "create": "node index.js"
},

// npm run create dyx douyaxing  输出数组。第三个值是dyx 第四个值是douyaxing
// 直接在script命令后添加参数即可，每个参数使用空格分开
```