## hooks
- React规定我们必须把hooks写在函数的最外层，不能写在if else条件语句中或内部函数中，来确保hooks的调用顺序在每次渲染中都是相同的。
- 只在React函数组件中调用hooks，而不在普通函数中调用hooks。
## useState(useState内部是基于useReducer实现的)
- 第一次渲染会读取设置的初始值，之后渲染时则会忽略设置的初始值。
- useState改变状态依然不是立即改变的，修改后无法实时获取到改变之后最新的值。
- 传入useState参数后返回一个带有默认状态和改变状态函数(如下setInfo)的数组; 
```
const [info, setInfo] = useState({
  name: 'dyx',
  age: 24,
});
```
- setState是非覆盖式更新状态，具备浅合并功能，只会更新传入的值，而useState是覆盖式更新状态。
```
const [info, setInfo] = useState({
  name: 'dyx',
  age: 24,
});
const changeInfo = addAge => {
  setInfo({
    ...info,
    age: info.age + addAge,
  });
}
```
- 使用useState更新值时获取更新前的值
```
const [num, setNum] = useState(2);

setNum((oldNum) => {
  return oldNum + 2;
})
```
- setState只要设置状态就会更新即使设置的值相同，useState设置相同的值不会更新。
- 修改引用类型数据，必须重新返回一个新的引用。直接的修改引用类型的属性值，这样破坏了不可变值的规矩，应该通过Object.assign或者扩展运算符来重新创建一个对象进行设置。React内部会针对传入的参数进行浅比较，引用类型的数据浅比较的是其引用指向的地址而不是内容值，所以只有内容值变化引用不变化不会更新。简单类型的浅比较是比较的内容值。
```
const [info, setInfo] = useState({
  name: 'dyx',
  age: 24,
});

// 页面会更新
const changeInfo = addAge => {
  setInfo((oldInfo) => {
    return {
      ...oldInfo,
      age: oldInfo.age + addAge,
    }
  });
}

const changeInfoCopy = addAge => {
  setInfo((oldInfo) => {
    oldInfo.age += addAge;
    // return oldInfo;  这样不会触发页面更新，引用类型数据的浅比较的是其指向的地址。
    return {...oldInfo}; // 这样会更新
  });
}


// 简单类型数据可以触发更新，简单类型的浅比较是比较的内容值。
const [num, setNum] = useState(2);
const changeNum = addNum => {
  setNum((oldNum) => {
    oldNum += addNum;
    return oldNum;
  });
}
```
## useEffect
- useEffect第二个参数中数组没有传值时代表不监听任何参数变化，只有在组件初始化时才会触发，用来代替componentDidMount
```
useEffect(() => {
  console.log('componentDidMount');
}, [])
```
- 如果第二个参数中的值改变则触发第一个参数中的方法，组件初始化也会触发此方法，引用类型数据也可以监听到
```
const [info, setInfo] = useState({ name: 'dyx', age: 24 });
useEffect(() => {
  console.log(info); // 改变后的值
}, [info]);
``` 
- 第二个参数可以监听多个参数，有其一改变就会触发
```
const [info, setInfo] = useState({ name: 'dyx', age: 24 });
const [num, setNum] = useState(2);
// 只要num和info有一个变化就会触发
useEffect(() => {
  console.log(info);
  console.log(num);
}, [info, num]);
``` 
- 没有第二个参数时类似于componentDidMount和componentDidUpdate, 每一次渲染都会触发
```
useEffect(() => {
  console.log('render');
})
```
- componentDidMount注册事件，componentWillUnmount销毁事件
> removeEventListener传入的事件处理函数必须和addEventListener传入的事件处理函数是相同的，只有传入相同的事件处理函数才能正常解除事件绑定。要特别注意函数组件执行就会形成一个闭包的Capture Value特性。

