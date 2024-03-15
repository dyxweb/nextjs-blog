## qiankun微应用
### 应用的请求代理proxy配置
> 子应用配置的请求代理，在独立运行是没问题的。但是通过主应用去加载的子应用，子应用发出的请求实际已经被主应用劫持了，不会运行到子应用的请求代理。所以主应用也需要配置子应用需要的请求代理。

### react子应用使用react-refresh，主应用不响应热更新的问题
> 当React Refresh的多个实例同时运行时，需要使用library属性为React Refresh设置命名空间，类似于webpack中的output.library选项。

- [react-refresh API](https://github.com/pmmmwh/react-refresh-webpack-plugin/blob/main/docs/API.md)
```
// webpack.dev.js
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const { name } = require('../package.json');

module.exports = {
  mode: 'development',
  devServer: {
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    hot: true,
    open: true,
    port: 3000,
  },
  plugins: [
    new ReactRefreshWebpackPlugin({
      library: `${name}-[name]`
    }),
  ]
}
```
### 使用react-refresh，报错出现浮层影响本地开发
> 将overlay属性值设置为false，关闭浮层报错。

```
// webpack.dev.js
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const { name } = require('../package.json');

module.exports = {
  mode: 'development',
  devServer: {
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    hot: true,
    open: true,
    port: 3000,
  },
  plugins: [
    new ReactRefreshWebpackPlugin({
      library: `${name}-[name]`,
      overlay: false,
    }),
  ]
}
```
### 应用样式隔离
> 默认情况下沙箱可以确保单实例场景子应用之间的样式隔离，但是无法确保主应用跟子应用、或者多实例场景的子应用样式隔离。当配置为{ strictStyleIsolation: true }时表示开启严格的样式隔离模式。这种模式下qiankun会为每个微应用的容器包裹上一个shadow dom节点，从而确保微应用的样式不会对全局造成影响。

- 使用{ strictStyleIsolation: true }有时候导致vue3的组件样式丢失，可以使用{ experimentalStyleIsolation: true }
> 使用{ experimentalStyleIsolation: true }qiankun会改写子应用所添加的样式为所有样式规则增加一个特殊的选择器规则来限定其影响范围。

```
// 假设应用名是 react16
.app-main {
  font-size: 14px;
}

div[data-qiankun-react16] .app-main {
  font-size: 14px;
}
```
### 子应用之间跳转
- 主应用和微应用都是hash模式，主应用根据hash来判断微应用，则不用考虑这个问题。
- 主应用根据path来判断微应用，history模式的微应用之间的跳转，或者微应用跳主应用页面，直接使用微应用的路由实例是不行的，原因是微应用的路由实例跳转都基于子应用路由的base。有两种办法可以跳转：
  1. history.pushState()。
  2. 将主应用的路由实例通过props传给微应用，微应用这个路由实例跳转。