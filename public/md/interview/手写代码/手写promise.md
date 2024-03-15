## [手写Promise](https://juejin.cn/post/6945319439772434469)
### 基本功能
1. Promise是一个类，在执行这个类的时候会传入一个执行器，这个执行器会立即执行，执行器会传入内部的resolve和reject方法供调用的时候使用。
```
class MyPromise {
  constructor(executor){
    // 立即执行并传入resolve和reject方法
    executor(this.resolve, this.reject);
  }

  // 用箭头函数就可以让this指向当前实例对象
  // 更改成功后的状态
  resolve = () => {}

  // 更改失败后的状态
  reject = () => {}
}
```
2. Promise会有三种状态Pending 等待, Fulfilled 完成, Rejected 失败，状态只能由 Pending --> Fulfilled 或者 Pending --> Rejected，且一但发生改变便不可二次修改。
3. Promise中使用resolve和reject两个函数来更改状态。
```
// 先定义三个常量表示状态
const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

class MyPromise {
  constructor(executor){
    // 立即执行并传入resolve和reject方法
    executor(this.resolve, this.reject)
  }

  // 储存状态的变量，初始值是 pending
  status = PENDING;

  // 成功之后的值
  value = null;

  // 失败之后的原因
  reason = null;

  // 用箭头函数就可以让this指向当前实例对象
  // 更改成功后的状态
  resolve = (value) => {
    // 只有状态是等待，才执行状态修改
    if (this.status === PENDING) {
      // 状态修改为成功
      this.status = FULFILLED;
      // 保存成功之后的值
      this.value = value;
    }
  }

  // 更改失败后的状态
  reject = (reason) => {
    // 只有状态是等待，才执行状态修改
    if (this.status === PENDING) {
      // 状态成功为失败
      this.status = REJECTED;
      // 保存失败后的原因
      this.reason = reason;
    }
  }
}
```
4. then方法内部做的事情就是状态判断，如果状态是成功，调用成功回调函数，如果状态是失败，调用失败回调函数。
```
then(onFulfilled, onRejected) {
  // 判断状态
  if (this.status === FULFILLED) {
    // 调用成功回调，并且把值返回
    onFulfilled(this.value);
  } else if (this.status === REJECTED) {
    // 调用失败回调，并且把原因返回
    onRejected(this.reason);
  }
}
```

### Promise处理异步，保证.then的执行等待异步执行完
> then方法中判断当前的状态，如果是Pending 则缓存成功和失败的回调函数，待状态改变之后在对应的reject或resolve方法中调用对应的回调函数。

```
// 存储成功回调函数
onFulfilledCallback = null;

// 存储失败回调函数
onRejectedCallback = null;

then(onFulfilled, onRejected) {
  // 判断状态
  if (this.status === FULFILLED) {
    // 调用成功回调，并且把值返回
    onFulfilled(this.value);
  } else if (this.status === REJECTED) {
    // 调用失败回调，并且把原因返回
    onRejected(this.reason);
  } else if (this.status === PENDING) {
    // 将成功回调和失败回调存储起来，等到执行成功失败函数的时候再传递
    this.onFulfilledCallback = onFulfilled;
    this.onRejectedCallback = onRejected;
  }
}

// 用箭头函数就可以让this指向当前实例对象
// 更改成功后的状态
resolve = (value) => {
  // 只有状态是等待，才执行状态修改
  if (this.status === PENDING) {
    // 状态修改为成功
    this.status = FULFILLED;
    // 保存成功之后的值
    this.value = value;
    // 判断成功回调是否存在，如果存在就调用
    this.onFulfilledCallback && this.onFulfilledCallback(value);
  }
}

// 更改失败后的状态
reject = (reason) => {
  // 只有状态是等待，才执行状态修改
  if (this.status === PENDING) {
    // 状态成功为失败
    this.status = REJECTED;
    // 保存失败后的原因
    this.reason = reason;
    // 判断失败回调是否存在，如果存在就调用
    this.onRejectedCallback && this.onRejectedCallback(reason)
  }
}
```
### then方法的多次调用实现
> 由于then方法可以多次调用，所以缓存时应该缓存所有的回调函数(数组存储)，状态改变之后调用的时候循环调用存储的回调函数。

