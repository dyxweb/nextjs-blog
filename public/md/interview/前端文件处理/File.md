## File
> File 文件接口提供有关文件的信息，并允许网页中的JavaScript访问其内容。实际上File对象是特殊类型的Blob，且可以用在任意的Blob类型的context中。Blob的属性和方法都可以用于File对象。File对象中只存在于浏览器环境中，在Node.js环境中不存在。

### 获取File对象
- input元素上选择文件后返回的FileList数组，这个数组的每个元素都是一个File对象，一个上传的文件就对应一个File对象。
```
<input type="file" id="fileInput" multiple="multiple">

const fileInput = document.getElementById("fileInput");
fileInput.onchange = (e) => {
  console.log(e.target.files); // FileList数组
}
```
- 文件拖放操作生成的DataTransfer对象。当拖放文件到拖放区域时，通过事件参数的dataTransfer属性的files获取到一个FileList数组，该数组的每一个元素都是一个File对象。
```
<div id="drop-zone"></div>

const dropZone = document.getElementById("drop-zone");
dropZone.ondragover = (e) => {
  e.preventDefault();
}
dropZone.ondrop = (e) => {
  e.preventDefault();
  const files = e.dataTransfer.files;
  console.log(files); // FileList数组
}
```
### File对象属性
- lastModified：引用文件最后修改日期，为自1970年1月1日0:00以来的毫秒数。
- lastModifiedDate：引用文件的最后修改日期。
- name：引用文件的文件名。
- size：引用文件的文件大小。
- type：文件的媒体类型（MIME）。
- webkitRelativePath：文件的路径或 URL。