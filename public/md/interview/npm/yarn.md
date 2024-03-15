## yarn
- 全局安装yarn  npm install -g yarn
- 查看yarn安装版本  yarn -v
### yarn全局安装依赖
- 全局安装依赖  yarn global add package
- 查看yarn全局安装过的依赖  yarn global list --depth=0
### yarn全局安装的依赖找不到
- 通过yarn global bin获取yarn bin路径。
- 检查path中是否加入了yarn bin路径，如未添加将其加入到环境变量。