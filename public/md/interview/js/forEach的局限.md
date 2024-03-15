## forEach的局限
- 不支持处理异步函数
> 因为forEach内部调用传入的callback时是同步调用的，没有做任何异步(await)的处理。

- 除了抛出异常以外，没有办法中止或跳出forEach循环。
- index不可被重置，在forEach中我们无法控制index的值，它只会无脑的自增直至大于数组的length跳出循环。
- forEach性能比for循环低，for循环没有额外的函数调用栈和上下文，所以它的实现最为简单。