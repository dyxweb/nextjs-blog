## jsx转换的变化
### React16版本及之前
- 使用jsx语法必须显式的将React引入。
- 在React16版本及之前，应用程序通过@babel/preset-react将jsx语法转换为React.createElement的js代码，因此需要显式将React引入才能正常调用createElement方法。
- babel编译前
```
export default class App extends Component {
  render() {
    return <div>dyx</div>
  }
}

ReactDom.render(<App />, document.getElementById('root'));
```
- babel编译后
```
export default class App extends Component {
  render() {
    return /*#__PURE__*/React.createElement("div", null, "dyx");
  }
}

ReactDom.render( /*#__PURE__*/React.createElement(App, null), document.getElementById('root'));
```
### React17版本及之后
- 只使用jsx语法不使用其它React提供的api，可以不引入React应用程序依然能够正常运行。
- 在React17版本及之后，官方与babel进行了合作，直接通过react/jsx-runtime对jsx语法进行了新的转换而不依赖React.createElement，转换的结果便是可直接供ReactDOM.render使用的ReactElement对象。
- 新的jsx转换不会将jsx转换为React.createElement，而是自动从React的package中引入新的入口函数并调用。
- babel编译前
```
export default class App extends Component {
  render() {
    return <div>dyx</div>
  }
}

ReactDom.render(<App />, document.getElementById('root'));
```
- babel编译后
```
import { jsx as _jsx } from "react/jsx-runtime";
export default class App extends Component {
  render() {
    return /*#__PURE__*/_jsx("div", {
      children: "dyx"
    });
  }
}

ReactDom.render( /*#__PURE__*/_jsx(App, {}), document.getElementById('root'));
```
### 升级至新的jsx转化
- 更新至支持新的jsx转换的React版本(v17以上)
- 修改babel配置
```
// 如果使用的是@babel/preset-react
{
  "presets": [
    [
      "@babel/preset-react",
      {
        "runtime": "automatic"
      }
    ]
  ]
}

// 如果使用的是@babel/plugin-transform-react-jsx
{
  "plugins": [
    [
      "@babel/plugin-transform-react-jsx",
      {
        "runtime": "automatic"
      }
    ]
  ]
}
```
- 修改tsconfig.json配置
```
{
  "compilerOptions": {
    // "jsx": "react",
    "jsx": "react-jsx",
  },
}
```
