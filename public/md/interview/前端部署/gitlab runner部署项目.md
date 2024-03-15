## gitlab runner部署项目
### 安装gitlab runner
- [windows下载](https://docs.gitlab.com/runner/install/windows.html)
- 下载完成之后，使用管理员运行cmd命令行，然后到刚刚下载的位置中，使用install进行安装，然后start启动。
```
gitlab-runner-windows-amd64.exe install
gitlab-runner-windows-amd64.exe start
```
- 注册gitlab runner
> 服务器上运行gitlab-runner后，runner会轮询的发送带token的http请求给gitlab，如果gitlab有任务了(一般是git push)，那么会把任务信息返回给runner，然后runner就开始调用注册时选的Executor来执行项目根目录下的配置文件.gitlab-ci.yml，执行后把结果反馈给gitlab。

  1. 在gitlab的项目中打开Settings => CI/CD  => Runners中找到注册的url以及token。
  2. 执行命令register填写上面中对应的url跟token。tags的值很重要要认真填写，executor执行者选择shell。
  3. 注册成功之后可以在Settings => CI/CD  => Runners中看到刚注册的Runner。
```
gitlab-runner-windows-amd64.exe register
```
### gitlab-ci.yml
- 必须指定tags
- cache的设置保证下一阶段任务可以正常使用
```
# 构建阶段：build & deploy 两个 job；按照先后顺序执行
stages:
  - install
  - build
  - deploy
  
cache:
  paths:
    - node_modules
    # 这里将这两个文件缓存，为了在第二个job中使用。其实只要缓存第二个也就够了
    - build/

install:
  tags:
    - deploy test
  stage: install
  only: 
    # 只在提交到 deploy/test 分支的时候触发
    - deploy/test
  script:
    # 安装依赖
    - npm install

build:
  tags:
    - deploy test
  stage: build
  only: 
    # 只在提交到 deploy/test 分支的时候触发
    - deploy/test
  script:
    # 打包
    - npm run build

deploy:
  tags:
    - deploy test
  stage: deploy
  only:
    - deploy/test
  script:
    # 打包
    - npm run deploy test
```
### 报错记录
- ERROR: Job failed (system failure): prepare environment: failed to start process: exec: “pwsh”: executable file not found in %PATH%.
>  因为运行脚本的executor不正确，需要指定一下，打开我们安装gitlab runner的文件夹，有一个config.toml的文件，打开之后吧shell的位置修改为powerShell。然后重启gitlab runner。

- Treating warnings as errors because process.env.CI = true. Most CI servers set it automati
> build之前设置CI=false

```
"build": "set \"CI=false\" && webpack --config config/webpack.prod.js",
```