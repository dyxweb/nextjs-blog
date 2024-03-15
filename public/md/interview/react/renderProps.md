## renderProps
- 组件Props的key为render，值为一个函数。
- renderProps是组件用来确定渲染什么内容的Props，renderProps的函数会返回渲染的结果，从而使得该组件的内容得到动态渲染。
```
// 定义renderProps，作用是为了更好地复用Mouse组件
<Mouse render={mouse => <Cat mouse={mouse} />} />

// 在Mouse组件中传入一个值，会根据传入的值动态渲染renderProps的内容
{this.props.render(this.state)}
```
### renderProps优点
- render函数可以通过参数拿到组件内部状态、方法、任意数据。在方法内也可调用当前组件的状态、方法、props等任何数据。
- 可以进行组件的复用，把组件无关的视图渲染逻辑抽象出来，交给用户自己定义。