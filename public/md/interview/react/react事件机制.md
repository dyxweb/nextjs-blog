## [react事件机制](https://mp.weixin.qq.com/s/DI0oQI7Q-v5vrySRkD1ckw)
### 事件传播机制
> 一般的事件触发都会经历三个阶段。如果想阻止事件的传播，可以在指定节点的事件监听器通过event.stopPropagation()或event.cancelBubble = true阻止事件传播。有些事件是没有冒泡阶段的，如scroll、blur、及各种媒体事件等。

1. 捕获阶段，事件从 window 开始，自上而下一直传播到目标元素的阶段。
2. 目标阶段，事件真正的触发元素处理事件的阶段。
3. 冒泡阶段，从目标元素开始，自下而上一直传播到 window 的阶段。
### 绑定事件的方法
- 行内 HTML 事件绑定。
> js 和 html 代码耦合。

```
<div onclick="handleClick()">test</div>
<script>
  let handleClick = function(){
    // ...
  }

  // 移除事件
  handleClick = function(){}
</script>
```
- 事件处理器属性(DOM0)。
> 作为属性使用，一次只能绑定一个事件，多次赋值会覆盖，只能处理冒泡阶段。

```
<div id="test">test</div>
<script>
  let target = document.getElementById('test')
  // 绑定事件
  target.onclick = function(){
    // ...
  }
  target.onclick = function(){
    // ...会覆盖上面的方法
  }
  // 移除事件
  target.onclick = null;
</script>
```
- addEventListener(DOM2)
> 就是为了绑定事件而生的 api，拓展性最强，现在开发者一般都用 addEventListener 绑定事件监听器。

```
<div id="test">test</div>
<script>
  let target = document.getElementById('test');
  // 绑定事件
  let funcA = function(){
    // ...
  }
  let funcB = function(){
    // ...
  }
  // 添加冒泡阶段监听器
  target.addEventListener('click', funcA, false);
  // 添加捕获阶段监听器
  target.addEventListener('click', funcB, true);
  // 移除监听器
  target.removeEventListener('click', funcA);
</script>
```
### 事件委托
> 当节点的数量较多时，如果给每个节点都进行事件绑定的话，内存消耗大，可将事件绑定到其父节点上统一处理，减少事件绑定的数量。

```
<ul id="parent">
  <li>1</li>
  <li>2</li>
  <li>3</li>
  ...
  <li>999</li>
  <li>1000</li>
</ul>
<script>
  let parent = document.getElementById('parent');
  parent.addEventListener('click', (e) => {
    // 根据e.target进行处理
  })
</script>
```
### 浏览器事件差异
> 由于浏览器厂商的实现差异，在事件的属性及方法在不同浏览器及版本上略有不同，开发者为兼容各浏览器及版本之间的差异，需要编写兼容代码。

```
// 阻止事件传播
function stopPropagation(e) {
  if (typeof e.stopPropagation === 'function') {
    e.stopPropagation();
  } else {
    // 兼容ie
    e.cancelBubble = true;
  }
}

// 阻止默认事件
function preventDefault(e) {
  if (typeof e.preventDefault === 'function') {
    e.preventDefault();
  } else {
    // 兼容ie
    e.returnValue = false;
  }
}

// 获取事件触发元素
function getEventTarget(e) {
  let target = e.target || e.srcElement || window;
}
```
### react中的事件类型
- 原生事件: 在componentDidMount生命周期里边通过addEventListener绑定的事件。
- 合成事件: 通过JSX方式绑定的事件，比如onClick={() => this.handle()}。
- 当事件在具体的DOM节点上被触发后，最终都会冒泡到document上，document上所绑定的统一事件处理程序会将事件分发到具体的组件实例。
### 为什么 React 实现自己的事件机制
- 将事件都代理到了根节点上，减少了事件监听器的创建，节省了内存。
- 磨平浏览器差异，开发者无需兼容多种浏览器写法。如想阻止事件传播时需要编写event.stopPropagation() 或 event.cancelBubble = true，在 React 中只需编写event.stopPropagation()即可。
- 对开发者友好。只需在对应的节点上编写如onClick、onClickCapture等代码即可完成click事件在该节点上冒泡节点、捕获阶段的监听，统一了写法。
### React自己事件机制实现步骤
#### 事件分类
> React 对在 React 中使用的事件进行了分类，具体通过各个类型的事件处理插件分别处理。

