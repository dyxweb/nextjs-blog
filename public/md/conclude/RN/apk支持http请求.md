## apk支持http请求
> 当请求http的服务时，在模拟器中可以正常调用，在真机中无法正常调用。

1. 在android => app => src => main => res 目录下新建 xml 目录，创建名为network_security_config.xml文件。文件内容如下。
```
<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
    <base-config cleartextTrafficPermitted="true" />
</network-security-config>
```
2. 在androidManifiest.xml文件中添加内容
```
<application
  android:name=".MainApplication"
  android:label="@string/app_name"
  android:icon="@mipmap/ic_launcher"
  android:roundIcon="@mipmap/ic_launcher_round"
  android:allowBackup="false"
  // 新添加内容
  android:networkSecurityConfig="@xml/network_security_config"
  android:theme="@style/AppTheme">
```