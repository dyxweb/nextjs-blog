## [react-markdown渲染markdown文件](https://blog.csdn.net/Sakuraaaa_/article/details/128400497)
### 安装依赖
```
yarn add react-markdown
 
// 其余样式插件
yarn add remark-gfm   
yarn add rehype-raw   
yarn add react-syntax-highlighter   
yarn add github-markdown-css
```
### 渲染markdown文件
```
import ReactMarkdown from 'react-markdown';

const App = () => {
  return (
    <ReactMarkdown>
      {/* markdown文件文件内容 */}
      {mdContent}
    </ReactMarkdown>
  )
}
```
### 优化样式
```
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm'; // 划线、表、任务列表和直接url等的语法扩展
import rehypeRaw from 'rehype-raw'; // 解析标签，支持html语法
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'; // 代码高亮
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'; // 代码高亮的主题
import 'github-markdown-css'; // 样式文件

const App = () => {
  return (
    <ReactMarkdown
      // 类名必须有才会有样式
      className="markdown-body"
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw]}
      components={{
        // 渲染代码块
        code(props: any) {
          const { children, ...rest } = props;
          return (
            <SyntaxHighlighter
              {...rest}
              style={vscDarkPlus}
              PreTag="div"
              language="javascript"
            >
              {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
          );
        }
      }}
    >
      
      {mdContent}
    </ReactMarkdown>
  )
}
```
### 生成导航目录
- 如果借用相关插件实现目录对我们markdown的书写格式规范要求较高，可能会出现解析目录失败的问题。
- 手动实现导航目录
  1. 对markdown渲染后的DOM进行遍历，取出所有的h1-h6标签以及标签中的文本进行目录展示，同时给所有的h1-h6标签添加a标签作为锚点，方便点击目录进行定位。
  ```
  // 根据H标签获取目录数据以及为H标签添加锚点
  const getNavs = () => {
    const blogDom = document.getElementsByClassName('markdown-body')[0];
    let eid = 0;
    const titles: any = [];
    for (const item of blogDom.childNodes as any) {
      const { nodeName, innerText } = item;
      if (['H1', 'H2', 'H3', 'H4', 'H5', 'H6'].includes(nodeName)) {
        const a = document.createElement('a');
        a.setAttribute('id', '#' + eid);
        a.innerText = ' ';
        const title = {
          type: nodeName,
          id: eid,
          name: innerText
        };
        titles.push(title);
        item.appendChild(a);
        eid++;
      }
    }
    setNavs(titles);
  };
  ```
  2. 点击生成的目录，跳转到对应的位置
  ```
  // 点击目录移动到对应内容
  const onNavClick = (e: any, id: number) => {
    e.preventDefault();
    if (id) {
      // 找到锚点对应得的节点
      const element = document.getElementById(`#${id}`);
      // 如果对应id的锚点存在，就跳滚动到锚点顶部
      element && element.scrollIntoView({ block: 'start', behavior: 'smooth' });
      onClose();
    }
  };
  ```