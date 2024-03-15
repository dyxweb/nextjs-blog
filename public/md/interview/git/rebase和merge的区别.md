## rebase和merge的区别
### merge
- 只处理一次冲突
- 会把两个分支最新的2个commit合并成一个新的commit
- 合并后的所有 commit 会按照提交时间从旧到新排列
### rebase
- 在 dev 分支执行 git reabse master 会将 dev 分支的当前提交复制到master的最新提交之后
- 可能会多次解决同一个地方的冲突
- 不会产生合并的commit
- 合并后的所有 commit 顺序不一定按照 commit 的提交时间排列
### merge VS rebase
> 当从a分支切到b分支的时候在b分支中做了多次提交，而且a分支在切到b分支之后也做了多次提交。

- 将b分支merge到a分支，a分支的提交记录会按a、b分支的提交顺序记录，且有合并的一次记录。最后的分支树呈现非线性的结构。
- 将b分支rebase到a分支，a分支的提交记录会先记录a分支的提交，再记录b分支的提交，且没有合并的一次记录。会形成一个线性的分支树。