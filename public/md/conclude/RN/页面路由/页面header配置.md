## 页面header配置
### 配置页面title  options
```
<Stack.Navigator>
  <Stack.Screen
    name="Home"
    component={HomeScreen}
    options={{ title: 'My home' }}
  />
</Stack.Navigator>
```
### 使用路由参数配置页面title
```
<Stack.Screen
  name="Home"
  component={HomeScreen}
  options={({ route }) => ({ title: route.params.name })}
/>
```
### 更新当前激活页面的配置信息
```
<Button
  title="Update the title"
  onPress={() => navigation.setOptions({ title: 'New Title' })}
/>
```
### 调整header样式
- headerStyle 整个header的样式设置，比如背景色等。
- headerTintColor 返回按钮以及页面title的颜色配置。
- headerTitleStyle 页面title的字体样式设置。
```
<Stack.Screen
  name="Home"
  component={HomeScreen}
  options={{
    title: 'My home',
    headerStyle: {
      backgroundColor: '#f4511e',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
  }}
/>
```
### 路由下所有页面(screen)通用的header样式设置 screenOptions
```
<Stack.Navigator
  screenOptions={{
    headerStyle: {
      backgroundColor: '#f4511e',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
  }}
>
  <Stack.Screen
    name="Home"
    component={HomeScreen}
    options={{ title: 'My home' }}
  />
</Stack.Navigator>
```
### 使用自定义组件替换默认的标题显示 headerTitle
```
function LogoTitle() {
  return (
    <Image
      style={{ width: 50, height: 50 }}
      source={require('@expo/snack-static/react-native-logo.png')}
    />
  );
}

function StackScreen() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerTitle: (props) => <LogoTitle {...props} /> }}
      />
    </Stack.Navigator>
  );
}
```
### header添加button  headerRight
```
<Stack.Screen
  name="Home"
  component={HomeScreen}
  options={{
    headerTitle: (props) => <LogoTitle {...props} />,
    headerRight: () => (
      <Button
        onPress={() => alert('This is a button!')}
        title="Info"
        color="#fff"
      />
    ),
  }}
/>
```
### 使用setOptions更新header上button的点击事件
> header与屏幕组件的交互。

```
function StackScreen() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={({ navigation, route }) => ({
          headerTitle: (props) => <LogoTitle {...props} />,
          headerRight: () => (
            // 不绑定点击事件
            <Button title="Update count" />
          ),
        })}
      />
    </Stack.Navigator>
  );
}

function HomeScreen({ navigation }) {
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    // 更新headerRight的配置，绑定上事件
    navigation.setOptions({
      headerRight: () => (
        <Button onPress={() => setCount((c) => c + 1)} title="Update count" />
      ),
    });
  }, [navigation]);

  return <Text>Count: {count}</Text>;
}
```
### 调整默认的返回按钮样式
- headerBackTitle 设置返回按钮标题
- headerBackTitleStyle 设置返回按钮样式
- headerBackImageSource 将返回按钮设置为图片资源
### 替换默认的返回按钮  headerLeft
> 返回按钮是navigation默认添加上的可以使用headerLeft替换默认的返回按钮，用法同headerRight。

