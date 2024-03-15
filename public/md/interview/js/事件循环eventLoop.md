## [事件循环(eventLoop)](https://juejin.cn/post/6969028296893792286)
> JS是单线程的，执行顺序是从上到下执行。事件循环是目前浏览器和NodeJS处理JavaScript代码的一种机制。JS的顺序执行会存在一些问题，比如当一个语句需要执行很长时间的话，如请求数据、定时器、读取文件等，后面的语句就得一直等着前面的语句执行结束后才会开始执行。所以JS将所有执行任务分为了同步任务和异步任务。每个任务都是在做两件事情，就是发起调用和得到结果。

### JS是单线程的原因
> 假设JS同时有两个线程，一个是操作A节点，一个是删除A节点，这时候浏览器就不知道要以哪个线程为准了。因此为了避免这类型的问题，JS从一开始就是单线程的语言。

### 调用栈(执行栈)
> 在JavaScript运行的时候，主线程会形成一个栈，这个栈被称为调用栈或者执行栈。具有后进先出的特性。调用栈内存放的是代码执行期间的所有执行上下文。(浏览器报错的调用栈是从下向上执行的)。

- 每调用一个函数，解释器就会把该函数的执行上下文添加到调用栈并开始执行。
- 正在调用栈中执行的函数，如果还调用了其他函数，那么新函数也会被添加到调用栈，并立即执行。
- 当前函数执行完毕后，解释器会将其执行上下文清除调用栈，继续执行剩余执行上下文中的剩余代码。
- 当分配的调用栈空间被占满，会引发“堆栈溢出”的报错。
### 同步任务
> 同步任务发起调用后，很快就可以得到结果。同步任务的执行会按照代码顺序调用，进入调用栈中并执行，执行结束后从调用栈移除。

### 异步任务
> 异步任务是无法立即得到结果，比如请求接口、定时器。异步任务的执行，首先它依旧会进入调用栈中，然后发起调用，然后解释器会将其回调任务放入一个任务队列，紧接着调用栈会将这个任务移除。当主线程清空后，即所有同步任务结束后(也就是setTimeout时间有延误的原因，当同步任务十分耗时的时候，setTimeout并不能及时执行)，解释器会读取任务队列，并依次将已完成的异步任务加入调用栈中并执行。

### 异步任务回调进入任务队列
> 异步任务回调进入任务队列，其实会利用到浏览器的其他线程。虽然说JavaScript是单线程语言，但是浏览器不是单线程的。而不同的线程就会对不同的事件进行处理，当对应事件可以执行的时候，对应线程就会将其放入任务队列。

- js引擎线程：用于解释执行js代码、用户输入、网络请求等。
- GUI渲染线程：绘制用户界面，与JS主线程互斥（因为js可以操作DOM，进而会影响到GUI的渲染结果）。
- http异步网络请求线程：处理用户的get、post等请求，等返回结果后将回调函数推入到任务队列。
- 定时触发器线程：setInterval、setTimeout等待时间结束后，会把执行函数推入任务队列中。
- 浏览器事件处理线程：将click、mouse等UI交互事件发生后，将要执行的回调函数放入到任务队列中。
```
// 后者的定时器会先被推进宏任务队列，而前者会在之后再被推入宏任务队列
setTimeout(() => {
  console.log('a');
}, 10000);

setTimeout(() => {
  console.log('b');
}, 100);
```
### 宏任务和微任务
> 在任务队列中，其实还分为宏任务队列和微任务队列，对应的里面存放的就是宏任务和微任务。

- macro-task(宏任务)：包括整体js代码script，setTimeout，setInterval，setImmediate，MessageChannel，I/O 操作，UI 渲染。
- micro-task(微任务)：Promise的then方法，process.nextTick，MutationObserver。
#### script（整体代码块）是宏任务
> 如果同时存在两个script代码块，会首先执行第一个script代码块中的同步代码，如果这个过程中创建了微任务并进入了微任务队列，第一个script同步代码执行完之后，会首先去清空微任务队列，再去开启第二个script代码块的执行。所以就可以理解script（整体代码块）是宏任务。

