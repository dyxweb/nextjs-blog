## react架构
### react15的架构
#### Reconciler(协调阶段) —— 生成虚拟DOM和找出变化的虚拟DOM
- 调用函数组件、或class组件的render方法，将返回的JSX转化为虚拟DOM
- 将虚拟DOM和上次更新时的虚拟DOM对比
- 通过对比找出本次更新中变化的虚拟DOM
- 通知Renderer将变化的虚拟DOM更新到页面上
#### Renderer(渲染提交阶段) —— 负责将变化的虚拟DOM更新到真实DOM上
### [react15架构的缺点](https://react.iamkasong.com/preparation/oldConstructure.html#react15%E6%9E%B6%E6%9E%84%E7%9A%84%E7%BC%BA%E7%82%B9)
- 在Reconciler中，mount的组件会调用mountComponent，update的组件会调用updateComponent。
- 这两个方法都会递归更新子组件。由于递归执行，所以更新一旦开始，中途就无法中断。当层级很深时，递归更新时间超过了16ms，用户交互就会卡顿。
- react15架构Reconciler和Renderer是交替工作的，当第一个需要更新的dom在页面上已经变化后，第二个需要更新的dom再进入Reconciler。由于整个过程都是同步的，所以在用户看来所有dom是同时更新的。如果中途中断更新会看见更新不完全的dom。
### react16的架构
> 相较于React15，React16中新增了Scheduler(调度器)。

#### Scheduler(调度阶段) —— 调度任务的优先级，高优任务优先进入Reconciler
- 以浏览器是否有剩余时间作为任务中断的标准，当浏览器有剩余时间时通知我们。其实部分浏览器已经实现了这个API，这就是requestIdleCallback。
- React实现了功能更完备的Scheduler。除了在空闲时触发回调的功能外，Scheduler还提供了多种调度优先级任务的功能。
#### Reconciler(协调阶段) —— 生成虚拟DOM和找出变化的虚拟DOM   Fiber架构
- 在React15中Reconciler是递归处理虚拟DOM的。React16的Reconciler更新工作从递归变成了可以中断的循环过程。每次循环都会调用shouldYield判断当前是否有剩余时间。
- 在React16中Reconciler与Renderer不再是交替工作。当Scheduler将任务交给Reconciler后，Reconciler会为变化的虚拟DOM打上代表增/删/更新的标记。
- 整个Scheduler与Reconciler的工作都在内存中进行(由于在内存中进行，不会更新页面上的DOM，所以即使反复中断，用户也不会看见更新不完全的DOM)。只有当所有组件都完成Reconciler的工作，才会统一交给Renderer。从而解决中断更新时DOM渲染不完全的问题。
#### Renderer(渲染提交阶段) —— 负责将变化的虚拟DOM更新到真实DOM上
- Renderer根据Reconciler为虚拟DOM打的标记，同步执行对应的真实DOM操作。
- 调用暴露给开发者的钩子方法，如componentDidUpdate、useLayoutEffect等。






