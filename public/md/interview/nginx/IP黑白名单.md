## nginx实现IP黑白名单
> 有时候某些接口只能开放给对应的合作商，或者购买/接入 API 的合作伙伴，那么此时就需要实现类似于IP白名单的功能。而有时候有些恶意攻击者或爬虫程序，被识别后需要禁止其再次访问网站，因此也需要实现IP黑名单。这些功能可直接在nginx中处理。主要是通过allow、deny配置项来实现。

```
# 允许指定的IP访问，可以用于实现白名单。
allow xxx.xxx.xxx.xxx;

# 禁止指定的IP访问，可以用于实现黑名单。
deny xxx.xxx.xxx.xxx; 
```
### 要同时屏蔽/开放多个IP访问时，如果所有IP全部写在nginx.conf文件中是比较冗余的，可以新建两个文件BlackIP.conf、WhiteIP.conf声明黑名单和白名单。
- BlackIP.conf 黑名单
```
# 屏蔽192.177.12.222访问
deny 192.177.12.222;  

# 屏蔽192.177.44.201访问  
deny 192.177.44.201; 
```
- WhiteIP.conf 白名单
```
# 允许192.177.12.222访问
allow 192.177.12.222;   

# 允许192.177.44.201访问
allow 192.177.44.201;   

# 除上述IP外，其他IP全部禁止访问 
deny all; 
```
- 分别将要禁止/开放的IP添加到对应的文件后，可以将这两个文件在nginx.conf中导入
> 如果要整站屏蔽/开放就在http中导入，如果只需要一个域名下屏蔽/开放就在sever中导入，如果只需要针对于某一系列接口屏蔽/开放就在location中导入。

```
http {  
  # 屏蔽该文件中的所有IP  
  include /nginx/IP/BlackIP.conf;   
  server {  
    location xxx {  
      # 某一系列接口只开放给白名单中的IP  
      include /nginx/IP/WhiteIP.conf;   
    }  
  }  
} 
```