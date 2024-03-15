## 配置SSL证书
> 网站接入HTTPS需要在nginx中配置SSL证书。

1. 去CA机构或从云控制台中申请对应的SSL证书，审核通过后下载nginx版本的证书。
2. 下载数字证书后，完整的文件总共有三个：.crt、.key、.pem：
    - .crt：数字证书文件，.crt 是.pem 的拓展文件，因此有些人下载后可能没有。
    - .key：服务器的私钥文件，及非对称加密的私钥，用于解密公钥传输的数据。
    - .pem：Base64-encoded 编码格式的源证书文本文件，可自行根需求修改拓展名。
3. 在nginx目录下新建certificate目录，并将下载好的证书/私钥等文件上传至该目录。
4. 修改一下nginx.conf文件如下
```
# ----------HTTPS配置-----------  
server {  
  # 监听HTTPS默认的443端口  
  listen 443;

  # 配置自己项目的域名  
  server_name domain;  

  # 打开SSL加密传输  
  ssl on;  

  # 输入域名后，首页文件所在的目录  
  root html; 

  # 配置首页的文件名  
  index index.html index.htm index.jsp index.ftl;  

  # 配置自己下载的数字证书  
  ssl_certificate  certificate/xxx.pem;  

  # 配置自己下载的服务器私钥  
  ssl_certificate_key certificate/xxx.key;  

  # 停止通信时，加密会话的有效期，在该时间段内不需要重新交换密钥  
  ssl_session_timeout 5m;  

  # TLS握手时，服务器采用的密码套件  
  ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE:ECDH:AES:HIGH:!NULL:!aNULL:!MD5:!ADH:!RC4;

  # 服务器支持的TLS版本  
  ssl_protocols TLSv1 TLSv1.1 TLSv1.2;  

  # 开启由服务器决定采用的密码套件  
  ssl_prefer_server_ciphers on;  

  location / {  
    ....  
  }  
}  
  
# ---------HTTP请求转HTTPS-------------  
server {  
  # 监听HTTP默认的80端口  
  listen 80;  

  # 如果80端口出现访问该域名的请求  
  server_name domain;  
  
  # 将请求重定向到HTTPS
  rewrite ^/(.*)$ https://domain/$1 permanent;  
} 
```
### http请求重定向到https时非GET请求报405的问题
> 设置301重定向后所有的请求方法都变成了GET方式，导致一些POST、DELETE等请求报405不能正常使用。可以针对非GET请求使用proxy_pass方法，GET请求使用rewrite

```
server {
  # 监听HTTP默认的80端口  
  listen 80;  

  # 如果80端口出现访问该域名的请求  
  server_name domain;  
  
  location / {
    # 非GET请求用proxy_pass来转发
    if ($request_method ~ ^(POST|DELETE|OPTIONS)$) {
      proxy_pass https://domain;
      break;
    }

    # 将请求重定向到HTTPS
    rewrite ^/(.*)$ https://domain/$1 permanent;  
  }
}
```
