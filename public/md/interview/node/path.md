## path
- __dirname：获得当前执行文件所在目录的完整目录名。
- __filename：获得当前执行文件的带有完整绝对路径的文件名。
- process.cwd()：获得当前执行node命令时候的文件夹目录名。
- ./ 不使用require时候，./与process.cwd()一样，使用require时候，与__dirname一样。
- path.resolve就相当于是shell下面的cd操作，从左到右执行。