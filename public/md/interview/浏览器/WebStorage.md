## WebStorage
### localStorage
- 使用Key-Value形式储存，通过setItem和getItem等方法进行操作，使用很方便。
- Key和Value以字符串形式储存。对于一些复杂的数据存储需要使用JSON.stringify()。
- 持久化存储，不手动清除不会消失。
- 存储大小有10MB。
- 只存储在客户端，默认不参与与服务端的通信。这样就很好地避免了Cookie在http传输过程带来的性能问题和安全问题。
- localStorage受同源策略的限制，不能跨域共享。
#### 应用场景
- 利用localStorage的较大容量和持久特性，可以利用localStorage存储一些内容稳定的资源如token。
### sessionStorage
- sessionStorage和localStorage有一个本质的区别，sessionStorage只是会话级别的存储，localStorage是持久化存储。
- 会话结束也就是页面关闭，sessionStorage就不存在了。
- localStorage受同源策略的限制，不能跨域共享。
#### 在标签或窗口打开一个新页面时会复制当前会话的上下文作为新会话的上下文。
- 多窗口之间sessionStorage不可以共享状态，但是在某些特定场景下新开的页面会复制之前页面的sessionStorage，复制之后的新窗口的sessionStorage和之前窗口的sessionStorage各自独立互不影响。
- window.open("同源页面")这种方式新开的页面会复制之前的sessionStorage，通过a标签新开的页面同样也会。
- 如果不想要这种复制的效果，可以先新建一个空白页面窗口，再将url设置到窗口中的地址栏中去。
#### 应用场景
- 存储本次浏览记录，关闭之后不再需要这些记录。
### JavaScript中操作WebStorage
- 设置WebStorage
```
localStorage.setItem("name", "dyx");
```
- 修改WebStorage
> 修改WebStorage相当于对其进行重新设置。

- 读取WebStorage
```
const name = localStorage.getItem("name");
```
- 删除WebStorage
```
localStorage.removeItem("name");
```
- 删除所有WebStorage
```
localStorage.clear();
```