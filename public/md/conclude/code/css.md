## css
### 文字溢出省略号
- 文字单行溢出
```
overflow: hidden;            // 溢出隐藏
text-overflow: ellipsis;     // 溢出用省略号显示
white-space: nowrap;         // 规定段落中的文本不进行换行
```
- 多行文字溢出
```
overflow: hidden;            // 溢出隐藏
text-overflow: ellipsis;     // 溢出用省略号显示
display:-webkit-box;         // 作为弹性伸缩盒子模型显示。
-webkit-box-orient:vertical; // 设置伸缩盒子的子元素排列方式：从上到下垂直排列
-webkit-line-clamp:3;        // 显示的行数
```
### 页面整体变灰色(特殊日子)
```
html { 
  filter: grayscale(1);
  -webkit-filter: grayscale(1);
}
```