## react性能优化
### react工作流
- React是声明式UI库，负责将数据转换为页面结构(虚拟DOM结构)后，再转换成真实DOM结构交给浏览器渲染。
- 当数据发生改变时，React会先进行调和(Reconciliation)阶段，调和阶段结束后立刻进入提交(Commit)阶段，提交阶段结束后新数据对应的页面才被展示出来。
#### 调和阶段
1. 计算目标虚拟DOM结构：计算出目标数据对应的虚拟DOM结构(类组件的render方法或函数组件自身)。
2. Diff过程：寻找将当前虚拟DOM结构修改为目标虚拟DOM结构的最优更新方案(Diff算法，会记录虚拟DOM的更新方式如Update、Mount、Unmount，为提交阶段做准备)。
#### 提交阶段
1. 更新真实DOM：将调和阶段记录的更新方式应用到真实DOM中。
2. 调用暴露给开发者的生命周期钩子方法。 
### Render过程
- 调和阶段中计算目标虚拟DOM结构的过程称为Render过程。
- 触发React组件的Render过程的方式
    1. State更新
    2. Props更新
    3. 父组件Render触发子组件Render过程。
    4. 组件依赖的上下文(context)发生变化
    5. forceUpdate强制更新
    6. 组件依赖的自定义hooks发生变化