```
const func = () => {
  console.log('func');
}

useEffect(() => {
  document.addEventListener('click', func);
  return () => {
    document.removeEventListener('click', func);
  };
}, []);

// componentWillUnmount功能
useEffect(() => {
  return () => {
    console.log('componentWillUnmount');
  }
}, [])
```
- 监听props的改变，可以监听整个props或者监听某个或多个props值
```
// 监听props
useEffect(() => {
  console.log(props);
}, [props]);
```
## useLayoutEffect
- useLayoutEffect中的代码以及其中任何计划的状态更新都会在浏览器重新绘制之前得到处理。
- useLayoutEffect可能会影响性能，尽可能使用useEffect。
## useRef
- createRef每次渲染都会返回一个新的引用，而useRef每次都会返回相同的引用。
- 创建useRef时候，会创建一个原始对象，只要函数组件不被销毁，原始对象就会一直存在，可以利用这个特性，来通过useRef保存一些数据。ref在所有的render中保持着唯一引用，因此所有对ref的赋值或取值，拿到的都是一个最终状态，不会在每个render间存在隔离。
```
// ref的值需要手动更新, 当无法在某一场景获取到最新的props时可以定义ref为最新的props值
const queryRef = useRef(props);
useEffect(() => {
  queryRef.current = props;
}, [props])
```
- 将ref对象传入元素，ref对象的.current属性将是当前的DOM节点。
```
/**
 * ref绑定元素的使用
 */
import React, { useRef } from 'react';

const DemoOne = () => {
  const refEle = useRef();

  const clickToFocus = () => {
    refEle && refEle.current && refEle.current.focus();
  }

  return (
    <div>
      <input ref={refEle} type="text" />
      <button onClick={clickToFocus}>click</button>
    </div>
  );
}

export default DemoOne;
```
## useImperativeHandleref
> useImperativeHandle可以配合forwardRef自定义暴露给父组件的实例值。子组件如果是class类组件，我们可以通过ref获取类组件的实例，但是在子组件是函数组件的情况，我们需要使用useImperativeHandle和forwardRef配合达到获取组件实例的效果。

```
/**
 * 父组件调用子组件方法的 父组件
 */
import React from 'react';
import Child from './child';

const Demo = () => {
  let childRef = null
  const getChild = () => {
    console.log(childRef); // 子组件useImperativeHandle返回的值
    childRef && childRef.childFunc(3);
  }
  
  return (
    <div>
      <Child ref={ref => childRef = ref} />
      <button onClick={getChild}>触发子组件方法</button>
    </div>
  );
}

export default Demo;

/**
 * 父组件调用子组件方法的 子组件
 */
import React, { useState, useImperativeHandle, forwardRef } from 'react';

// props子组件中需要接受ref
const Child = (props, ref) => {
  const [val, setVal] = useState(1);

  const changeVal = val => {
    setVal(val);
  }
  
  // useImperativeHandle方法的的第一个参数是目标元素的ref引用
  useImperativeHandle(ref, () => ({
    // childFunc 就是暴露给父组件的方法
    childFunc: (newVal) => {
      changeVal(val + newVal);
    }
  }));

  return (
    <div>{val}</div>
  );
}

export default forwardRef(Child);
```
## useMemo
- 只有依赖项改变才会调用某一个方法时可以使用useMemo，避免在每次渲染时都进行高开销的计算。返回的是函数运行的结果。
```
// 父组件
import React, { useState } from 'react';
import DemoOne from './demoOne';

const UseMemoDemo = (props) => {
  const [count, setCount] = useState(0);
  const [count1, setCount1] = useState(1);
  return (
    <div>
      <DemoOne {...props} count={count} count1={count1} />
      <button onClick={() => setCount(count + 1)}>count</button>
      <button onClick={() => setCount1(count1 + 1)}>count1</button>
    </div>
  );
}

export default UseMemoDemo;


// 子组件
import React, { useState, useMemo } from 'react';

const DemoOne = (props) => {
  const [num, setNum] = useState(100);
  const { count, count1 } = props;

  const operationProps = (props) => {
    console.log('propsChange')
    return {
      newcount: props.count + 10,
      newcount1: props.count1 + 10,
    }
  }

  // 如果不使用useMemo在组件内部状态改变时也会重新调用operationProps方法，使用之后只有在props改变时才会重新调用operationProps方法
  const { newcount, newcount1 } = useMemo(() => operationProps(props), [props]);
  return (
    <div>
      <div>
        props count: {count}  count1: {count1}
      </div>
      <div>
        new count: {newcount}  count1: {newcount1}
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
- 没有依赖项时在第一次渲染时调用方法，可以用于debounce方法的声明
```
import { debounce } from 'lodash';
const onChange = () => {
  console.log('onChange');
}

