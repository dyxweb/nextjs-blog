## Concurrent Mode (并发模式)
> 在并发模式下，React在执行过程中每执行一个Fiber都会看看有没有更高优先级的更新，如果有则当前低优先级的的更新会被暂停，待高优先级任务执行完之后，再继续执行或重新执行。

### React 的状态更新可以分为两类
> 并发模式只是提供了可中断的能力，并不会自动帮我们区分不同优先级的更新。默认情况下，所有的更新都是紧急更新。

1. 紧急更新(Urgent updates)：比如打字、点击、拖动等，需要立即响应的行为，如果不立即响应会给人很卡，或者应用出问题的感觉。
2. 过渡更新(Transition updates)：将UI从一个视图过渡到另一个视图，不需要即时响应，有些延迟是可以接受的。
### startTransition
> 会在高优先级更新渲染完成之后，才会启动低优先级更新渲染，并且低优先级渲染随时可被其它高优先级更新中断。通过startTransition标记了非紧急更新，让树的更新变成低优先级的，可以被随时中止，保证了高优先级的Slider的体验。

```
const [treeLeanInput, setTreeLeanInput] = useState(0); // Slider的控制
const [treeLean, setTreeLean] = useState(0); // 绘制树的控制

function changeTreeLean(event) {
  const value = Number(event.target.value);
  setTreeLeanInput(value)

  // 将 treeLean 的更新用 startTransition 包裹
  React.startTransition(() => {
    setTreeLean(value);
  });
}

return (
  <>
    <input type="range" value={treeLeanInput} onChange={changeTreeLean} />
    <Pythagoras lean={treeLean} />
  </>
)
```
- input 更新
  1. treeLeanInput 状态变更
  2. 准备新的 DOM
  3. 渲染 DOM
- 树更新（这一次更新是低优先级的，随时可以被中止）
  1. treeLean 状态变更
  2. 准备新的 DOM
  3. 渲染 DOM
### useTransition
> 在低优先状态等待更新过程中，有一个Loading的状态。

```
const [treeLeanInput, setTreeLeanInput] = useState(0);
const [treeLean, setTreeLean] = useState(0);

// 实时监听 transition 状态
const [isPending, startTransition] = useTransition();

function changeTreeLean(event) {
  const value = Number(event.target.value);
  setTreeLeanInput(value)

  // 将 treeLean 的更新用 startTransition 包裹
  startTransition(() => {
    setTreeLean(value);
  });
}

return (
  <>
    <input type="range" value={treeLeanInput} onChange={changeTreeLean} />
    // 等待更新过程添加loading效果
    <Spin spinning={isPending}>
      <Pythagoras lean={treeLean} />
    </Spin>
  </>
)
```