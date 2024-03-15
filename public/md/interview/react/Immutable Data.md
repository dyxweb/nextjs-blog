## Immutable Data
### JavaScript中的对象是可变的
- JavaScript中的对象一般是可变的(Mutable)，因为使用了引用赋值，新的对象简单的引用了原始对象，改变新的对象将影响到原始对象。
- 引用赋值可以节约内存，但当应用复杂后这就造成了非常大的隐患，Mutable带来的优点变得得不偿失。
- 为了解决Mutable带来的隐患，一般的做法是使用shallowCopy(浅拷贝)或deepCopy(深拷贝)来避免原始对象被修改，但这样做造成了CPU和内存的浪费。
- Immutable Data可以很好的解决JavaScript中对象是可变带来的问题。
### Immutable Data
- Immutable Data是一种一旦创建就不能再被更改的数据，对Immutable Data的任何修改或添加删除操作都会返回一个新的Immutable Data。
- 主要原理是采用Persistent Data Structure(持久化数据结构)，当每次修改后我们都会得到一个新的版本，且旧版本可以完好保留。
- 使用旧数据创建新数据时可以保证旧数据同时可用且不变。同时为了避免deepCopy把所有节点都复制一遍带来的性能损耗，Immutable Data使用了Structural Sharing(结构共享)，对于本次操作没有修改的部分会直接共享避免内存浪费。
- Immutable Data内部采用是多叉树的结构，凡是有节点被改变，那么它和与它相关的所有上级节点都更新，并且更新后返回了一个全新的引用，即使是浅比对也能感知到数据的改变。
### Immutable Data优点
- 降低复杂度，避免副作用
```
// 如果不查看fn的代码是不能确定打印的结果的，因为不确定它对data做了什么。但如果data是Immutable Data的，是可以确定打印的结果是value。
function andLog(fn) {
  let data = { key: 'value' };
  fn(data);
  console.log(data.key);
}
```
- 节省内存，Immutable Data采用了结构共享机制，所以会尽量复用内存。
```
// a和b共享了没有变化的info节点
import { produce } from 'immer';
const a = {
  name: 'dyx',
  info: { age: 26 }
}
const b = produce(a, draft => {
  draft.name = 'douyaxing';
});

a === b; // false
a.info === b.info; // true
```
- 方便回溯，Immutable Data每次修改都会创建一个新对象，那么变更的记录就能够被保存下来，应用的状态变得可控、可追溯，方便撤销和重做功能的实现。
### react强调使用Immutable Data
- React中组件重新渲染是判断state或props是否变化，而React中对state或props是否变化的判断是浅比较shallowCompare，如果直接修改引用类型数据的属性值，那么该引用类型数据的引用地址没有改变所以浅比较判断未发生改变，组件也就不会实时更新。
### 在react中使用Immutable Data的好处
- 修改引用类型数据，当属性值没有变化时不会生成新的引用，组件不会重新渲染，减少不必要的渲染。
- 判断组件是否要更新时，对于引用类型数据比较不再需要深比较，提升性能。
- 操作引用类型数据，不需要再浅拷贝或者深拷贝，提升性能。
- 操作引用类型数据，简化修改引用类型数据的写法，尤其层次比价深的情况。
### PureComponent(React.memo)进行浅比较
- 当引用类型数据的属性值变化，但是引用没有变化时，浅比较无法识别变化，导致不更新。
- 当引用类型数据的属性值没有变化，但是引用变化时，浅比较会识别出变化，导致多余更新。
### shouldComponentUpdate中进行深比较
- 把引用类型数据的所有属性和值进行递归比较，当引用类型数据层次比较复杂时比较浪费性能。
### Immutable Data + PureComponent(React.memo)浅比较
- 使用Immutable Data凡是有节点被改变，那么它和与它相关的所有上级节点都更新，并且更新后返回了一个全新的引用，即使是浅比对也能感知到数据的改变。
### 使用immer减少因为引用类型数据的引用变化但是数据值没有变化造成的重复render
- 每一次触发change方法组件都会重新render，因为每一次触发change方法即使age没有变化也都生成了一个新的对象。
```
const [data, setData] = useState({
  name: 'dyx',
  info: { age: 26 }
});
const change = () => {
  const newData = {...data, info: {...data.info, age: 27}};
  setData(newData);
}
```
- 使用immer后只有age变化时才会生成新的对象，组件才会重新render。
```
import produce from 'immer';

const [data, setData] = useState({
  name: 'dyx',
  info: { age: 26 }
});
const change = () => {
  const newData = produce(data, draft => {
    draft.info.age = 27;
  });
  setData(newData);
}
```
### 在shouldComponentUpdate中判断组件是否需要更新不再需要deepCompare，只需要使用===判断即可，相较于deepCompare可以极大提高性能。
```
shouldComponentUpdate(nextProps = {}, nextState = {}) {
  const thisProps = this.props || {}, thisState = this.state || {};

  if (Object.keys(thisProps).length !== Object.keys(nextProps).length ||
    Object.keys(thisState).length !== Object.keys(nextState).length
  ) {
    return true;
  }

  for (const key in nextProps) {
    if (thisProps[key] !== nextProps[key]) {
      return true;
    }
  }

  for (const key in nextState) {
    if (thisState[key] !== nextState[key]) {
      return true;
    }
  }
  return false;
}
```