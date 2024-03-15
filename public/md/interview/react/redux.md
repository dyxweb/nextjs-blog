## [redux](https://juejin.cn/post/6844904036013965325)
- Redux遵循“单向数据流”和“不可变状态模型”的设计思想。
- 这使得Redux的状态变化是可预测、可调试的。
### 异步状态更新
- redux执行action是同步的，但是reducer中将新状态返回更新store数据仓库的过程是异步的。
- 组件通过react-redux封装后相当于包了一层高阶组件。而这一个高阶组件在redux里的state更新时会调用setState，所以redux的store的数据仓库更新才会有异步更新的现象。
### 工作流程
- 用户在view层触发某个事件，通过dispatch发送了action和payload。
- action和payload被传入reducer函数，返回一个新的state。
- store拿到reducer返回的state并做更新，同时通知view层进行re-render。
### 三大要素
- 单一数据源，state存储在唯一的store中。
- state是只读的，唯一改变state的方法是dispatch action，action是一个用于描述已发生事件的普通对象。
- 纯函数修改，通过reducer纯函数修改状态，它接收之前的state和action，并返回新的state。一定要返回一个新的对象，而不是修改之前的state。
### reducer为什么要返回一个新的对象
- redux源码中会比较传入的state和reducer修改之后的state，如果相同则返回旧的对象，如果不同则返回新的对象。
- 比较两个javascript对象中所有的属性是否完全相同，唯一的办法就是深比较，深比较在真实的应用中代码是非常大的，非常耗性能的，需要比较的次数特别多，所以一个有效的解决方案就是做一个规定，当无论发生任何变化时开发者都要返回一个新的对象，没有变化时开发者返回旧的对象，这样直接比较对象的存储地址即可以。
```
for (let i = 0; i < finalReducerKeys.length; i++) {
  const key = finalReducerKeys[i]
  const reducer = finalReducers[key]
  const previousStateForKey = state[key]
  const nextStateForKey = reducer(previousStateForKey, action)
  if (typeof nextStateForKey === 'undefined') {
    const errorMessage = getUndefinedStateErrorMessage(key, action)
    throw new Error(errorMessage)
  }
  nextState[key] = nextStateForKey
  hasChanged = hasChanged || nextStateForKey !== previousStateForKey
}
return hasChanged ? nextState : state
```
### redux
#### getState的实现
```
export const createStore = () => {    
  let currentState = {}       // 公共状态    
  function getState() {       // getter        
    return currentState    
  }    
  function dispatch() {}      // setter    
  function subscribe() {}     // 发布订阅    
  return { getState, dispatch, subscribe }
}
```
#### dispatch实现
```
export const createStore = () => {    
  let currentState = {}    
  function getState() {        
    return currentState    
  }    
  function dispatch(action) {        
    switch (action.type) {            
      case 'plus':            
      currentState = {                 
        ...state,                 
        count: currentState.count + 1            
      }        
    }    
  }    
  function subscribe() {}    
  return { getState, subscribe, dispatch }
}

// reducer抽离
// reducer.js
const initialState = {    
  count: 0
}
export function reducer(state = initialState, action) {    
  switch(action.type) {      
    case 'plus':        
    return {            
      ...state,                    
      count: state.count + 1        
    }      
    case 'subtract':        
    return {            
      ...state,            
      count: state.count - 1        
    }      
    default:        
    return initialState    
  }
}

import { reducer } from './reducer'
export const createStore = (reducer) => {    
  let currentState = {}     
  function getState() {        
    return currentState    
  }    
  function dispatch(action) {         
    currentState = reducer(currentState, action)  
  }    
  function subscribe() {}    
  dispatch({ type: '@@REDUX_INIT' })  // 初始化store数据  
  return { getState, dispatch, subscribe }
}
```
#### subscribe实现
```
import { reducer } from './reducer'
export const createStore = (reducer) => {        
  let currentState = {}        
  let observers = []             // 观察者队列        
  function getState() {                
    return currentState        
  }        
  function dispatch(action) {                
    currentState = reducer(currentState, action)                
    observers.forEach(fn => fn())        
  }        
  function subscribe(fn) {                
    observers.push(fn)        
  }        
  dispatch({ type: '@@REDUX_INIT' })  // 初始化store数据        
  return { getState, subscribe, dispatch }
}
```
### react-redux
####  Provider实现
> Provider将store放进this.context里，就能在组件中通过this.context.store这样的形式取到store，不需要再单独import store。同时也用于connect方法中更好的直接使用store。

```
import React from 'react'
import PropTypes from 'prop-types'

export class Provider extends React.Component {  
  // 需要声明静态属性childContextTypes来指定context对象的属性,是context的固定写法  
  static childContextTypes = {    
    store: PropTypes.object  
  } 

  // 实现getChildContext方法,返回context对象,也是固定写法  
  getChildContext() {    
    return { store: this.store }  
  }  

  constructor(props, context) {    
    super(props, context)    
    this.store = props.store  
  }  

  // 渲染被Provider包裹的组件  
  render() {    
    return this.props.children  
  }
}
```
#### Connect实现
> connect接收mapStateToProps、mapDispatchToProps两个方法，然后返回一个高阶函数，这个高阶函数接收一个组件，返回一个高阶组件(其实就是给传入的组件增加一些属性和功能)，connect根据传入的map，将state和dispatch(action)挂载子组件的props上。其实context不过是给connect提供了获取store的途径，我们在connect中直接import store完全可以取代context。那么Provider存在的意义是什么，上面这个connect是自己写的，可以直接import store，但react-redux的connect是封装的，对外只提供api，所以需要让Provider传入store。

```
export function connect(mapStateToProps, mapDispatchToProps) {    
  return function(Component) {      
    class Connect extends React.Component {        
      componentDidMount() {          
        // 从context获取store并订阅更新          
        this.context.store.subscribe(this.handleStoreChange.bind(this));        
      }       
      handleStoreChange() {          
        // 触发更新          
        // 触发的方法有多种,这里为了简洁起见,直接forceUpdate强制更新,读者也可以通过setState来触发子组件更新          
        this.forceUpdate()        
      }        
      render() {          
        return (            
          <Component              
            // 传入该组件的props,需要由connect这个高阶组件原样传回原组件              
            { ...this.props }              
            // 根据mapStateToProps把state挂到this.props上              
            { ...mapStateToProps(this.context.store.getState()) }               
            // 根据mapDispatchToProps把dispatch(action)挂到this.props上              
            { ...mapDispatchToProps(this.context.store.dispatch) }                 
          />              
        )        
      }      
    }      
    //接收context的固定写法      
    Connect.contextTypes = {        
      store: PropTypes.object      
    }      
    return Connect    
  }
}
```