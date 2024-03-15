## [react服务端渲染](https://juejin.cn/post/6844903881390964744)
### node不支持import语法，不能直接使用jsx需要babel支持，添加babel配置以及使用babel-node server/index.js启动node服务。
### 同构
> 使用react-dom/server下的renderToString方法生成react组件的html字符串。但renderToString并没有做事件相关的处理，因此返回给浏览器的内容不会有事件绑定。

- 同构就是一套React代码在服务器上运行一遍，到达浏览器又运行一遍。服务端渲染完成页面结构，浏览器端渲染完成事件绑定。
- 浏览器端的事件绑定的方式就是让浏览器去拉取JS文件执行，让JS代码来控制事件的绑定。初始的页面html结构由服务端生成并返回，后续的事件操作交互等交给常规打包完成的js实现。
- 服务端返回的html字符串时将打包的js文件引入，诸如图像、CSS 文件和JavaScript文件之类的静态文件，可使用Express中的express.static内置中间件函数。就可以将public目录下的图片、CSS 文件、JavaScript文件对外开放访问了。
### 加入路由
- 加上路由之后，服务端渲染无法正确匹配路由，服务端响应的路径改为 * 匹配所有路径，使用StaticRouter将路由逻辑在服务端执行一遍。
### redux
- redux也需要服务端和客户端分别执行一次，分别使用provider包裹，需要注意store的使用，在服务端单例的使用可能导致多个用户使用一个store，需要每一次引用store时分别创建store。
- 客户端和服务端的store会存在不同步的情况，服务端返回html字符串时在window上挂载服务端的store中的state值，客户端的store中的state值默认使用服务端挂载的值。
### css
- 使用isomorphic-style-loader包获取css。