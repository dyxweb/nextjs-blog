## output的hash
### hash
> 异步加载打出的每一个包的hash都相同，每次修改任何一个文件，所有文件名的hash值都将改变。所以一旦修改了任何一个文件，整个项目的文件缓存都将失效。

### chunkhash
> 异步加载打出的每一个包的hash不同，chunkhash根据不同的入口文件(Entry)进行依赖文件解析、构建对应的chunk，生成对应的哈希值。因为打出的css和js文件的hash值相同，只要对应css或js改变，与其关联的文件hash值也会改变，但其内容并没有改变，所以也没有达到缓存意义。

### contenthash
> 异步加载打出的每一个包的hash不同，针对文件内容级别的，只有自己模块的内容变了，hash值才改变。生产环境建议使用。

### 占位符的解释
- ext	文件后缀名
- name	文件名
- path	文件相对路径
- folder	文件所在文件夹
- hash	每次构建生成的唯一 hash 值
- chunkhash	根据 chunk 生成 hash 值
- contenthash	根据文件内容生成hash 值