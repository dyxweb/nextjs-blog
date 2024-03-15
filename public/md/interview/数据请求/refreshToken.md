## refreshToken
> 用户携带的accessToken过期时，用户需要重新获取新的accessToken，而refreshToken就是用来重新获取新accessToken的凭证。

### 使用refreshToken可以提高安全性
> 有了refreshToken可以降低accessToken被盗的风险。

- 用户在访问网站时accessToken被盗取了，此时攻击者就可以拿这个accessToke访问权限以内的功能了。如果accessToken设置一个短暂的有效期2小时，攻击者能使用被盗取的accessToken的时间最多也就2个小时，除非再通过refreshToken刷新accessToken才能正常访问。
- 设置accessToken有效期是永久的，用户在更改密码之后，之前的accessToken也是有效的。
### 请求前判断token是否过期
> 在请求前利用最初请求返回的字段expires_in字段来判断access_token是否已经过期，若已过期则将请求挂起，先刷新access_token后再继续请求。

- 优点
  1. 能节省http请求。
- 缺点
  1. 因为使用了本地时间判断，若本地时间被篡改，有校验失败的风险。
### 响应拦截器里判断是否过期刷新token
> 响应拦截器里拦截返回后的数据。先发起请求，如果接口返回access_token过期，刷新access_token再进行一次重试。

- 优点
  1. 无需判断时间。
- 缺点
  1. 会消耗多一次http请求。
### 响应拦截器里判断是否过期刷新token代码实现
1. 创建isRefreshing = false变量存储否正在刷新token，创建requests = []变量存储待重发请求。
2. 当请求返回401(约定好为token过期)且不是请求刷新token的接口时特殊处理。
3. 如果正在刷新token(isRefreshing为true)
  - 返回未执行resolve的Promise。
  - requests变量存储当前的请求(用函数形式将resolve存入，等待token刷新后重新请求再执行)。
4. 如果没有正在刷新token(isRefreshing为false)，请求刷新token的接口(开始请求时isRefreshing改为true，请求结束之后isRefreshing改为false)
  - 请求成功时
    1. 存储新的token。
    2. 使用新的token将requests数组中的请求重新执行并清空requests变量。
    3. 并重新发起原来的请求。
  - 请求失败时
    1. 需跳转到登录页重新登录。
```
/**
 * axios请求方法
 */
import axios from 'axios';
import { message } from 'antd';
import history from './history';

// 刷新access_token的接口
const refreshToken = () => {
  return request.post('http://localhost:7001/refreshToken', { refresh_token: localStorage.getItem('refresh_token') });
}

let isRefreshing = false;// 标记是否正在刷新token
let requests: any = []; // 存储待重发请求的数组

const request = axios.create({
  baseURL: '',
  timeout: 30000,
});

// 请求头添加access_token
request.interceptors.request.use((config: any) => {
  const accessToken = localStorage.getItem('access_token');
  if (accessToken && config.headers) {
    config.headers.access_token = accessToken;
  }
  return config;
});

request.interceptors.response.use(
  response => response,
  error => {
    // 请求返回401且不是请求刷新token的接口
    if (error.response?.status === 401 && !error.config.url.endsWith('/refreshToken')) {
      const { config } = error;
      if (isRefreshing) {
        // 正在刷新token时存储请求方法
        return new Promise(resolve => {
          // 存储未执行resolve方法的Promise，等待刷新后再执行
          requests.push(() => {
            resolve(request(config))
          });
        })
      } else {
        isRefreshing = true;
        // 刷新token
        return refreshToken().then(res => {
          const { access_token, refresh_token } = res.data.data || {};
          // 存储新的token
          localStorage.setItem('access_token', access_token);
          localStorage.setItem('refresh_token', refresh_token);
          // token刷新后将数组中的请求重新执行
          requests.forEach((cb: any) => cb());
          requests = []; // 重新请求完清空
          return request(config); // 重新发起当前请求
        }).catch(err => {
          // 刷新token的接口请求失败时需重新登录
          message.error('抱歉，您的登录状态已失效，请重新登录');
          history.push('/login');
          return Promise.reject(err);
        }).finally(() => {
          isRefreshing = false;
        })
      }
    }
    return Promise.reject(error);
  }
);

export default request;
```