const debounceOnChange = useMemo(() => {
  return debounce(onChange, 600);
}, [])
```
## useCallback
> 返回的是函数。父组件重新渲染时，声明的函数也会重新定义，如果此函数传递给子组件，那么子组件会重新render，使用useCallback对函数进行包裹，可以避免子组件不必要的重新渲染，子组件使用React.memo包裹。

```
// 父组件
import React, { useState, useCallback } from 'react';
import DemoOne from './demoOne';

const UseMemoDemo = () => {
  const [count, setCount] = useState(0);
  const [count1, setCount1] = useState(1);

  const clickCount= () => {
    setCount(count + 1);
  };

  const clickCount1 = useCallback(() => {
    setCount1(count1 + 1);
  }, [count1]);

  return (
    <div>
      <div>count: {count}, count1: {count1}</div>
      <DemoOne clickCount={clickCount}>普通函数形式</DemoOne>
      <DemoOne clickCount={clickCount1}>useCallback函数形式</DemoOne>
    </div>
  );
}

export default UseMemoDemo;


/**
 * 避免父组件重新渲染，导致传递的方法重新定义导致子组件重新渲染
 */
import React from 'react';

const DemoOne = (props) => {
  console.log(props.children)
  return (
    <div>
      <div>
        {props.children}
      </div>
      <button onClick={props.clickCount}>调用父组件方法</button>
    </div>
  );
}

export default React.memo(DemoOne);
```
## useContext
```
// colorContext.js
import { createContext } from 'react';
const ColorContext = createContext();

export default ColorContext;


// useContextDemo.js
import React from 'react';
import DemoOne from './demoOne';
import ColorContext from './colorContext'

const UseContextDemo = () => {
  return (
    // 此处的value才是子孙组件读取到的值
    <ColorContext.Provider value="red">
      <DemoOne />
    </ColorContext.Provider>
  );
}

export default UseContextDemo;

// demoOne.js
import React from 'react';
import DemoTwo from './demoTwo';

const DemoOne = () => {
  return (
    <DemoTwo />
  );
}

export default DemoOne;

// demoTwo.js
import React, { useContext } from 'react';
import ColorContext from './colorContext'

const DemoTwo = () => {
  const color = useContext(ColorContext);
  return (
    <div style={{ color }}>
      {color}
    </div>
  );
}

export default DemoTwo;
```
## useReducer
> useReducer接受的第一个参数是一个函数，我们可以认为它就是一个reducer，reducer的参数就是常规reducer里面的state和action，返回改变后的state，useReducer第二个参数为state的初始值。返回一个数组，数组的第一项就是更新之后state的值，第二个参数是派发更新的dispatch函数。

- dispatch调用后，状态更新是异步的，因此立刻读取状态仍是旧的。
- React对dispatch有一个优化机制：如果dispatch触发更新前后的值相等(使用Object.is判断)，出于性能考虑React不会进行重新渲染。
- 在reducer里面更新对象和数组的状态，需要创建一个新的对象或数组，而不是在原对象和数组上修改，这一点和useState是一样的。
```
import React, { useReducer } from 'react';

const UseReducerDemo = () => {
  /* count为更新后的state值,  dispatchCount 为当前的派发函数 */
  const [count, dispatchCount] = useReducer((state, action) => {
    const { payload, type } = action
    /* return的值为新的state */
    switch(type) {
      case 'add':
	      return state + 1
      case 'sub':
        return state - 1 
      case 'reset':
        return payload       
    }
    return state
  }, 0)

  return (
    <div>
     <div>{ count }</div>
      <button onClick={() => dispatchCount({ type:'add' })}>add</button>
      <button onClick={() => dispatchCount({ type:'sub' })}>sub</button>
      <button onClick={() => dispatchCount({ type:'reset', payload: 123 })}>reset</button>
    </div>
  )
}

