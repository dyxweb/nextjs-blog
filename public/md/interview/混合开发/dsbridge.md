## dsbridge
### 调用原生同步方法
```
import dsBridge from 'dsbridge';

const __function = function (name, defaultValue) {
  return function (args) {
    const returnValue = dsBridge.call(name, args);
    if (returnValue) {
      return JSON.parse(returnValue);
    } else {
      if (!window.isApp) {
        return defaultValue;
      } else {
        throw new Error(`函数 ${name} 没有有效的返回值`);
      }
    }
  };
};

// 使用
const getStatusBarHeight = __function("getStatusBarHeight", 45);
const height = getStatusBarHeight()
```
### 调用原生异步方法
```
import dsBridge from 'dsbridge';

const __functionAsync = function (name, defaultValue) {
  return function (args) {
    return new Promise((resolve, reject) => {
      if (!window.isApp) {
        resolve(defaultValue);
      } else {
        dsBridge.call(name, args, (returnValue) => {
          resolve(JSON.parse(returnValue));
        });
      }
    });
  };
};

// 使用
const getSystemPushStatus = __functionAsync('getSystemPushStatus', { systemPushStatus: 0 });
const getStatus = async() => {
  const res = await getSystemPushStatus();
}
```
### 判断是否有此方法
```
import dsBridge from 'dsbridge';

// 判断方法是否存在
dsBridge.hasNativeMethod('getStatusBarHeight');
```
