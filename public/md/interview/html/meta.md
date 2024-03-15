## meta
> meta是文档级元数据元素，meta标签一般放在整个html页面的head部分。

### description
- 一段简短而精确对页面内容的描述。
```
<meta name="description" content="dyxweb个人网站">
```
### keywords
- 与页面内容相关的关键词，使用逗号分隔。
- 某些搜索引擎在遇到这些关键字时，会用这些关键字对文档进行分类。
```
<meta name="keywords" content="dyxweb,个人网站">
```
### viewport
- 用来配置视口大小和缩放等。
- viewport只对移动端浏览器有效，对PC端浏览器是无效的。
```
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
```
### author
- 用来表示网页的作者的名字，例如某个组织或者机构。
```
<meta name="author" content="dyxweb">
```
### robots
- 表示爬虫对此页面的处理行为，是用来做搜索引擎抓取的。content值如下。
  1. all：搜索引擎将索引此网页，并继续通过此网页的链接索引搜索其它的网页。
  2. none：搜索引擎将忽略此网页。
  3. index：搜索引擎索引此网页。
  4. follow：搜索引擎继续通过此网页的链接索引搜索其它的网页。
```
<meta name="robots" content="all">
```
### renderer
- 用来指定双核浏览器的渲染方式。
```
<meta name="renderer" content="webkit"> // 默认webkit内核
<meta name="renderer" content="ie-comp"> // 默认IE兼容模式
<meta name="renderer" content="ie-stand"> // 默认IE标准模式
```
