## chunk
> webpack实现中，原始的资源模块以Module对象形式存在、流转、解析处理。而Chunk则是输出产物的基本组织单位，在生成阶段webpack按规则将entry及其它Module插入Chunk中，之后再由SplitChunksPlugin插件根据优化规则与ChunkGraph对Chunk做一系列的变化、拆解、合并操作，重新组织成一批性能(可能)更高的Chunks。运行完毕之后webpack继续将chunk一一写入物理文件中完成编译工作。chunk是无法在打包结果中看到的，打包结果中看到的是bundle。

### chunk的基本分包规则
> 业务模块是指开发者所编写的项目代码；runtime模块是指Webpack分析业务模块后，动态注入的用于支撑各项特性的运行时代码。

- 每个entry项都会对应生成一个chunk对象，称之为initial chunk。
- 每个异步模块都会对应生成一个chunk对象，称之为async chunk。
- Webpack 5之后，如果entry配置中包含runtime值，则在entry之外再增加一个专门容纳runtime的chunk对象，此时可以称之为runtime chunk。
### bundle vs chunk
> bundle: bundle是webpack打包之后的各个文件，一般就是和chunk是一对一的关系，但有时候也不完全是一对一的关系。bundle就是对chunk进行编译压缩打包等处理之后的产出。chunk是过程中的代码块，bundle是结果的代码块。


