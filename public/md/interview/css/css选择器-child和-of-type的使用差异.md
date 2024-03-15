## css选择器-child和-of-type的使用差异
> 平时开发中经常 -child 和 -of-type 傻傻分不清楚，本文将以:first-child和:first-of-type为例说明其差异。

### 选择器
- :first-child         :first-of-type
- :last-child          :last-of-type
- :nth-child(n)        :nth-of-type(n)
- :nth-last-child(n)   :nth-last-of-type(n)
- only-child           :only-of-type
### :first-child
> :first-child 选择器用于选取属于其父元素的首个子元素的指定选择器

### :first-of-type
> :first-of-type 选择器匹配属于其父元素的特定类型的首个子元素的每个元素

### 使用示例
**使用元素选择器**
> p:first-child 可以理解为查找p元素的父元素中第一个子元素，如果为p元素则应用，否则不应用。p:first-of-type 可以理解为查找p元素的父元素中第一个为p的元素，找到并应用。

- :first-child
> 没有任何子元素应用背景色，因为p标签的父元素的第一个子元素是div不是p，所以选择器不生效。

```
p:first-child {
  background: #ff0000;
}
<div>
  <div>div</div>
  <p>1</p>
  <p>2</p>
  <p>3</p>
</div>
```
- :first-of-type
> 查找p元素的父元素中第一个为p的元素，所以第一个p元素应用背景色。

```
p:first-of-type {
  background: #ff0000;
}
<div>
  <div>div</div>
  <p>1</p> // 应用背景色
  <p>2</p>
  <p>3</p>
</div>
```

**使用class或者id选择器**
> .exer:first-child 可以理解为查找.exer元素的父元素中第一个子元素，如果为该元素元素有.exer类则应用，否则不应用。.exer:first-of-type 可以理解为查找.exer元素，然后根据对应元素的标签开始找同类型标签的兄弟节点，如果查找到这个元素是同类型兄弟元素中的第一个，则应用，否则不应用。

- :first-child
> 没有任何子元素应用背景色，因为.exer的父元素的第一个子元素没有exer类，所以选择器不生效。

```
.exer:first-child {
  background: #ff0000;
}
<div>
  <p>p</p>
  <p class="exer">1</p>
  <p class="exer">2</p>
  <p class="exer">3</p>
</div>
```
- :first-of-type
> 没有任何子元素应用背景色，因为.exer的元素类型是p元素，该元素在同为p的兄弟元素中不是第一个所以没有任何元素应用背景色。

```
.exer:first-of-type {
  background: #ff0000;
}
<div>
  <p>p</p>
  <p class="exer">1</p>
  <p class="exer">2</p>
  <p class="exer">3</p>
</div>
```

**使用class或者id选择器搭配:first-of-type查找到的元素节点有很多种**
- :first-child
> .exer:first-child 因为.exer的父元素的第一个子元素有exer类，所以选择器生效。

```
.exer:first-child {
  background: #ff0000;
}
<body class="body">
  <h1 class="exer">标题1</h1> // 应用背景色
  <h1 class="exer">标题2</h1>
  <p>段落1</p>
  <p class="exer">段落2</p>
  <p class="exer">段落3</p>
  <p class="exer">段落4</p>
  <div class="exer">div 1</div>
  <div>div 2</div>
</body>
```
- :first-of-type
> .exer:first-of-type 会匹配到的元素类型有h1、p、div标签但是找到的p标签不是同为p标签的兄弟元素中的第一个，所以只有h1、div标签应用背景色。

```
.exer:first-of-type {
  background: #ff0000;
}
<body class="body">
  <h1 class="exer">标题1</h1> // 应用背景色
  <h1 class="exer">标题2</h1>
  <p>段落1</p>
  <p class="exer">段落2</p>
  <p class="exer">段落3</p>
  <p class="exer">段落4</p>
  <div class="exer">div 1</div> // 应用背景色
  <div>div 2</div>
</body>
```
### 总结
- first-child会判断选择器选择到的元素的第一个兄弟元素是否匹配对应的选择器，不会考虑元素的html标签类型。
- first-of-type会判断选择器选择到的元素的html标签类型，判断相同html标签类型的第一个兄弟元素是否匹配对应的选择器。
