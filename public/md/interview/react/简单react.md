## [简单react (Fiber + Diff + Render)](https://mp.weixin.qq.com/s?__biz=MzIxMzExMjYwOQ==&mid=2651896816&idx=1&sn=cd685d3f4ab5b4b9375552f9980ef3ff&scene=21#wechat_redirect)
### Fiber 渲染过程
> 每个 fiber节点 都有一个链接指向它的第一个子节点、下一个兄弟节点和它的父节点。这种数据结构可以让我们更方便的查找下一个工作单元。

```
<div>
  <h1>
    <p />
    <a />
  </h1>
  <h2 />
</div>
```
1. 从 root 开始，找到第一个子节点 div。
2. 找到 div 的第一个子节点 h1。
3. 找到 h1 的第一个子节点 p。
4. 找 p 的第一个子节点，如无子节点，则找下一个兄弟节点，找到 p 的兄弟节点 a。
5. 找 a 的第一个子节点，如无子节点，也无兄弟节点，则找它的父节点的下一个兄弟节点，找到 a 的 父节点的兄弟节点 h2。
6. 找 h2 的第一个子节点，找不到，找兄弟节点，找不到，找父节点 div 的兄弟节点，也找不到，继续找 div 的父节点的兄弟节点，找到 root。
7. 第 6 步已经找到了 root 节点，渲染已全部完成。
### 渲染提交阶段
> 由于渲染过程被我们做了可中断的，那么中断的时候，不希望浏览器给用户展示的是渲染了一半的 UI，所以需要等整个渲染过程结束才插入元素。

