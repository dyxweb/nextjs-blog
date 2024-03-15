## vue指令
> 指令简写 v-bind的缩写为: ，v-on的缩写为@(@click='jump'),v-bind用于html属性的绑定如href，class，src等

**v-on**
> v-on可以监听多个方法，但是若是同一种事件类型的方法会报错;事件绑定使用v-on，且事件名如click不用大写，且事件直接写v-on:click='a'，不用写{{}}，有事件修饰符，按键修饰符和鼠标修饰符，需要传递参数时v-on:click='a(1)',在script中(如生命周期)的写法为this.a();v-on的事件名也可以根据data的值动态来获取，缩写为@。

```
// eventName是data的值可以动态变化
<a v-on:[eventName]="change">123</a>
<input type="text" :value="name" @focus="onFocus" @blur="onBlur" />
```
**v-model的双向绑定**
```
// 用于表单组件
<input 
  v-model="text" 
  @keyup.enter="addTag(text)" 
  @keydown.delete="delTag(source.length - 1, true)">
```
**v-if v-show**
> v-if有较高的切换消耗，当只有一次切换显示隐藏时应该使用v-if，控制该DOM是否存在。v-show有更高的初始渲染消耗(纯css  dispaly实现)，经常切换显示隐藏使用v-show节省性能。其后可以跟表达式v-if="age<16";v-if：根据表达式的值的真假条件渲染元素。在切换时元素及它的数据绑定 / 组件被销毁并重建。v-if 是惰性的：如果在初始渲染时条件为假，则什么也不做。直到条件第一次变为真时，才会开始渲染条件块。v-show：根据表达式之真假值，v-show不管初始条件是什么，元素总是会被渲染，只是简单的切换元素的 display CSS 属性。

```
<p v-if="seen">显示</p>
<p v-show="seen">显示</p>
```

**v-for**
> 基于一个数组或者对象渲染一个列表，vue 2.0以上必须需配合 key值 使用。key 的作用是为了在 diff 算法执行时更快的找到对应的节点，提高 diff 速度。

```
// 应该加上key同react提升性能
<div v-for="(value,index) in arr" v-bind:key="index">{{index}}:{{value}}</div>
```
**v-bind**
> 动态地绑定一个或多个特性，html的原生属性需要使用v-bind来绑定，bind的属性值也可以根据data的值动态来获取。或一个组件 prop 到表达式;缩写为:

```
<a v-bind:href="url">123</a>
// attributeName是data的值可以动态变化
<a v-bind:[attributeName]="url">123</a>
<span v-bind:title="message">
 鼠标悬停查看此处动态绑定的提示信息
</span>
```
**v-text**
> 用来渲染页面数据，但是只能用来渲染字符串

```
<div v-text="message"></div>
```
**v-html**
> 用于直接渲染html代码,{{}}会将数据解释成普通文本。

```
<div v-html="message"></div>
```
**v-once**
> 执行一次性地插值，当数据改变时，插值处的内容不会更新。

```
<span v-once>This will never change: {{ msg }}</span>
```

**自定义指令**
> Vue.directive来实现

```
// 自定义防抖
<template>
  <div>
    <input
      type="text"
      v-model="text"
      v-debounce="search"
    >
  </div>
</template>
<script>
  export default {
    name: 'debounce',
    data () {
      return {
        msg: 'Welcome to Your Vue.js App',
        text: '',
        count: 1
      }
    },
    directives: {
      debounce: {
        inserted: function (el, binding) {
          let timer
          el.addEventListener('keyup', () => {
            if (timer) {
             clearTimeout(timer)
            }
            timer = setTimeout(() => {
              binding.value()
            }, 300)
          })
        }
      }
    },
    methods: {
      search () {
        // 实际要进行的操作 axios.get('')之类的
        this.count++
        console.log('count is:' + this.count)
      }
    }
  }
</script>
```