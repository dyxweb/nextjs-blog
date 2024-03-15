## 统一Node版本
> 在现代前端开发中，Node.js作为构建工具和服务端运行环境的基石，版本不一致可能导致各种问题，如依赖库兼容性问题、开发环境与生产环境不匹配等。为了确保团队协作项目的稳定性和一致性，需要采取一些措施来保证项目中的Node版本一致。

### package.json的engines字段
- 在项目的package.json文件中，可以使用engines字段来指定所需的Node版本。在该字段中可以定义一个范围或者具体的版本号来限制Node的版本。
```
// 指定特定版本号
"engines": {
  "node": "14.17.0"
}

// 范围符号：表示项目需要Node版本大于等于12.0.0且小于16.0.0。
"engines": {
  "node": ">=12.0.0 < 16.0.0"
}

// 波浪线符号：表示项目需要Node版本为14.17.x
"engines": {
  "node": "~14.17.0"
}

// 插入符号：表示项目需要Node版本为14.x.x
"engines": {
  "node": "^14.17.0"
}
```
- 使用npm install时，engines配置并没有起作用，使用yarn安装时，engines配置会起作用。
- engines默认不开启严格版本校验，只会给出提示，需要手动开启严格模式。在根目录.npmrc文件中添加engine-strict = true后使用npm install才会起作用。
```
engine-strict = true
```
### 使用.nvmrc文件
- 使用nvm等Node版本管理工具很方便在不同项目下切换不同的Node版本。但来回切换很容易导致混淆，因此引发的一些bug还难以排查。
- 创建一个.nvmrc文件，指定项目Node版本，执行nvm use自动就切换到项目指定的Node版本。
```
v14.17.5
```