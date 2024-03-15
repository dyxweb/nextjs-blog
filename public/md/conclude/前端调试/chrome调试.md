## chrome调试
### 重新发起请求
- Network选择要重新发送的请求
- 右键选择Replay XHR
### 在控制台快速发起请求
- Network选择要发起的请求
- 右键选择Copy as fetch
- 控制台粘贴代码
- 修改参数，回车搞定
### 复制JavaScript变量
- 使用copy函数，将对象作为入参执行。
- JSON.stringify(obj, null, 2)打印到控制台，再手动复制粘贴。
### 控制台获取Elements面板选中的元素
- 通过Elements选择要调试的元素
- 控制台直接用$0访问
### 截取一张全屏的网页
- 准备好需要截屏的网页
- cmd + shift + p 执行Command命令
- 输入Capture full size screenshot回车截取全屏网页
- 输入Capture node screenshot回车截取部分网页
### 直接在控制台安装npm包
- 安装Console Importer插件
- $i(dayjs)安装dayjs npm包