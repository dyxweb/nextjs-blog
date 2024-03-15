## css
### css3新增的伪类
- -child 类
- -of-type 类
- first-line 选择元素中的第一行（伪元素）
- first-letter 选择元素中的第一个字符（伪元素）
- after 在元素在该元素之后添加内容（伪元素）
- before 在元素在该元素之前添加内容（伪元素）
### position的值
- relative（相对定位）： 生成相对定位的元素，定位原点是元素本身所在的位置；
- absolute（绝对定位）：生成绝对定位的元素，定位原点是离自己这一级元素最近的一级position设置为absolute或者relative的父元素的左上角为原点的，否则是html元素。
- fixed （固定定位）：生成绝对定位的元素，相对于浏览器窗口进行定位。
- static：默认值。没有定位，元素出现在正常的流中（忽略 top, bottom, left, right、z-index 声明）。
- inherit：规定从父元素继承 position 属性的值。
- sticky (粘贴定位)：必须指定top、bottom、left、right4个值之一
### 创建三角
> 利用border的特性，隐藏其中三条边。

### 为什么要初始化CSS样式
> 因为浏览器的兼容问题，不同浏览器对标签的默认值是不同的，如果没有对浏览器的CSS初始化，会造成相同页面在不同浏览器的显示存在差异。

### CSS预处理器/后处理器
- 预处理器，如：less，sass，增加了css代码的复用性，还有层级，变量，循环， 函数等，对编写以及开发UI组件都极为方便。
- 后处理器，如：postCss，目前最常做的是给css属性添加浏览器私有前缀，实现跨浏览器兼容性的问题。
### rgba 和 opacity 的透明效果有什么不同
- opacity 作用于元素以及元素内的所有内容（包括文字）的透明度
- rgba 只作用于元素自身的颜色或其背景色，子元素不会继承透明效果
### 外边距重叠
- 两个相邻的外面边距是正数时，折叠结果就是他们之中的较大值
- 两个相邻的外边距都是负数时，折叠结果是两者绝对值的较大值
- 两个外边距一正一负时，折叠结果是两者的相加的和
### 解析css
> CSS选择器的解析是从右向左解析的，这样会提高查找选择器所对应的元素的效率。若从左向右的匹配，发现不符合规则，需要进行回溯，会损失很多性能。若从右向左匹配，先找到所有的最右节点，对于每一个节点，向上寻找其父节点直到找到根元素或满足条件的匹配规则。

### others
- transform移动之后有锯齿 加 translateZ(0) 可解决
- rgba的背景色的透明度不影响文字的显示，opacity会影响。
- cursor: not-allowed;  和  pointer-events: none;  共用前面不生效， 两层元素可解决此问题，外层使用前者，内层使用后者
- sass继承另一个类的样式 @extend
```
.button-basic  {
  border: none;
  padding: 15px 30px;
  text-align: center;
  font-size: 16px;
  cursor: pointer;
}

.button-report  {
  @extend .button-basic;
  background-color: red;
}
```