```
// 存储成功回调函数
onFulfilledCallbacks = [];

// 存储失败回调函数
onRejectedCallbacks = [];

then(onFulfilled, onRejected) {
  // 判断状态
  if (this.status === FULFILLED) {
    // 调用成功回调，并且把值返回
    onFulfilled(this.value);
  } else if (this.status === REJECTED) {
    // 调用失败回调，并且把原因返回
    onRejected(this.reason);
  } else if (this.status === PENDING) {
    // 将成功回调和失败回调存储起来，等到执行成功失败函数的时候再传递
    this.onFulfilledCallbacks.push(onFulfilled);
    this.onRejectedCallbacks.push(onRejected);
  }
}

// 更改成功后的状态
resolve = (value) => {
  // 只有状态是等待，才执行状态修改
  if (this.status === PENDING) {
    // 状态修改为成功
    this.status = FULFILLED;
    // 保存成功之后的值
    this.value = value;
    // resolve里面将所有成功的回调拿出来执行
    while (this.onFulfilledCallbacks.length) {
      // Array.shift() 取出数组第一个元素，然后（）调用，shift不是纯函数，取出后，数组将失去该元素，直到数组为空
      this.onFulfilledCallbacks.shift()(value)
    }
  }
}

// 更改失败后的状态
reject = (reason) => {
  // 只有状态是等待，才执行状态修改
  if (this.status === PENDING) {
    // 状态成功为失败
    this.status = REJECTED;
    // 保存失败后的原因
    this.reason = reason;
    // reject里面将所有失败的回调拿出来执行
    while (this.onRejectedCallbacks.length) {
      this.onRejectedCallbacks.shift()(reason)
    }
  }
}
```
### then方法的链式调用
> then方法要链式调用就需要返回一个Promise对象。then方法里面return一个返回值作为下一个then方法的参数，如果是return一个Promise对象，那么就需要判断它的状态。

```
class MyPromise {
  // ......
  then(onFulfilled, onRejected) {
    // 为了链式调用这里直接创建一个 MyPromise，并在后面 return 出去
    const promise2 = new MyPromise((resolve, reject) => {
      // 这里的内容在执行器中，会立即执行
      if (this.status === FULFILLED) {
        // 获取成功回调函数的执行结果
        const x = onFulfilled(this.value);
        // 传入 resolvePromise 集中处理
        resolvePromise(x, resolve, reject);
      } else if (this.status === REJECTED) {
        onRejected(this.reason);
      } else if (this.status === PENDING) {
        this.onFulfilledCallbacks.push(onFulfilled);
        this.onRejectedCallbacks.push(onRejected);
      }
    }) 
    return promise2;
  }
}

function resolvePromise(x, resolve, reject) {
  // 判断x是不是 MyPromise 实例对象
  if(x instanceof MyPromise) {
    // 执行 x，调用 then 方法，目的是将其状态变为 fulfilled 或者 rejected
    // x.then(value => resolve(value), reason => reject(reason))
    // 简化之后
    x.then(resolve, reject)
  } else {
    // 普通值
    resolve(x)
  }
}
```
### then方法判断是否返回自己
> 如果then方法返回的是自己的Promise对象，则会发生循环调用，这个时候程序会报错

