## Generator和协程
### Generator迭代器
> ES6 新引入了 Generator 函数，可以通过 yield 关键字，把函数的执行流挂起，通过next()方法可以切换到下一个状态，为改变执行流程提供了可能，从而为异步编程提供解决方案。

```
function* myGenerator() {
  yield '1';
  yield '2';
  return '3';
}

const gen = myGenerator();  // 获取迭代器
gen.next()  // { value: "1", done: false }
gen.next()  // { value: "2", done: false }
gen.next()  // { value: "3", done: true }
```
- 可以通过给next()传参, 让yield具有返回值
```
function* myGenerator() {
  console.log(yield '1');  // test1
  console.log(yield '2');  // test2
  console.log(yield '3');  // test3
}

const gen = myGenerator(); // 获取迭代器
gen.next()
gen.next('test1')
gen.next('test2')
gen.next('test3')
```
### 协程
> 生成器实现机制，协程是一种比线程更加轻量级的存在，协程处在线程的环境中，一个线程可以存在多个协程，可以将协程理解为线程中的一个个任务。不像进程和线程，协程并不受操作系统的管理，而是被具体的应用程序代码所控制。一个线程一次只能执行一个协程。比如当前执行 A 协程，另外还有一个 B 协程，如果想要执行 B 的任务，就必须在 A 协程中将 JS 线程的控制权转交给 B协程，那么现在 B 执行，A 就相当于处于暂停的状态。

### 示例
> A 将执行权交给 B，也就是 A 启动 B，我们也称 A 是 B 的父协程。因此 B 当中最后return 100其实是将 100 传给了父协程。对于协程来说，它并不受操作系统的控制，完全由用户自定义切换。

```
function* A() {
  console.log("我是A");
  yield B(); // A停住，在这里转交线程执行权给B
  console.log("结束了");
}
function B() {
  console.log("我是B");
  return 100;// 返回，并且将线程执行权还给A
}
let gen = A();
gen.next();
gen.next();

// 我是A
// 我是B
// 结束了
```