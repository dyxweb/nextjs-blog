## react18变化
### setState自动批处理
- 自动批处理是指React将多次setState会被合并为1次执行。
- 在React 18之前，React只会在合成事件和生命周期钩子函数中使用批处理，而在Promise、setTimeout、setInterval、原生事件是不会自动批处理的。
- 在React 18中所有的状态更新都会自动使用批处理。如果在某种场景下不想使用批处理，可以通过flushSync来强制立即执行(比如需要在状态更新后，立刻读取新DOM上的数据等)。
```
import React, { useState } from "react";
import { flushSync } from "react-dom";

const App = () => {
  const [count, setCount] = useState(0);
  const [count2, setCount2] = useState(0);

  return (
    <div className="App">
      <button
        onClick=(() => {
          // 第一次更新
          flushSync(()=>{
            setCount(count => count + 1);
          })
          // 第二次更新
          flushSync(() => {
            setCount2(count2 => count2 + 1);
          })
        })
      >
        点击
      </button>
      <span>count:{count}</span>
      <span>count2:{count2}</span>	
    </div>	
  )
}
export default App;
```
### React 18提供了更合理的初始化API，使用该API会自动启用concurrent(并发)模式。
- React 18之前
```
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

const root = document.getElementById("root");
ReactDOM.render(root, <App />);

// 卸载组件
ReactDOM.unmountComponentAtNode(root);
```
- React 18
```
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);

// 卸载组件
root.unmount(); 
```
### Concurrent Mode(并发模式)
- 并发模式不是一个功能，而是一个底层设计。它可以帮助应用保持响应，根据用户的设备性能和网速进行调整，它通过渲染可中断来修复阻塞渲染机制。
- 在concurrent模式中，React可以同时更新多个状态，区别就是使同步不可中断更新变成了异步可中断更新。
- useDeferredValue和startTransition用来标记一次非紧急更新。
### 去掉了对IE浏览器的支持
- react18引入的新特性全部基于现代浏览器，如需支持需要退回到react17版本。
### react组件返回值更新
- 在react17中，返回空组件只能返回null，显式返回undefined会报错。
- 在react18中，支持null和undefined返回。因为在Suspense中允许fallback为undefined，所以为了保持一致性所以允许返回undefined。
### strict mode更新
- 当使用严格模式时，React会对每个组件返回两次渲染，以便观察一些意想不到的结果。
- 在react17中去掉了一次渲染的控制台日志，以便让日志容易阅读。react18取消了这个限制，第二次渲染会以浅灰色出现在控制台日志。
### Suspense不再需要fallback捕获
### 支持useId
- 在服务器和客户端生成相同的唯一id，避免hydrating的不兼容。
### useSyncExternalStore
- 用于解决外部数据撕裂问题。
### useInsertionEffect
- 这个hooks只建议在css in js库中使用，这个hooks执行时机在DOM生成之后，useLayoutEffect执行之前，它的工作原理大致与useLayoutEffect相同，此时无法访问DOM节点的引用，一般用于提前注入脚本。


