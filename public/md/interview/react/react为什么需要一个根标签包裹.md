## react为什么需要一个根标签包裹
### react能创建多个根元素
- react的组件渲染的不是根元素，只有ReactDOM.render、React.createRoot才会创建根元素。
- 在应用内可以多次使用ReactDOM.render，所以react能创建多个根元素。
```
ReactDOM.render(<App />, document.getElementById('root'));
ReactDOM.render(<App1 />, document.getElementById('root1'));
```
- 很多组件库的toast、modal其实都用到创建多个根元素的技术。
### react根元素能渲染多个组件
- 使用数组包裹多个组件
```
ReactDOM.render(
  [<App />, <App1 />],
  document.getElementById('root')
);
```
- 使用Fragment包裹多个组件
```
ReactDOM.render(
  <Fragment>
    <App />
    <App1 />
  </Fragment>,
  document.getElementById('root')
);
```
### react组件能渲染多个元素
- 组件的返回值使用JSX的方式是可以返回多个element的。
- 使用数组包裹多个element
```
const App = () => {
  return ([
    <div>Hello</div>,
    <div>World</div>
  ]);
};
```
- 使用Fragment包裹多个element
```
const App = () => {
  return (
    <Fragment>
      <div>Hello</div>
      <div>World</div>
    </Fragment>
  );
};
```
- 不能使用如下写法
  1. 因为JSX最后会被编译为React.createElement(...)的表达式。
  2. 一个函数不能返回多个表达式，可以通过数组或Fragment包裹的方式将多个表达式包裹成一个表达式。
```
const App = () => {
  return (
    <div>Hello</div>
    <div>World</div>
  );
};
```
