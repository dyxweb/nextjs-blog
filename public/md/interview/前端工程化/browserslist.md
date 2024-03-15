## [browserslist](https://browsersl.ist/)
> browserslist帮助我们在浏览器兼容性和包大小之间保持适当的平衡。使用browserslist可以做到覆盖更广泛的浏览器同时包的体积也会保持最小化。

### 配置方式
- 可以在package.json中声明browserslist字段进行配置
```
"browserslist": [
  "> 0.2%",
  "last 10 versions",
]
```
- 通过.browserslistrc文件配置
```
> 0.2%
last 10 versions
```
### 如何配置
> 可以通过[https://browsersl.ist/](https://browsersl.ist/)网站来查看配置的内容具体支持的浏览器情况。

- defaults(默认配置)，> 0.5%, last 2 versions, Firefox ESR, not dead。
- 根据全球或某个国家/地区的使用率进行配置
    - `> 0.2%` (全世界使用率大于0.2%)
    - `> 0.2% in CN` (中国使用率大于0.2%)
- 根据最近的浏览器版本进行配置
    - last 10 versions (所有浏览器最新的10个版本)
    - last 10 Chrome versions (Chrome浏览器最新2个版本)
- dead (官方不再支持或24个月没有更新的浏览器)
- 根据特定浏览器版本进行配置
    - iOS 7 (支持iOS版本7的浏览器)
    - Firefox > 20 (支持Firefox版本大于20的浏览器)
    - ie 6-8 (支持ie版本6-8的浏览器)
- 选择支持特定功能的浏览器版本
    - supports es6-module (支持es6-module的浏览器)
    - supports css-grid (支持css-grid的浏览器)
- not (可以给任何配置使用，表示反义)
- 以上条件可以组合
    - `> 0.2%, last 10 versions` (使用率大于0.2%或者所有浏览器最新10个版本，等价于 > 0.2% or last 10 versions)
    - `> 0.2% and last 10 versions` (使用率大于0.2%浏览器且是最新的10个版本)
    - `> 0.2%, last 10 versions, not dead` (使用率大于0.2%或者所有浏览器最新10个版本且没有dead的浏览器)

### 检查配置是否正确
> 运行`npx browserslist-lint`命令查看配置是否有错误。

### 查看配置支持的浏览器
> 运行`npx browserslist`命令查看配置支持的浏览器。
