## root和alias
> alias是一个目录别名的定义，root则是最上层目录的含义。

### 差异
- root的处理结果是: root路径 + location路径；alias的处理结果是: 使用alias路径替换location路径。
- 如果location路径是以/结尾，则alias也必须是以/结尾，root没有要求。
- alias无法与try_files搭配使用，root可以与try_files搭配使用。

### /home/micro/build/index.html目录
- root
```
location /micro {
  root   /home;
  index  build/index.html build/index.htm;
}
```
- alias
```
location /micro {
  alias  /home/micro;
  index  build/index.html build/index.htm;
}
```