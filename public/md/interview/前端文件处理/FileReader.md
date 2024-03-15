## FileReader
> FileReader是一个异步API，用于读取文件并提取其内容以供进一步使用。FileReader可以将Blob读取为不同的格式。
FileReader仅用于以安全的方式从用户（远程）系统读取文件内容，不能用于从文件系统中按路径名简单地读取文件。

### FileReader创建
> 通过FileReader()构造函数创建FileReader对象。

```
const reader = new FileReader();
```
### FileReader属性
- error：表示在读取文件时发生的错误。
- result：文件内容。该属性仅在读取操作完成后才有效，数据的格式取决于使用哪个方法来启动读取操作。
- readyState：表示FileReader状态的数字。取值0：还没有加载任何数据；取值1：数据正在被加载；取值2：已完成全部读取。
### FileReader方法
> 下面这些方法接受一个要读取的blob对象作为参数，读取完之后会将读取的结果放入对象的result属性中。

- readAsArrayBuffer()：读取指定Blob中的内容，完成之后result属性中保存的将是被读取文件的ArrayBuffer数据对象。
- readAsBinaryString()：读取指定Blob中的内容，完成之后result属性中将包含所读取文件的原始二进制数据。
- readAsDataURL()：读取指定Blob中的内容，完成之后result属性中将包含一个data: URL格式的Base64字符串以表示所读取文件的内容。
- readAsText()：读取指定Blob中的内容，完成之后result属性中将包含一个字符串以表示所读取的文件内容。
### FileReader事件处理
> 这些方法可以加上前置on后在HTML元素上使用，比如onload、onerror、onabort、onprogress。由于FileReader对象继承自EventTarget，因此还可以使用addEventListener()监听上述事件。

- abort：该事件在读取操作被中断时触发。
- error：该事件在读取操作发生错误时触发。
- load：该事件在读取操作完成时触发。
- progress：该事件在读取Blob时触发。

```
<input type="file" id="fileInput">

const fileInput = document.getElementById("fileInput");
const reader = new FileReader();
fileInput.onchange = (e) => {
  reader.readAsText(e.target.files[0]);
  // 上传图片文件时可以使用readAsDataURL方法获取base64编码的URL进行预览展示
  reader.readAsDataURL(e.target.files[0]);
}
reader.onload = (e) => {
  console.log(e.target.result);
}

// 可以通过progress事件来监控文件的读取进度
reader.onprogress = (e) => {
  if (e.loaded && e.total) {
    const percent = (e.loaded / e.total) * 100;
    console.log(`上传进度: ${Math.round(percent)} %`);
  }
});
```

