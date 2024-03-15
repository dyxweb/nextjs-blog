## [链表中倒数第k个节点](https://leetcode.cn/problems/lian-biao-zhong-dao-shu-di-kge-jie-dian-lcof/)
> 输入一个链表，输出该链表中倒数第k个节点。从1开始计数，即链表的尾节点是倒数第1个节点。

- 循环链表，创建对象obj以index为key节点为value存储每个节点，直到循环结束。
- 上一步循环获取到最后一个节点的index值，index - k即是倒数第k个节点的index值。最终返回obj[index - k]。
```
var getKthFromEnd = function(head, k) {
  let obj = {}, point = head, index = 0;
  // 循环链表存储链表每个节点信息
  while(point) {
    obj[index] = point
    index++;
    point = point.next;
  }
  return obj[index - k];
};
```