## promise
### Promise中的代码是同步执行的，then方法中是异步执行的
```
// 输出结果是 1 3 4 2
new Promise(resolve => {
  console.log(1);
  resolve(2);
  console.log(3);
}).then(res => console.log(res));
console.log(4)
```
### Promise一旦状态改变，就不会再变,后序的操作会执行但是不影响Promise的状态,并且不会影响返回的结果
```
// 输出结果1
new Promise((resolve, reject) => {
  resolve(1);
  reject(2);
  resolve(3)
}).then(
  res => console.log(res)
).catch(
  err => console.log(err)
)
```
### then方法
- then方法的第一个参数是resolved状态的回调函数，第二个参数（可选）是rejected状态的回调函数。
```
new Promise((resolve, reject) => {
  resolve(1);
}).then(
  res => console.log(res), // 1
  err => console.log(err)
)

new Promise((resolve, reject) => {
  reject(1);
}).then(
  res => console.log(res),
  err => console.log(err) // 1
)
```
- then方法返回一个Promise对象，所以then方法可以链式调用。
```
// 输出 1 2
new Promise(resolve => {
  resolve(1);
}).then(
  res => {
    console.log(res);
    return 2;
  }
).then(res => console.log(res))
```
### catch方法
> 用于获取Promise中抛出的错误或者rejected状态返回的结果，效果等同于then方法中第二个参数的作用，then方法使用两个参数时，catch方法不生效。抛出错误不能return Error对象，需要throw Error对象或者使用reject。

```
new Promise((resolve, reject) => {
  // throw new Error('error');
  reject('123')
}).then(
  res => {
    console.log(res);
    return 2;
  },
  err => console.log(err) // 输出结果
).catch(
  err => console.log(err) // 不执行
)

// catch 可以捕获then方法中抛出的错误, then方法的第二个参数不能捕获第一个参数中抛出的错误，只能捕获前面Promise实例抛出的错误
Promise.resolve(123).then(
  res => {
    throw new Error('err')
  },
  err => console.log(err)
).catch(
  err => console.log(err) // 捕获错误信息
)

// 可以使用链式调用then方法的形式捕获上一个then方法抛出的错误
Promise.resolve(123).then(
  res => {
    throw new Error('err')
  },
  err => console.log(err)
).then(
  res => console.log(res),
  err => console.log(err) // 捕获错误信息
)
```
### finally方法
> 不管 Promise 对象最后状态如何，都会执行的操作

```
new Promise((resolve, reject) => {
  reject(1);
}).then(
  res => console.log(res)
).catch(
  err => console.log(err) // 1
).finally(res => console.log('dyx')) // 'dyx'
```
### then 或者 catch 可以被调用多次，但 Promise 构造函数只执行一次。后续每次调用 then 或者 catch 都会直接拿到第一次执行的结果。
- then 或 catch 返回的值不能是 当前Promise 本身，否则会造成死循环
- then 或者 catch 的参数期望是函数，如果传入非函数会将最前面的Promsie的值传递过去
```
// 最后console的res是'123',前面的then方法中的console.log(1)依然会执行
new Promise((resolve, reject) => {
  resolve('123')
}).then('dyx').then(console.log(1)).then(res => console.log(res))
```
- 如果传入函数后面的then方法接收到的值为前面then方法中返回的值
```
// 最后console的res是undefined,因为前面的then方法中的函数没有return任何值
new Promise((resolve, reject) => {
  resolve('123')
}).then(() => 'dyx').then(() => console.log(1)).then(res => console.log(res))
```
### Promise.all
> 接受一个数组作为参数，数组中的每一个参数都是一个promise实例。适用于对同一接口调用多次只是调用参数不同的情况。所有的Promise实例都为resolved才会返回Promise.all的结果，有Promise实例rejected时会立即返回当前rejected的结果，后序的Promise实例依然会执行，只是不影响整体的返回结果。当rejected的实例自定义了catch方法会将此实例的结果看为resolved，值为定义的catch方法的返回值。