1. 这里的分类是对 React 事件进行分类的，简单事件如onClick和onClickCapture，它们只依赖了原生事件click。而有些事件是由 React 统一包装给用户使用的，如onChange，它依赖了['change','click','focusin','focusout','input','keydown','keyup','selectionchange']，这是 React 为了兼容不同表单的修改事件收集，如对于`<input type="checkbox" />`和`<input type="radio" />`开发者原生需要使用click事件收集表单变更后的值，而在 React 中可以统一使用onChange来收集。
2. 分类并不代表依赖的原生事件之间没有交集。 如简单事件中有onKeyDown，它依赖于原生事件keydown。输入前事件有onCompositionStart，它也依赖了原生事件keydown。表单修改事件onChange，它也依赖了原生事件keydown。

- SimpleEventPlugin简单事件，代表事件onClick。
- BeforeInputEventPlugin输入前事件，代表事件onBeforeInput。
- ChangeEventPlugin表单修改事件，代表事件onChange。
- EnterLeaveEnventPlugin鼠标进出事件，代表事件onMouseEnter。
- SelectEventPlugin选择事件，代表事件onSelect。
#### 事件收集
> React 需要对所有的事件做代理委托，所以需要事先知道浏览器支持的所有事件，这些事件都是硬编码在 React 源码的各个事件插件中的。而对于所有需要代理的原生事件，都会以原生事件名字符串的形式存储在一个名为allNativeEvents的集合中，并且在registrationNameDependencies中存储 React 事件名到其依赖的原生事件名数组的映射。

1. 事件的收集是通过各个事件处理插件各自收集注册的，在页面加载时，会执行各个插件的registerEvents，将所有依赖的原生事件都注册到allNativeEvents中去，并且在registrationNameDependencies中存储映射关系。
2. 对于原生事件不支持冒泡阶段的事件，硬编码的形式存储在了nonDelegatedEvents集合中，原生不支持冒泡阶段的事件在后续的事件代理环节有不一样的处理方式。
```
// React代码加载时就会执行以下js代码
SimpleEventPlugin.registerEvents();
EnterLeaveEventPlugin.registerEvents();
ChangeEventPlugin.registerEvents();
SelectEventPlugin.registerEvents();
BeforeInputEventPlugin.registerEvents();

// 上述代码执行完后allNativeEvents集合中就会有cancel、click等80种事件
allNativeEvents = ['cancel','click', ...]

// nonDelegatedEvents有cancel、close等29种事件
nonDelegatedEvents = ['cancel','close'，...]

// registrationNameDependencies保存react事件和其依赖的事件的映射
registrationNameDependencies = {
  onClick: ['click'],
  onClickCapture: ['click'],
  onChange: ['change','click','focusin','focusout','input','keydown','keyup','selectionchange'],
  ...
}
```
#### 事件代理
- 原生事件支持冒泡的可代理事件。
  1. 将事件委托代理到根元素的操作发生在ReactDOM.render(element, container)时。在ReactDOM.render的实现中，在创建了fiberRoot后，在开始构造fiber树前，会调用listenToAllSupportedEvents进行事件的绑定委托。
  > 首先会判断根元素上的事件监听器相关的字段是否已标记完成过监听，如果没有完成，则将根标记为已监听过，并遍历allNativeEvents进行事件的委托绑定。是否完成监听的判断是避免多次调用ReactDOM.render(element, container)是对同一个container重复委托事件。listenToNativeEvent即对元素进行事件绑定的方法，第二个参数的含义是是否将监听器绑定在捕获阶段。对于不存在冒泡阶段的事件，React 只委托了捕获阶段的监听器，而对于其他的事件，则对于捕获阶段和冒泡阶段都委托了监听器。

  ```
  const listeningMarker =
    '_reactListening' +
    Math.random()
      .toString(36)
      .slice(2);

  export function listenToAllSupportedEvents(rootContainerElement: EventTarget) {
    if (enableEagerRootListeners) {
      if ((rootContainerElement: any)[listeningMarker]) {
        // 避免重复初始化
        return;
      }
      // 将该根元素标记为已初始化事件监听
      (rootContainerElement: any)[listeningMarker] = true;
      allNativeEvents.forEach(domEventName => {
        if (!nonDelegatedEvents.has(domEventName)) {
          listenToNativeEvent(
            domEventName,
            false,
            ((rootContainerElement: any): Element),
            null,
          );
        }
        listenToNativeEvent(
          domEventName,
          true,
          ((rootContainerElement: any): Element),
          null,
        );
      });
    }
  }
  ```
  2. listenToNativeEvent的内部会将绑定了入参的dispatchEvent使用addEventListener绑定到根元素上。
  > 原生事件支持冒泡的可代理事件在根元素上绑定了捕获和冒泡阶段的回调，原生事件不支持冒泡的非代理事件在根元素上只绑定了捕获阶段的回调。

  ```
  export function dispatchEvent(
    domEventName: DOMEventName, // 原生事件名
    eventSystemFlags: EventSystemFlags, // 事件标记，如是否捕获阶段
    targetContainer: EventTarget, // 绑定事件的根
    nativeEvent: AnyNativeEvent, // 实际触发时传入的真实事件对象
  ): void {
      // ... 前三个参数在绑定到根上时已传入
  }

  // 提前绑定入参
  const listener = dispatchEvent.bind(
    null,
    targetContainer,
    domEventName,
    eventSystemFlags,
  )
  if (isCapturePhaseListener) {
    addEventCaptureListener(targetContainer, domEventName, listener)
  } else {
    addEventBubbleListener(targetContainer, domEventName, listener)
  }

  // 添加冒泡事件监听器
  export function addEventBubbleListener(
    target: EventTarget,
    eventType: string,
    listener: Function,
  ): Function {
    target.addEventListener(eventType, listener, false);
    return listener;
  }

  // 添加捕获事件监听器
  export function addEventCaptureListener(
    target: EventTarget,
    eventType: string,
    listener: Function,
  ): Function {
    target.addEventListener(eventType, listener, true);
    return listener;
  }
  ```
