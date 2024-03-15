## JSX
- 只要使用了JSX就需要引用React(React17版本之前)，因为JSX本质就是React.createElement。
- JSX只是为React.createElement方法提供的语法糖，所有的JSX代码最后都会转换成React.createElement(...)，最后再转化成常规的JS对象，Babel帮助我们完成了这个转换的过程。
- 在编译时会判断JSX中组件的首字母，当首字母为小写时，其被认定为原生DOM标签，React.createElement的第一个变量被编译为字符串。当首字母为大写时，其被认定为自定义组件，React.createElement的第一个变量被编译为对象。
- React.createElement函数对key和ref等特殊的props进行处理，并获取defaultProps对默认props进行赋值，并且对传入的子节点进行处理，最终构造成一个ReactElement对象(虚拟DOM)。
- ReactDOM.render将生成好的虚拟DOM渲染到指定容器上，最终转换为真实DOM。
### JSX转换为React.createElement
```
// 实际开发中使用JSX来创建虚拟dom
const element = (
  <div id='foo'>
    <a>bar</a>
    <b></b>
  </div>
)

// 使用React.createElement创建虚拟dom
const element = React.createElement(
  "div", 
  { id: "foo" },
  React.createElement("a", null, "bar"),
  React.createElement("b", null)
);
```
### JSX转换成真实DOM的过程
- JSX代码编写，使用JSX语法编写React组件的界面结构。JSX允许使用类似HTML的标记来描述UI层次结构。
```
const element = <div>Hello, React!</div>;
```
- Babel转换，JSX语法并不是浏览器原生支持的，所以需要使用工具将JSX代码转换为浏览器可识别的JavaScript代码。通常会使用Babel这样的工具来进行转换。
```
const element = React.createElement("div", null, "Hello, React!");
```
- 创建虚拟DOM，在转换后的JavaScript代码中，React.createElement函数会创建一个称为虚拟DOM的JavaScript对象。虚拟DOM是React内部用来表示界面结构的一种轻量级表示形式。
- 虚拟DOM对比，当状态发生变化导致界面需要更新时，React会使用虚拟DOM来比较前后两次状态的差异。这个过程被称为协调。
- 生成真实DOM更新，通过协调过程React能够计算出哪些部分的DOM需要被更新。然后针对实际需要更新的部分生成一系列真实DOM操作，然后将其应用于浏览器的真实DOM上。React会尽量最小化真实DOM操作的次数，以提高性能。
### JSX与JS的区别
- JS可以被打包工具直接编译不需要额外转换，JSX需要通过babel编译，它是React.createElement的语法糖，使用JSX等价于使用React.createElement。
- JSX是JS的语法扩展，允许在html中写JS。JS是原生写法，需要通过script标签引入。
### Fragment
- Fragment碎片概念，能够让一个组件返回多个元素，React.Fragment等价于空标签。
- React.Fragment实际上是没有节点的，会被编译为React.createElement(React.Fragment, null, "")这样的形式。
- Fragment允许有key，而空标签无法添加key。
### React中元素和组件的区别
- react组件有类组件、函数组件。
- react元素是通过JSX创建的。
### 由于JSX提前要被Babel编译，所以JSX是不能在运行时动态选择类型的
```
// 错误
function App(props) {
  return <components[props.type] data={props.data} />;
}

// 正确
function App(props) {
  const CurrenCom = components[props.type];
  return <CurrenCom data={props.data} />;
}
```
