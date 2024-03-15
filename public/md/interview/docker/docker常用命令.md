## docker常用命令
- docker --version 查看docker版本
### 镜像相关命令
- 构建镜像
  1. -t 设置镜像的名字及标签name:tag，可以为一个镜像名设置多个标签。不设置tag时tag默认为latest。
  2. . 表示当前路径，也可指定其他路径。
```
// 镜像名admin，tag为0.0.1
docker build -t admin:0.0.1 .
```
- docker images 列出镜像
- docker rmi imageId | imageName:imageTag 删除镜像
- docker rmi imageId | imageName:imageTag --force 强制删除镜像(被容器使用的镜像不可被删除)
### 容器相关命令
- 启动容器
  1. -d 后台运行。
  2. -p 指定映射端口号，前一个端口号为服务监听端口号，后一个为容器内部监听端口号，80:80将宿主服务的80端口映射到容器的80端口。
  3. -v 指定数据卷挂载，/aaa:/bbb/ccc挂载宿主机的/aaa目录到容器的/bbb/ccc目录。容器内读写/bbb/ccc目录的时候改的就是宿主机的/aaa目录，改宿主机/aaa目录，容器内的/bbb/ccc也会改。
  4. --name admin 容器名为admin。
  5. admin:0.0.1 使用镜像名为admin的 0.0.1 tag版本，不指定tag版本默认使用latest版本。
```
docker run -d -p 80:80 -v /aaa:/bbb/ccc --name admin admin:0.0.1
```
- docker ps 查看正在运行的容器
- docker ps -a 查看所有的容器
- docker start containerId | containerName 启动容器
- docker restart containerId | containerName 重启容器
- docker stop containerId | containerName 停止容器
- docker rm containerId | containerName 删除容器 (运行中的容器不能删除，需先停止容器才删除)
- docker rm -f containerId | containerName 强制删除容器 (运行中的容器能强制删除)
- docker同一容器需要更换镜像，需要先将容器删除，更换镜像之后再开启容器
### 进入容器内部相关命令
- docker exec -it containerId | containerName ls  查看容器的文件目录
- docker exec -it containerId | containerName sh  进入容器
- exit  进入容器后退出
### 容器内文件复制到服务器操作
> 在docker容器中进行文件的读写，改动并不会同步到服务器的文件，需要将容器的文件复制到服务器。

```
// docker cp containerId:docker文件路径 服务器文件路径
docker cp containerId:/app/schedule.json /root/fe 
```

