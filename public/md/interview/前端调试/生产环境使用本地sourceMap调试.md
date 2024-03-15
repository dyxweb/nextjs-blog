## 生产环境使用本地sourceMap调试
> 由于生产环境不会上传sourceMap文件，所以当线上项目有错误信息时，无法精准定位到源代码，只能定位到打包后混淆的代码。可以使用本地sourceMap调试从而精准定位到源代码。

- 打开Sources面板找到Workspace页签，点击Add folder可以将本地包含sourceMap的目录添加进去（注意本地生成sourceMap时保证和线上环境代码一致）。
- 在Sources面板的Page页签下打开指定的打包后混淆的代码文件。
- 在打开的打包后混淆的代码文件中右键选择Add source map，将该文件对应的sourceMap文件路径（可以在Workspace页签对应的sourceMap文件右键选择Copy link address）添加进去即可。
- 添加之后可以根据控制台错误信息精准定位到源代码（浏览器刷新之后需要重新执行Add source map步骤）。