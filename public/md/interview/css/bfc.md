## bfc(块级格式化上下文)
> BFC就是页面上一个单独的容器，容器内部的元素不会影响到外面的元素。

### 创建bfc
- float的值不是none
- position的值是absolute、fixed
- display的值是inline-block、flow-root、table-cell、table-caption、flex或者inline-flex、grid或者inline-grid
- overflow的值不是visible
### bfc的作用
- 用BFC包住浮动的子元素，子元素浮动，脱离了普通文档流，父元素包不住子元素。
  1. 父元素浮动
  2. 父元素绝对定位
  3. 父元素变为行内块级元素
  4. 父元素的overflow设置为hidden
- 和浮动元素产生边界，兄弟元素之间，其中左边元素浮动，右边元素会覆盖左边元素
  1. 右侧兄弟元素margin-left设置为浮动元素宽度+想要产生的边距宽度
  2. 让右侧兄弟元素的overflow设置为hidden
  3. 右侧元素浮动