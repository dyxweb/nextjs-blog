## react-intl国际化
### 安装依赖
```
yarn add react-intl
```
### 添加国际化语言配置
- en_US.js
```
const en_US = {
  search: 'Search'
};

export { en_US };
```
- zh_CN.js
```
const zh_CN = {
  search: '搜索'
};

export { zh_CN };
```
- index.ts
```
import zhCN from 'antd/lib/locale/zh_CN';
import enUS from 'antd/lib/locale/en_US';
import { zh_CN } from './zh_CN';
import { en_US } from './en_US';

export const getLocale = (lang: string) => {
  let locale = null;
  let antLocale = null;
  let messages = null;
  switch (lang) {
    case 'en-US':
      locale = 'en-US';
      antLocale = enUS;
      messages = en_US;
      break;
    case 'zh-CN':
      locale = 'zh-CN';
      antLocale = zhCN;
      messages = zh_CN;
      break;
    default:
      locale = 'zh-CN';
      antLocale = zhCN;
      messages = zh_CN;
      break;
  }
  // 语言环境、Ant Design组件库的语言环境、国际化语言内容
  return { locale, antLocale, messages };
};
```
### redux中存储当前的语言环境
```
// reducer.ts
interface PayloadDataType {
  locale: string;
}

interface ActionType {
  type: string;
  payload?: PayloadDataType;
}
const initState = {
  locale: localStorageUtil.getItem('locale') || 'zh-CN' // locale
};

export const configStore = (state = initState, action: ActionType) => {
  const { type, payload } = action;
  switch (type) {
    case 'changeLocale':
      localStorageUtil.setItem('locale', payload?.locale);
      return {
        locale: payload?.locale
      };
    default:
      return state;
  }
};
```
### 入口文件配置
```
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { IntlProvider } from 'react-intl';
import { ConfigProvider } from 'antd';
import 'antd/dist/antd.css';
import Routes from './routes';
import store from './store';
import { getLocale } from '@/assets/locale';
import './index.css';

const App = () => {
  // 获取语言信息
  const currentLocale = store.getState().configStore.locale;
  const { locale, antLocale, messages } = getLocale(currentLocale);

  return (
    <Provider store={store}>
      <IntlProvider locale={locale} messages={messages}>
        <ConfigProvider locale={antLocale}>
          <Routes />
        </ConfigProvider>
      </IntlProvider>
    </Provider>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
```
### 组件中使用
```
import { FormattedMessage } from 'react-intl';

<FormattedMessage id="search" />
```
### 切换语言
```
// 修改语言
const onChangeLocale = () => {
  dispatch({
    type: 'changeLocale',
    payload: { locale: locale === 'zh-CN' ? 'en-US' : 'zh-CN' }
  });
  window.location.reload();
};
```
### 非组件中使用国际化
- 使用createIntl创建intl实例导出。
```
import { createIntl, createIntlCache } from 'react-intl';
import zhCN from 'antd/lib/locale/zh_CN';
import enUS from 'antd/lib/locale/en_US';
import { zh_CN } from './zh_CN';
import { en_US } from './en_US';

export const getLocale = (lang: string) => {
  let locale = null;
  let antLocale = null;
  let messages = null;
  switch (lang) {
    case 'en-US':
      locale = 'en-US';
      antLocale = enUS;
      messages = en_US;
      break;
    case 'zh-CN':
      locale = 'zh-CN';
      antLocale = zhCN;
      messages = zh_CN;
      break;
    default:
      locale = 'zh-CN';
      antLocale = zhCN;
      messages = zh_CN;
      break;
  }
  return { locale, antLocale, messages };
};

// 导出intl实例
export const getIntl = (lang: string) => {
  const cache = createIntlCache();
  const { locale, messages } = getLocale(lang);

  return createIntl(
    {
      locale,
      messages
    },
    cache
  );
};
```
- 非组件中使用
```
import { getIntl } from '@/assets/locale';

message.success(
  getIntl(store.getState().configStore.locale).formatMessage({
    id: 'search'
  })
);
```
### 国际化支持参数传递
- en_US.js
```
const en_US = {
  search: 'Search {content}'
};

export { en_US };
```
- zh_CN.js
```
const zh_CN = {
  search: '搜索 {content}'
};

export { zh_CN };
```
- 组件中使用
```
import { FormattedMessage } from 'react-intl';

<FormattedMessage id="search" values={{ content: 'dyx' }} />
```
- 非组件中使用
```
import { getIntl } from '@/assets/locale';

message.success(
  getIntl(store.getState().configStore.locale).formatMessage(
    { id: 'search' },
    { content: 'dyx' }
  )
);
```