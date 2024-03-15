## hooks生命周期
### 挂载
1. 首先react运行(惰性初始化程序)
2. 第一次渲染(render)
3. React更新DOM
4. 运行LayoutEffects
5. 浏览器绘制屏幕
6. 运行Effects
### 更新
1. render
2. React更新DOM
3. 清除LayoutEffects
4. 运行LayoutEffects
5. 浏览器绘制屏幕hooks生命周期
6. 清理Effects
7. 运行Effects
### 卸载
1. 清理LayoutEffects
2. 清理Effects
### 挂载和更新之间的主要区别
- 惰性初始化仅在挂载阶段
- 挂载阶段不存在清理工作

![hooks生命周期](./img/hooks%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F.png)
