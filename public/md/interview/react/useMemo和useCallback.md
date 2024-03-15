## useMemo和useCallback
- 缓存内容不同。useMemo是对计算结果的缓存，useCallback是对函数的缓存。
- 优化方向不同。useMemo优化方向是减少重复计算，如果需要经常使用某个计算量很大的函数，可以使用useMemo进行函数计算值的缓存。useCallback优化方向是函数的缓存从而减少重复渲染，如果需要将该函数作为props传递给子组件，那么可以使用useCallback对函数进行缓存。

### useMemo
> 只有依赖项改变才会调用某一个方法时可以使用useMemo，避免在每次渲染时都进行高开销的计算。返回的是函数运行的结果。

- 父组件
```
import React, { useState } from 'react';
import DemoOne from './demoOne';

const UseMemoDemo = () => {
  const [count, setCount] = useState(0);
  const [count1, setCount1] = useState(1);
  return (
    <div>
      <button onClick={() => setCount(count + 1)}>count</button>
      <button onClick={() => setCount1(count1 + 1)}>count1</button>
      <DemoOne count={count} count1={count1} />
    </div>
  );
}

export default UseMemoDemo;
```
- 子组件
```
import React, { useState, useMemo } from 'react';

const DemoOne = (props) => {
  const [num, setNum] = useState(100);
  const { count, count1 } = props;

  const operationProps = (data) => {
    console.log('propsChange');
    return {
      newCount: data.count + 10,
      newCount1: data.count1 + 10,
    }
  }

  // 如果不使用useMemo在组件内部状态改变时也会重新调用operationProps方法，使用之后只有在props改变时才会重新调用operationProps方法
  const { newCount, newCount1 } = useMemo(() => operationProps(props), [props]);

  return (
    <div>
      <div>
        props count: {count}  count1: {count1}
      </div>
      <div>
        new count: {newCount}  count1: {newCount1}
      </div>
      <div>
        num {num}
        <button onClick={() => setNum(num + 1)}>changeNum</button>
      </div>
    </div>
  );
}

export default DemoOne;
```
### useCallback
> 父组件重新渲染时声明的函数也会重新定义，如果此函数作为props传递给子组件，那么子组件会重新render。使用useCallback对函数进行缓存，子组件使用React.memo包裹，可以避免子组件不必要的重新渲染。

- 父组件
```
import React, { useState, useCallback } from 'react';
import DemoOne from './demoOne';

const UseCallbackDemo = () => {
  const [count, setCount] = useState(0);
  const [count1, setCount1] = useState(1);

  const reset = () => {
    setCount(0);
    setCount1(0);
  }

  const useCallbackReset = useCallback(reset, []);

  return (
    <div>
      <div>
        count: {count}  count1: {count1}
      </div>
      <button onClick={() => setCount(count + 1)}>count</button>
      <button onClick={() => setCount1(count1 + 1)}>count1</button>
      {/* 如果传递reset函数，每一次点击按钮DemoOne都会重新渲染，传递使用useCallback缓存的useCallbackReset函数，点击按钮DemoOne不会重新渲染 */}
      <DemoOne reset={useCallbackReset} />
    </div>
  );
}

export default UseCallbackDemo;
```
- 子组件
```
import React from 'react';

const DemoOne = (props) => {
  console.log('render');

  return (
    <div>
      <button onClick={() => props.reset()}>reset</button>
    </div>
  );
}

export default React.memo(DemoOne);
```


