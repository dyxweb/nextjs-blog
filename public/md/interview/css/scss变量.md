## scss变量
### 定义变量
```
// common.scss
$primaryColor: #1890FF;
$buttonSpacing: 8px;

:export {
  primaryColor: $primaryColor;
  buttonSpacing: $buttonSpacing;
}
```
### scss文件中使用变量
```
@import "@/styles/common.scss";

.icon {
  cursor: pointer;
  color: $primaryColor;
}
```
### js文件中使用变量
```
import styleConfig from '@/styles/common.scss';

const { primaryColor } = styleConfig;
<div style={{ color: primaryColor }}>dyx</div>
```