export default UseReducerDemo
```
## Capture Value(函数组件执行，就会形成一个闭包)
- 每次render的内容都会形成一个快照并保留下来，当re-render的时候就形成了n个render状态，而每个render状态都拥有自己固定不变的props和state。
- useState中定义的变量在每一次render的时候都是一个固定的常量，只是不同的render时机，对应的常量的值可能不同。
- 每次render都有自己的事件处理
> 如下示例中如果将console的值由内部的状态改为父组件传过来的props，如果在3秒内父组件的props发生变化，console的值还是原来的值，不是最新的值。但是class形式组件是最新的值，虽然props是不可变的，但是this在class形式组件中是可变的，因此this.props形式的调用每次都访问最新的props。而函数组件不存在this.props的语法，因此props在一次render中时固定不变的。

```
import React, { useState } from 'react';

const CaptureValueDemo = () => {
  const [num, setNum] = useState(0);

  const log = () => {
    setTimeout(() => {
      // 每一次console的值都是执行setNum之前的值
      // 在log函数执行的那个render中，num的值还是执行setNum之前的值
      // 执行setNum()之后会交由一个全新的render中，新的render中不会执行log函数。
      // 而三秒后执行的内容是由setNum前的那个render执行的，所以console的num自然也是setNum前的那个render中的num值
      // num、log都拥有Capture Value特性
      console.log(num);
    }, 3000);
  };

  return (
    <div>
      {num}
      <button
        onClick={() => {
          setNum(num + 1);
          log();
        }}
      >
        click
      </button>
    </div>
  );
};

export default CaptureValueDemo;
```
- useRef没有Capture Value特性。ref在所有的render中保持着唯一引用，因此所有对ref的赋值或取值，拿到的都是一个最终状态，不会在每个render间存在隔离。
- useEffect也一样具有Capture Value的特性
```
// Capture Value特性
const [num, setNum] = useState(0);

useEffect(() => {
  // 由于useEffect的Capture Value的特性，拿到的num值永远是初始化的0。
  // setInterval永远在num为0基础上加一，setInterval在一直循环但是后续的setNum没有什么作用
  const intervalId = setInterval(() => {
    setNum(num + 1);
  }, 1000);
  return () => clearInterval(intervalId);
}, []);

return (
  <div>{num}</div>
);

// 监听状态
const [num, setNum] = useState(0);

useEffect(() => {
  // useEffect监听num的变化可以拿到了最新的num。
  // 但是计时器不准了，因为每次count变化时都会销毁并重新计时。计时器频繁的挂载和销毁 定时器带来了一定性能负担。
  const intervalId = setInterval(() => {
    setNum(num + 1);
  }, 1000);
  return () => clearInterval(intervalId); 
}, [num]);

return (
  <div>{num}</div>
);

// 不依赖外部变量(依赖useState的回调形式进行更新操作)
const [num, setNum] = useState(0);

useEffect(() => {
  const intervalId = setInterval(() => {
    setNum(oldNum => oldNum + 1);
  }, 1000);
  return () => clearInterval(intervalId);
}, []);

return (
  <div>{num}</div>
);
```
## [hooks 闭包问题](https://juejin.cn/post/7051535411042058271)
> 每一个Function的执行都有与之相应的Scope，对于面向对象来说，this引用即是连接了所有Scope的Context(当然前提是在同一个Class下)，在React Hooks中每一次的render由彼时的State决定，render完成Context即刷新。useRef是可以横跨多次render生成的Scope，它能保留下已执行的渲染逻辑，却也能使已渲染的Context 得不到释放，如果说this引用是面向对象中最主要的副作用，那么useRef亦同。


- [延迟调用会存在闭包问题，使用useRef会避免此问题。](https://juejin.cn/post/7046358484610187277)
> useRef仅在Mount时期初始化对象，而Update时期返回Mount时期的结果(memoizedState)。这意味着一次完整的生命周期中，useRef​保留的引用始终不会改变。
