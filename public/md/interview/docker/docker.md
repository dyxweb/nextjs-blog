## docker
> Docker是一种容器技术，可以在操作系统上创建多个相互隔离的容器。容器内独立安装软件、运行服务。但是这个容器和宿主机还是有关联的，比如可以把宿主机的端口映射到容器内的端口、宿主机某个目录挂载到容器内的目录。

### [优化镜像体积](https://mp.weixin.qq.com/s/JnTmB7H-8tJuRWMosnHCKA)
- 使用alpine镜像，而不是默认的linux镜像。
> alpine去掉了很多linux里用不到的功能，使得镜像体积更小。

```
// Dockerfile

// before
FROM node:lts
FROM nginx:stable

// after
FROM node:lts-alpine
FROM nginx:stable-alpine
```
- 多阶段构建
> 源码和依赖是不需要的，但是现在都保存在了镜像里。实际上我们只需要构建出来的build目录下的文件。

1. FROM后面添加一个as来指定当前构建阶段的名字。
2. 通过COPY --from=xxx 可以从上个阶段复制文件过来。
3. docker build之后，只会留下最后一个阶段的镜像。
4. 最终构建出来的镜像里是没有源码的，有的只是build的文件，这样镜像就会小很多。
```
# build stage
FROM node:lts-alpine as build-stage

WORKDIR /app

COPY package.json ./

COPY yarn.lock ./

RUN yarn

COPY . . 

RUN npm run build

# production stage 
FROM nginx:stable-alpine as production-stage

COPY --from=build-stage /app/build /home/admin/build/

COPY default.conf /etc/nginx/conf.d/default.conf
```
### 优化镜像构建速度
- 充分利用缓存
> docker是分层存储的，dockerfile里的每一行指令是一层，会做缓存。每次docker build的时候，只会从变化的层开始重新构建，没变的层会直接复用。现在这种写法(先复制package.json进去，安装依赖之后再复制其他文件)，如果package.json没变，就不会执行yarn，直接复用之前的。如果一开始就把所有文件复制进去那不管package.json变没变，任何一个文件变了都会重新yarn，这样没法充分利用缓存性能不好。

```
# build stage
FROM node:lts-alpine as build-stage

WORKDIR /app

COPY package.json ./

COPY yarn.lock ./

RUN yarn

COPY . . 

RUN npm run build

# production stage 
FROM nginx:stable-alpine as production-stage

COPY --from=build-stage /app/build /home/admin/build/

COPY default.conf /etc/nginx/conf.d/default.conf
```