- 原生事件不支持冒泡的非代理事件。实际上 React 对这些不可冒泡的事件都进行了冒泡模拟。
> 对于非代理事件nonDelegatedEvents，由于这些事件不存在冒泡阶段，在根部代理他们的冒泡阶段监听器也不会触发，所以需要特殊处理。这些事件的代理发生在 DOM 实例的创建阶段，也就是render阶段的completeWork阶段。通过调用finalizeInitialChildren为 DOM 实例设置属性时，判断 DOM 节点类型来添加响应的冒泡阶段监听器。如为`<img />`和`<link />`标签对应的 DOM 实例添加error和load的监听器。

```
export function setInitialProperties(
  domElement: Element,
  tag: string,
  rawProps: Object,
  rootContainerElement: Element | Document,
): void {
  // ...
  switch (tag) {
    // ...
    case 'img':
    case 'image':
    case 'link':
        listenToNonDelegatedEvent('error', domElement);
        listenToNonDelegatedEvent('load', domElement);
        break;
    // ...
  }
  // ...
}

// 非代理事件监听器绑定
export function listenToNonDelegatedEvent(
  domEventName: DOMEventName,
  targetElement: Element,
): void {
  // 绑定在目标/冒泡阶段
  const isCapturePhaseListener = false;
  const listenerSet = getEventListenerSet(targetElement);
  const listenerSetKey = getListenerSetKey(
    domEventName,
    isCapturePhaseListener,
  );
  if (!listenerSet.has(listenerSetKey)) {
    addTrappedEventListener(
      targetElement,
      domEventName,
      IS_NON_DELEGATED, // 非代理事件
      isCapturePhaseListener, // 目标/冒泡阶段
    );
    listenerSet.add(listenerSetKey);
  }
}
```
### 合成事件
> 合成事件SyntheticEvent是 React 事件系统对于原生事件跨浏览器包装器。它除了兼容所有浏览器外，它符合W3C规范，包括事件触发、事件冒泡、事件捕获、事件合成和事件派发等，它还拥有和浏览器原生事件相同的接口，包括 stopPropagation() 和 preventDefault()。当需要使用浏览器的底层事件时，只需要使用 nativeEvent 属性来获取即可。