#### [Promise.then微任务的注册和执行过程](https://juejin.cn/post/6844903987183894535)
1. .then的执行顺序是先注册的先执行, .then的注册微任务队列和执行是分离的, .then对应的同步代码执行完之后则开始注册.then。
2. .then的链式调用的注册时机是依赖前一个.then的执行完成的, 而非链式的调用的注册时机则是同步注册。
### 事件循环流程
1. 从宏任务队列中，按照入队顺序，找到第一个执行的宏任务，放入调用栈，开始执行。
2. 执行完该宏任务下所有同步任务后，即调用栈清空后，该宏任务被推出宏任务队列，然后微任务队列开始按照入队顺序，依次执行其中的微任务，直至微任务队列清空为止。
3. 当微任务队列清空后，一个事件循环结束。
4. 接着从宏任务队列中，找到下一个执行的宏任务，开始第二次事件循环，直至宏任务队列清空为止。
### 事件循环注意点
- 第一次执行的时候，解释器会将整体代码script放入宏任务队列中，因此事件循环是从script这个宏任务开始的。
- 一次事件循环中，宏任务永远在微任务之前执行。完成一个宏任务后，执行余下的所有微任务。
- 微任务按放入队列的顺序执行，先放入的先执行，如果在执行微任务的过程中，产生新的微任务添加到微任务队列中，也需要一起清空；微任务队列没清空之前，是不会执行下一个宏任务的。
### 页面渲染响应
- 当一次事件循环结束后，即一个宏任务执行完成后以及微任务队列被清空后，浏览器就会进行一次页面更新渲染。

```
<body>
  <div id="demo"></div>
</body>
<script>
  // innerText时并不会直接更新渲染当promise的then执行完alert('开始渲染！')，一次事件循环结束才会更新渲染。
  const demoEl = document.getElementById('demo');
  console.log('a');
  setTimeout(() => {
    alert('渲染完成！')
    console.log('b');
  }, 0)
  new Promise(resolve => {
    console.log('c');
    resolve()
  }).then(() => {
    console.log('d');
    alert('开始渲染！')
  })
  console.log('e');
  demoEl.innerText = 'Hello World!';
</script>
```
- 页面不再响应
```
// 一直在执行微任务
function foo() {
 return Promise.resolve().then(foo);
};
```
### promise.then + setTimeout
- 第一轮事件循环执行script宏任务。
  - setTimeout会作为第二轮的宏任务执行。
  - 打印promise，promise的then方法会作为第一轮的微任务执行。
  - 打印console。
  - 执行第一轮的微任务打印then。
- 执行第二轮的宏任务打印setTimeout。
```
setTimeout(() => {
  console.log('setTimeout');
}, 0);
new Promise(resolve => {
  console.log('promise');
  resolve('dyx');
}).then(res => {
  console.log('then');
})

console.log('console');

// 执行结果
- promise
- console
- then
- setTimeout
```
- 第一轮事件循环执行script宏任务。
  - promise的then方法作为第一轮的微任务执行。
  - setTimeout1会作为第二轮事件循环的宏任务。
  - 然后执行第一轮的微任务打印promise1，然后将setTimeout2作为第三轮事件循环的宏任务（每一次事件循环只能执行一个宏任务）。
- 执行第二轮的宏任务，打印setTimeout1。
  - 此时将promise2作为第二轮的微任务执行，所以打印promise2。
- 然后执行第三轮宏任务打印setTimeout2。

```
Promise.resolve().then(() => {
  console.log('promise1');
  setTimeout(() => {
    console.log('setTimeout2');
  }, 0);
})
setTimeout(() => {
  console.log('setTimeout1');
  Promise.resolve().then(() => {
    console.log('promise2');
  });
}, 0);

// 执行结果
- promise1
- setTimeout1
- promise2
- setTimeout2
```
- 第一次事件循环
  - 1
  - 6
  - 8
  - 10
  - 7 // 微任务
- 第二次事件循环
  - 2
  - 3
  - 5
  - 4 // 微任务
- 第三次事件循环
  - 9
