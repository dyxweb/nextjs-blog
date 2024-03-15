## 自定义hooks
- 自定义hooks可以使用官方提供的hooks和其他自定义hooks，拥有自己的状态，封装通用的逻辑。一个自定义hooks就像一个不用返回jsx的函数组件。
- 自定义hooks的使用尽可能不要做无关的渲染，需要减少性能开销，一个好用的自定义hooks需要配合useMemo、useCallback等进行优化。
### 获取浏览器的高度和宽度
```
// 获取浏览器的高度和宽度
export const useWinSize = () => {
  const [windowSize, setWindowSize] = useState({
    winHeight: document.documentElement.clientHeight,
    winWidth: document.documentElement.clientWidth
  });

  const handleResize = () => {
    setWindowSize({
      winHeight: document.documentElement.clientHeight,
      winWidth: document.documentElement.clientWidth
    });
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
};
```
### 仅在组件重新渲染时调用的useEffect
```
// 仅在组件重新渲染时调用(第一次render不调用)
export const useNotFirstRenderEffect = (func: () => void, deps: any) => {
  const hasFirstRender = useRef(false); // 是否已经完成第一次render
  useEffect(() => {
    if (hasFirstRender.current) {
      func();
    } else {
      hasFirstRender.current = true;
    }
  }, deps);
}
```
### 支持回调的useState
```
// useState改变状态后支持回调
export const useCallbackState = (initData: any) => {
  const cbRef: any = useRef(); // 存储回调函数
  const [data, setData] = useState(initData);

  useEffect(() => {
    cbRef.current && cbRef.current(data);
  }, [data]);

  return [
    data,
    function (newData: any, callback: any) {
      cbRef.current = callback;
      setData(newData);
    }
  ];
}
```