#### 合成事件作用
- 在底层磨平不同浏览器的差异，React实现了统一的事件机制，不再需要处理浏览器事件机制方面的兼容问题，在上层面向开发者暴露稳定、统一的、与原生事件相同的事件接口。
- React16的事件绑定在document上，React17以后事件绑定在挂载的dom上。而不是绑定在React组件对应的DOM(减少内存开销就是因为所有的事件都绑定在document上，其他节点没有绑定事件)。
- React把握了事件机制的主动权，实现了对所有事件的中心化管控。
- React引入事件池避免垃圾回收，在事件池中获取或释放事件对象，避免频繁的创建和销毁。
#### 合成事件和原生事件的区别
- 合成事件不是原生DOM事件，但它包含了原生DOM事件的引用，可以通过e.nativeEvent访问。
- 合成事件无法获取到真实DOM，但可以通过React提供refAPI进行获取。
#### 合成事件的使用
> React 事件的命名采用小驼峰式（camelCase），而不是纯小写。以 click 事件为例，冒泡阶段用onClick，捕获阶段用onClickCapture。使用 JSX 语法需要传入一个函数作为事件处理函数，而不是一个字符串。在 React 事件中不通过返回 false 阻止默认行为，必须显示调用event.preventDefault()。由于 React 事件执行回调时的上下文并不在组件内部，所以还需要注意 this 的指向问题。

```
// 传统html绑定事件
<button onclick="activateLasers()">
  test
</button>

// 在React中绑定事件
<button onClick={activateLasers}>
  test
</button>
```
#### 磨平浏览器差异
- React 通过事件normalize以让他们在不同浏览器中拥有一致的属性。React 声明了各种事件的接口，以此来磨平浏览器中的差异。
  1. 如果接口中的字段值为 0，则直接使用原生事件的值。
  2. 如果接口中字段的值为函数，则会以原生事件作为入参，调用该函数来返回磨平了浏览器差异的值。
  ```
  // 基础事件接口，timeStamp需要磨平差异
  const EventInterface = {
    eventPhase: 0,
    bubbles: 0,
    cancelable: 0,
    timeStamp: function(event) {
      return event.timeStamp || Date.now();
    },
    defaultPrevented: 0,
    isTrusted: 0,
  };
  // UI事件接口，继承基础事件接口
  const UIEventInterface: EventInterfaceType = {
    ...EventInterface,
    view: 0,
    detail: 0,
  };
  // 鼠标事件接口，继承UI事件接口，getModifierState，relatedTarget、movementX、movementY等字段需要磨平差异
  const MouseEventInterface: EventInterfaceType = {
    ...UIEventInterface,
    screenX: 0,
    screenY: 0,
    clientX: 0,
    clientY: 0,
    pageX: 0,
    pageY: 0,
    ctrlKey: 0,
    shiftKey: 0,
    altKey: 0,
    metaKey: 0,
    getModifierState: getEventModifierState,
    button: 0,
    buttons: 0,
    relatedTarget: function(event) {
      if (event.relatedTarget === undefined)
        return event.fromElement === event.srcElement
          ? event.toElement
          : event.fromElement;

      return event.relatedTarget;
    },
    movementX: function(event) {
      if ('movementX' in event) {
        return event.movementX;
      }
      updateMouseMovementPolyfillState(event);
      return lastMovementX;
    },
    movementY: function(event) {
      if ('movementY' in event) {
        return event.movementY;
      }
      // Don't need to call updateMouseMovementPolyfillState() here
      // because it's guaranteed to have already run when movementX
      // was copied.
      return lastMovementY;
    },
  };
  // 指针类型，继承鼠标事件接口。还有很多其他事件类型接口...
  const PointerEventInterface = {
    ...MouseEventInterface,
    pointerId: 0,
    width: 0,
    height: 0,
    pressure: 0,
    tangentialPressure: 0,
    tiltX: 0,
    tiltY: 0,
    twist: 0,
    pointerType: 0,
    isPrimary: 0,
  };
  ```
- 由于不同的类型的事件其字段有所不同，所以 React 实现了针对事件接口的合成事件构造函数的工厂函数。 通过传入不一样的事件接口返回对应事件的合成事件构造函数，然后在事件触发回调时根据触发的事件类型判断使用哪种类型的合成事件构造函数来实例化合成事件。
> 合成事件的实例，其实就是根据事件类型对原生事件的属性做浏览器的磨平，以及关键方法的包装。