1. 判断返回的Promise是否等于自己，如果等于自己抛错。
2. 判断的过程在Promise的运行过程中，此时无法获取到返回的Promise，所以判断的过程需要创建微任务queueMicrotask(可以使用setTimeout来代替)来处理，保证可以获取到返回的Promise。
```
class MyPromise {
  // ......
  then(onFulfilled, onRejected) {
    const promise2 = new MyPromise((resolve, reject) => {
      if (this.status === FULFILLED) {
        // 创建一个微任务等待 promise2 完成初始化
        queueMicrotask(() => {
          // 获取成功回调函数的执行结果
          const x = onFulfilled(this.value);
          // 传入 resolvePromise 集中处理
          resolvePromise(promise2, x, resolve, reject);
        })  
      } else if (this.status === REJECTED) {
        onRejected(this.reason);
      } else if (this.status === PENDING) {
        this.onFulfilledCallbacks.push(onFulfilled);
        this.onRejectedCallbacks.push(onRejected);
      }
    }) 
    
    return promise2;
  }
}

function resolvePromise(promise2, x, resolve, reject) {
  // 如果相等了，说明return的是自己，抛出类型错误并返回
  if (promise2 === x) {
    return reject(new TypeError('Chaining cycle detected for promise #<Promise>'))
  }
  if (x instanceof MyPromise) {
    x.then(resolve, reject)
  } else {
    resolve(x)
  }
}
```
### 参考fulfilled状态下的处理方式，对rejected和pending状态进行改造
```
then(onFulfilled, onRejected) {
  // 为了链式调用这里直接创建一个 MyPromise，并在后面 return 出去
  const promise2 = new MyPromise((resolve, reject) => {
    // 判断状态
    if (this.status === FULFILLED) {
      // 创建一个微任务等待 promise2 完成初始化
      queueMicrotask(() => {
        try {
          // 获取成功回调函数的执行结果
          const x = onFulfilled(this.value);
          // 传入 resolvePromise 集中处理
          resolvePromise(promise2, x, resolve, reject);
        } catch (error) {
          reject(error)
        } 
      })  
    } else if (this.status === REJECTED) { 
      // 创建一个微任务等待 promise2 完成初始化
      queueMicrotask(() => {
        try {
          // 调用失败回调，并且把原因返回
          const x = onRejected(this.reason);
          // 传入 resolvePromise 集中处理
          resolvePromise(promise2, x, resolve, reject);
        } catch (error) {
          reject(error)
        } 
      }) 
    } else if (this.status === PENDING) {
      // 将成功回调和失败回调存储起来，等到执行成功失败函数的时候再传递
      this.onFulfilledCallbacks.push(() => {
        queueMicrotask(() => {
          try {
            // 获取成功回调函数的执行结果
            const x = onFulfilled(this.value);
            // 传入 resolvePromise 集中处理
            resolvePromise(promise2, x, resolve, reject);
          } catch (error) {
            reject(error)
          } 
        }) 
      });
      this.onRejectedCallbacks.push(() => {
        queueMicrotask(() => {
          try {
            // 调用失败回调，并且把原因返回
            const x = onRejected(this.reason);
            // 传入 resolvePromise 集中处理
            resolvePromise(promise2, x, resolve, reject);
          } catch (error) {
            reject(error)
          } 
        }) 
      });
    }
  }) 
  
  return promise2;
}
```
### then方法的参数可选
> then方法的参数可以不传或者单传都不影响执行，then方法的参数进行判断，没有传入参数时执行默认的方法。

```
then(onFulfilled, onRejected) {
  // 如果不传，就使用默认函数
  onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
  onRejected = typeof onRejected === 'function' ? onRejected : reason => { throw reason };

  // ......
}
```
### 捕获错误
1. 捕获执行器中的代码，如果执行器中有代码错误(外部调用的语法)，那么Promise的状态要变为失败。
2. then方法执行时捕获错误。
```
// 执行器捕获错误
constructor(executor) {
  // 立即执行并传入resolve和reject方法
  try {
    executor(this.resolve, this.reject)
  } catch (error) {
    // 如果有错误，就直接执行 reject
    this.reject(error)
  }
}

// then方法执行捕获错误
then(onFulfilled, onRejected) {
  // 为了链式调用这里直接创建一个 MyPromise，并在后面 return 出去
  const promise2 = new MyPromise((resolve, reject) => {
    // 判断状态
    if (this.status === FULFILLED) {
      // 创建一个微任务等待 promise2 完成初始化
      queueMicrotask(() => {
        try {
          // 获取成功回调函数的执行结果
          const x = onFulfilled(this.value);
          // 传入 resolvePromise 集中处理
          resolvePromise(promise2, x, resolve, reject);
        } catch (error) {
          reject(error)
        }  
      })  
    } else if (this.status === REJECTED) {
      // 调用失败回调，并且把原因返回
      onRejected(this.reason);
    } else if (this.status === PENDING) {
      // 将成功回调和失败回调存储起来，等到执行成功失败函数的时候再传递
      this.onFulfilledCallbacks.push(onFulfilled);
      this.onRejectedCallbacks.push(onRejected);
    }
  }) 
  return promise2;
}
```
### resolve和reject的静态调用
> 在Promise类中使用static关键字实现resolve和reject方法，方法的内部就是调用new Promise((resolve, reject) => {})。

