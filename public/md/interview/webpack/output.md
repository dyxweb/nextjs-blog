## output
### output.path
> output.path指示静态资源输出的目录，对应一个绝对路径。默认值：process.cwd()。

```
output: {
 path: path.resolve(__dirname, '../build'),
}
```
### output.publicPath
> output.publicPath为项目中的所有资源指定一个基础路径，它被称为公共路径。这个最终静态资源访问路径在使用html-webpack-plugin打包后得到的html中可以看到。默认值：空字符串。

- 静态资源最终访问路径 = output.publicPath + 资源loader或插件的配置路径。
- 一般情况下publicPath应该以'/'结尾，而资源loader或插件的配置路径不要以'/'开头。
- 当部署项目访问路径不是根路径或者需要访问cdn资源时会特殊配置output.publicPath。
```
output: {
  publicPath: '/build/',
  filename: 'static/js/[name].[contenthash:8].js',
},

// 最终js的访问路径为
/build/static/js/[name].[contenthash:8].js
```