```
// 辅助函数，永远返回true
function functionThatReturnsTrue() {
  return true;
}
// 辅助函数，永远返回false
function functionThatReturnsFalse() {
  return false;
}
// 合成事件构造函数的工厂函数，根据传入的事件接口返回对应的合成事件构造函数
function createSyntheticEvent(Interface: EventInterfaceType) {

  // 合成事件构造函数
  function SyntheticBaseEvent(
    reactName: string | null,
    reactEventType: string,
    targetInst: Fiber,
    nativeEvent: {[propName: string]: mixed},
    nativeEventTarget: null | EventTarget,
  ) {
    // react事件名
    this._reactName = reactName;
    // 当前执行事件回调时的fiber
    this._targetInst = targetInst;
    // 真实事件名
    this.type = reactEventType;
    // 原生事件对象
    this.nativeEvent = nativeEvent;
    // 原生触发事件的DOM target
    this.target = nativeEventTarget;
    // 当前执行回调的DOM
    this.currentTarget = null;

    // 下面是磨平字段在浏览器间的差异
    for (const propName in Interface) {
      if (!Interface.hasOwnProperty(propName)) {
        // 该接口没有这个字段，不拷贝
        continue;
      }
      // 拿到事件接口对应的值
      const normalize = Interface[propName];
      // 如果接口对应字段函数，进入if分支，执行函数拿到值
      if (normalize) {
        // 获取磨平了浏览器差异后的值
        this[propName] = normalize(nativeEvent);
      } else {
        // 如果接口对应值是0，则直接取原生事件对应字段值
        this[propName] = nativeEvent[propName];
      }
    }
    // 磨平defaultPrevented的浏览器差异，即磨平e.defaultPrevented和e.returnValue的表现
    const defaultPrevented =
      nativeEvent.defaultPrevented != null
        ? nativeEvent.defaultPrevented
        : nativeEvent.returnValue === false;
    if (defaultPrevented) {
      // 如果在处理事件时已经被阻止默认操作了，则调用isDefaultPrevented一直返回true
      this.isDefaultPrevented = functionThatReturnsTrue;
    } else {
      // 如果在处理事件时没有被阻止过默认操作，则先用返回false的函数
      this.isDefaultPrevented = functionThatReturnsFalse;
    }
    // 默认执行时间时，还没有被阻止继续传播，所以调用isPropagationStopped返回false
    this.isPropagationStopped = functionThatReturnsFalse;
    return this;
  }
  // 合成事件重要方法的包装
  Object.assign(SyntheticBaseEvent.prototype, {
    preventDefault: function() {
      // 调用后设置defaultPrevented
      this.defaultPrevented = true;
      const event = this.nativeEvent;
      if (!event) {
        return;
      }
      // 下面是磨平e.preventDefault()和e.returnValue=false的浏览器差异，并在原生事件上执行
      if (event.preventDefault) {
        event.preventDefault();
        // $FlowFixMe - flow is not aware of `unknown` in IE
      } else if (typeof event.returnValue !== 'unknown') {
        event.returnValue = false;
      }
      // 然后后续回调判断时都会返回true
      this.isDefaultPrevented = functionThatReturnsTrue;
    },

    stopPropagation: function() {
      const event = this.nativeEvent;
      if (!event) {
        return;
      }
      // 磨平e.stopPropagation()和e.calcelBubble = true的差异，并在原生事件上执行
      if (event.stopPropagation) {
        event.stopPropagation();
        // $FlowFixMe - flow is not aware of `unknown` in IE
      } else if (typeof event.cancelBubble !== 'unknown') {
        // The ChangeEventPlugin registers a "propertychange" event for
        // IE. This event does not support bubbling or cancelling, and
        // any references to cancelBubble throw "Member not found".  A
        // typeof check of "unknown" circumvents this issue (and is also
        // IE specific).
        event.cancelBubble = true;
      }
      // 然后后续判断时都会返回true，已停止传播
      this.isPropagationStopped = functionThatReturnsTrue;
    },
    /**
     * We release all dispatched `SyntheticEvent`s after each event loop, adding
     * them back into the pool. This allows a way to hold onto a reference that
     * won't be added back into the pool.
     */
    // react16的保留原生事件的方法，react17里已无效
    persist: function() {
      // Modern event system doesn't use pooling.
    },

    /**
     * Checks if this event should be released back into the pool.
     *
     * @return {boolean} True if this should not be released, false otherwise.
     */
    isPersistent: functionThatReturnsTrue,
  });
  // 返回根据接口类型包装的合成事件构造器
  return SyntheticBaseEvent;
}
// 使用通过给工厂函数传入鼠标事件接口获取鼠标事件合成事件构造函数
export const SyntheticMouseEvent = createSyntheticEvent(MouseEventInterface);
```
### 事件触发
> 当页面上触发了特定的事件时，如点击事件 click，就会触发绑定在根元素上的事件回调函数，也就是之前绑定了参数的dispatchEvent，而dispatchEvent在内部最终会调用dispatchEventsForPlugins。

