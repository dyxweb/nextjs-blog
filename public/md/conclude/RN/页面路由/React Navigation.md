## React Navigation
- StackNavigator：包含导航栏的页面导航组件。
- TabNavigator：底部展示tabBar的页面导航组件。
- DrawerNavigator：用于实现侧边栏抽屉页面的导航组件。
### 页面路由形式应用
- npm install @react-navigation/native
- npx expo install react-native-screens react-native-safe-area-context
  1. react-native-screens：用于原生层释放未展示的页面，改善 app 内存使用。
  2. react-native-safe-area-context： 用于保证页面显示在安全区域（主要针对刘海屏）。
```
// android/app/src/main/java/<your package name>/MainActivity.java

@Override
protected void onCreate(Bundle savedInstanceState) {
  super.onCreate(null);
}

import android.os.Bundle;
```
- 使用NavigationContainer包裹整个应用
```
<NavigationContainer>
  ...
</NavigationContainer>
```
- npm install @react-navigation/native-stack
> 堆栈导航器。

```
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './src/home';

const Stack = createNativeStackNavigator();
function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
export default App;
```
### 默认路由 initialRouteName
```
<NavigationContainer>
  <Stack.Navigator initialRouteName="Home">
    <Stack.Screen name="Home" component={Home} />
    <Stack.Screen name="Details" component={Details} />
  </Stack.Navigator>
</NavigationContainer>
```
### 自定义路由页面标题 options
```
<Stack.Screen
  name="Home"
  component={Home}
  options={{ title: 'dyxHome' }}
/>
```
### 路由下所有页面的通用自定义 screenOptions
```
<Stack.Navigator
  initialRouteName="Home"
  screenOptions={{ title: 'dyxHome' }}
>
  <Stack.Screen name="Home" component={Home} />
  <Stack.Screen name="Details" component={Details} />
</Stack.Navigator>
```


