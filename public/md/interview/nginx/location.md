### location
### http://ip
> 访问时http://ip会返回/home/admin/build（root配置）目录下的index.html（index配置）文件。

```
server {
  location / {
    # 指定根目录
    root   /home/admin/build;
    index  index.html index.htm;
  }
}
```
### http://ip/micro
> 访问时http://ip/micro会返回/home/micro（root配置 + location路径）目录下的build/index.html（index配置）文件。

```
server {
  location /micro {
    # 指定根目录
    root   /home;
    index  build/index.html build/index.htm;
  }
}
```
### location匹配规则
> nginx的匹配优先顺序按照如下的顺序进行优先匹配，一旦某一个匹配命中直接退出，不再进行往下的匹配。剩下的前缀匹配（大小写敏感）会按照最长匹配长度优先级来匹配，谁匹配的越多就用谁。

1. = 表示精确匹配。只有请求的url路径与后面的字符串完全相等时，才会命中。
2. ^~ 表示如果该符号后面的字符是最佳匹配，采用该规则，不再进行后续的查找。
3. ~ 表示该规则是使用正则定义的，区分大小写。
4. ~* 表示该规则是使用正则定义的，不区分大小写。
#### http://ip/document
> 匹配702。因为正则匹配比普通匹配的优先级更高，而且正则是一旦匹配到就直接退出所以不会再匹配703。

```
server {
  location /document {
    return 701;
  }
  location ~* ^/docume.*$ {
    return 702;
  }
  location ~* ^/document$ {
    return 703;
  }
}
```
#### http://ip/document
> 匹配702。因为^~精确匹配比正则匹配优先级更高。

```
server {
  location ~* ^/docume.*$ {
    return 701;
  }
  location ^~ /doc {
    return 702;
  }
  location ~* ^/document$ {
    return 703;
  }
}
```
#### http://ip/document
> 匹配701。前缀匹配是按照最长匹配，跟顺序无关。

```
server {
  location /doc {
    return 702;
  }
  location /docu {
    return 701;
  }
}
```