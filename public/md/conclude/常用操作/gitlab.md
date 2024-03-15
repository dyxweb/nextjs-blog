## gitlab
### gitlab添加ssh key
- 生成前可以通过 `cat ~/.ssh/id_rsa.pub` 查看本机是否已有 SSH Key
- 生成 SSH Key `ssh-keygen -o -t rsa -b 4096 -C "email"`  (自己的email)
- 查看 SSH Key 并粘贴到gitlab ('ssh-rsa' 开头(也有 'ssh-ed25519' 格式))