### react底层优化机制
- 虚拟DOM + Diff算法高效的更新真实DOM。
- 升级fiber架构使得Diff过程可以被中断且恢复，fiber架构把Diff的工作过程时间分片，避免JS脚本执行时间过长导致页面掉帧、页面卡顿。
- 设计任务调度优先级更高效的更新，及时响应用户的操作。
### 优化技巧
- 由于调和阶段的Diff过程和提交阶段的更新真实DOM都属于React的内部实现，开发者能提供的优化能力有限，仅有列表项使用key属性一条优化技巧。
- 实际工程中大部分优化方式都集中在调和阶段计算目标虚拟DOM的过程。
### 跳过不必要的组件更新
#### PureComponent、React.memo
- 当父组件重新渲染时，即使父组件传给子组件的所有Props都没有变化，子组件也会重新渲染。
- PureComponent会对类组件的State和Props进行浅比较，只有当State和Props发生变化时组件才会重新渲染。
- React.memo会对函数组件的Props进行浅比较，只有当Props发生变化时组件才会重新渲染。支持第二个参数传入一个函数，如果组件需要更新就返回false，不需要更新就返回true。和shouldComponentUpdate正好相反。
#### shouldComponentUpdate
- shouldComponentUpdate是class组件主要的优化方式。
- 支持对this.props与nextProps以及this.state与nextState以及this.context和nextContext进行比较，如果组件需要更新就返回true，不需要更新就返回false。
#### useMemo、useCallback生成稳定的Props值
- 如果传给子组件的Props每次都是新的引用(例如传递函数作为子组件Props时，父组件每次重新渲染，作为Props的函数都会生成新的引用)，那么React.memo的优化就会失效。
- 可以借助useMemo或useCallback来生成稳定的Props值，并结合React.memo避免子组件重新渲染。
#### Immutable Data + PureComponent(React.memo)
- 使用Immutable Data凡是有节点被改变，那么它和与它相关的所有上级节点都更新，并且更新后返回了一个全新的引用，即使是浅比对也能感知到数据的改变。
- 使用Immutable Data + PureComponent(React.memo)可以识别出State和Props是否变化(引用类型数据变化也可以识别到)，从而通过PureComponent(React.memo)可以更好的控制组件是否更新。
#### 发布者订阅者跳过中间组件的渲染
- React推荐将公共数据放在所有需要该状态的组件的公共祖先上，但将状态放在公共祖先上后，该状态就需要层层向下传递，直到传递给使用该状态的组件为止。每次状态的更新都会涉及中间组件的渲染，但中间组件并不关心该状态，中间组件只负责将该状态再传给子组件。
- 这种场景下可以将状态用发布者订阅者模式维护，只有关心该状态的组件才去订阅该状态，不再需要中间组件传递该状态。当状态更新时发布者发布数据更新消息，只有订阅者组件才会重新渲染，中间组件不再需要重新渲染。
- 只要是发布者订阅者模式的库，都可以进行该优化。比如redux、React.createContext等。
#### 状态下放，缩小状态影响范围
- 如果一个状态只在某部分子树中使用，那么可以将这部分子树提取为组件，并将该状态移动到该组件内部。
#### useMemo返回稳定的虚拟DOM
- 相较于React.memo需要对组件进行一次包装生成新的组件，useMemo返回稳定的虚拟DOM形式只需在存在性能瓶颈的地方使用，不用修改组件使用更方便。
- useMemo返回稳定的虚拟DOM形式不用判断组件的所有Props，而只需考虑当前场景中用到的值，使用更灵活。
- 父组件
```
// 子组件只关心count数据，当更新name数据的时候，Children子组件不会重新渲染，实现对组件的缓存控制。
import React, { useState, useMemo } from 'react';
import Children from './children';

const Parent = () => {
  const [count, setCount] = useState(0);
  const [name, setName] = useState(0);

  const memoChildren = useMemo(() => <Children count = {count} />, [count]);
  return (
    <div>
      <div>count：{count}；name：{name}</div>
      <button onClick={() => setCount(count + 1)}>点击更新count</button>
      <button onClick={() => setName(name + 1)}>点击更新name</button>
      {memoChildren}
    </div>
  )
}

export default Parent;
```
- 子组件
```
import React from 'react';

const Children = (props) => {
  console.log('render');
  return (
    <div>
      子组件只关心count数据
      {props.count}
    </div>
  )
}

export default Children;
```
### 更快的完成Diff比较
#### 列表项使用稳定唯一的key属性。
#### 尽量保持节点的类型一致，如果更新前后节点类型不一致的话无论有多少子组件将全部卸载重新创建。
#### 条件渲染时不要去破坏结构，尽量使用空节点来保持前后结构顺序的统一。
### 通用优化
#### 减少波及范围，无关刷新数据不存入State中
- 在class组件可以使用类组件的实例属性存储无关刷新的数据。
- 在函数组件中可以通过useRef来存储无关刷新的数据。
#### 缓存计算结果，减少不必要的计算逻辑
- 使用useMemo缓存上次计算的结果，当useMemo的依赖未发生改变时，就不会触发重新计算。一般用在有非常耗时的计算场景中。
#### 批量更新State，减少setState的重复操作
- 在React18之前的版本中，在生命周期钩子函数和React合成事件中会自动应用批量更新，在异步函数(setTimeout、 Promise的then回调)和原生事件中(addEventListener)不会应用批量更新，可以使用unstable_batchedUpdates方法实现批量更新。
- React18中的任何场景都会自动应用批量更新。
- react合成事件中多次调整state，只会重新渲染一次，批量更新
```
import React, { Component } from 'react';

export default class Home extends Component {
  state = {
    count: 0
  }

  buttonClick = () => {
    this.setState({
      count: this.state.count + 1
    });
    console.log(this.state.count); // 0
    this.setState({
      count: this.state.count + 1
    });
    console.log(this.state.count); // 0
    this.setState({
      count: this.state.count + 1
    });
    console.log(this.state.count); // 0
  }

  render() {
    console.log('render', this.state.count); // 1
    return (
      <div>
        <div>{this.state.count}</div>
        <button onClick={this.buttonClick}>click</button>
      </div>
    )
  }
}
```
- 原生事件中多次调整state，会重新渲染多次，react18之前为非批量更新，react18之后为批量更新
```
import React, { Component } from 'react';

export default class Home extends Component {
  state = {
    count: 0
  }

  componentDidMount() {
    document.getElementById('dyx')?.addEventListener('click', this.buttonClick)
  }

  componentWillUnmount() {
    document.getElementById('dyx')?.removeEventListener('click', this.buttonClick)
  }

  buttonClick = () => {
    this.setState({
      count: this.state.count + 1
    });
    console.log(this.state.count); // 1
    this.setState({
      count: this.state.count + 1
    });
    console.log(this.state.count); // 2
    this.setState({
      count: this.state.count + 1
    });
    console.log(this.state.count); // 3
  }

  render() {
    console.log('render', this.state.count); // 1、2、3
    return (
      <div>
        <div>{this.state.count}</div>
        <button id="dyx">click</button>
      </div>
    )
  }
}
```
- 使用unstable_batchedUpdates将非批量更新的场景调整为批量更新
```
import React, { Component } from 'react';
import { unstable_batchedUpdates } from 'react-dom';

export default class Home extends Component {
  state = {
    count: 0
  }

  componentDidMount() {
    document.getElementById('dyx')?.addEventListener('click', this.buttonClick)
  }

  componentWillUnmount() {
    document.getElementById('dyx')?.removeEventListener('click', this.buttonClick)
  }

  buttonClick = () => {
    unstable_batchedUpdates(() => {
      this.setState({
        count: this.state.count + 1
      });
      console.log(this.state.count); // 0
      this.setState({
        count: this.state.count + 1
      });
      console.log(this.state.count); // 0
      this.setState({
        count: this.state.count + 1
      });
      console.log(this.state.count); // 0
    })
  }

  render() {
    console.log('render', this.state.count); // 1
    return (
      <div>
        <div>{this.state.count}</div>
        <button id="dyx">click</button>
      </div>
    )
  }
}
```
#### 按优先级更新，及时响应用户
- 将耗时任务移动到下一个宏任务中执行，优先响应用户行为。
### PureComponent比较逻辑
- PrueComponent继承了Component将shouldComponentUpdate重写成了shallowCompare。
- 在shallowCompare中使用shallowEqual方法对新旧Props和新旧State进行浅比较。
```
export defualut function PureComponent(props, context) {
  Component.call(this, props, context);
}
PureComponent.prototype = Object.create(Component.prototye);
PureComponent.prototype.contructor = PureComponent;
PureComponent.prototype.shouldComponentUpdate = shallowCompare;
 
function shallowCompare(nextProps, nextState) {
  return !shallowEqual(this.props, nextProps) || !shallowEqual(this.state, nextState);
}
```
#### shallowEqual的比较步骤
1. 首先会直接比较新老Props和新老State两个对象的地址是否相同，如果地址相同，就直接返回true，如果地址不相同就继续判断。
2. 判断新老Props和新老State，有不是对象或者为null的，返回false。
3. 判断新老Props和新老State的属性个数(Object.keys)是否相同，如果不同证明有属性增加或者减少，返回false。
4. 遍历老Props和老State的每一项，如果对应的新Props或新State中有没有与之对应的属性或对应的属性值不相等(浅比较)，返回false。
```
function shallowEqual(objA, objB) {
  if (is(objA, objB)) {
    return true;
  }
 
  if (typeof objA !== 'object' || objA === null || typeof objB !== 'object' || objB === null) {
    return false;
  }
 
  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);
 
  if (keysA.length !== keysB.length) {
    return false;
  }
 
  // Test for A's keys different from B.
  for (let i = 0; i < keysA.length; i++) {
    if (!hasOwnProperty.call(objB, keysA[i]) || !is(objA[keysA[i]], objB[keysA[i]])) {
      return false;
    }
  }
 
  return true;
}
```