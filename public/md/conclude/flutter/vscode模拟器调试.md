## [vscode模拟器调试](https://flutter.cn/docs/get-started/test-drive?tab=vscode)
### [vscode 安装 Flutter 和 Dart 插件](https://flutter.cn/docs/get-started/editor?tab=vscode)
### [vscode提示No Devices](https://blog.csdn.net/qq_40259641/article/details/90475896)
1. Creates and Launches a new Android emulator(创建并启动一个新的安卓模拟器)
2. 提示 No suitable Android AVD system images are available. 错误
> 需要Android Studio创建虚拟设备而不是VS Code来创建。打开Android Studio创建模拟器之后可以在vscode中可以看到Android Studio中创建的模拟器设备。

### 模拟调试
- 出现模拟器之后，vscode启动调试模式。  运行 => 启动调试
- 调试运行时提示：Running Gradle task 'assembleDebug' 时，将 Flutter SDK 目录：flutter\packages\flutter_tools\gradle\resolve_dependencies.gradle、Flutter SDK 目录：flutter\packages\flutter_tools\gradle\flutter.gradle、项目：android\build.gradle 三个文件替换 repositories 配置。
```
把

google()
mavenCentral()

替换为

maven { url 'https://maven.aliyun.com/repository/google' }
maven { url 'https://maven.aliyun.com/repository/jcenter' }
maven { url 'https://maven.aliyun.com/nexus/content/groups/public' }
```
- 报 Android SDK Platform 错误 ，执行 flutter doctor --android-licenses 命令。