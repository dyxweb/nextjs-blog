## hooks模拟class生命周期
### componentDidMount
```
useEffect(() => {

}, []);
```
### componentDidUpdate
```
useEffect(() => {
  // 所有更新都会执行

});

useEffect(() => {
  // 依赖改变时才会执行

}, [dependencies]);
```
### shouldComponentUpdate
```
React.memo(Component, (prevProps, nextProps) => {
  // 返回false组件会更新，返回true组件不更新
})
```
### componentWillUnmount
```
useEffect(() => {
  return () => {

  }
}, []);
```
### componentWillMount
- 使用useState
```
const useComponentWillMount = (fun) => {
  const [hasRendered, setHasRendered] = useState(false);

  useEffect(() => setHasRendered(true), [hasRendered]);

  if (!hasRendered) {
    fun();
  }
}
```
- 使用useRef
```
const useComponentWillMount = (fun) => {
  const hasMounted = useRef(false);

  if (!hasMounted.current) {
    (() => {
      hasMounted.current = true;
      fun();
    })();
  }
  
  return null;
}
```