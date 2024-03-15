## try_files
> 单页应用history路由支持刷新时使用。有路由时会应用try_files规则，没有路由默认进入时不会应用try_files规则。nginx的alias和try_files互斥，不能同时使用。

### 示例一
> try_files设置文件查找规则为 $uri $uri/ /index.html。当访问/exer时$uri为/exer。

```
location / {
  # 指定根目录
  root   /home/admin/build;
  index  index.html index.htm;

  # 单页应用history支持刷新
  try_files $uri $uri/ /index.html;
}
```
- 首先检查/home/admin/build目录中是否存在exer文件，如果存在则返回文件，如果不存在则进行下一步。
- 其次检查/home/admin/build目录中是否存在exer目录，如果存在则再检查exer目录中是否存在index.html或者index.htm文件(由index指定)，如果存在则返回该文件，如果不存在则进行下一步。
- 最后检查/home/admin/build目录中是否存在index.html文件(root目录与try_files第三个规则的路径拼接)，如果存在则返回文件，如果不存在则返回404。
### 示例二
> 当访问/micro/exer时$uri为/micro/exer。

```
location /micro {
  # 指定根目录
  root   /home;
  index  build/index.html build/index.htm;

  try_files $uri $uri/ /micro/build/index.html;
}
```
- 首先检查/home目录中是否存在/micro/exer文件，如果存在则返回文件，如果不存在则进行下一步。
- 其次检查/home目录中是否存在/micro/exer目录，如果存在则在检查/micro/exer目录中是否存在build/index.html或者build/index.htm文件(由index指定)，如果存在则返回该文件，如果不存在则进行下一步。
- 最后检查/home目录中是否存在/micro/build/index.html文件(root目录与try_files第三个规则的路径拼接)，如果存在则返回文件，如果不存在则返回404。
