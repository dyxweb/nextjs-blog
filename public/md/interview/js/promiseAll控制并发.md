## promiseAll控制并发
> 比如有几百个存储操作，不能要一次性去全部执行，而是要控制一次性只能执行10个操作，10个中有一个执行完了，就拿还没执行的操作补上去，就这样一直到这几百个操作全部执行完为止。减少服务器的并发压力

- 从第1个异步操作开始，初始化promise对象，同时用一个executing数组保存正在执行的promise。
- 不断初始化promise，直到达到poolLimt。
- 使用Promise.race，获得executing中promise的执行情况，当有一个promise执行完毕，继续初始化promise并放入executing中。
- 所有异步操作都执行了，调用Promise.all返回。
```
function asyncPool(poolLimit, array, iteratorFn) {
  let i = 0;
  const ret = [];
  const executing = [];
  const enqueue = function () {
    // 当所有的异步都处理之后返回一个resolve状态的promise
    if (i === array.length) {
      return Promise.resolve();
    }
    // 每调一次enqueue，初始化一个promise
    const item = array[i++];
    const p = new Promise(resolve => resolve(iteratorFn(item)))
    // 将当前的promise放入最终结果的数组中
    ret.push(p);
    // promise执行完毕，从executing数组中删除
    const e = p.then(() => executing.splice(executing.indexOf(e), 1));
    // 正在执行的promise插入executing数组，用于表示正在执行的数据
    executing.push(e);
    let r = Promise.resolve();
    // 默认Promise状态为resolve，每当executing数组中promise数量大于等于poolLimit，使用Promise.race判断进行中的promise是否有完成的实例从而判断是否要实例化新的promise并执行
    if (executing.length >= poolLimit) {
      r = Promise.race(executing);
    }
    // 递归，直到遍历完array
    return r.then(() => enqueue());
  };

  // 当所有的异步操作都处理之后才执行Promise.all
  return enqueue().then(() => Promise.all(ret));
}

// 使用
const timeout = i => new Promise(resolve => setTimeout(() => resolve(i), i));
asyncPool(2, [1000, 5000, 3000, 2000], timeout).then(results => {
  console.log(results);
});
```