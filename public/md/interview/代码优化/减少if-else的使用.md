## 减少if-else的使用
### 短路运算
> 使用或 || 的短路运算代替一些比较简单的 if else。

```
// 原：
let c;
if (a) {
  c = a;
} else {
  c = b;
}

// 后：
let c = a || b;
```
### 三元运算符
> 使用三元运算符替代 if else。

```
// 原：
const fn = (nBoolean) {
  if (nBoolean) {
    return 1;
  } else {
    return 0;
  }
}

// 后：
const fn = (nBoolean) {
  return nBoolean ? 1 : 0;
}
```
### switch case
> 对于多重条件判断使用 switch case 的可读性比 if else 更好。

```
// 原：
let type = 'A';

if (type === 'A' || type === 'B') {
  console.log(1);
} else if (type === 'C') {
  console.log(2);
} else if(type === 'D') {
  console.log(3);
} else {
  console.log(0);
}

// 后：
switch (type) {
  case 'A':
  case 'B':
    console.log(1);
    break;
  case 'C':
    console.log(2);
    break;
  case 'D':
    console.log(3);
    break;
  default:
    console.log(0);
}
```
### 对象配置/策略模式
> 对象配置看起来跟 策略模式 差不多，都是根据不同得参数使用不同得数据/算法/函数。策略模式就是将一系列算法封装起来，并使它们相互之间可以替换。被封装起来的算法具有独立性，外部不可改变其特性。对象配置不一定非要使用对象去管理我们键值对，还可以使用 Map去管理。

```
// 原：
const getDiscount = (userKey) => {
  if (userKey === '普通会员') {
    return 0.9;
  } else if (userKey === '年费会员') {
    return 0.85;
  } else if (userKey === '超级会员') {
    return 0.8;
  } else {
    return 1;
  }
}
console.log(getDiscount('普通会员')) // 0.9

// 后：
const getDiscount = (userKey) => {
  // 根据用户类型来生成我们的折扣对象
  const discounts = {
    '普通会员': 0.9,
    '年费会员': 0.85,
    '超级会员': 0.8,
    'default': 1,
  }
  return discounts[userKey] || discounts['default'];
}
console.log(getDiscount('普通会员')) // 0.9
```