### vue
> vue的注释在不同的模块(html,css,js)中应用当前模块的注释方法，template中也是有唯一的子元素,自定义组件的名字不能同原生html同名

**脚手架搭建项目**
- npm install -g vue-cli
- vue init webpack 项目名

**vue的组件引入**
```
// TranslateForm.vue
export default {
  name: 'translateForm',
  //相当于一个全局 ID；可以不写,写了可以提供更好的调试信息(详见官方文档)
}

//b.vue
<template>
    <translateForm v-on:formSubmit="translateText"></translateForm>
</template>

<script>

import TranslateForm from './components/TranslateForm'

export default {
  name: 'app',
  components: {
    TranslateForm //此是对象那个解构的写法
    // aa(在template使用，html不区分大小写,这里使用大写，template中使用小写可以，这里使用小写，template中使用大写不可以,可以写成translate-form形式) : TranslateForm(import过来的值)
  },
}
</script>
```
**style scoped**
> 样式只用于当前组件，使用样式直接class即可，使用less或scss等`<style lang="scss">直接可以使用预编译语言的规则</style>`同react需要webpack的配置

**data定义**
> data中即使没有值也要返回一个空的对象。data的变化会触发视图变化，只有实例被创建前存在的属性才是响应式的，如果添加一个新的属性不会触发视图的变化，可以先设置一些初始值。或使用this.$set()。使用Object.freeze()会阻止修改现有属性，也不会响应式变化。

```
export default {
  name: 'app',
  data:function(){ // data(){} es6写法
    return{
      student:{
        name:"dyx",
        sex:"man",
      }
    }
},// 使用函数定义return对象的形式，data在template中使用作为内容{{}}，其它如作为属性值直接写即可，作为函数的实参传入时也是直接写即可，在方法中this.a即可
}
```
**$set()**
> vue直接给student对象赋值操作，（ this.student.age = 24）虽然可以新增属性，但是不会触发视图更新,处理这种情况，我们可以使用$set()方法，既可以新增属性,又可以触发视图更新.正确写法：this.$set(this.data,”key”,value’)  this.$set(this.student,"age", 24); 错误写法：this.$set(key,value)（ps: 可能是vue1.0的写法）this.$set(this.student.age, 24)

**事件对象以及传参**
```
<div @paste="pasteText($event,123)"></div>
//粘贴事件
pasteText (e,a) {
        e.preventDefault()
        alert(a)
        this.addTag(text)
    }
```
**事件触发的组合**
```
@keyup.alt.67="function"   // Alt + C
@click.ctrl="function"     // Ctrl + Click
```

- **slot为插槽作用类似于react的this.props.children**
```
<alert-box>something</alert-box>
Vue.component('alert-box', {
  template: `<div>
    <div>title</div>
    <slot></slot>
  </div>`
})
```
- **`<div v-bind:class="{active:isactive}"></div>` active这个class存在与否取决于data中isactive的布尔值**
- **行内样式`<div v-bind:style="{ width: health + '%' }"></div>  <div v-bind:style="{ color:'red' }"></div>`health是data内的值，在vue中html的属性值使用data或method都是直接使用''的形式**
- **在template中使用boolean值的时候在data中定义visible为boolean类型的值然后在template中visible=visible或visible='visible'都可以**
- **不要在实例属性或者回调函数中使用箭头函数。因为箭头函数绑定父上下文，所以 this 不会像预想的一样是 Vue 实例**
- **data以及method和computed等在html的属性中都是写在""之间**
```
// updateStatus为method， todoCompletedNum为computed， todolist为data可以在""中使用.length的写法
<footer-status v-on:updateStatus="updateStatus"  v-bind:length="todolist.length" v-bind:completeNum="todoCompletedNum" />
```
**使用css预处理语言**
> 要先安装对应依赖

- scss  npm install node-sass sass-loader vue-style-loader
```
<style lang="scss"></style>
```

**key的使用**
> 如果不加key切换loginType将不会清除用户已经输入的内容。因为两个模板使用了相同的元素不会被替换掉，仅仅是替换了它的 placeholder`。所以Vue提供了一种方式来表达这两个元素是完全独立的，不要复用它们。添加一个具有唯一值的 key 属性即可。列表数据修改的时候,他会根据key值去判断某个值是否修改,如果修改,则重新渲染这一项,否则复用之前的元素;（因为Virtual DOM 使用Diff算法实现的原因）。

```
<template v-if="loginType === 'username'">
 <label>Username</label>
 <input placeholder="Enter your username" key="username-input">
</template>
<template v-else>
 <label>Email</label>
 <input placeholder="Enter your email address" key="email-input">
</template>
```