- dispatchEventsForPlugins
```
function dispatchEventsForPlugins(
  domEventName: DOMEventName, // dispatchEvent中绑定的事件名
  eventSystemFlags: EventSystemFlags, // dispatchEvent绑定的事件标记
  nativeEvent: AnyNativeEvent, // 事件触发时回调传入的原生事件对象
  targetInst: null | Fiber, // 事件触发目标元素对应的fiber
  targetContainer: EventTarget, // 绑定事件的根元素
): void {
  // 磨平浏览器差异，拿到真正的target
  const nativeEventTarget = getEventTarget(nativeEvent);
  // 要处理事件回调的队列
  const dispatchQueue: DispatchQueue = [];
  // 将fiber树上的回调收集
  extractEvents(
    dispatchQueue,
    domEventName,
    targetInst,
    nativeEvent,
    nativeEventTarget,
    eventSystemFlags,
    targetContainer,
  );
  // 根据收集到的回调及事件标记处理事件
  processDispatchQueue(dispatchQueue, eventSystemFlags);
}
```
- extractEvents 收集事件对应回调
  1. 回调的收集也是根据事件的类型分别处理的，将extractEvents的入参分别给各个事件处理插件的extractEvents进行分别处理。
  ```
  function extractEvents(
    dispatchQueue: DispatchQueue,
    domEventName: DOMEventName,
    targetInst: null | Fiber,
    nativeEvent: AnyNativeEvent,
    nativeEventTarget: null | EventTarget,
    eventSystemFlags: EventSystemFlags,
    targetContainer: EventTarget,
  ) {
    // 抽出简单事件
    SimpleEventPlugin.extractEvents(
      dispatchQueue,
      domEventName,
      targetInst,
      nativeEvent,
      nativeEventTarget,
      eventSystemFlags,
      targetContainer,
    );
    const shouldProcessPolyfillPlugins =
      (eventSystemFlags & SHOULD_NOT_PROCESS_POLYFILL_EVENT_PLUGINS) === 0;
    if (shouldProcessPolyfillPlugins) {
      EnterLeaveEventPlugin.extractEvents(
        dispatchQueue,
        domEventName,
        targetInst,
        nativeEvent,
        nativeEventTarget,
        eventSystemFlags,
        targetContainer,
      );
      ChangeEventPlugin.extractEvents(
        dispatchQueue,
        domEventName,
        targetInst,
        nativeEvent,
        nativeEventTarget,
        eventSystemFlags,
        targetContainer,
      );
      SelectEventPlugin.extractEvents(
        dispatchQueue,
        domEventName,
        targetInst,
        nativeEvent,
        nativeEventTarget,
        eventSystemFlags,
        targetContainer,
      );
      BeforeInputEventPlugin.extractEvents(
        dispatchQueue,
        domEventName,
        targetInst,
        nativeEvent,
        nativeEventTarget,
        eventSystemFlags,
        targetContainer,
      );
    }
  }
  ```
  2. 以SimpleEventPlugin.extractEvents为例查看如何收集事件回调
    - 根据原生事件名，得到对应的 React 事件名。
    - 根据原生事件名，判断需要使用的合成事件构造函数。
    - 根据绑定的事件标记得出事件是否捕获阶段。
    - 判断事件名是否为 scoll 且不是捕获阶段，如果是则只收集事件触发节点。
    - 从触发事件的 DOM 实例对应的 fiber 节点开始，向上遍历 fiber 树，判断遍历到的 fiber 是否宿主类型 fiber 节点，是的话判断在其 props 上是否存在 React 事件名同名属性，如果存在，则 push 到数组中，遍历结束即可收集由叶子节点到根节点的回调函数。
    - 如果收集的回调数组不为空，则实例化对应的合成事件，并与收集的回调函数一同收集到dispatchQueue中。
  ```
  // SimpleEventPlugin.js
  function extractEvents(
    dispatchQueue: DispatchQueue,
    domEventName: DOMEventName,
    targetInst: null | Fiber,
    nativeEvent: AnyNativeEvent,
    nativeEventTarget: null | EventTarget,
    eventSystemFlags: EventSystemFlags,
    targetContainer: EventTarget,
  ): void {
    // 根据原生事件名拿到React事件名
    const reactName = topLevelEventsToReactNames.get(domEventName);
    if (reactName === undefined) {
      // 如果是没对应的React事件就不处理
      return;
    }
    // 默认的合成事件构造函数，下面根据事件名重新赋值对应的合成事件构造函数
    let SyntheticEventCtor = SyntheticEvent;
    let reactEventType: string = domEventName;
    // 根据事件名获取对应的合成事件构造函数
    switch (domEventName) {
      case 'keypress':
      case 'keydown':
      case 'keyup':
        SyntheticEventCtor = SyntheticKeyboardEvent;
        break;
      case 'focusin':
        reactEventType = 'focus';
        SyntheticEventCtor = SyntheticFocusEvent;
        break;
      case 'focusout':
        reactEventType = 'blur';
        SyntheticEventCtor = SyntheticFocusEvent;
        break;
      case 'beforeblur':
      case 'afterblur':
        SyntheticEventCtor = SyntheticFocusEvent;
        break;
      case 'click':
        // Firefox creates a click event on right mouse clicks. This removes the
        // unwanted click events.
        if (nativeEvent.button === 2) {
          return;
        }
      /* falls through */
      case 'auxclick':
      case 'dblclick':
      case 'mousedown':
      case 'mousemove':
      case 'mouseup':
      // TODO: Disabled elements should not respond to mouse events
      /* falls through */
      case 'mouseout':
      case 'mouseover':
      case 'contextmenu':
        SyntheticEventCtor = SyntheticMouseEvent;
        break;
      // ...这里省略了很多case
      default:
        // Unknown event. This is used by createEventHandle.
        break;
    }
    // 判断是捕获阶段还是冒泡阶段
    const inCapturePhase = (eventSystemFlags & IS_CAPTURE_PHASE) !== 0;
    if (
      enableCreateEventHandleAPI &&
      eventSystemFlags & IS_EVENT_HANDLE_NON_MANAGED_NODE
    ) {
      // 这个分支不看
    } else {
      // Some events don't bubble in the browser.
      // In the past, React has always bubbled them, but this can be surprising.
      // We're going to try aligning closer to the browser behavior by not bubbling
      // them in React either. We'll start by not bubbling onScroll, and then expand.
      // 如果不是捕获阶段且事件名为scroll，则只处理触发事件的节点
      const accumulateTargetOnly =
        !inCapturePhase &&
        // TODO: ideally, we'd eventually add all events from
        // nonDelegatedEvents list in DOMPluginEventSystem.
        // Then we can remove this special list.
        // This is a breaking change that can wait until React 18.
        domEventName === 'scroll';
      // 在fiber树上收集事件名对应的props
      const listeners = accumulateSinglePhaseListeners(
        targetInst,
        reactName,
        nativeEvent.type,
        inCapturePhase,
        accumulateTargetOnly,
      );
      // 如果存在监听该事件props回调函数
      if (listeners.length > 0) {
        // Intentionally create event lazily.
        // 则构建一个react合成事件
        const event = new SyntheticEventCtor(
          reactName,
          reactEventType,
          null,
          nativeEvent,
          nativeEventTarget,
        );
        // 并收集到队列中
        dispatchQueue.push({event, listeners});
      }
    }
  }
  // 遍历fiber树的收集函数
  export function accumulateSinglePhaseListeners(
    targetFiber: Fiber | null,
    reactName: string | null,
    nativeEventType: string,
    inCapturePhase: boolean,
    accumulateTargetOnly: boolean,
  ): Array<DispatchListener> {
    const captureName = reactName !== null ? reactName + 'Capture' : null;
    const reactEventName = inCapturePhase ? captureName : reactName;
    const listeners: Array<DispatchListener> = [];

    let instance = targetFiber;
    let lastHostComponent = null;

    // Accumulate all instances and listeners via the target -> root path.
    while (instance !== null) {
      const {stateNode, tag} = instance;
      // Handle listeners that are on HostComponents (i.e. <div>)
      if (tag === HostComponent && stateNode !== null) {
        lastHostComponent = stateNode;
        // Standard React on* listeners, i.e. onClick or onClickCapture
        if (reactEventName !== null) {
          // 拿到DOM节点类型上对应事件名的props
          const listener = getListener(instance, reactEventName);
          if (listener != null) {
            // 如果这个同名props存在，则收集起来
            listeners.push(
              createDispatchListener(instance, listener, lastHostComponent),
            );
          }
        }
      }
      // If we are only accumulating events for the target, then we don't
      // continue to propagate through the React fiber tree to find other
      // listeners.
      // 对于只收集当前节点的事件，收集完当前节点就退出了
      if (accumulateTargetOnly) {
        break;
      }
      // 向上遍历
      instance = instance.return;
    }
    // 返回该事件名对应收集的监听器
    return listeners;
  }
  ```
