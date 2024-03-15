## plugin
> plugin是一个扩展器，它丰富了webpack本身，针对是loader结束后，webpack打包的整个过程，它并不直接操作文件，而是基于事件机制工作，会监听webpack打包过程中的某些节点，执行广泛的任务。

### define-plugin
> 定义全局的变量(一般用于区分生产环境和开发环境)。使用时不能通过window.QUERYHOST获取，只能通过QUERYHOST直接使用。

```
plugins: [
  new webpack.DefinePlugin({
    'QUERYHOST': JSON.stringify('http://localhost:7001/api'),
  })
]
```
### html-webpack-plugin
> 默认添加脚本标签位置是头部而不是主体，由于脚本标记具有defer属性，因此只有在解析了HTML后脚本才会加载，所以不会有任何问题。如果仍然希望将脚本标记添加到正文的末尾，则可以使用inject选项。

- 自动引入打包后的资源(比如资源名称含hash值的情况)
```
new HtmlWebpackPlugin({
  filename: 'index.html', // 配置输出文件名和路径
  template: path.join(__dirname, "../template/index.html") // 配置文件模板
})
```
- 多入口
```
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
  mode:'development', // 开发模式
  entry: {
    main:path.resolve(__dirname,'../src/main.js'),
    header:path.resolve(__dirname,'../src/header.js')
  }, 
  output: {
    filename: '[name].[hash:8].js',      // 打包后的文件名称
    path: path.resolve(__dirname,'../dist')  // 打包后的目录
  },
  plugins:[
    new HtmlWebpackPlugin({
      template:path.resolve(__dirname,'../public/index.html'),
      filename:'index.html',
      chunks:['main'] // 与入口文件对应的模块名
    }),
    new HtmlWebpackPlugin({
      template:path.resolve(__dirname,'../public/header.html'),
      filename:'header.html',
      chunks:['header'] // 与入口文件对应的模块名
    }),
  ]
}
```
### clean-webpack-plugin
> 当打包后的文件名字固定时，新的打包文件会自动覆盖上次的，如果文件名使用了hash，则不会自动删除上次打包的文件，使用clean-webpack-plugin可以自动清除上次打包的文件。

```
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
plugins: [
  new CleanWebpackPlugin(),
],
```
### hard-source-webpack-plugin
> 可以优化构建速度,第一次构建将花费正常的时间,第二次构建将明显加快（大概提升90%的构建速度。缓存文件默认存在node_module下。webpack5.0会把hard-source-webpack-plugin内置成一个配置。

```
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
plugins: [
  new HardSourceWebpackPlugin({
    cachePrune: {
      maxAge: 2 * 24 * 60 * 60 * 1000, // 设置缓存文件过期时间为2天
      sizeThreshold: 500 * 1024 * 1024, // 总缓存文件大于500M时才会自动删除过时的缓存文件
    },
  }),
]
```
### extract-text-webpack-plugin
> 将css分开打包

```
const ExtractTextPlugin = require('extract-text-webpack-plugin');
{
  test: /.css$/,
  use: ExtractTextPlugin.extract({ // 调用分离插件内的extract方法
    fallback: 'style-loader', // 相当于回滚，经postcss-loader和css-loader处理过的css最终再经过style-loader处理
    use: ['css-loader', 'postcss-loader']
  })
},
plugins: [
  new ExtractTextPlugin('index.css'), // 将css分离到/public文件夹下的css文件夹中的index.css
]
```
### compression-webpack-plugin
> 将文件压缩成gzip的形式

```
const CompressionPlugin = require('compression-webpack-plugin');
new CompressionPlugin({
  filename: '[path].gz[query]',
  algorithm: 'gzip', // 算法
  test: new RegExp(
    '\\.(js|css|less|scss)$' // 压缩 js 与 css
  ),
  // threshold: 10240, // 只处理比这个值大的资源。按字节计算
  // minRatio: 0.8 // 只有压缩率比这个值小的资源才会被处理
}),
```
### unused-files-webpack-plugin 
> 查找无用文件

```
const { UnusedFilesWebpackPlugin } = require("unused-files-webpack-plugin");
 
// 会输出无用文件目录
module.exports = {
  plugins: [
    new UnusedFilesWebpackPlugin(),
  ],
};

// cwd  插件检索的目录
globOptions: { cwd: path.resolve(__dirname, "../src") },

// 找到未使用的文件直接退出命令 默认false
failOnUnused: true, 
```
### webpack-bundle-analyzer
> 运行打包命令，打开的页面会显示各个模块的大小。

```
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
plugins: [
  new BundleAnalyzerPlugin({
    analyzerMode: 'server',
    analyzerHost: '127.0.0.1',
    analyzerPort: 8888,
    reportFilename: 'report.html',
    defaultSizes: 'parsed',
    openAnalyzer: true,
    generateStatsFile: false,
    statsFilename: 'stats.json',
    logLevel: 'info'
  })
]
```
### Speed Measure Plugin
> 对打包过程中消耗的时间进行精确的统计，能够测量出在你的构建过程中，每一个 Loader 和 Plugin 的执行时长,在启动本地服务的命令行中显示。smp.wrap包裹所有的webpack的配置module.exports = smp.wrap({})，使用webpack-merge后不用加smp.wrap({}), 引入插件即可。

```
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const smp = new SpeedMeasurePlugin();
const webpackConfig = smp.wrap({
  plugins: [
    new MyPlugin(),
    new MyOtherPlugin()
  ]
});
```