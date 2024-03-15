## [reactApi](https://juejin.cn/post/6950063294270930980)
### 组件类
#### Component
- 类组件的基础。
#### PureComponent
- PureComponent会对类组件的State和Props进行浅比较，只有当State和Props发生变化时组件才会重新渲染。
#### memo
- React.memo会对函数组件的Props进行浅比较，只有当Props发生变化时组件才会重新渲染。支持第二个参数传入一个函数，如果组件需要更新就返回false，不需要更新就返回true。和shouldComponentUpdate正好相反。
#### forwardRef
- 想要获取深层次组件(例如孙组件)的dom元素
- 高阶组件，使用ref拿到原始组件的实例
#### lazy + Suspense
- 构建异步渲染组件，两者要配合使用，不支持服务端渲染，服务端渲染可以使用loadable。实现代码分割，动态加载。
- React.lazy接受一个函数，这个函数需要动态调用import()。它必须返回一个Promise，该Promise需要resolve一个default export的React组件。
- Suspense让组件“等待”某个异步操作，直到该异步操作结束即可渲染，等待加载lazy组件时做UI层面的优雅降级(如loading显示等)。
```
import React, { Suspense } from 'react';

const OtherComponent = React.lazy(() => import('./OtherComponent'));

function MyComponent() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <OtherComponent />
      </Suspense>
    </div>
  );
}
```
#### Fragment
- react不允许一个组件返回多个节点元素，使用Fragment元素包裹不会增加新的DOM节点。
- 相较于<></>形式Fragment可以支持key、ref属性。
- map遍历后的元素，react底层会处理，默认在外部嵌套一个Fragment元素
#### Profiler
- 用于开发阶段性能检测，检测一次react组件渲染用时性能开销。
- 第一个参数是id，用于表识唯一性的，第二个参数是onRender回调函数，用于渲染完成，接受渲染参数。
#### StrictMode
- 严格模式，用于检测react项目中的潜在的问题，严格模式检查仅在开发模式下运行，不会影响生产构建。
- 识别不安全的生命周期。
- 关于使用过时的字符串ref API的警告。
- 关于使用废弃的findDOMNode方法的警告。
- 检测使用过时的Context API。
- 检测意外的副作用。
### 工具类
#### createElement
- JSX最终会被babel用createElement编译成React元素形式。
- 第一个参数如果是组件类型传入组件，如果是dom元素类型传入元素类型的字符串。
- 第二个参数为一个对象，在dom类型中为属性，在组件类型中为Props。
- 其他参数为children，根据顺序排列。
#### cloneElement
- cloneElement的作用是以element元素为样板克隆并返回新的React元素。返回新的React元素可以在原基础上添加新的属性。
#### createContext
- createContext用于创建一个Context对象，createContext对象中包括用于传递Context对象值value的Provider，和接受value变化订阅的Consumer。
#### createFactory
- 返回用于生成指定类型React元素的函数，api将要被废弃，如果想要达到同样的效果，可以使用createElement。
#### createRef
- createRef可以创建一个ref元素。
#### isValidElement
- 可以用来检测是否为React element元素，接受待验证对象，返回true或者false。
#### React.Children提供了用于处理this.props.children不透明数据结构的实用方法
- 当children的元素的数据结构使用数组的map等方法不是很适用时，就要使用react.Chidren的方法来处理。
- Children.map 遍历并返回新的数组
- Children.forEach 仅遍历
- Children.count 获取children中的组件总数量
- Children.toArray 返回children扁平化后的结果
- Children.only 验证children是否只有一个子节点，如果有则返回它，否则此方法会抛出错误。Children.only不接受Children.map的返回值，因为它是一个数组而并不是React元素
### react-dom
#### render
- 用于渲染react元素
#### hydrate
- 服务端渲染使用的方法，用法同render
#### createPortal
- createPortal可以把当前组件或element元素的子节点，渲染到组件之外的其他地方。例如弹窗组件。
#### unstable_batchedUpdates
- 正常情况下react的state更新会批量更新state减少渲染次数，当在异步函数或原生事件中使用不再有此效果，想要依然实现批量更新的效果可以使用unstable_batchedUpdates方法。
```
handerClick = () => {
  Promise.resolve().then(() => {
    ReactDOM.unstable_batchedUpdates(() => {
      this.setState({ number: this.state.number + 1 });
      console.log(this.state.number);
      this.setState({ number: this.state.number + 1 });
      console.log(this.state.number);
      this.setState({ number: this.state.number + 1 });
      console.log(this.state.number);
    }) 
  })
}

```
#### flushSync
- 可以将更新任务放在一个较高的优先级。
```
// 打印 0 3 4 1  因为3设定了一个高优先级的更新，所以3先被打印，2 4被批量更新为4，最后打印1(setTimeout在下一轮的宏任务中执行)
class Home extends React.Component {
  state = { number: 0 }

  handerClick = () => {
    setTimeout(() => {
      this.setState({ number: 1  })
    })
    this.setState({ number: 2  })
    ReactDOM.flushSync(() => {
      this.setState({ number: 3  })
    })
    this.setState({ number: 4  })
  }

  render() {
    const { number } = this.state
    console.log(number)
    return (
      <div>
        <div>{ number }</div>
        <button onClick={this.handerClick} >测试flushSync</button>
      </div>
    )
  }
}
```
#### findDOMNode
- 用于访问组件DOM元素节点，推荐使用ref获取。
#### unmountComponentAtNode
- 从DOM中卸载组件，会将其事件处理器和state一并清除。
- 如果指定容器上没有对应已挂载的组件，这个函数什么也不会做。如果组件被移除将会返回true，如果没有组件可被移除将会返回false。 