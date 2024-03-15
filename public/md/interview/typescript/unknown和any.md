## any 和 unknown
### any
> any 可以代表任意类型的值，而且可以绕过 TS 的类型检查。

```
let myName: any;
myName = 1;

// 错误使用
myName();
```
### unknown
> unknown 可以代表任意类型的值，但是它不可以绕过 TS 的类型检查。

```
let myName: unknown;
myName = 1;

// ts error: unknown 无法被调用，这被认为是不安全的
myName();

// 使用typeof保护myName类型为function
if (typeof myName === 'function') { 
  // 此时校验myName的类型为function，可以正常调用 
  myName();
}
```
### unknown 就代表一些并不会绕过类型检查但又暂时无法确定值的类型
> 在一些无法确定函数参数（返回值）类型中 unknown 使用的场景比较多。

```
// 在不确定函数参数的类型时
function test(val: unknown) {
  if (typeof val === 'string') {  
    // someThing 
  } else if (typeof val === 'number') { 
    // someThing  
  } 
  // ...
}
```
### unknown类型可以接收任意类型的值，但并不支持将unknown赋值给其它类型(可以赋值给any类型)。any类型同样支持接收任意类型的值，同时也支持赋值给其它任意类型(除never类型)。