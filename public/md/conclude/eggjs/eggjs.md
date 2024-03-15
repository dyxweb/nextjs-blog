## eggjs
### GET请求的两种传参方式
- query形式
```
router.get('/product/detail', ...);

async detail() {
  const { ctx } = this;
  console.log('query', ctx.query);
  ctx.body = ctx.query.id;
}
```
- params形式
```
router.get('/product/detail/:id', ...);

async detail() {
  const { ctx } = this;
  console.log('params', ctx.params);
  ctx.body = ctx.params.id;
}
```
### POST请求
```
router.post('/product/detail', ...);

async detail() {
  const { ctx } = this;
  console.log('body', ctx.request.body);
  ctx.body = ctx.request.body.id;
}
```
### POST请求出现invalid csrf token安全验证的报错
- 关闭安全验证
```
// config.default.js

exports.security = {
  csrf: {
    enable: false,
  },
};
```
- 初始化前端应用时先GET请求一个接口返回秘钥给前端，前端POST请求的时候放在headers的x-csrf-token请求头里，eggjs会自动去验证这个秘钥，验证成功才会成功请求。
### GET请求的参数值为数组时，使用this.ctx.query无法正常获取参数
> GET请求针对参数值为数组的参数会序列化处理，使用this.ctx.query无法正确获取参数的key，可以将数组形式的参数值转化成其它数据格式进行请求，接口层面再转成数组形式。

### mysql查询Date类型数据时区不对，时间减了8小时
> 修改mysql配置，增加dateStrings: true配置。

```
exports.mysql = {
  ...
  client: {
    ...
    dateStrings: true, // 时间按字符串读取
  },
  ...
}
```
### 接收前端sendBeacon发送的数据时cors必须配置credentials。
```
exports.cors = {
  origin: '*',
  allowMethods: '*',
  credentials: true
}
```
### sql获取到的数据不要直接扩展运算符处理或者添加属性，这样处理会携带其它数据。
### eggjs内置了static插件，static插件默认映射/public/* -> app/public/* 目录，把静态资源都放到app/public 目录下即可。
### app目录下的文件读取app目录下的其它文件
```
fs.readFileSync(`${__dirname}/../public/`)
```
### 设置单个接口允许跨域
```
class HomeController extends Controller {
  async index() {
    this.ctx.set('Access-Control-Allow-Origin', '*');
    this.ctx.set('Access-Control-Allow-Credentials', true);
    // ...
  }
}
```
### egg应用使用docker部署需要将start命令中的--daemon去掉。
