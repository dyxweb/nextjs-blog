
## Token
1. 客户端向服务器发送登录信息用户名/密码来请求登录。
2. 服务器收到请求去验证用户名与密码，验证成功后服务端会签发一个Token并把这个Token发送给客户端。
3. 客户端收到Token后会把它存储起来，web端一般会放在localStorage或Cookie中，移动端原生APP一般存储在本地缓存中。
4. 客户端向服务端请求API资源的时候，将Token通过HTTP请求头Authorization字段或者其它方式发送给服务端。
5. 服务器收到请求后会去验证客户端请求里面带着的Token，根据Token验证结果判断该请求是否合法。
### Token的优点
- 服务端无状态化、可扩展性好，Token机制在服务端不需要存储会话（Session）信息，因为Token自身包含了其所标识用户的相关信息，这有利于在多个服务间共享用户状态。
- 安全性好，有效避免CSRF攻击（不依赖Cookie的使用）。
- 支持跨程序调用：因为Cookie是不允许跨域访问的，而Token则不存在这个问题。
### Token 的缺点：
- 需要前后端配合处理。
- Token正常情况下比sid大，消耗更多流量，占用更多宽带。
- 验证Token时不用再去访问数据库或远程服务进行权限校验，但是需要对Token加解密等操作，所以会更耗性能。
- 有效期短，为了避免Token被盗用，一般Token的有效期会设置的较短，使用Refresh Token更新Token。
### Token和Session-Cookie的区别
> Session-Cookie和Token有很多类似的地方，但是Token更像是Session-Cookie的升级改良版。

- 存储地不同：Session一般是存储在服务端，Token是无状态的一般由前端存储。
- 安全性不同：Token不依赖浏览器的Cookie机制，可以降低web攻击的风险。
- 支持性不同：Session-Cookie认证需要依赖浏览器的Cookie机制，如果遇到原生应用或浏览器的Cookie功能被禁用时这种机制就不起作用了。
### JWT(JSON Web Token)
- 上述的Token形式服务端验证客户端发送过来的Token时，需要查询数据库获取用户基本信息，然后验证Token是否有效。这样每次请求验证都要查询数据库，增加了查库带来的延迟等性能消耗。
- JWT就是登录成功后将相关用户信息组成JSON对象，然后对这个对象进行某种方式的加密，返回给客户端。客户端在下次请求时带上这个Token，服务端再收到请求时直接校验Token的合法性并可以获取到用户信息。
### JWT的优点
- 校验Token合法性时不需要查询数据库，减少服务端查询数据库的次数。
#### JWT的缺点
- 到期问题：一旦JWT签发了，在到期之前就会始终有效，除非服务器部署额外的逻辑。
### JWT和Token的区别
- JWT和Token区别主要体现在校验Token合法性时是否需要进入数据库查询信息。
### eggjs实现JWT校验
- 安装依赖
```
npm install egg-jwt;
```
- config.default.js
```
exports.jwt = { 
  secret: 'login-server', // 可以自定义秘钥
};
```
- plugin.js
```
exports.jwt = {
  enable: true,
  package: 'egg-jwt',
};
```
- 登录时签发Token和Refresh Token
```
// 登录
async login() {
  const userData = this.ctx.request.body;
  const access_token = this.app.jwt.sign({
    ...userData,
    exp: Math.floor(Date.now() / 1000) + 60 // token有效期60秒
  }, this.app.config.jwt.secret);
  const refresh_token = this.app.jwt.sign({
    ...userData,
    exp: Math.floor(Date.now() / 1000) + 120 // refresh_token有效期120秒
  }, this.app.config.jwt.secret);
  this.ctx.body = {
    success: true,
    data: {
      access_token,
      refresh_token,
    },
    msg: null,
  };
}
```
- 校验Token
```
async upsert() {
  const userData = this.ctx.request.body;
  const accessToken = this.ctx.request.headers.access_token; // 获取header的accessToken
  let checkTokenInfo = null; // token校验信息
  try {
    checkTokenInfo = this.app.jwt.verify(token, this.app.config.jwt.secret);
  } catch (error) {
    checkTokenInfo = null;
  }
  if (checkTokenInfo) {
    this.ctx.body = {
      success: true,
      data: checkTokenInfo,
      msg: null,
    };
  } else {
    this.ctx.status = 401;
    this.ctx.body = {
      success: false,
      data: null,
      msg: 'token已过期'
    };
  }      
}
```
- 刷新Token
```
// 刷新token
async refreshToken() {
  const { refresh_token } = this.ctx.request.body;
  let checkTokenInfo = null; // token校验信息
  try {
    checkTokenInfo = this.app.jwt.verify(refresh_token, this.app.config.jwt.secret);
  } catch (error) {
    checkTokenInfo = null;
  }
  if (checkTokenInfo) {
    // refresh_token校验通过生成新的Token和refresh_token
    const { username, password } = userData;
    const access_token = this.app.jwt.sign({
      username,
      password,
      exp: Math.floor(Date.now() / 1000) + 60 // token有效期
    }, this.app.config.jwt.secret);
    const refresh_token = this.app.jwt.sign({
      username,
      password,
      exp: Math.floor(Date.now() / 1000) + 120 // refresh_token有效期
    }, this.app.config.jwt.secret);
    this.ctx.body = {
      success: true,
      data: {
        access_token,
        refresh_token,
      },
      msg: null,
    };
  } else {
    this.ctx.status = 401;
    this.ctx.body = {
      success: false,
      data: null,
      msg: 'refresh_token过期'
    };
  }
}
```