```
// resolve 静态方法
static resolve (parameter) {
  // 如果传入 MyPromise 就直接返回
  if (parameter instanceof MyPromise) {
    return parameter;
  }

  // 转成常规方式
  return new MyPromise(resolve =>  {
    resolve(parameter);
  });
}

// reject 静态方法
static reject (reason) {
  return new MyPromise((resolve, reject) => {
    reject(reason);
  });
}
```
### 全量实现
```
// 先定义三个常量表示状态
const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

// 新建 MyPromise 类
class MyPromise {
  constructor(executor) {
    // 会立即执行并传入resolve和reject方法
    try {
      executor(this.resolve, this.reject)
    } catch (error) {
      this.reject(error)
    }
  }

  // 储存状态的变量，初始值是 pending
  status = PENDING;
  // 成功之后的值
  value = null;
  // 失败之后的原因
  reason = null;

  // 存储成功回调函数
  onFulfilledCallbacks = [];
  // 存储失败回调函数
  onRejectedCallbacks = [];

  // 更改成功后的状态
  resolve = (value) => {
    // 只有状态是等待，才执行状态修改
    if (this.status === PENDING) {
      // 状态修改为成功
      this.status = FULFILLED;
      // 保存成功之后的值
      this.value = value;
      // resolve里面将所有成功的回调拿出来执行
      while (this.onFulfilledCallbacks.length) {
        // Array.shift() 取出数组第一个元素，然后（）调用，shift不是纯函数，取出后，数组将失去该元素，直到数组为空
        this.onFulfilledCallbacks.shift()(value)
      }
    }
  }

  // 更改失败后的状态
  reject = (reason) => {
    // 只有状态是等待，才执行状态修改
    if (this.status === PENDING) {
      // 状态成功为失败
      this.status = REJECTED;
      // 保存失败后的原因
      this.reason = reason;
      // resolve里面将所有失败的回调拿出来执行
      while (this.onRejectedCallbacks.length) {
        this.onRejectedCallbacks.shift()(reason)
      }
    }
  }

  then(onFulfilled, onRejected) {
    const realOnFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
    const realOnRejected = typeof onRejected === 'function' ? onRejected : reason => { throw reason };

    // 为了链式调用这里直接创建一个 MyPromise，并在后面 return 出去
    const promise2 = new MyPromise((resolve, reject) => {
      const fulfilledMicrotask = () =>  {
        // 创建一个微任务等待 promise2 完成初始化
        queueMicrotask(() => {
          try {
            // 获取成功回调函数的执行结果
            const x = realOnFulfilled(this.value);
            // 传入 resolvePromise 集中处理
            resolvePromise(promise2, x, resolve, reject);
          } catch (error) {
            reject(error)
          } 
        })  
      }

      const rejectedMicrotask = () => { 
        // 创建一个微任务等待 promise2 完成初始化
        queueMicrotask(() => {
          try {
            // 调用失败回调，并且把原因返回
            const x = realOnRejected(this.reason);
            // 传入 resolvePromise 集中处理
            resolvePromise(promise2, x, resolve, reject);
          } catch (error) {
            reject(error)
          } 
        }) 
      }

      // 判断状态
      if (this.status === FULFILLED) {
        fulfilledMicrotask() 
        // 可以使用setTimeout实现
        setTimeout(() => {
          try {
            let x = realOnFulfilled(this.value);
            x instanceof MyPromise ? x.then(resolve, reject) : resolve(x)
          } catch (err) {
            reject(err)
          }
        })
      } else if (this.status === REJECTED) { 
        rejectedMicrotask()
      } else if (this.status === PENDING) {
        // 将成功回调和失败回调存储起来，等到执行成功失败函数的时候再传递
        this.onFulfilledCallbacks.push(fulfilledMicrotask);
        this.onRejectedCallbacks.push(rejectedMicrotask);
      }
    }) 
    
    return promise2;
  }

  // resolve 静态方法
  static resolve(parameter) {
    // 如果传入 MyPromise 就直接返回
    if (parameter instanceof MyPromise) {
      return parameter;
    }

    // 转成常规方式
    return new MyPromise(resolve =>  {
      resolve(parameter);
    });
  }

  // reject 静态方法
  static reject(reason) {
    return new MyPromise((resolve, reject) => {
      reject(reason);
    });
  }
}

function resolvePromise (promise2, x, resolve, reject) {
  // 如果相等了，说明return的是自己，抛出类型错误并返回
  if (promise2 === x) {
    return reject(new TypeError('Chaining cycle detected for promise #<Promise>'))
  }
  // 判断x是不是 MyPromise 实例对象
  if(x instanceof MyPromise) {
    // 执行 x，调用 then 方法，目的是将其状态变为 fulfilled 或者 rejected
    // x.then(value => resolve(value), reason => reject(reason))
    // 简化之后
    x.then(resolve, reject)
  } else{
    // 普通值
    resolve(x)
  }
}

module.exports = MyPromise;
```
### Promise.resolve
- Promise.resolve最终结果还是一个Promise，并且与Promise.resolve(该值)传入的值息息相关。
- 传入的参数可以是一个Promise实例，那么该函数执行的结果是直接将实例返回。
- 如果这个值是thenable（即带有"then" 方法），返回的promise会“跟随”这个thenable的对象，采用它的最终状态；否则返回的promise将以此值完成。
```
Promise.resolve = function(value) {
  // 如果是 Promsie，则直接返回
  if (value && typeof value === 'object' && value instanceof Promise) {
    return value;
  }
  return new Promise(resolve => resolve(value))
}
```
### Promise.reject
> Promise.reject() 方法返回一个带有拒绝原因的Promise对象。

