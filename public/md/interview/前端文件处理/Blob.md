## blob
> blob全称binary large object，即二进制大对象，blob对象表示一个不可变、原始数据的类文件对象，它的数据可以按文本或二进制的格式进行读取，也可以转换成 ReadableStream来用于数据操作。

### blob创建
> 使用Blob()构造函数创建新的blob对象。

- array：由ArrayBuffer、ArrayBufferView、Blob、DOMString等对象构成的Array，将会被放进blob。
- options：可指定如下两个属性
  1. type：默认值为""，表示将会被放入到blob中的数组内容的MIME类型。
  2. endings：默认值为"transparent"，用于指定包含行结束符\n的字符串如何被写入，不常用。
```
const blob = new Blob(array, options);

const blob = new Blob(["Hello World"], { type: "text/plain" });
```
### blob属性
- size属性：blob对象中所包含数据的大小（字节）；
- type属性：字符串，认为该blob对象所包含的MIME类型。如果类型未知，则为空字符串。
```
const blob = new Blob(["Hello World"], { type: "text/plain" });

console.log(blob.size); // 11
console.log(blob.type); // "text/plain"
```
### 将blob转化为URL
> 使用URL.createObjectURL()方法将将blob转化为一个URL进行使用。

```
const url = URL.createObjectURL(blob);
```
### blob分片
> 除了使用Blob()构造函数来创建blob对象之外，还可以从blob对象中创建blob，也就是将blob对象切片。blob对象内置了slice()方法用来将blob对象分片。

- start：设置切片的起点，即切片开始位置。默认值为0，意味着切片应该从第一个字节开始。
- end：设置切片的结束点，会对该位置之前的数据进行切片。默认值为blob.size。
- contentType：设置新blob的MIME类型。如果省略type，则默认为blob的原始值。
```
const blob = new Blob(["Hello World"], { type: "text/plain" });
const subBlob = blob.slice(0, 5);
```
