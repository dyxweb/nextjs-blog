## try-catch
- try-catch中不要写入太多的代码(声明太多的变量)，最好是把要执行的代码放在另一个function中，在try-catch中调用这个function。
- 在代码进入try-catch的时候js引擎会拷贝当前的词法环境，拷贝的其实就是当前scope下的所有的变量，会有较大的性能消耗。
- catch语句不要忽略，避免空的catch块。
- try-catch捕获异常并可以使后续代码正常运行，try代码块的内容在出错之后不会再继续执行，但是不影响try-catch代码块之后的代码执行。
```
try {
  console.log(1) // 1
  console.log(a)
  console.log(2)
} catch (error) {
  console.log(error) // ReferenceError: a is not defined
}
console.log(3) // 3
```
- finally在try-catch语句中是可选的，finally一经使用其代码无论如何都会执行。finally会阻止return语句的终止。
```
const a = () => {
  try {
    return 'try';
  } catch (e) {
    return 'catch';
  } finally {
    return 'finally';
  }
}
console.log(a()) // finally
```
- try-catch嵌套使用，内层try-catch捕获错误之后就不会被外层try-catch捕获错误且不影响外层try代码块的继续执行。
```
const a = () => {
  try {
    console.log(dyx);
  } catch (error) {
    console.log('inner catch'); // inner catch
  }
}
try {
  a();
  console.log('outer try');  // outer try
} catch (error) {
  console.log('outer error');
}
```