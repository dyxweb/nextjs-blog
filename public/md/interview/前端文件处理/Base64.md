## Base64
> Base64是一种基于64个可打印字符来表示二进制数据的表示方法。Base64编码普遍应用于需要通过被设计为处理文本数据的媒介上储存和传输二进制数据而需要编码该二进制数据的场景。这样是为了保证数据的完整并且不用在传输过程中修改这些数据。

### 编码解码
- atob()：解码，解码一个Base64字符串；
- btoa()：编码，从一个字符串或者二进制数据编码一个Base64字符串。
```
btoa("JavaScript");       // 'SmF2YVNjcmlwdA=='
atob('SmF2YVNjcmlwdA=='); // 'JavaScript'
```
### 使用场景
- 使用toDataURL()方法把canvas画布内容生成base64编码格式的图片url进行展示。
```
const canvas = document.getElementById('canvas'); 
const ctx = canvas.getContext("2d");
const dataUrl = canvas.toDataURL();
```
- 使用readAsDataURL()方法把上传的文件转为base64格式的图片url进行展示。
```
<input type="file" id="fileInput" />
<img id="preview" />

const fileInput = document.getElementById("fileInput");
const preview = document.getElementById("preview");
const reader = new FileReader();

fileInput.onchange = (e) => {
  reader.readAsDataURL(e.target.files[0]);
};

reader.onload = (e) => {
  preview.src = e.target.result;
};
```