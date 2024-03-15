**vuex [https://segmentfault.com/a/1190000009404727](https://segmentfault.com/a/1190000009404727)** 
> 使用vuex,安装依赖npm install vuex --save,输出store对于小型应用可以将所用内容写在一起，大型应用可以使用modules的形式对应不同UI组件进行管理，最后在main.js中引入store即可,store中有四个部分，state,mutations,actions,getters。state是可以根据modules形式来区分,mutations,actions,getters不会根据module来区分

1. state代表组件中的数据，在组件中使用$store.state.a，如果为modules形式则为$store.state.hello.a.
2. mutations是对state进行操作的纯函数，在组件中通过事件触发使用$store.commit('mins',2),可以传递参数，mutations 中的方法是不分组件的 , 会执行所有文件的mins的mutations，且不建议进行异步操作。在此改变状态可以直接state.a=[...state.a,params],也可以state.a.splice(params,0)// 改变原数组state.a
3. actions当需要执行多个 mutations时使用actions，在组件中通过事件触发使用action时$store.dispatch('add_show',3),可以传递参数，actions 中的方法是不分组件的 , 会执行所有文件的add_show的action，建议将异步操作写在action中。
4. getters 和 vue 中的 computed 类似，都是用来计算 state 然后生成新的数据 ( 状态 ) 的。在组件中使用$store.getters.not_show。
5. mutations和actions的名字可以相同，因为触发的方式不同，两个的名字可以为变量。
```
[a](state,params){} // mutations的使用
[a]({commit},params){commit()}或[a](context,params){context.commit()}  // actions的使用
```
**example**
```
// hello.js
export default{
    state:{
        number:0,
        show:false
    },
    mutations:{
        add(state,params){//这里的state对应着上面这个state
            state.number =state.number+=params ;
            //可以在这里执行其他的操作改变state
        },
        show(state,params){
            state.show =state.show=true ;
        }
    },
    actions:{
        add_show(context,params){//这里的context和我们使用的$store拥有相同的对象和方法
            context.commit('add',params);
            context.commit('show');
            //可以在这里触发其他的mutations方法
        },
    },
    getters:{
        show(state){//这里的state对应着上面这个state
            return !state.show;
        }
    },

}

// store.js
import Vue from 'vue'
import vuex from 'vuex'
Vue.use(vuex);

import hello_store from './hello';//引入某个store对象

// modules的形式，state根据module来区分。actions、mutations不能根据modules区分
export default new vuex.Store({
    modules: {
        hello: hello_store
    } 
})

// 非modules的形式
export default new vuex.Store(hello_store)

// UI组件使用
<h1>{{$store.state.hello.number}}</h1>
<button @click="$store.dispatch('add_show',3)">+</button>
<button @click="$store.commit('show')">显示</button>
<div v-if="$store.state.hello.show">aksaks</div>
<div>{{$store.getters.show}}</div>
```
**mapState, mapGetters, mapActions, mapMutations**
> 使用$store.state.dialog.show 、$store.dispatch('switch_dialog') 这种写法又长又臭 , 很不方便，使用mapState, mapGetters, mapActions, mapMutations可以得到改善。

1. 在UI组件中import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'。
2. mapState, mapGetters写在computed中，mapActions, mapMutations写在methods中。
3. mapState, mapGetters, mapActions, mapMutations映射到组件中的值直接使用即可
```
<template>
  <div id="app">
    <div  v-bind:style="{ color: 'red' }">{{number}}</div>
    <div @click="add(3)">add</div>
    <div @click="addAndshow(3)">addandshow</div>
    <div>{{notshow}}</div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
export default {
  name: 'vuex',
  data:function(){
    return{
        
    }
  },
  components: {

  },
  methods:{
    ...mapMutations({
      add:'add',
    }),
    ...mapActions({
      addAndshow:'add_show',
      // addAndshow:'add_show' 前面的为在UI组件中使用的名字，后面为在store中对应的名字
    })
  },

  computed: {
    ...mapState({
      show:state=>state.hello.show,
      number:state=>state.hello.number
    }),
    ...mapGetters({
      notshow:'show',
    }),
  }
}
</script>
```
**输出store也可以额外输出getters**
> 方便一些常用状态的使用

```
const getters = {
  role: state => state.login.role,
};

const store = new Vuex.Store({
  modules: {
    login,
  },
  getters
});

// main.js的使用
store.getters.role
```