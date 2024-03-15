## Redux DevTools
> 浏览器安装对应扩展之后，需要在react应用中配置才能正常使用该扩展。

### 无侵入性的使用
- 不使用redux中间件的简单形式
```
import { createStore } from 'redux';

const store = createStore(
  rootReducers,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
```
- 使用redux中间件
```
import { createStore, applyMiddleware, compose } from 'redux';
import reduxThunk from 'redux-thunk';

const composeEnhancers: any = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
  rootReducers,
  composeEnhancers(applyMiddleware(reduxThunk))
);
```
- 只在开发环境使用
```
import { createStore, applyMiddleware, compose } from 'redux';
import reduxThunk from 'redux-thunk';

const composeEnhancers: any = process.env.NODE_ENV === 'development' ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose : compose;
const store = createStore(
  rootReducers,
  composeEnhancers(applyMiddleware(reduxThunk))
);
```
### 侵入性使用
- 安装@redux-devtools/extension依赖
```
yarn add @redux-devtools/extension
```
- 不使用redux中间件的简单形式
```
import { createStore } from 'redux';
import { composeWithDevTools } from '@redux-devtools/extension';

const store = createStore(
  rootReducers,
  composeWithDevTools()
);
```
- 使用redux中间件
```
import { createStore, applyMiddleware } from 'redux';
import reduxThunk from 'redux-thunk';
import { composeWithDevTools } from '@redux-devtools/extension';

const store = createStore(
  rootReducers,
  composeWithDevTools(applyMiddleware(reduxThunk))
);
```
- 只在开发环境使用
```
import { createStore, applyMiddleware } from 'redux';
import reduxThunk from 'redux-thunk';
import { composeWithDevTools } from '@redux-devtools/extension/src/developmentOnly';

const store = createStore(
  rootReducers,
  composeWithDevTools(applyMiddleware(reduxThunk))
);
```