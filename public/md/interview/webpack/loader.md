## loader
> 利用 Webpack 我们不仅可以打包 JS 文件，还可以打包图片、CSS、字体等其他类型的资源文件。而支持打包非 JS 文件的特性是基于 Loader 机制来实现的。loader的设计要做到每个 Loader 的职责单一。

### loader的作用
> Loader 本质上是导出函数的 JavaScript 模块。所导出的函数，可用于实现内容转换。

```
/**
 * @param {string|Buffer} content 源文件的内容
 * @param {object} [map] 可以被 https://github.com/mozilla/source-map 使用的 SourceMap 数据
 * @param {any} [meta] meta 数据，可以是任何内容
 */
function webpackLoader(content, map, meta) {
  // 你的webpack loader代码
}
module.exports = webpackLoader;
```
### 样式相关
- style-loader 将模块导出的内容作为样式并添加到 DOM 中
- css-loader 加载 CSS 文件并解析 import 的 CSS 文件，最终返回 CSS 代码
- less-loader 加载并编译 LESS 文件
- sass-loader 加载并编译 SASS/SCSS 文件
- postcss-loader 使用 PostCSS 加载并转换 CSS/SSS 文件
### 模板相关
- raw-loader
> 此loader可以允许我们以字符串的形式引入文件原始内容，比如markdown文件等。

```
{
  test: /\.md$/,
  use: 'raw-loader'
}
```
- markdown-loader
> 使用markdown-loader以及html-loader可以将引入的markdown文件转为html。代码区块有空行会显示错误。

```
{
  test: /\.md$/,
  use: ['html-loader', 'markdown-loader'],
},
```
### cache-loader
> 打包时间的大部分都在npm install和各种loader的执行上，可以在loader之前加上cache-loader，这样这个loader执行过一次后的数据会缓存在node_modules/.cache目录下，下次再打包就会利用缓存。只有执行时间很长的loader才适合用缓存，因为读写文件也是有开销的，滥用反而会导致变慢。