- 所有的Promise实例的结果为resolved的时候，Promise.all会返回一个数组的结果，数组内容为每一个Promise实例的返回结果
```
// 输出顺序是 1 2 [1,2]
var p1 = new Promise(resolve => {
  setTimeout(() => {
    console.log(1);
    resolve(1)
  }, 500);
});
var p2 = new Promise(resolve => {
  setTimeout(() => {
    console.log(2);
    resolve(2)
  }, 600);
});
Promise.all([p1, p2]).then(res => {
  console.log(res);  // [1,2]
});
```
- 所有的Promise实例中有一个被rejected，Promise.all的状态就变成rejected，此时第一个被reject的实例的返回值会作为Promise.all的返回值，后序的Promsie实例依然会执行，只是不影响最终的结果
```
// 输出顺序是1 err 2
var p1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    console.log(1);
    reject('err')
  }, 500);
})
var p2 = new Promise(resolve => {
  setTimeout(() => {
    console.log(2);
    resolve(2)
  }, 600);
});
Promise.all([p1, p2]).then(
  res => console.log(res),
  err => console.log(err) // err
)
```
- 如果作为参数的Promise 实例，自己定义了catch方法，那么一旦被rejected，并不会触发Promise.all()的catch方法,只会触发这个实例的catch方法
```
// 输出顺序是1 'err' 2 ['err', 2]
var p1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    console.log(1);
    reject('err')
  }, 500);
}).catch(err => {
  console.log(err) // err
  return err;
}) 
var p2 = new Promise(resolve => {
  setTimeout(() => {
    console.log(2);
    resolve(2)
  }, 600);
});
Promise.all([p1, p2]).then(
  res => console.log(res) // ['err', 2]
).catch(err => console.log(err))
```
### Promise.race
> Promise.race同样接受一个数组作为参数，数组中的每一个参数都是一个promise实例。适用于多个接口调用有其中一个成功即可的场景。只要有一个Promise实例都为resolved就会返回Promise.race的结果，有Promise实例rejected时会立即返回当前rejected的结果，后序的Promise实例依然会执行，只是不影响整体的返回结果。当rejected的实例自定义了catch方法会将此实例的结果看为resolved，值为定义的catch方法的返回值。

- Promise.race根据传入的实例，一旦有Promsie实例为resolved，则将该实例的结果作为Promise.race的结果返回，后序的Promise实例的依然会执行只是运行结果不会影响最终结果。
```
// 输出结果为 1 1 2
var p1 = new Promise(resolve => {
  setTimeout(() => {
    console.log(1);
    resolve(1)
  }, 500);
});
var p2 = new Promise(resolve => {
  setTimeout(() => {
    console.log(2);
    resolve(2)
  }, 600);
});
Promise.race([p1, p2]).then(res => {
  console.log(res);  // 1
});
```
- 一旦有Promise实例为rejected，也将作为结果返回，后序的Promsie实例依然会执行，只是不影响最终的结果。
```
// 输出结果为 1 err 2
var p1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    console.log(1);
    reject('err')
  }, 500);
});
var p2 = new Promise(resolve => {
  setTimeout(() => {
    console.log(2);
    resolve(2)
  }, 600);
});
Promise.race([p1, p2]).then(res => {
  console.log(res);  
}).catch(err => console.log(err)); // err
```
- 如果作为参数的Promise 实例，自己定义了catch方法，那么一旦被rejected，并不会触发Promise.race()的catch方法,只会触发这个实例的catch方法
```
// 输出顺序是1 'err' 'err' 2
var p1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    console.log(1);
    reject('err')
  }, 500);
}).catch(err => {
  console.log(err) // err
  return err;
})
var p2 = new Promise(resolve => {
  setTimeout(() => {
    console.log(2);
    resolve(2)
  }, 600);
});
Promise.race([p1, p2]).then(
  res => console.log(res) // 'err'
).catch(err => console.log(err))
```
### Promise.any
> Promise.any同样接受一个数组作为参数，数组中的每一个参数都是一个promise实例。和Promise.race相似，只是不会因为某个 Promise 变成rejected状态而结束。只要有Promise实例为resolved就会返回Promise.any的结果，当所有Promise实例rejected时会返回一个error信息。当rejected的实例自定义了catch方法会将此实例的结果看为resolved，值为定义的catch方法的返回值。

