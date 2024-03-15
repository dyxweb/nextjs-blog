## fetch和merge的区别
> git fetch相当于从远程获取最新代码到本地，但是不会自动merge。

```
git fetch origin master 将远程的master分支下载到本地
git merge origin/master 将远程的master分支进行合并

git fetch origin master:mastercopy 获取最新远程的master分支并在本地建立mastercopy分支
git merge mastercopy 将mastercopy分支合并到当前分支

// 使用pull代替
git pull origin master
```