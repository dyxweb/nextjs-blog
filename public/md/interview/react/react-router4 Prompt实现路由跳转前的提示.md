## react-router4 Prompt实现路由跳转前的提示
[Demo地址](https://github.com/dyxweb/RouterPrompt)
> Prompt组件是react-router4提供的组件，主要作用于路由跳转前的阻止、提示等操作，常使用于提示用户未保存等提示。

### when
> 当Prompt的when属性为true时，渲染Prompt该组件。

### message
> 阻止时的提示框的文字内容(string)，也可以使用函数形式的属性值，动态返回message值，也可以通过函数形式实现自定义提示组件。

### 简单形式
> 默认的Prompt提示样式。

```
/**
 * 使用Prompt的默认提示框阻止跳转
 */
import React, { Component } from 'react';
import { Prompt, Link } from 'react-router-dom';

export default class DefaultPrompt extends Component {
  render() {
    return (
      <div>
        <Link to="/function/message">跳转到function形式的message的页面</Link>
        {/* when为true时表示阻止默认的跳转行为 */}
        <Prompt when={true} message='确认离开此页面？' />
        <h1>
          使用Prompt的默认提示框阻止跳转
        </h1>
      </div>
    )
  }
}
```
### 使用Prompt的message的function形式实现自定义的提示样式
> 可以实现自定义样式，如使用常用UI组件库的弹窗提示等，只能作用于当前组件的跳转时的自定义样式，优先级高于Router的getUserConfirmation方法。

```
/**
 * 使用Prompt的message的function形式实现自定义的提示样式
 */
import React, { Component } from 'react';
import { Prompt, Link } from 'react-router-dom';
import { Modal } from 'antd';

export default class FunctionMessage extends Component {
  state = {
    isBlock: true, // 是否阻止离开此页面
  };

  // 确认离开时的方法
  onConfirmLeave = pathname => {
    // 将isBlock设置为false，不再阻止跳转行为，并手动进行路由跳转
    this.setState({
      isBlock: false,
    }, () => this.props.history.push(pathname));
  }

  render() {
    const { isBlock } = this.state;
    return (
      <div>
        <Link to="/default/prompt">跳转到默认提示的页面</Link>
        <Prompt
          when={isBlock}
          message={location => {
            Modal.confirm({
              title: '确认离开此页面？',
              onOk: () => this.onConfirmLeave(location),
            })
            return false;
          }}
        />
        <h1>
          使用Message的function的用法实现自定义阻止效果
        </h1>
      </div>
    )
  }
}
```
### 使用Router的getUserConfirmation实现自定义提示样式
> 可以作用于所有使用Prompt组件的路由页面。

```
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Route, Switch, Redirect} from 'react-router-dom';
import { Modal } from 'antd';
import FunctionMessage from './FunctionMessage';
import DefaultPrompt from './DefaultPrompt';

export default class App extends Component {
  // 提示框的确认的方法(移除挂载自定义提示组件的dom)
  onOk = callback => {
    callback(true);
    const routerDom = document.getElementById('router-dom');
    document.getElementsByTagName('body')[0].removeChild(routerDom);
    ReactDOM.unmountComponentAtNode(routerDom);
  };

  // 提示框的取消的方法(移除挂载自定义提示组件的dom)
  onCancel = callback => {
    callback(false);
    const routerDom = document.getElementById('router-dom');
    document.getElementsByTagName('body')[0].removeChild(routerDom);
    ReactDOM.unmountComponentAtNode(routerDom);
  };

  // getUserConfirmation自定义提示，message就是对应路由页面的message信息
  getConfirmation = (message, callback) => {
    // 在body下添加新的节点用于挂载自定义提示组件
    const routerDom = document.createElement('div');
    routerDom.setAttribute('id', 'router-dom');
    document.getElementsByTagName('body')[0].appendChild(routerDom);
    const ConFirmComponent = () => (
      <Modal
        title="使用getUserConfirmation实现自定义离开样式"
        visible={true}
        onOk={() => this.onOk(callback)}
        onCancel={() => this.onCancel(callback)}
      >
        {message}
      </Modal>
    )
    ReactDOM.render(
      <ConFirmComponent />,
      document.getElementById('router-dom')
    )
  }

  render() {
    return (
      <Router getUserConfirmation={this.getConfirmation}>
        <Switch>
          <Route path="/default/prompt" component={DefaultPrompt} />
          <Route path="/function/message" component={FunctionMessage} />
          <Redirect to="/default/prompt" />
        </Switch>
      </Router>
    )
  }
};
```