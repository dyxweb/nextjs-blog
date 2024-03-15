## [打包apk](https://www.jianshu.com/p/8566139480ab)
- 使用Android studio打开根目录下找到android文件夹。
- 选择菜单栏的build的Generate Signed Bundle/APK。
- 选择APK。
- 选择Key store 的文件路径，输入密码等相关信息。
- 选择要打包的APK的类型（打release的包可以正常使用  debug的包不能正常使用）。
### 修改App的名称
> 打开android/app/src/main/res/values/strings.xml 修改App名称即可。

### 修改App图标
> 使用[图标工厂](https://icon.wuruihong.com/)一键下载压缩包解压后，用图标工场下载的文件，替换 android/app/src/main/res下对应的图标文件夹。默认下载的图标没有ic_launcher_round的形式，需要重新生成一份有圆角的图片添加到android/app/src/main/res下对应的图标文件夹内。