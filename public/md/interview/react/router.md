## react-router
### router中路由切换window的滚动条位置会被记录
### 路由组件渲染使用render和children的差异
- 使用children无论是否匹配都会渲染，使用render只有匹配上才会渲染。
### react路由跳转携带参数
- 使用params，会体现在url上，刷新数据不会丢失
```
{ path: '/detail/:id/:name', component: Detail },

// 取值
this.props.match.params.id
```
- 使用query，不会体现在url上，刷新数据会丢失
```
history.push({ pathname: '', query: { flag: true } })

// 取值
this.props.location.query.flag
```
- 使用state，不会体现在url上，刷新数据会丢失
```
history.push({ pathname: '', state: { flag: true} })

// 取值
this.props.location.state.flag
```
- search传参，直接在pathname上拼接search，会体现在url上，刷新数据不会丢失
```
history.push({ pathname:'/settings/userinfos/mobile', search: '?from=user' })
history.push("/settings/userinfos/mobile?from=user")

// 取值
this.props.location.search
```
### react-router-dom的抛错
- Invalid prop `component` of type `object` supplied to `Route`, expected `function`
```
// 使用这样会报错
<Route exact path="/upload" component={UploadFile} />

// 修改如下不会报错
<Route exact path="/upload" render={(props) => <UploadFile {...props} />} />
```
- Switch直接写元素会有warning提示
### react路由切换动画
- react-router-transition
- 当使用类似整体路由模块的时候切换匹配到模块中的某一个时没有动画，因为匹配到的整体路由组件一直在挂载中，所以切换路由，没有办法捕获到组件切换的时机所以没有动画。
```
import { AnimatedSwitch } from 'react-router-transition';

<Router>
  <AnimatedSwitch
    atEnter={{ opacity: 0 }}
    atLeave={{ opacity: 0 }}
    atActive={{ opacity: 1 }}
    className="switch-wrapper"
  >
    <Route exact path="/" component={Home} />
    <Route path="/about/" component={About} />
    <Route path="/etc/" component={Etc} />
  </AnimatedSwitch>
</Router>
```
### react异步加载路由上线后报loading chunk fail的解决
```
componentDidCatch(error, info) {
  if (String(error).includes('Loading chunk')) {
    window.location.reload();
  }
}
```