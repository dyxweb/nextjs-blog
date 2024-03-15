## Component
### React.Component源码
```
function Component(props, context, updater) {
  // 接收 props，context，updater 进行初始化，挂载到 this 上
  this.props = props;
  this.context = context;
  this.refs = emptyObject;
  // updater 上挂载了 isMounted、enqueueForceUpdate、enqueueSetState 等触发器方法
  this.updater = updater || ReactNoopUpdateQueue;
}

// 原型链上挂载 isReactComponent，在 ReactDOM.render 时用于和函数组件做区分
Component.prototype.isReactComponent = {};

// 给类组件添加 `this.setState` 方法
Component.prototype.setState = function(partialState, callback) {
  // 验证参数是否合法
  invariant(
    typeof partialState === 'object' ||
      typeof partialState === 'function' ||
      partialState == null
  );
  // 添加至 enqueueSetState 队列
  this.updater.enqueueSetState(this, partialState, callback, 'setState');
};

// 给类组件添加 `this.forceUpdate` 方法
Component.prototype.forceUpdate = function(callback) {
  // 添加至 enqueueForceUpdate 队列
  this.updater.enqueueForceUpdate(this, callback, 'forceUpdate');
};
```
### React.Component流程
1. 将props、context、updater挂载到this上。
2. 在Component原型链上添加isReactComponent对象，用于标记类组件。
3. 在Component原型链上添加setState方法。
4. 在Component原型链上添加forceUpdate方法。
5. 理解react类组件super()的作用，以及this.setState和this.forceUpdate的由来。
