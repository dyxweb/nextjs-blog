## hooks中使用防抖节流
### class形式组件中使用形式
```
import React, { Component } from "react";
import { debounce } from "lodash";

export default class Home extends Component {
  state = {
    value: ''
  }

  debounceSearch = debounce((value) => {
    console.log(value);
  }, 600);

  onChange = (e) => {
    const value = e.target.value;
    this.setState({
      value
    });
    this.debounceSearch(value);
  }

  render() {
    return (
      <input onChange={this.onChange} value={this.state.value} />
    )
  }
}
```
### 沿用class的使用形式在hooks中使用
- debounceSearch方法没有达到防抖的效果。
- debounceSearch函数每次调用前都执行了setValue导致重新渲染，这使得每一次调用的debounceSearch都被重建了，每次调用的debounceSearch都是一个新函数，并且失去了之前的记忆，所以达不到防抖的效果。
```
import React, { useState } from "react";
import { debounce } from "lodash";

const Home = () => {
  const [value, setValue] = useState('');

  const debounceSearch = debounce((value) => {
    console.log(value);
  }, 600);

  const onChange = (e) => {
    const inputValue = e.target.value;
    setValue(inputValue);
    debounceSearch(inputValue);
  }

  return (
    <input onChange={onChange} value={value} />
  )
}

export default Home;
```
### 缓存debounceSearch函数，避免每一次重新渲染时debounceSearch函数重建
- 使用useCallback
```
const debounceSearch = useCallback(
  debounce((value) => {
    console.log(value);
  }, 600),
[])
```
- 使用useRef
```
const debounceSearch = useRef(
  debounce((value) => {
    console.log(value);
  }, 600)
).current
```
- 使用useMemo
```
const debounceSearch = useMemo(() => {
  return debounce((value) => {
    console.log(value);
  }, 600)
}, [])
```
### useDebounce
```
import { useCallback } from 'react';
import { debounce } from 'lodash';

export const useDebounce = (fun, deps = [], time = 600) => useCallback(debounce(fun, time), deps);
```
### useThrottle
```
import { useCallback } from 'react';
import { throttle } from 'lodash';

export const useThrottle = (fun, deps = [], time = 600) => useCallback(throttle(fun, time), deps);
```