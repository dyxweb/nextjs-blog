## [useReducer](https://juejin.cn/post/7274789845754445859)
### 基础用法
- useReducer接收三个参数：
  1. reducer函数：指定如何更新状态的函数，它必须是纯函数，以state和dispatch为参数，并返回下一个状态。
  2. 初始状态：初始状态的计算值。
  3. 初始化参数(可选)：用于返回初始状态。如果未指定初始状态将设置为initialArg，如果有指定初始状态将被设置为调用init(initialArg)的结果。
- useReducer返回两个参数：
  1. 当前的状态：当前状态。在第一次渲染时它会被设置为init(initialArg)或initialArg(没有init的情况)。
  2. dispatch：调度函数，用于调用reducer函数，以更新状态并触发重新渲染。
```
const [state, dispatch] = useReducer(reducer, initialArg, init?)
```
- 计数器组件
```
const initialState = { count: 0 };

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    default:
      throw new Error();
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <>
      Count: {state.count}
      <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
    </>
  );
}
```
### 使用dispatch注意事项
- dispatch调用后，状态更新是异步的，因此立刻读取状态仍是旧的。
- React对dispatch有一个优化机制：如果dispatch触发更新前后的值相等(使用Object.is判断)，出于性能考虑React不会进行重新渲染。
### 使用reducer注意事项
- 在reducer里面更新对象和数组的状态，需要创建一个新的对象或数组，而不是在原对象和数组上修改，这一点和useState是一样的。
### 初始化状态使用init函数和将第二个参数(initialArg)直接通过执行函数获取初始状态的区别
> 两者都可以用于初始化状态，如果初始化逻辑简单并且没有性能顾虑，可以直接使用一个函数作为useReducer的第二个参数，但如果需要基于传入的参数来决定初始化逻辑或者想确保性能最优的做法，那么应该使用init函数。

- 执行时机
  1. 直接调用函数作为第二个参数，这个函数会在每次组件渲染时执行。
  2. 使用init函数，init函数只在组件初次渲染时执行一次。
- 访问到的数据
  1. 直接调用函数作为第二个参数，这个函数只能访问到定义它时的作用域内的数据。
  2. 使用init函数，由于init函数接受initialArg作为参数，这使得init函数具有更大的灵活性，能够基于传入的参数进行计算。
- 代码组织
  1. 直接调用函数作为第二个参数，代码更简洁适合简单的初始化逻辑。
  2. 使用init函数，提供了更清晰的代码组织结构，特别是当初始化逻辑相对复杂或需要根据传入的参数变化时。
- 性能
  1. 直接调用函数作为第二个参数，如果这个函数执行了一些计算密集或副作用的操作，那么在每次组件渲染时都会执行，可能会导致性能问题。
  2. 使用init函数，由于它只在组件的初始化阶段执行一次，所以对于那些计算密集的初始化操作，使用init函数可能会更为高效。
### 中间件
> 类似Redux中的中间件，可以利用dispatch创建一个中间件方法，支持调用dispatch之前或之后添加逻辑。

- 通过将原始的dispatch包裹在另一个函数内部，中间件提供了在真正的状态更新前后注入自定义逻辑的机会。
- 在原始的dispatch调用之前检查action的类型，可以添加任何自定义的逻辑。在原始的dispatch调用之后，可以添加任何自定义的逻辑。
```
function thunkMiddleware(dispatch) {
  return function(action) {
    if (typeof action === 'function') {
      action(dispatch);
    } else {
      dispatch(action);
    }
    // 代码在dispatch之后执行
    console.log("Action dispatched at: ", new Date().toISOString());
  };
}

function fetchData() {
  return dispatch => {
    fetch("/api/data")
      .then(res => res.json())
      .then(data => dispatch({ type: 'SET_DATA', payload: data }));
  };
}

function App() {
  const [state, unenhancedDispatch] = useReducer(reducer, initialState);
  const dispatch = thunkMiddleware(unenhancedDispatch);
  
  useEffect(() => {
    dispatch(fetchData());
  }, [dispatch]);
}
```
### useReducer + useContext创建简单的全局状态管理
- 首先定义状态、reducer和context
```
const ThemeContext = React.createContext();

const initialState = { theme: 'light' };

function themeReducer(state, action) {
  switch (action.type) {
    case 'TOGGLE_THEME':
      return { theme: state.theme === 'light' ? 'dark' : 'light' };
    default:
      return state;
  }
}
```
- 创建一个Provider组件
```
function ThemeProvider({ children }) {
  const [state, dispatch] = useReducer(themeReducer, initialState);

  return (
    <ThemeContext.Provider
      value={{
        theme: state.theme,
        toggleTheme: () => dispatch({ type: 'TOGGLE_THEME' })
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
```
- 在子组件中，切换主题和读取主题
```
function ThemedButton() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <button
      style={{ backgroundColor: theme === 'light' ? '#fff' : '#000' }}
      onClick={toggleTheme}
    >
      Toggle Theme
    </button>
  );
}
```
### useReducer与 Redux 的差异
> 虽然useReducer和Redux都采用了action和reducer的模式来处理状态，但它们在实现和使用上有几个主要的区别。

- 范围：useReducer通常在组件或小型应用中使用，而Redux被设计为大型应用的全局状态管理工具。
- 中间件和扩展：Redux支持中间件，这允许开发者插入自定义逻辑。而useReducer本身不直接支持，但可以模拟中间件的效果。
- 复杂性：对于简单的状态管理useReducer通常更简单和直接。但当涉及到复杂的状态逻辑和中间件时，Redux更具优势。

