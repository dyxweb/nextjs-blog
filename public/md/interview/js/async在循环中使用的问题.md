## [async在循环中使用的问题](https://zhuanlan.zhihu.com/p/68117645)
### for循环中使用async
> 可以正常的使用，等待await结果才会进行下一次循环。

```
const arrIds = [1, 2, 3];

// 写一个sleep方法模拟异步操作
const sleep = ms => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// 假设根据id获取count的过程是异步的
const getCount = id => {
  return sleep(2000).then(() => id + 10);
}

const loop_for = async () => {
  console.log('start');
  let result = 0;
  for(let i = 0; i < arrIds.length; i++) {
    const count = await getCount(arrIds[i]);
    console.log(count);
    result += count;
  }
  console.log('result', result);
  console.log('end');
}

loop_for()

// start
// 11
// 12
// 13
// result 36
// end
```
### forEach中使用
> 使用forEach发现没有达到我们预期的效果。

```
const arrIds = [1, 2, 3];

// 写一个sleep方法模拟异步操作
const sleep = ms => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// 假设根据id获取count的过程是异步的
const getCount = id => {
  return sleep(2000).then(() => id + 10);
}

const loop_forEach = () => {
  console.log('start');
  let result = 0;
  // 在回调函数中，异步是不好控制的
  arrIds.forEach(async item => {
    const count = await getCount(item);
    console.log(count);
    result += count;
  })
  console.log('result', result);
  console.log('end');
}
loop_forEach();

// start
// result 0
// end
// 11
// 12
// 13
```
### 在forEach中合理使用async
> 将循环结果存储，使用promise.all进行解析。

```
const arrIds = [1, 2, 3];

// 写一个sleep方法模拟异步操作
const sleep = ms => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// 假设根据id获取count的过程是异步的
const getCount = id => {
  return sleep(2000).then(() => id + 10);
}

const loop_forEach = async () => {
  console.log('start');
  const promise = [];
  // 在回调函数中，异步是不好控制的
  arrIds.forEach(item => {
    const count = getCount(item);
    promise.push(count);
  });
  const res = await Promise.all(promise);
  console.log('res', res);
  const result = res.reduce((sum, count) => sum + count);
  console.log('result', result);
  console.log('end');
}
loop_forEach();

// start
// res [11, 12, 13]
// result 36
// end
```
### [在forEach中不可以使用async的原因](https://www.cnblogs.com/xjnotxj/p/10629900.html)
> 在forEach的实现中，调用传入的callback时是同步调用的，没有做任何异步(await)的处理。如果将callback的调用改为await将可以正常使用，不建议修改全局forEach的使用，所以建议使用for循环。

```
// 默认的处理逻辑
Array.prototype.myForEach = function(callback, thisArg) {
  if (!((typeof callback === 'Function' || typeof callback === 'function') && this)) {
    throw new TypeError();
  }
  const arr = Object(this);  // this 就是调用当前方法的数组
  const len = arr.length >>> 0;  // 转换为正整数
  let i = 0;
  while (i < len) {
    if (i in arr) {
      callback.call(thisArg, arr[i], i, arr);
    }
    i++;
  }
}

// 如果将callback的调用改为await调用将没有这个问题
Array.prototype.myForEach = function(callback, thisArg) {
  // ...
  await callback.call(thisArg, arr[i], i, arr);
  // ...
}
```