- 处理回调
> 对于回调的处理，就是简单地根据收集到的回调数组，判断事件的触发是处于捕获阶段还是冒泡阶段来决定是顺序执行还是倒序执行回调数组。并且通过event.isPropagationStopped()来判断事件是否执行过event.stopPropagation()以决定是否继续执行。

```
// 分别处理事件队列
export function processDispatchQueue(
  dispatchQueue: DispatchQueue,
  eventSystemFlags: EventSystemFlags,
): void {
  const inCapturePhase = (eventSystemFlags & IS_CAPTURE_PHASE) !== 0;
  for (let i = 0; i < dispatchQueue.length; i++) {
    const {event, listeners} = dispatchQueue[i];
    processDispatchQueueItemsInOrder(event, listeners, inCapturePhase);
  }
}

// 根据事件是捕获阶段还是冒泡阶段，来决定是顺序执行还是倒序执行
// 并且如果事件被调用过event.stopPropagation则退出执行
function processDispatchQueueItemsInOrder(
  event: ReactSyntheticEvent,
  dispatchListeners: Array<DispatchListener>,
  inCapturePhase: boolean,
): void {
  let previousInstance;
  if (inCapturePhase) {
    // 捕获阶段逆序执行
    for (let i = dispatchListeners.length - 1; i >= 0; i--) {
      const {instance, currentTarget, listener} = dispatchListeners[i];
      if (instance !== previousInstance && event.isPropagationStopped()) {
        // 如果被阻止过传播，则退出
        return;
      }
      // 执行
      executeDispatch(event, listener, currentTarget);
      previousInstance = instance;
    }
  } else {
    for (let i = 0; i < dispatchListeners.length; i++) {
      const {instance, currentTarget, listener} = dispatchListeners[i];
      if (instance !== previousInstance && event.isPropagationStopped()) {
        return;
      }
      executeDispatch(event, listener, currentTarget);
      previousInstance = instance;
    }
  }
}

// 执行事件回调
function executeDispatch(
  event: ReactSyntheticEvent,
  listener: Function,
  currentTarget: EventTarget,
): void {
  const type = event.type || 'unknown-event';
  // 设置合成事件执行到当前DOM实例时的指向
  event.currentTarget = currentTarget;
  invokeGuardedCallbackAndCatchFirstError(type, listener, undefined, event);
  // 不在事件的回调中时拿不到currentTarget
  event.currentTarget = null;
}
```
### React17 与 React16 事件系统的差别
- 绑定位置，事件委托的节点从 React16 的 document 更改为 React17 的 React 树的根 DOM 容器。
> 如果页面中存在多个 React 应用，由于他们都会在顶层document注册事件处理器，如果你在一个 React 子应用的 React 事件中调用了e.stopPropagation()，无法阻止事件冒泡到外部树，因为真实的事件早已传播到document。而将事件委托在 React 应用的根 DOM 容器则可以避免这样的问题，减少了多个 React 应用并存可能产生的问题，并且事件系统的运行也更贴近现在浏览器的表现。

