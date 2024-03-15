## 反向代理
- proxy_pass：定义后端服务器的地址。
- proxy_set_header：修改从客户端传递到代理服务器的请求头。
- proxy_hide_header：隐藏从代理服务器返回的响应头。
- proxy_redirect：修改从代理服务器返回的响应头中的Location和Refresh头字段。
### 访问http://192.168.1.1/proxy/test.html
> 如果在proxy_pass后面的url加/，表示绝对根路径；如果没有/，表示相对路径，把匹配的路径部分也给代理走。

- 代理到http://127.0.0.1/test.html
```
location /proxy {
  proxy_pass http://127.0.0.1/;
}
```
- 代理到http://127.0.0.1/proxy/test.html
```
location /proxy {
  proxy_pass http://127.0.0.1;
}
```
- 代理到http://127.0.0.1/aaa/test.html
```
location /proxy {
  proxy_pass http://127.0.0.1/aaa/;
}
```
- 代理到http://127.0.0.1/aaatest.html
```
location /proxy {
  proxy_pass http://127.0.0.1/aaa;
}
```