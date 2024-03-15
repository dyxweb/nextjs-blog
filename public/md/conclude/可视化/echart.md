## echart
- [echarts 按需引入使用](https://echarts.apache.org/handbook/zh/basics/import#%E6%8C%89%E9%9C%80%E5%BC%95%E5%85%A5-echarts-%E5%9B%BE%E8%A1%A8%E5%92%8C%E7%BB%84%E4%BB%B6)
- echarts的toolbox只显示英文
> 为toolbox中每一个配置项都添加title属性，title属性的值就是你想显示的值。

```
toolbox: {
  show: true,
  feature: {
    dataView: { 
      show: true,
      readOnly: false,
      title: '数据视图',
      lang:['', '关闭', '刷新']
    },
    magicType: {
      show: true,
      type: ['line', 'bar'],
      title:{ line:'切换为折线图', bar:'切换为柱状图' },
    },
    restore: { show: true, title: '还原' },
    saveAsImage: { show: true, title: '保存为图' }
  }
},
```
- echarts的toolbox的数据试图的按钮显示英文
```
toolbox: {
  show: true,
  feature: {
    dataView: { 
      show: true,
      readOnly: false,
      title: '数据视图',
      lang:['', '关闭', '刷新']
    },
    magicType: {
      show: true,
      type: ['line', 'bar'],
      title:{ line:'切换为折线图', bar:'切换为柱状图' },
    },
    restore: { show: true, title: '还原' },
    saveAsImage: { show: true, title: '保存为图' }
  }
},
```
- 当搜索条件修改之后图表重新渲染。
  1. 只init一次，后面使用setOption更新图表配置。
  2. init时需要提前将图表销毁。
  > There is a chart instance already initialized on the dom.

  ```
  echarts.dispose();
  ```
- 使用echarts图表时，如果容器div是通过事件控制显示与隐藏的话，那么echart要等元素显示之后，调用resize方法，这样图表才能正确的显示。
- 调整柱状图或折线图默认的颜色使用itemStyle，不使用lineStyle，使用lineStyle只能修改线的颜色，不能修改圆点的颜色。
```
series: [
  {
    type: 'line',
    itemStyle: {
      color: 'red'
    }
  },
  {
    type: 'bar',
    itemStyle: {
      color: 'green'
    }
  },
]
```