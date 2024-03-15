## vue-router[https://www.toutiao.com/i6594552886611411470/](https://www.toutiao.com/i6594552886611411470/)
**路由实现**
- Hash 路由(带#号)
```
// hash 改变时，并会触发相应的 hashchange 事件,在事件的回调中处理
window.addEventListener('hashchange', function () {
 console.log('render');
});
```
- History 路由
> HTML5 规范中提供了 history.pushState 和 history.replaceState 来进行路由控制。通过这两个方法，可以实现改变 url 且不向服务器发送请求。同时不会像 hash 有一个 # ，更加的美观。但是 History 路由需要服务器的支持，并且需将所有的路由重定向到根页面。

**基本嵌套路由**
> 在父级路由中一定要有`<router-view></router-view>`否则子路由不会显示

```
// 配置路由参数
import Vue from 'vue'
import VueRouter from 'vue-router';
import Translate from './translate'
// import A from './a'
import B from './b'
import User from './user'
import Tags from './tags'

Vue.use(VueRouter)

const routes = [
  { path: '/translate', component: Translate,meta: {title: 'translate'} },
  { path: '/tags', component: Tags,
    children:[
      {path:'a',component:require("./a")},
      {path:'b',component:B},
    ],
     meta: {title: 'tags'}  
  },
  { path:"/user/:id", component: User },
  { path: '*',  redirect: '/translate'} //路由重定向
]

const router = new VueRouter({
	routes
})
export default router

// 把路由注入到根实例中，启动路由 main.js
import Vue from 'vue'
import VueResource from 'vue-resource'
import App from './App'
import router from './route/router.js'
import store from './vuex/store.js'

Vue.use(VueResource)
Vue.config.productionTip = false

router.beforeEach((to, from, next) => {
  /* 路由发生变化修改页面title */
  if (to.meta.title) {
  document.title = to.meta.title;
  }
  next();
})

new Vue({
  el: '#app',
  template: '<App/>',
  components: { App },
  router,
  store
})

// template模板中使用，嵌套路由也是在父组件中这样使用
<template>
<div id="app">
  <h1>Hello App!</h1>
  <p>
    <router-link to="/translate">Translate</router-link>
    <router-link to="/tags">Tags</router-link>
  </p>
  <router-view></router-view>
</div>
</template>
```
**vueRouter中用 redirect 来定义重定向。**
> 在router的配置中{path: '*',  redirect: '/translate'} 打开页面默认跳转到的路由，以及跳转到没有配置路由的页面，这个不会走两次router.beforeEach。

**动态路由**
> 由于两个路由共用一个组件所以我们发现，页面跳转后数据竟然没更新？原因是vue-router"智能地"发现这是同一个组件，然后它就决定要复用这个组件，所以你在created函数里写的方法压根就没执行。通常的解决方案是监听$route的变化来初始化数据。或者给router-view添加一个unique的key，这样即使是公用组件，只要url变化了，就一定会重新创建这个组件。（虽然损失了一丢丢性能，但避免了无限的bug）。将key直接设置为路由的完整路径。`<router-view :key="$route.fullpath"></router-view>`

```
{ path:"/user/:id", component: user }
<router-link to="/user/123">User123</router-link>
<router-link to="/user/456">User456</router-link>

// 获取动态部分
<template>
<div>
<h1>User</h1>
<div>我是user组件, 动态部分是{{dynamicSegment}}</div>
</div>
</template>
<script>
export default {
  computed: {
    dynamicSegment () {
      return this.$route.params.id
    }
  }
}
</ script>

// 就是动态路由在来回切换时，由于它们都是指向同一组件，vue不会销毁再创建这个组件，而是复用这个组件，就是当第一次点击（如：user123）的时候，vue 把对应的组件渲染出来，但在user123, user456点击来回切换的时候，这个组件就不会发生变化了，组件的生命周期不管用了。

<script>
export default {
    data () {
      return {
        dynamicSegment: ''
      }
    },

    watch: {
      $route (to,from){
        // to表示的是你要去的那个组件，from 表示的是你从哪个组件过来的，它们是两个对象，你可以把它打印出来，它们也有一个param 属性
        console.log(to);
        console.log(from);
        this.dynamicSegment = to.params.id
      }
    }
}
</script>

// 在组件内部监听路由变化执行对应的方法
watch:{
  "$route":function(to,from){
  //from 对象中包含当前地址
  //to 对象中包含目标地址
  /还有一个next参数的这个参数是控制路由是否跳转的
  //如果没写，可以不用写next()来代表允许路由跳转，如果写了就必须写next(),否则路由是不会生效的。
  }
}
```

**编程式导航(点击事件触发路由跳转)**
> 当们把router 注入到根实例中后，组件中通过 this.$router 可以获取到router, 所以在组件中使用 this.$router.push("translate") 路径不加/时在当前路径的最后一个/后面添加，加/是绝对路径直接跳转到相应路径。

```
methods: {
  goback() { //向后跳转一页
      this.$router.go(-1)
  },
  forwards() { //向前跳转一页
      this.$router.go(1)
  },
  goto () { //跳转任一页
      this.$router.push("/about")
  }
}

```

**路由变化切换title**
```
// 路由配置中meta的title设置
const routes = [
  { path: '/translate', component: Translate,meta: {title: 'translate'} },
  { path: '/tags', component: Tags,
    children:[
      {path:'a',component:require("./a")},
      {path:'b',component:B},
    ],
     meta: {title: 'tags'}  
  },
  { path:"/user/:id", component: User },
  {path: '/',  redirect: '/translate'} //路由重定向
]

const router = new VueRouter({
	routes
})

router.beforeEach((to, from, next) => {
  /* 路由发生变化修改页面title */
  if (to.meta.title) {
    document.title = to.meta.title;
  }
  next();
 })
export default router
```
**router的模式有两种history与hash**
```
const router = new VueRouter({
  routes,
  mode:'history'  // 没有#号
})
```
**后置钩子**
```
router.afterEach(transition => {
   // code
});
```
**前置钩子**
```
router.beforeEach((to, from, next) => {
  // code
})
```
