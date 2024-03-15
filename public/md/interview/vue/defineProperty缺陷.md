## defineProperty缺陷
1. 只能劫持对象的属性，因此我们需要对每个对象的每个属性进行遍历监听，如果属性值也是对象那么需要深度遍历。
2. 对象属性的添加和删除无法被Object.defineProperty监听，需要手动添加监听。
```
var vm = new Vue({
  data: {
    obj: {
      a: 1
    },
  },
  template: '<div>{{ obj.message }}{{ obj.a }}</div>'
});

// 无法被监听到，可以使用vm.$set(obj, propertyName, newValue)方法实现
vm.obj.message = 'modified';

// 无法被监听到，可以使用vm.$delete(obj, propertyName)方法实现
delete vm.obj.a;
```
3. 部分数组的操作无法监听到，Vue虽然针对部分数组的方法进行了包裹促使可以监听到。然而通过push、unshift方法增加的元素，`vm.items[indexOfItem] = newValue`这种是无法检测的
```
const vm = new Vue({
  data: {
    items: [1, 2, 3, 4, 5],
  },
});
// 对象和数组如果需要监听每个属性和元素，实际上是对每个属性或者元素进行Object.defineProperty劫持，对象是监听key而数组则是以数字下标作为key，数组的数据量可能会很大，因此Vue出于性能考虑，并没有对元素下标进行响应式处理。
vm.items[1] = 8;
// 无法监听到 数组新添加的元素和删除元素无法被Object.defineProperty监听。
vm.items[5] = 6;
// 也是由于Object.defineProperty的限制，数组的长度直接修改也无法被监听。
vm.items.length = 2;
```
### proxy
- proxy代理的是整个对象，而不是对象的某个特定属性，不需要我们通过遍历来逐个进行数据绑定。
- proxy在遇到一个对象的属性还是一个对象的情况下不需要递归监听，Object.defineProperty需要递归监听。
- proxy可以直接监听数组的变化。
- proxy提供了更丰富的拦截方式。
### [proxy与defineProperty的性能对比](https://mp.weixin.qq.com/s/uVEe5tb4WJd0Zk1crYo35A)
- Proxy在对象创建时的性能明显优于Object.defineProperty。
- 在浅层对象的读写性能方面Object.defineProperty表现更好，但是当对象的嵌套深度增加时，Object.defineProperty的优势会逐渐减弱。
- 在性能测试中Object.defineProperty的读写优势可能更适合实际开发场景，但Proxy的性能与Object.defineProperty并没有拉开太大差距。
- Vue3选择Proxy不仅仅基于性能考量，还因为Proxy提供了更为友好、现代且强大的API，使得操作更加灵活。