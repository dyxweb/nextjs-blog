## LRU
> LRU（Least recently used，最近最少使用），如果数据最近被访问过，那么将来被访问的几率也更高。所以越常被使用的数据权重越高。当需要清理数据时总是清理最不常使用的数据。

### 实践
- 浏览器的访问历史
- tab形式页面的切换
### 实现
> 主要是使用什么数据结构来存储数据，因为map的存取非常快所以采用了它，当然数组、链表其实也可以实现的。

- set方法：往map里面添加新数据，如果添加的数据存在了，则先删除该条数据然后再添加。如果添加数据后超长了，则需要删除最久远的一条数据。data.keys().next().value 便是获取第一个键（最先存入map集合的键）。
- get方法：首先从map对象中拿出该条数据，然后删除该条数据，最后再重新插入该条数据，确保将该条数据移动到最前面。
```
class LRUCache {
  constructor(lenght) {
    this.length = lenght; // 存储长度
    this.data = new Map(); // 存储数据
  }

  // 存储数据，通过键值对的方式
  set(key, value) {
    const data = this.data;
    if (data.has(key)) {
      data.delete(key)
    }
    data.set(key, value);

    // 如果超出了容量，则需要删除最久的数据
    if (data.size > this.length) {
      const delKey = data.keys().next().value;
      data.delete(delKey);
    }
  }

  // 获取数据
  get(key) {
    const data = this.data;
    // 未找到
    if (!data.has(key)) {
      return null;
    }
    const value = data.get(key); // 获取元素
    data.delete(key); // 删除元素
    data.set(key, value); // 重新插入元素
  }
}
const lruCache = new LRUCache(5);
```
