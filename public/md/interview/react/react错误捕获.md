## react错误捕获
### 错误捕获的组件(参考官方文档实现)
```
import React from 'react';

export default class ErrorBoundary extends React.Component {
  state = {
    hasError: false,
  }

  static getDerivedStateFromError() {
    // 更新 state 使下一次渲染能够显示降级后的 UI
    return { hasError: true };
  }

  componentDidCatch() {
    this.setState({
      hasError: true
    })
  }

  render() {
    const { tip } = this.props;
    if (this.state.hasError) {
      // 可以自定义降级后的 UI 并渲染
      return <h1>{tip}</h1>;
    }
    return this.props.children; 
  }
}
```
### react的ErrorBoundary如果直接包裹在jsx外，jsx中的错误无法捕捉到，只能捕捉到jsx中组件内的错误，正如官方所说的可以捕获发生在其子组件树任何位置的 JavaScript错误，并打印这些错误，同时展示降级UI。
> 如下实例，demoOne中的jsx错误无法被ErrorBoundary捕获到，但是demoTwo中的错误可以被捕获到。

```
// demoOne
import React, { Component } from 'react';
import ErrorBoundary from 'components/errorBoundary';

export default class JsxTestOne extends Component {
  render() {
    return (
      <ErrorBoundary tip="JsxTestOne 组件的ErrorBoundary">
        <div>ErrorBoundary直接包裹jsx无法捕捉错误</div>
        <div>{user.name}</div>
      </ErrorBoundary>
    )
  }
}

// demoTwo
import React, { Component } from 'react';
import ErrorBoundary from 'components/errorBoundary';

class Demo extends Component {
  render() {
    return (
      <div>
        <div>ErrorBoundary包裹组件可以捕捉错误</div>
        <div>{user.name}</div>
      </div>
    )
  }
}

export default class JsxTestTwo extends Component {
  render() {
    return (
      <ErrorBoundary tip="JsxTestTwo 组件的ErrorBoundary">
        <Demo />
      </ErrorBoundary>
    )
  }
}
```
### 一个后代组件抛错，可以被包裹其的祖先组件的ErrorBoundary组件catch到错误，但是会优先被最近包裹其的祖先组件的ErrorBoundary组件catch到错误
> 如下的实例DemoThree抛错，会优先被包裹DemoThree的ErrorBoundary(tip="最外层子组件组件的ErrorBoundary组件")组件catch到错误。如果DemoThree外不包裹ErrorBoundary，将会被包裹DemoTwo的ErrorBoundary(tip="最外层组件的ErrorBoundary组件")组件catch到错误。

```
// demoOne
import React, { Component } from 'react';
import ErrorBoundary from 'components/errorBoundary';
import DemoTwo from './demoTwo';

export default class DemoOne extends Component {
  render() {
    return (
      <div style={{ border: '1px solid green', margin: '20px 0'}}>
        <div>最外层的组件</div>
        <ErrorBoundary tip="最外层组件的ErrorBoundary组件">
          <DemoTwo />
        </ErrorBoundary>
      </div>
    )
  }
}

// demoTwo
import React, { Component } from 'react';
import ErrorBoundary from 'components/errorBoundary';
import DemoThree from './demoThree';

export default class DemoTwo extends Component {
  state={
    user: null
  }
  render() {
    return (
      <div style={{ border: '1px solid red', margin: '20px'}}>
        <div>最外层的子组件</div>
        <div onClick={() => this.setState({ user: { name: 'dyx' }})}>设置user</div>
        <ErrorBoundary tip="最外层子组件组件的ErrorBoundary组件">
          <DemoThree user={this.state.user} />
        </ErrorBoundary>
      </div>
    )
  }
}

// demoThree
import React, { Component } from 'react';

export default class DemoThree extends Component {
  render() {
    const { user } = this.props;
    return (
      <div style={{ border: '1px solid blue', margin: '20px'}}>
        最外层的孙组件
        {user.name}
      </div>
    )
  }
}
```
### 生命周期函数的错误可以被ErrorBoundary组件catch到
> 如下实例，生命周期的方法中错误会显示回退的UI。

