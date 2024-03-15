## mysql
### [mysql安装](https://www.runoob.com/mysql/mysql-install.html)
- mysql文件夹下创建my.ini配置文件。
- 以管理员身份在mysql文件夹下的bin目录下运行cmd。
- 初始化数据库：mysqld --initialize --console。获取初始密码。
- 安装命令：mysqld install。
- 启动mysql服务：net start mysql；关闭mysql服务：net stop mysql。
- 登录mysql：mysql -u root -p，输入密码之后命令提示符会一直以mysql>加一个闪烁的光标等待命令的输入, 输入exit或quit退出登录。
- 登录之后需要修改默认的初始密码。
```
ALTER USER 'root'@'localhost' IDENTIFIED BY '123456'; // 修改账户密码(123456为新密码)
flush privileges; // 修改成功后刷新权限
```
- mysql设置之前不为空的字段可为空
```
alter table 表名 modify 字段 类型(长度) null;

alter table classification modify `desc` varchar(1000) null; // 修改可为空
alter table classification modify `desc` varchar(1000) not null; // 修改不可为空
```