1. 去除performUnitOfWork的appendChild的逻辑，待全部渲染结束才append。
2. 新增根节点变量，存储Fiber根节点。
3. 当所有Fiber工作完成时，nextUnitOfWork 为 undefined，这时再渲染真实 DOM。
4. 新增渲染真实DOM的逻辑，递归将 fiber tree 渲染为真实 DOM。
### code
```
<div id='container'></div>

// 创建html元素
function createElement (type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map(child => 
        typeof child === 'object'
        ? child 
        : createTextElement(child)
      )
    }
  }
}

// 创建text元素
function createTextElement (text) {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text,
      children: []
    }
  }
}

const isEvent = key => key.startsWith("on")
const isProperty = key => key !== "children" && !isEvent(key)
const isNew = (prev, next) => key => prev[key] !== next[key]
const isGone = (prev, next) => key => !(key in next)

let nextUnitOfWork = null // 下一个Fiber节点
let wipRoot = null // 根节点
let currentRoot = null // 更新前的节点数据
let deletions = null  // 删除的元素

// 创建dom
function createDom (fiber) {
  const dom = fiber.type === 'TEXT_ELEMENT'
    ? document.createTextNode("")
    : document.createElement(fiber.type)
  // 修改dom的属性
  updateDom(dom, {}, fiber.props)
  return dom
}

// 更新的dom属性修改
function updateDom(dom, prevProps, nextProps) {
  // 删除旧的或者有变化的事件(新的dom中不存在的事件或者新的dom事件绑定值修改的事件删除)
  // 事件绑定值修改的删除是因为下方绑定新的事件后，原来的事件还会继续监听，和普通属性的直接覆盖不同
  Object.keys(prevProps).filter(isEvent).filter(key =>
    !(key in nextProps) ||
    isNew(prevProps, nextProps)(key)
  ).forEach(name => {
    const eventType = name.toLowerCase().substring(2)
    dom.removeEventListener(eventType, prevProps[name])
  })

  // 添加新的事件监听(新的dom事件绑定值修改的和新的dom新添的事件绑定)
  Object.keys(nextProps).filter(isEvent).filter(isNew(prevProps, nextProps)).forEach(name => {
    const eventType = name.toLowerCase().substring(2)
    dom.addEventListener(eventType, nextProps[name])
  })

  // 删除旧的属性(新的dom中不存在的属性删除掉)
  Object.keys(prevProps).filter(isProperty).filter(isGone(prevProps, nextProps)).forEach(name => {
    dom[name] = ""
  })

  // 添加新的属性(新的dom属性值修改的和新的dom新添的属性)
  Object.keys(nextProps).filter(isProperty).filter(isNew(prevProps, nextProps)).forEach(name => {
    dom[name] = nextProps[name]
  })
}

// 递归生成真实DOM
function commitWork (fiber) {
  if (!fiber) return
  const domParent = fiber.parent.dom
  if (
    fiber.effectTag === "PLACEMENT" &&
    fiber.dom != null
  ) {
    // 新的元素
    domParent.appendChild(fiber.dom)
  } else if (fiber.effectTag === "DELETION") {
    // 删除的元素
    domParent.removeChild(fiber.dom)
  } else if (fiber.effectTag === 'UPDATE' && fiber.dom !== null) {
    // 有更新的元素
    updateDom(fiber.dom, fiber.alternate.props, fiber.props)
  }  
  commitWork(fiber.child)
  commitWork(fiber.sibling)
}

// 渲染真实DOM
function commitRoot () {
  deletions.forEach(commitWork)
  commitWork(wipRoot.child)
  // 正在应用的节点修改，下次再渲染时进行比较
  currentRoot = wipRoot
  wipRoot = null
}

// 处理当前Fiber节点，并返回下一个要处理的Fiber节点
function performUnitOfWork(fiber) {
  if (!fiber.dom) {
    fiber.dom = createDom(fiber)
  }

  const elements = fiber.props.children
  reconcileChildren(fiber, elements)

  if (fiber.child) {
    return fiber.child
  }
  let nextFiber = fiber
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling
    }
    nextFiber = nextFiber.parent
  }
}

// Fiber节点的diff 
function reconcileChildren (wipFiber, elements) {
  let index = 0
  let oldFiber = wipFiber.alternate && wipFiber.alternate.child
  let prevSibling = null

  while (index < elements.length || oldFiber != null) {
    const element = elements[index]
    let newFiber = null

    const sameType = oldFiber && element && element.type == oldFiber.type
      
    if (sameType) {
      // 存在oldFiber的同节点类型 (更新)
      newFiber = {
        type: oldFiber.type,
        props: element.props,
        dom: oldFiber.dom,
        parent: wipFiber,
        alternate: oldFiber,
        effectTag: "UPDATE",
      }
    }

    // 没有oldFiber或者新旧节点的类型不同 (新建)
    if (element && !sameType) {
      newFiber = {
        type: element.type,
        props: element.props,
        dom: null,
        parent: wipFiber,
        alternate: null,
        effectTag: "PLACEMENT",
      }
    }

    // 有oldFiber但是类型不同 (删除)
    if (oldFiber && !sameType) {
      oldFiber.effectTag = "DELETION"
      deletions.push(oldFiber)
    }    

    if (oldFiber) {
      // 新节点循环比较的下一个节点是旧节点的兄弟节点
      oldFiber = oldFiber.sibling
    }

    if (index === 0) {
      wipFiber.child = newFiber
    } else if (element) {
      prevSibling.sibling = newFiber
    }

    prevSibling = newFiber
    index++
  }
}

// Fiber 渲染机制
function workLoop (deadline) {
  let shouldYield = false
  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork)
    shouldYield = deadline.timeRemaining() < 1
  }
  if (!nextUnitOfWork && wipRoot) {
    commitRoot()
  }
  requestIdleCallback(workLoop)
}
requestIdleCallback(workLoop)

// render函数
function render (element, container) {
  wipRoot = {
    dom: container,
    props: {
      children: [element]
    },
    alternate: currentRoot // 存储更新前dom结构
  }
  deletions = [] // 存储删除的dom
  nextUnitOfWork = wipRoot
}

const container = document.getElementById("container")
// 更新之后改变虚拟 DOM 结构
const updateValue = e => {
  const newData = Array.from(e.target.value || []).map(item => ({
    "type": "div",
    "props": {
      "children": [
        {
          "type": "TEXT_ELEMENT",
          "props": {
            "nodeValue": item,
            "children": []
          }
        },
      ]
    }
  }))
  element.props.children = [
    {
      "type": "input",
      "props": {
        "value": e.target.value,
        "children": [],
        "onInput": updateValue,
      }
    },
    {
      "type": "h2",
      "props": {
        "children": [
          {
            "type": "TEXT_ELEMENT",
            "props": {
              "nodeValue": `Hello ${e.target.value}`,
              "children": []
            }
          },
        ]
      }
    },
    ...newData,
  ]
  render(element, container)
}

// 模拟 jsx 的虚拟 DOM 结构
const element = {
  "type": "div",
  "props": {
    "children": [
      {
        "type": "input",
        "props": {
          "value": "",
          "children": [],
          "onInput": updateValue,
        }
      },
      {
        "type": "h2",
        "props": {
          "children": [
            {
              "type": "TEXT_ELEMENT",
              "props": {
                "nodeValue": "Hello",
                "children": []
              }
            },
          ]
        }
      }
    ]
  }
}
render(element, container)
```