```
Promise.reject = function(reason) {
  return new Promise((resolve, reject) => reject(reason))
}
```
### Promise.all
```
Promise.all = function(promiseArr) {
  let count = 0, result = [];
  const len = promiseArr.length;
  return new Promise((resolve, reject) => {
    if (len === 0) {
      return resolve([]);
    }
    promiseArr.forEach((p, i) => {
      Promise.resolve(p).then(val => {
        count++
        result[i] = val
        // 全部resolve之后才返回最终的值
        if (count === promiseArr.length) {
          resolve(result)
        }
      }, err => {
        reject(err)
      })
    })
  })
}
```
### Promise.allSettled
```
Promise.allSettled = (promiseArr) => {
  let count = 0, result = [];
  const len = promiseArr.length
  return new Promise((resolve, reject) => {
    // 数组是空的话，直接返回空数据
    if (len === 0) {
      return resolve([]);
    }
    promiseArr.forEach((p, i) => {
      Promise.resolve(p).then((res) => {
        count += 1
        // 成功属性设置 
        result[ i ] = {
          status: 'fulfilled',
          value: res
        }
        
        if (count === len) {
          rs(result)
        }
      }).catch((err) => {
        count += 1
        // 失败属性设置 
        result[i] = { 
          status: 'rejected', 
          reason: err 
        }
        if (count === len) {
          rs(result)
        }
      })
    })
  })
}
```
### Promise.race
```
Promise.race = function(promiseArr) {
  return new Promise((resolve, reject) => {
    promiseArr.forEach(p => {
      Promise.resolve(p).then(val => {
        // 有一个resolve之后就返回最终的值
        resolve(val)
      }, err => {
        reject(err)
      })
    })
  })
}
```
### Promise并行限制
```
class Scheduler {
  constructor() {
    this.queue = [];
    this.maxCount = 2;
    this.runCounts = 0;
  }
  add(promiseCreator) {
    this.queue.push(promiseCreator);
  }
  taskStart() {
    for (let i = 0; i < this.maxCount; i++) {
      this.request();
    }
  }
  request() {
    if (!this.queue || !this.queue.length || this.runCounts >= this.maxCount) {
      return;
    }
    this.runCounts++;

    this.queue.shift()().then(() => {
      this.runCounts--;
      this.request();
    });
  }
}
   
const timeout = time => new Promise(resolve => {
  setTimeout(resolve, time);
})
  
const scheduler = new Scheduler();
  
const addTask = (time,order) => {
  scheduler.add(() => timeout(time).then(()=>console.log(order)))
}
  
  
addTask(1000, '1');
addTask(500, '2');
addTask(300, '3');
addTask(400, '4');
scheduler.taskStart()
```