- Promise.any根据传入的实例，一旦有Promsie实例为resolved，则将该实例的结果作为Promise.any的结果返回，后序的Promise实例的依然会执行只是运行结果不会影响最终结果。
```
// 输出结果为 1 1 2
var p1 = new Promise(resolve => {
  setTimeout(() => {
    console.log(1);
    resolve(1)
  }, 500);
});
var p2 = new Promise(resolve => {
  setTimeout(() => {
    console.log(2);
    resolve(2)
  }, 600);
});
Promise.any([p1, p2]).then(res => {
  console.log(res);  // 1
});
```
- 有Promise实例为rejected，不会将reject结果返回，而是会返回后续执行中实例为resolve的结果，后序的Promsie实例依然会执行，只是不影响最终的结果。
```
// 输出结果为 1 2 2
var p1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    console.log(1);
    reject('err')
  }, 500);
});
var p2 = new Promise(resolve => {
  setTimeout(() => {
    console.log(2);
    resolve(2)
  }, 600);
});
Promise.any([p1, p2]).then(res => {
  console.log(res);  // 2
}).catch(err => console.log(err)); 
```
- 当所有的实例都reject时，会返回一个error信息，表示所有的Promise实例都rejected
```
// 输出结果为 1 2 All promises were rejected
var p1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    console.log(1);
    reject('err')
  }, 500);
});
var p2 = new Promise((resolve, reject) => {
  setTimeout(() => {
    console.log(2);
    reject(2)
  }, 600);
});

Promise.any([p1, p2]).then(res => {
  console.log(res); 
}).catch(err => console.log(err)); // All promises were rejected
```
- 如果作为参数的Promise 实例，自己定义了catch方法，那么一旦被rejected，并不会触发Promise.any()的catch方法,只会触发这个实例的catch方法
```
// 输出结果为 1 'err' 'err' 2
var p1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    console.log(1);
    reject('err')
  }, 500);
}).catch(err => {
  console.log(err) // 'err'
  return err
});
var p2 = new Promise((resolve, reject) => {
  setTimeout(() => {
    console.log(2);
    reject(2)
  }, 600);
});

Promise.any([p1, p2]).then(res => {
  console.log(res); // 'err'
}).catch(err => console.log(err));
```
### Promise.allSettled
> Promise.allSettled同样接受一个数组作为参数，数组中的每一个参数都是一个promise实例。只有等到所有这些参数实例都返回结果，不管是fulfilled还是rejected，allSettled才会结束。当rejected的实例自定义了catch方法会将此实例的结果看为resolved，值为定义的catch方法的返回值。

- 当所有的实例都为resolve时
```
// 输出结果为 1 2 [{status: "fulfilled", value: 1}, {status: "fulfilled", value: 2}]
var p1 = new Promise(resolve => {
  setTimeout(() => {
    console.log(1);
    resolve(1)
  }, 500);
});
var p2 = new Promise(resolve => {
  setTimeout(() => {
    console.log(2);
    resolve(2)
  }, 600);
});
Promise.allSettled([p1, p2]).then(res => {
  console.log(res);  // [{status: "fulfilled", value: 1}, {status: "fulfilled", value: 2}]
});
```
- 当所有的实例都为reject时
```
// 输出结果为 1 2 [{status: "rejected", reason: 1}, {status: "rejected", reason: 2}]
var p1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    console.log(1);
    reject(1)
  }, 500);
});
var p2 = new Promise((resolve, reject) => {
  setTimeout(() => {
    console.log(2);
    reject(2)
  }, 600);
});
Promise.allSettled([p1, p2]).then(res => {
  console.log(res);  // [{status: "rejected", reason: 1}, {status: "rejected", reason: 2}]
}).catch(err => console.log(err));
```
- 有的实例resolve，有的reject时
```
// 输出结果为 1 2 [{status: "fulfilled", value: 1}, {status: "rejected", reason: 2}]
var p1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    console.log(1);
    resolve(1)
  }, 500);
});
var p2 = new Promise((resolve, reject) => {
  setTimeout(() => {
    console.log(2);
    reject(2)
  }, 600);
});
Promise.allSettled([p1, p2]).then(res => {
  console.log(res);  // [{status: "fulfilled", value: 1}, {status: "rejected", reason: 2}]
}).catch(err => console.log(err));
```
- 其中一个promise没有结果，则什么都结果都拿不到
```
// 输出结果为 1 
var p1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    console.log(1);
    resolve(1)
  }, 500);
});
var p2 = new Promise((resolve, reject) => {});
Promise.allSettled([p1, p2]).then(res => {
  console.log(res);  // 不会返回任何结果
}).catch(err => console.log(err));
```
- 当reject的实例自定义catch时
```
// 输出结果为 1 2 2 [{status: "fulfilled", value: 1}, {status: "fulfilled", reason: 2}]
var p1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    console.log(1);
    resolve(1)
  }, 500);
});
var p2 = new Promise((resolve, reject) => {
  setTimeout(() => {
    console.log(2);
    reject(2)
  }, 600);
}).catch(err => {
  console.log(err)
  return err;
});
Promise.allSettled([p1, p2]).then(res => {
  console.log(res);  // [{status: "fulfilled", value: 1}, {status: "fulfilled", reason: 2}]
}).catch(err => console.log(err));
```
### Promsie实现简单的延时效果
```
const delay = time => new Promise(resolve => {
  setTimeout(resolve, time)
})
delay(3000).then(() => {
  console.log("三秒以后执行")
})
```