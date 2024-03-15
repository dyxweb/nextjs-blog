## react-router6组件外部路由跳转

### 使用unstable_HistoryRouter
- 自定义history
```
import { createBrowserHistory } from "history";

export default createBrowserHistory();
```
- 使用HistoryRouter传递自定义history
```
import { unstable_HistoryRouter as HistoryRouter, Routes } from 'react-router-dom';
import customHistory from '@/utils/history';

<HistoryRouter history={customHistory}>
  <Routes>
    ...
  </Routes>
</HistoryRouter>
```
- 组件外部使用自定义history路由跳转
```
import customHistory from '@/utils/history';
history.push('/login');
```
### 使用CustomRouter
- 自定义history
```
import { createBrowserHistory } from "history";

export default createBrowserHistory();
```
- 自定义CustomRouter
```
/**
 * 自定义Router(支持组件外部使用history跳转路由)
 */
import React, { useLayoutEffect, useState } from "react";
import { BrowserRouterProps, Router } from "react-router-dom";
import { BrowserHistory } from "history";
import customHistory from "@/utils/history";

interface Props extends BrowserRouterProps {
  history: BrowserHistory;
}
const CustomRouter = ({ basename, history, children }: Props) => {
  const [state, setState] = useState({
    action: history.action,
    location: history.location,
  });
  useLayoutEffect(() => history.listen(setState), [history]);

  return (
    <Router
      navigator={customHistory}
      location={state.location}
      navigationType={state.action}
      basename={basename}
    >
      {children}
    </Router>
  );
};

export default CustomRouter;
```
- 使用CustomRouter
```
import { Routes } from 'react-router-dom';
import customHistory from '@/utils/history';

<CustomRouter history={customHistory}>
  <Routes>
    ...
  </Routes>
</CustomRouter>
```
- 组件外部使用自定义history路由跳转
```
import customHistory from '@/utils/history';
customHistory.push('/login');
```
### 组件内部跳转
```
import { useNavigate } from 'react-router-dom';
const navigate = useNavigate();

// 跳转
navigate('/login');
```