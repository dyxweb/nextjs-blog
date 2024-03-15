## React防御XSS
- React防御XSS关键在于jsx的处理上。
- React在它的领域范围内已经尽可能地帮我们防住了XSS攻击。
  1. 使用安全的API修改DOM。
  2. 禁止`<script>`执行。
  3. 特殊字符转义。
- React在客户端和服务端对XSS的防御方式不同。
- 使用dangerouslySetInnerHTML和一些可执行代码的地方，需要提高警惕防止XSS攻击。
### React客户端渲染防御XSS
- jsx实际上是React.createElement的语法糖，React使用.textContent安全的API将props.children作为文本插入html，不会有XSS的问题。
```
const App = () => {
  const [text] = useState('<img src onerror="alert(1)" />');

  // 不会有XSS问题，img标签以文本形式展示
  return (
    <div>{text}</div>
  );
}
```
- 通过document.getElementById('input').value = xxx或者.setAttribute()安全的API设置元素属性，不会有XSS的问题。
```
const App = () => {
  const [text] = useState('"><img src onerror="alert(1)" />');

  // 不会有XSS问题
  return (
    <input type="text" value={text} />
  );
}
```
- jsx里加入`<script>`既不会执行，也不会显示。
  1. React通过.innerHTML的方式插入`<script>`使得`<script>`不可执行。
  2. 使用dangerouslySetInnerHTML属性插入`<script>`也不会执行，不会显示，因为dangerouslySetInnerHTML底层也是调用.innerHTML。
```
const App = () => {
  // 不会有XSS问题，也不会显示
  return (
    <div>
      <script>alert(1)</script>
    </div>
  );
}
```
### React服务端渲染防御XSS
- 转义特殊字符：React对元素属性和内容中的5种特殊字符进行转义。
### dangerouslySetInnerHTML
- 在一些场景下我们需要直接往页面插入html代码，React提供dangerouslySetInnerHTML属性来实现这个功能，这有可能造成XSS攻击。
```
const App = () => {
  // 会有XSS问题
  return (
    <div dangerouslySetInnerHTML={{__html: '<img src onerror="alert(1)" />'}} />
  );
}
```
### 字符串可以作为代码运行的地方
- 不安全的字符串作为代码运行时有可能造成XSS攻击。
```
const App = () => {
  const [href] = useState('javascript:alert(1)');

  // 会有XSS问题
  return (
    <a href={href}>跳转</a>
  );
}
```
