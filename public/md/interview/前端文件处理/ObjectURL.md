## Object URL
> Object URL又称Blob URL，是HTML5中的新标准。它是一个用来表示File Object或Blob Object的URL。

### createObjectURL
> 可以使用URL构造函数的createObjectURL()方法创建将给出的对象的URL。这个URL对象表示指定的File对象或Blob对象。我们可以在img、script标签中或者a、link标签的href属性中使用这个URL。

```
<input type="file" id="fileInput" />
<img id="preview" />

const fileInput = document.getElementById("fileInput");
const preview = document.getElementById("preview");
fileInput.onchange = (e) => {
  // 直接预览图片
  preview.src = URL.createObjectURL(e.target.files[0]);
};
```

### revokeObjectURL
> 当使用createObjectURL()方法创建一个Object URL时，就需要使用revokeObjectURL()方法从内存中清除它来释放内存。虽然浏览器会在文档卸载时自动释放Object URL，但为了提高性能应该使用createObjectURL()来手动释放它。

```
const blob = new Blob(['123']);
const url = URL.createObjectURL(blob);
const link = document.createElement('a');
link.href = url;
link.download = '123.txt';
link.click();
// 释放一个之前已经存在的、通过调用URL.createObjectURL()创建的URL对象
URL.revokeObjectURL(url);
```