```
import React, { Component } from 'react';
import ErrorBoundary from 'components/errorBoundary';

class Demo extends Component {
  componentDidMount() {
    console.log(a)
  }
  render() {
    return (
      <div>
        生命周期的错误
      </div>
    )
  }
}

export default class CyclifeTest extends Component {
  render() {
    return (
      <ErrorBoundary tip="生命周期的错误捕捉的ErrorBoundary">
        <Demo />
      </ErrorBoundary>
    )
  }
}
```
### 事件处理的错误不会被ErrorBoundary组件catch到
> 如下实例demoOne中func中的错误并不会被catch到，正如官方文档所说React不需要错误边界来捕获事件处理器中的错误。与render方法和生命周期方法不同，事件处理器不会在渲染期间触发。因此如果它们抛出异常React仍然能够知道需要在屏幕上显示什么。但是demTwo中如果func中的处理导致render函数或者生命周期逻辑抛错则是可以被catch到的。

- 事件处理的错误不影响render函数和生命周期的正常逻辑，不会被ErrorBoundary组件catch。
```
// demoOne
import React, { Component } from 'react';
import ErrorBoundary from 'components/errorBoundary';

class DemoOne extends Component {
  state = {
    user: { name: 'dyx' },
  }

  func = () => {
    console.log(a)
  }

  render() {
    return (
      <div onClick={this.func}>
        事件处理的错误
        <div>{this.state.user.name}</div>
      </div>
    )
  }
}

export default class FuncTest extends Component {
  render() {
    return (
      <ErrorBoundary tip="事件处理的错误捕捉的ErrorBoundary">
        <DemoOne />
      </ErrorBoundary>
    )
  }
}
```
- 事件处理的错误影响render函数和生命周期的正常逻辑，会被ErrorBoundary组件catch。
```
// demoTwo
import React, { Component } from 'react';
import ErrorBoundary from 'components/errorBoundary';

class DemoTwo extends Component {
  state = {
    user: { name: 'dyx' },
  }

  func = () => {
    this.setState({
      user: null
    })
    console.log(a)
  }

  componentDidUpdate() {
    console.log(this.state.user.name)
  }

  render() {
    return (
      <div onClick={this.func}>
        事件处理的错误
        <div>{this.state.user.name}</div> 
      </div>
    )
  }
}

export default class FuncTest extends Component {
  render() {
    return (
      <ErrorBoundary tip="事件处理的错误捕捉的ErrorBoundary">
        <Demo />
      </ErrorBoundary>
    )
  }
}
```
### 如果一个组件抛错，显示了回退的UI，此时我们在其父组件中修改此错误还是会显示回退的UI，不会正常渲染组件，所以如果错误是因为接口数据错误导致的，此时重新获取接口数据，并不会使错误的组件正常渲染，reload才会有效。
> 如下实例中子组件渲染出错，此时在父组件中修改传给子组件的属性，即使此时子组件中的逻辑正确，依然不能正常渲染，因为此时ErrorBoundary中的hasError状态已经是true，所以只会显示回退的UI。

```
// 父组件
import React, { Component } from 'react';
import ErrorBoundary from 'components/errorBoundary';
import DemoThree from './demoThree';

export default class Demo extends Component {
  state={
    user: null
  }
  render() {
    return (
      <div style={{ border: '1px solid red', margin: '20px'}}>
        <div onClick={() => this.setState({ user: { name: 'dyx' } })}>设置user</div>
        <ErrorBoundary tip="最外层组件的ErrorBoundary组件">
          <DemoOne user={this.state.user} />
        </ErrorBoundary>
      </div>
    )
  }
}

// 子组件
import React, { Component } from 'react';

export default class DemoOne extends Component {
  render() {
    const { user } = this.props;
    return (
      <div style={{ border: '1px solid blue', margin: '20px'}}>
        {user.name}
      </div>
    )
  }
}
```