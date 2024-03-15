## ref
### string ref
> 这种方式已经被React官方废弃。

### callback ref
> ref属性传递函数时，会在commit阶段创建真实DOM时执行ref指定的函数，并将元素作为第一个参数传入，此时我们就可以利用它进行赋值以获取DOM元素或组件实例。

### object ref
> 常用的方式，使用createRef或者useRef创建Ref对象，并将其传给标签的ref属性即可，这种方式获取到的ref需要先调用current属性才能获取到对应的DOM元素或组件实例。

- createRef
> 不能在函数组件中使用createRef，因为每次函数组件渲染都是一次新的函数执行，每次执行createRef得到的都是一个新的对象，无法保留其原来的引用。

```
export function createRef(): RefObject {
  const refObject = {
    current: null,
  }
  return refObject;
}
```
- useRef
> 函数组件中使用useRef创建Ref对象，React会将useRef和函数组件对应的fiber对象关联，将useRef创建的ref对象挂载到对应的fiber对象上，每次函数组件执行，只要函数组件不被销毁，那么对应的fiber对象实例也会一直存在，所以ref也能够被保留下来。