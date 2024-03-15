## axios
- GET请求传递数组参数，axios中使用paramsSerializer转化参数
```
import axios from 'axios';
import qs from 'qs';

paramsSerializer: function(params) {
  return qs.stringify(params, { arrayFormat: 'repeat' })
}
```
- [qs序列化效果](https://blog.csdn.net/weixin_43970434/article/details/121402694)
```
// ids=1&ids=2&ids=3
qs.stringify({ ids: [1, 2, 3] }, { indices: false })

// ids[0]=1&ids[1]=2&ids[2]=3
qs.stringify({ ids: [1, 2, 3] }, { arrayFormat: 'indices' })

// ids[]=1&ids[]=2&ids[]=3
qs.stringify({ ids: [1, 2, 3] }, { arrayFormat: 'brackets' })

// ids=1&ids=2&ids=3
qs.stringify({ ids: [1, 2, 3] }, { arrayFormat: 'repeat' }) 
```
- 直接用axios POST传递一个字符串给后端接口
```
axios({
  method: 'POST',
  url: '/url',
  data: 'hello',
  headers: {
    'Content-Type': 'application/json; charset=utf-8'
  }
}).then(({ data }) => {
  console.log(data)
})
```