## class组件的super
- 在JS中，super引用的是父类构造函数。在React中引用的是React.Component。
- JS强制在构造函数中先调用super()才能使用this。这一限制也被应用到了React组件。
- 我们可以在class组件中省略构造函数，使用实例属性形式定义state。
- 在class组件中一旦写了constructor就要写super()，只有写了super()才会有自己的this，否则后续使用的时候会报错。
### super(props)
- 调用super()时没有传入props参数，依然能够在render和其它方法中访问this.props，这是因为React在调用构造函数之后，会把props赋值给刚刚创建的实例对象。
- super()中传递props才能在constructor中使用this.props。如上述React在调用构造函数之后才给实例设置props，所以super()中不传递props不能在constructor中使用this.props。