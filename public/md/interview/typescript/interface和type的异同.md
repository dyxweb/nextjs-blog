## interface和type的异同
> 能用interface实现就用interface，如果不能就用type。

### 相同点
#### 都可以描述一个对象和函数。
```
interface User {
  name: string
  age: number
}

interface SetUser {
  (name: string, age: number): void;
}

type User = {
  name: string
  age: number
};

type SetUser = (name: string, age: number) => void;
```
#### interface 和 type 都可以继承。可以相互继承
- interface 继承 interface
```
interface Person {
  name:string
}
interface Student extends Person { stuNo: number }
```
- interface 继承 type
```
type Person {
  name:string
}
interface Student extends Person { stuNo: number }
```
- type 继承 type
```
type Person {
  name:string
}
type Student = Person & { stuNo: number }
```
- type 继承 interface
```
interface Person{
  name:string
}
type Student = Person & { stuNo: number }
```
### 不同点
#### type 可以声明基本类型别名，联合类型，元组等类型，interface不可以。
```
// 声明基本类型
type userName = string;
type stuNo = number;

// 声明联合类型(表示取值可以为多种类型中的一种)
type Student = { stuNo: number } | { classId: number }

// 声明元组
type Data = [number, string];
```
#### interface 能够重复声明并且会进行合并，但是type不可以。type重复声明会报错。
```
interface User {
  name: string
  age: number
}

interface User {
  sex: string
}

/*
User 接口为 {
  name: string
  age: number
  sex: string 
}
*/
```
