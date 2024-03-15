## jwt
### 安装
> npm install egg-jwt --save

### 配置
```
// config.default.js
exports.jwt = {
  secret: "dyxweb_token"
};

// plugin.js
exports.jwt = {
  enable: true,
  package: 'egg-jwt',
};
```
### 登录时设置token
```
// 接口返回token，前端的请求携带token
const token = await this.app.jwt.sign({
	name: name,
}, this.app.config.jwt.secret)
```
### 服务端验证token
```
// middleware/jwt.js

module.exports=()=>{
  return async function(ctx, next) {
    try {
      let token = ctx.request.header.authorization;
      ctx.app.jwt.verify(token,ctx.app.config.jwt.secret);
      await next();
    } catch(e) {
        ctx.status = 401;
        ctx.body={
          code: 401,
          message: '没有token',
        }
    }
  }
}
```
### 配置路由需要token验证
```
const { router, controller, middleware } = app;
router.get('/api/getBlogList', middleware.jwt(app.config.jwt), controller.blog.getBlogList);
```