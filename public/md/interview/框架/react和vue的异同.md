## react和vue的异同
### 相同点
- 都提倡组件化。
- 都使用虚拟DOM高效的更新视图。
- 都实现了数据驱动视图。
- 都使用diff算法，也都对diff算法进行了优化。
- 都有router库实现url到组件的映射。
- 都有状态管理。
### 组件化
- 组件是独立和可复用的代码组织单元，它使开发者使用小型、独立和通常可复用的组件构建大型应用。
- 能大幅提高应用开发效率、测试性、复用性、维护性，降低整个系统的耦合度。
- 调试方便，根据报错的组件快速定位问题，之所以能够快速定位，是因为每个组件之间低耦合，职责单一，所以逻辑会比分析整个系统要简单。
- 提高可维护性，由于每个组件的职责单一，并且组件在系统中是被复用的，所以对代码进行优化可获得系统的整体升级。
### 组件化相同点
- react和vue都推崇组件化，通过将页面拆分成一个一个小的可复用单元来提高代码的复用率和开发效率。
- 在开发时react和vue有相同的套路，比如都有父子组件传参，都有数据状态管理，都有前端路由等。
### 组件化差异
- React推荐的做法是JSX + inline style, 也就是把 HTML 和 CSS 全都写进 JavaScript 中，即 all in js。
- Vue 推荐的做法是 template 的单文件组件格式,即 html,css,JS 写在同一个文件(vue也支持JSX写法)。
### 虚拟DOM
- 虚拟dom是一个js对象，存储在内存之中。
- 虚拟dom能够描述真实dom（存在一个对应关系）。
- 当数据变化的时候，生成新的DOM，对比新旧虚拟DOM的差异，将差异更新到真实DOM上。
### 虚拟DOM相同点
- Vue与React都使用了虚拟DOM + Diff算法，不管是Vue的Template模板 + options api写法， 还是React的Class或者Function写法，最后都是生成render函数，而render函数执行返回VNode(虚拟DOM的数据结构，本质上是棵树)。
- 当每一次UI更新时，总会根据render重新生成最新的VNode，然后跟以前缓存起来老的VNode进行比对，再使用Diff算法（框架核心）去真正更新真实DOM（虚拟DOM是JS对象结构，同样在JS引擎中，而真实DOM在浏览器渲染引擎中，所以操作虚拟DOM比操作真实DOM开销要小的多）。
![虚拟DOM](./img/%E8%99%9A%E6%8B%9FDOM.jpg)
### 虚拟DOM差异
- react会自顶向下全diff。vue会跟踪每一个组件的依赖关系，不需要重新渲染整个组件树。
- 在react中当状态发生改变时，组件树就会自顶向下的全diff，重新render页面，重新生成新的虚拟dom tree, 新旧dom tree进行比较，进行patch打补丁方式，局部更新dom。所以react为了避免父组件更新而引起不必要的子组件更新，可以在shouldComponentUpdate做逻辑判断，减少没必要的render，以及重新生成虚拟dom做差量对比的过程。
- 在vue中通过Object.defineProperty把data属性全部转为getter/setter。同时watcher实例对象会在组件渲染时，将属性记录为dep, 当dep项中的setter被调用时，通知watch重新计算，使得关联组件更新。
### Diff算法
- 在处理老节点部分，都需要把节点处理 key - value 的 Map 数据结构，方便在往后的比对中可以快速通过节点的 key 取到对应的节点。
- 同样在比对两个新老节点是否相同时，key 是否相同也是非常重要的判断标准。所以不同是 React, 还是 Vue，在写动态列表的时候，都需要设置一个唯一值 key，这样在 diff 算法处理的时候性能才最大化。
### Diff算法的相同点
- tag不同认为是不同节点。
- 只比较同一层级，不跨级比较。
- 同一层级的节点用key唯一标识，tag和key都相同则认为是同一节点。
- Diff算法借助元素的 Key 判断元素是新增、删除、修改，从而减少不必要的元素重渲染。
### Diff算法的差异
- vue对比节点时当节点元素相同，但是classname不同，认为是不同类型的元素，删除重建，而react认为是同类型节点，只是修改节点属性。
- vue的列表对比，采用的是两端到中间比对的方式，而react采用的是从左到右依次对比的方式。当一个集合只是把最后一个节点移到了第一个，react会把前面的节点依次移动，而vue只会把最后一个节点移到第一个。
### 数据驱动视图
> 数据变化的时候，相应的视图会得到更新。开发者只需要关注数据的变化而不用再去手动的操作DOM。

### vue中的数据驱动视图
> Vuejs的数据驱动是通过MVVM这种框架来实现的。MVVM框架主要包含3个部分:model、view和 viewModel。Model:指的是数据部分，对应到前端就是javascript对象；View:指的是视图部分，对应前端就是dom；ViewModel:就是连接视图与数据的中间件。

- ViewModel是实现数据驱动视图的核心，当数据变化的时候，ViewModel能够监听到这种变化，并及时的通知view做出修改。同样的，当页面有事件触发时，ViewModel也能够监听到事件，并通知model进行响应。ViewModel就相当于一个观察者，监控着双方的动作，并及时通知对方进行相应的操作。
- vuejs在实例化的过程中，会对遍历传给实例化对象选项中的data 选项，遍历其所有属性并使用 Object.defineProperty 把这些属性全部转为 getter/setter。
同时每一个实例对象都有一个watcher实例对象，他会在模板编译的过程中，用getter去访问data的属性，watcher此时就会把用到的data属性记为依赖，这样就建立了视图与数据之间的联系。
- 当之后我们渲染视图的数据依赖发生改变（即数据的setter被调用）的时候，watcher会对比前后两个的数值是否发生变化，然后确定是否通知视图进行重新渲染。这样就实现了所谓的数据对于视图的驱动。
### react的数据驱动视图
> React通过setState实现数据驱动视图，通过setState来引发一次组件的更新过程从而实现页面的重新渲染(除非shouldComponentUpdate返回false)。pending：当前所有等待更新的state队列；isBatchingUpdates：React中用于标识当前是否处理批量更新状态，默认false；dirtyComponent：当前所有待更新state的组件队列。

- setState()首先将接收的第一个参数state存储在pending队列中。（state）
- 判断当前React是否处于批量更新状态，是的话就将需要更新state的组件添加到dirtyComponents中。（组件）
- 不是的话，它会遍历dirtyComponents的所有组件，调用updateComponent方法更新每个dirty组件。（开启批量更新事务）
### 响应式原理的差异
> react和vue都是通过修改数据来改变dom的显示，react需要调用setState方法，而vue直接修改变量就行，看似是api不同其实是响应式的原理不同。

- 在react中，组件的状态是不能被修改的，setState没有修改原来那块内存中的变量，而是去新开辟一块内存；而vue则是直接修改保存状态的那块原始内存。
- react中，调用setState方法后，会自顶向下重新渲染组件，自顶向下的含义是，该组件以及它的子组件全部需要渲染；而vue使用Object.defineProperty（vue@3迁移到了Proxy）对数据的设置（setter）和获取（getter）做了劫持，也就是说，vue能准确知道视图模版中哪一块用到了这个数据，并且在这个数据修改时，告诉这个视图，你需要重新渲染了。所以当一个数据改变，react的组件渲染是很消耗性能的——父组件的状态更新了，所有的子组件得跟着一起渲染，它不能像vue一样，精确到使用当前修改数据的组件粒度。
