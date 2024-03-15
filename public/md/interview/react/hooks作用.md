## hooks的作用
1. 函数组件中可以有状态和生命周期。
2. 更好的状态复用。可以把组件的状态逻辑抽离成自定义hooks，从而实现状态逻辑在不同组件之间复用。
3. 比class组件更易用，没有了class组件的this绑定问题。
4. 友好的渐进式，依然可以在项目里一边写class组件，一边写hooks组件，可以一点点深入使用。
### hooks的局限
1. hooks在使用层面有着严格的规则约束，不能写在判断语句中。
2. 函数组件给了我们一定程度的自由，却也对开发者的水平提出了更高的要求(闭包的问题)。
3. hooks还不能完整的为函数组件提供类组件的能力。
### hooks不能写在判断语句中
- hooks信息都会以链表的形式保存在current fiber的memoizedState中。
- 更新渲染时每次构建对应的是函数组件的workingProgress fiber时，都会从对应的current fiber中延续这个以链表结构存储的hooks信息。如果有hooks写在判断语句中那么就会破坏延续的顺序，所以hooks不能写在判断语句中。
### mixin(状态复用)
- mixins虽然提供了状态复用的能力，但弊端太多。
```
// 混入文件：name-mixin.js
export default {
  data() {
    return {
      name: genRandomName() // 假装它能生成随机的名字
    }
  },
  methods: {
    setName(name) {
      this.name = name
    }
  }
}

// 组件：my-component.vue
<template>
  <div>{{ name }}</div>
<template>
<script>
  import nameMixin from './name-mixin';
  export default {
    mixins: [nameMixin],
    // 通过mixins, 你可以直接获得 nameMixin 中所定义的状态、方法、生命周期中的事件等
    mounted() {
      setTimeout(() => {
        this.setName('Tom')
      }, 3000)
    }
  }
<script>
```
- 难以追溯的方法与属性
```
export default {
  mixins: [ a, b, c, d, e, f, g ], // 表示它混入了很多能力
  mounted() {
    console.log(this.name)
    // 这个 this.name 来自于谁？
  }
}
```
- 覆盖、同名问题
> 当同时混入mixin-a.js和mixin-b.js以同时获得它们能力的时候，当这两个mixin都定义了this.name作为属性时就会有问题

- 重复使用时，需要扩展代码无法像hooks一样定义别名。
### renderProps渲染属性
> 渲染属性指的是使用一个值为函数的props来传递需要动态渲染的节点或组件。

### 高阶组件
> 一个函数接受一个组件作为参数，经过一系列加工后，最后返回一个新的组件。

### hooks相对的好处
> 代码以及组件的嵌套层级不会很复杂。
