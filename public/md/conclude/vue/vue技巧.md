## vue skill
> (https://www.toutiao.com/i6577947269104927245/)[https://www.toutiao.com/i6577947269104927245/]

- 化繁为简的Watch
> 组件创建的时候我们获取一次列表，同时监听input框，每当发生变化的时候重新获取一次筛选后的列表

```
// 优化前
created(){
    this.fetch()
},
watch:{
  serachInput(){
      this.fetch()
  }
}
//优化后
watch:{
  serachInput:{
      handler:'fetch',
      immediate:true,
  }
}
```
- router key
> 使用Vue-router来实现路由的控制。需求是从/post-page/a，跳转到/post-page/b。由于两个路由共用一个组件所以我们发现，页面跳转后数据竟然没更新？原因是vue-router"智能地"发现这是同一个组件，然后它就决定要复用这个组件，所以你在created函数里写的方法压根就没执行。通常的解决方案是监听$route的变化来初始化数据。

```
//给router-view添加一个unique的key，这样即使是公用组件，只要url变化了，就一定会重新创建这个组件。（虽然损失了一丢丢性能，但避免了无限的bug）。将key直接设置为路由的完整路径。
 <router-view :key="$route.fullpath"></router-view>

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
- 自定义组件添加click等事件不生效,使用.native修饰符.
```
<template>
   <el-progress type="circle" :percentage=“0" @click.native=“stopProgress”></el-progress> // 自定义组件
</template>
<script>
    export default {
        methods:{
            stopProgress() { 
               console.log('停止')
            }
        }
    }
</script>
```
- vue使用高德地图[https://www.toutiao.com/i6608264415714214414/](https://www.toutiao.com/i6608264415714214414/)
