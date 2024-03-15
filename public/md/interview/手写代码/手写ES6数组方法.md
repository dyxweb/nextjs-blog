## 手写ES6数组方法
### forEach
```
Array.prototype.myForEach = function(callback, thisArg) {
  if (!((typeof callback === 'Function' || typeof callback === 'function') && this)) {
    throw new TypeError();
  }
  const arr = Object(this);  // this是调用当前方法的数组
  const len = arr.length >>> 0;  // 转换为正整数
  let i = 0;
  while (i < len) {
    if (i in arr) {
      callback.call(thisArg, arr[i], i, arr);
    }
    i++;
  }
}

// 使用
const arr = new Array(1, 2, 3)
arr.myForEach((item, index, arr) => {
  console.log(item, index, arr)
})
console.log(arr)
```
### map
```
Array.prototype.myMap = function(callback, thisArg) {
  if (!((typeof callback === 'Function' || typeof callback === 'function') && this)) {
    throw new TypeError();
  }
  const arr = Object(this)  // this是调用当前方法的数组
  const len = arr.length >>> 0  // 转换为正整数
  let i = 0
  let res = []
  while (i < len) {
    if (i in arr) {
      res[i] = callback.call(thisArg, arr[i], i, arr);
    }
    i++;
  }
  return res
}

const arr = new Array(1, 2, 3)
const arr1 = arr.myMap((item, index, arr) => item + 1)
console.log(arr)
console.log(arr1)
```
### filter
```
Array.prototype.myFilter = function(callback, thisArg) {
  if (!((typeof callback === 'Function' || typeof callback === 'function') && this)) {
    throw new TypeError();
  }
  const arr = Object(this)  // this是调用当前方法的数组
  const len = arr.length >>> 0  // 转换为正整数
  let i = 0
  let res = [] // 返回值
  while (i < len) {
    if (i in arr) {
      if (callback.call(thisArg, arr[i], i, arr)) {
        res.push(arr[i])
      }
    }
    i++;
  }
  return res
}

const arr = new Array(1, 2, 3)
const arr1 = arr.myFilter((item, index, arr) => item > 1)
console.log(arr)
console.log(arr1)
```
### some
```
Array.prototype.mySome = function(callback, thisArg) {
  if (!((typeof callback === 'Function' || typeof callback === 'function') && this)) {
    throw new TypeError();
  }
  const arr = Object(this)  // this是调用当前方法的数组
  const len = arr.length >>> 0  // 转换为正整数
  let i = 0
  while (i < len) {
    if (i in arr) {
      if (callback.call(thisArg, arr[i], i, arr)) {
        return true
      }
    }
    i++;
  }
  return false
}

// 使用
const arr = new Array(1, 2, 3)
const res = arr.mySome((item, index, arr) => item > 1)
const res1 = [].mySome((item, index, arr) => item > 1)
console.log(arr)
console.log(res)
console.log(res1) // 空数组使用返回false
```
### every
```
Array.prototype.myEvery = function(callback, thisArg) {
  if (!((typeof callback === 'Function' || typeof callback === 'function') && this)) {
    throw new TypeError();
  }
  const arr = Object(this)  // this 就是调用当前方法的数组
  const len = arr.length >>> 0  // 转换为正整数
  let i = 0
  while (i < len) {
    if (i in arr) {
      if (!callback.call(thisArg, arr[i], i, arr)) {
        return false
      }
    }
    i++;
  }
  return true
}

// 使用
const arr = new Array(1, 2, 3)
const res = arr.myEvery((item, index, arr) => item > 1)
const res1 = [].myEvery((item, index, arr) => item > 1)
console.log(arr)
console.log(res)
console.log(res1) // 空数组使用返回true
```
### reduce
```
Array.prototype.myReduce = function(callback, initialValue) {
  if (!((typeof callback === 'Function' || typeof callback === 'function') && this)) {
    throw new TypeError();
  }
  const arr = Object(this)  // this是调用当前方法的数组
  const len = arr.length >>> 0  // 转换为正整数
  let i = 0, res
  
  if (arguments.length > 1) {
    res = initialValue
  } else {
    // 没传入初始值的时候，取数组中第一个非 empty 的值为初始值
    while (i < len && !(i in arr)) {
      i++
    }
    // 空数组必须有初始值否则抛错
    if (i >= len) {
      throw new TypeError( 'Reduce of empty array with no initial value' );
    }
    res = arr[i++]
  }
  while (i < len) {
    if (i in arr) {
      res = callback(res, arr[i], i, arr)
    }
    i++
  }
  return res
}

// 使用
const arr = new Array(1, 2, 3)
const emptyArr = new Array()
const res = arr.myReduce((prev, curr) => console.log(prev, curr))
const res1 = emptyArr.myReduce((prev, curr) => console.log(prev, curr))
console.log(arr)
console.log(res)
console.log(res1)
```