## tab形式导航
> npm install @react-navigation/bottom-tabs

```
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

<Tab.Navigator>
  <Tab.Screen name="Today" component={Today} />
  <Tab.Screen name="My" component={My} />
</Tab.Navigator>
```
### 默认渲染的Tab页面 initialRouteName
```
<Tab.Navigator initialRouteName="My">
  <Tab.Screen name="Today" component={Today} />
  <Tab.Screen name="My" component={My} />
</Tab.Navigator>
```
### 路由下所有页面(screen)通用的header样式设置 screenOptions
```
<Tab.Navigator screenOptions={{headerShown: false}}>
  <Tab.Screen name="Today" component={Today} />
  <Tab.Screen name="My" component={My} />
</Tab.Navigator>
```
### 设置页面的Tab options
- 设置图标 tabBarIcon属性
> tabBarIcon方法有参数可以根据激活状态渲染不同的icon样式。`{ focused: boolean, color: string, size: number }`

```
<Tab.Navigator screenOptions={{headerShown: false}}>
  <Tab.Screen
    name="Today"
    component={Today}
    options={{
      tabBarIcon: ({color}) => (
        <Iconfont iconText={'\ue60f'} ownStyle={{fontSize: 24, color}} />
      ),
    }}
  />
  <Tab.Screen
    name="My"
    component={My}
    options={{
      tabBarIcon: ({color}) => (
        <Iconfont iconText={'\ue78b'} ownStyle={{fontSize: 24, color}} />
      ),
    }}
  />
</Tab.Navigator>
```
- 设置显示的文案 tabBarLabel 属性
```
<Tab.Navigator screenOptions={{headerShown: false}}>
  <Tab.Screen
    name="Today"
    component={Today}
    options={{
      tabBarIcon: ({color}) => (
        <Iconfont iconText={'\ue60f'} ownStyle={{fontSize: 24, color}} />
      ),
      tabBarLabel: '今天',
    }}
  />
  <Tab.Screen
    name="My"
    component={My}
    options={{
      tabBarIcon: ({color}) => (
        <Iconfont iconText={'\ue78b'} ownStyle={{fontSize: 24, color}} />
      ),
      tabBarLabel: '我的',
    }}
  />
</Tab.Navigator>
```
- 设置小徽章(未读信息提示) tabBarBadge、tabBarBadgeStyle 属性
```
<Tab.Navigator screenOptions={{headerShown: false}}>
  <Tab.Screen
    name="My"
    component={My}
    options={{
      tabBarIcon: ({color}) => (
        <Iconfont iconText={'\ue78b'} ownStyle={{fontSize: 24, color}} />
      ),
      tabBarLabel: '我的',
      tabBarBadge: 4,
      tabBarBadgeStyle: {
        color: '#fff',
        backgroundColor: '#67c1b5',
      },
    }}
  />
</Tab.Navigator>
```