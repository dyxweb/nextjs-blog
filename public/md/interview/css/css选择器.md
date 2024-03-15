## css选择器
- 标签选择器（div, p, span等）
- id选择器（#content）
- 类选择器（.content）
- 相邻选择器（h1+p）
- 子选择器（ul>li）
- 后代选择器（li a）
- 通配符选择器（*）
- 属性选择器（a[rel = "external"]）
- 伪类选择器（a:hover, li:nth-child）
### css 优先级
- !important > id选择器 > 类选择器 > 标签选择器   !important 比 内联优先级高。
- 考虑到就近原则，同权重情况下样式定义以最近者为准。
- 同权重情况下 内联样式表（标签内部）> 嵌入样式表（当前文件中）> 外部样式表（外部文件中）