- 事件代理阶段
> 在 React16 中，对 document 的事件委托都委托在冒泡阶段，当事件冒泡到 document 之后触发绑定的回调函数，在回调函数中重新模拟一次 捕获-冒泡 的行为，所以 React 事件中的e.stopPropagation()无法阻止原生事件的捕获和冒泡，因为原生事件的捕获和冒泡已经执行完了。在 React17 中，对 React 应用根 DOM 容器的事件委托分别在捕获阶段和冒泡阶段。

  1. 当根容器接收到捕获事件时，先触发一次 React 事件的捕获阶段，然后再执行原生事件的捕获传播。所以 React 事件的捕获阶段调用e.stopPropagation()能阻止原生事件的传播。
  2. 当根容器接受到冒泡事件时，会触发一次 React 事件的冒泡阶段，此时原生事件的冒泡传播已经传播到根了，所以 React 事件的冒泡阶段调用e.stopPropagation()不能阻止原生事件向根容器的传播，但是能阻止根容器到页面顶层的传播。
- 去除事件池
- scroll 事件不再冒泡
> 在原生 scroll 里，scroll 是不存在冒泡阶段的，但是 React16 中模拟了 scroll 的冒泡阶段，React17 中将此特性去除，避免了当一个嵌套且可滚动的元素在其父元素触发事件时造成混乱。