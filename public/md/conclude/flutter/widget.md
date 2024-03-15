## widget
- 无状态的 widgets 是不可变的，这意味着它们的属性不能改变 —— 所有的值都是 final。
- 有状态的 widgets 也是不可变的，但其持有的状态可能在 widget 生命周期中发生变化，实现一个有状态的 widget 至少需要两个类
  1. 一个 StatefulWidget 类；
  2. 一个 State 类，StatefulWidget 类本身是不变的，但是 State 类在 widget 生命周期中始终存在。