```
console.log(1);

setTimeout(() => {
  console.log(2);
  new Promise(resolve => {
    console.log(3);
    resolve(4);
    console.log(5);
  }).then(res => {
    console.log(res);
  });
}, 0);

new Promise(resolve => {
  console.log(6);
  resolve(7);
  console.log(8);
}).then(res => {
  console.log(res);
});

setTimeout(() => {
  console.log(9);
}, 0);
console.log(10);
```
### [async函数执行](https://juejin.cn/post/7194744938276323384)
#### async函数返回值
- async函数在抛出返回值时，会根据返回值类型开启不同数目的微任务。
  - return结果值：非thenable、非promise（不等待）。
  - return结果值：thenable（等待 1个then的时间）。
  - return结果值：promise（等待 2个then的时间）。
- await右值类型区别
  - 接非thenable类型，会立即向微任务队列添加一个微任务then，但不需等待。
  - 接thenable类型，需要等待一个then的时间之后执行。
  - 接Promise类型(有确定的返回值)，会立即向微任务队列添加一个微任务then，但不需等待。（TC39对await后面是promise的情况如何处理进行了一次修改，移除了额外的两个微任务，在早期版本，依然会等待两个then的时间）。
#### 例子
- 类型一
```
const test = () => {
 console.log("test");
 return "testFunReturn";
}
const testAsync = async() => {
 console.log("testAsync");
 return Promise.resolve("testAsyncFunReturn");
}

const run = async() => {
 console.log("run");
 const result1 = await test();
 console.log(result1);
 const result2 = await testAsync();
 console.log(result2);
 console.log(result1, result2);
}
run();
const promise = new Promise(resolve => {
  console.log("promise");
  resolve("promise end");
})
promise.then(res => console.log(res));
console.log("end")

// 执行结果
- run
- test
- promise
- end
- testFunReturn
- testAsync
- promise end
- testAsyncFunReturn
- testFunReturn, testAsyncFunReturn
```
- 类型2
```
// 将test方法加async
const test = async() => {
 console.log("test");
 return "testFunReturn";
}
const testAsync = async() => {
 console.log("testAsync");
 return Promise.resolve("testAsyncFunReturn");
}

const run = async() => {
 console.log("run");
 const result1 = await test();
 console.log(result1);
 const result2 = await testAsync();
 console.log(result2);
 console.log(result1, result2);
}
run();
const promise = new Promise(resolve => {
  console.log("promise");
  resolve("promise end");
})
promise.then(res=> console.log(res));
console.log("end")

// 执行结果
- run
- test
- promise
- end
- promise end
- testFunReturn
- testAsync
- testAsyncFunReturn
- testFunReturn, testAsyncFunReturn
```
- 类型3
```
const asyncTestOne = async() => {
  console.log('asyncOne start')
  await asyncTestTwo()
  console.log('asyncOne end')
}

const asyncTestTwo = async() => {
  console.log('asyncTwo start')
}

console.log('start');

setTimeout(() => {
  console.log('setTimeout') 
}, 0)

asyncTestOne();

new Promise(resolve => {
  console.log('promise')
  resolve('promiseResult');
}).then((res) => {
  console.log(res)
})

console.log('end')

// 执行结果
- start
- asyncOne start
- asyncTwo start
- promise
- end
- promiseResult
- asyncOne end
- setTimeout
```
### node和浏览器的事件循环差异
- 浏览器环境下，微任务会在宏任务之后执行。而在Node.js中，微任务会在事件循环的各个阶段之间执行，也就是一个阶段执行完毕，就会去执行微任务队列的任务。
- node端的setTimeout/setInterval的宏任务有多个时会一次执行完所有的宏任务，然后再去执行微任务，并不会一次事件循环只执行一个宏任务。
```
console.log('start');

setTimeout(() => {
  console.log('timer1');
  Promise.resolve().then(function() {
    console.log('promise1');
  })
}, 0);

setTimeout(() => {
  console.log('timer2');
  Promise.resolve().then(function() {
    console.log('promise2');
  })
}, 0);

Promise.resolve().then(function() {
  console.log('promise3');
})
console.log('end');

// node端执行结果
1. start
2. end
3. promise3
4. timer1
5. timer2
6. promise1
7. promise2

// 浏览器端执行结果
1. start
2. end
3. promise3
4. timer1
5. promise1
6. timer2
7. promise2
```


