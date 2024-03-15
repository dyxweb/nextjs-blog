## useEffect和useLayoutEffect
### useEffect
- useEffect用来取代componentDidMount和componentDidUpdate。
- 主要用于浏览器绘制之后进行一些副作用操作(比如访问DOM，请求数据)。
### useLayoutEffect
- useLayoutEffect中的代码以及其中任何计划的状态更新都会在浏览器重新绘制之前得到处理。
- useLayoutEffect可能会影响性能，尽可能使用useEffect。
### 区别
- useEffect在浏览器重新绘制之后触发，useLayoutEffect在浏览器重新绘制之前触发。
- useEffect异步执行不会阻塞浏览器绘制，useLayoutEffect同步执行会阻塞浏览器绘制。
### 示例
- 为了使效果更明显在渲染期间人为地添加了延迟。
- 使用useEffect时会在浏览器绘制之后再处理useEffect内部的状态更新，点击数字之后会先显示0再显示随机数，页面会有抖动效果。
- 使用useLayoutEffect时会在浏览器绘制之前就处理useLayoutEffect内部的状态更新(所以useLayoutEffect会阻塞浏览器绘制)，点击数字之后会直接显示最后的随机数，页面没有抖动效果。
```
import React, { useLayoutEffect, useEffect, useState } from 'react';

const App = () => {
  const [count, setCount] = useState(0);
  
  // 人为地减慢了渲染
  const now = performance.now();
  while (performance.now() - now < 100) {
    // 不做任何事情...
  }

  useEffect(() => {
    if (count === 0) {
      setCount(10 + Math.random() * 200);
    }
  }, [count]);

  return (
    <div onClick={() => setCount(0)}>{count}</div>
  );
}

export default App;
```