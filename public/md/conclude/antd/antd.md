## antd
- 自定义的组件可以通过Form.Item包裹后监听到值的变化，被包裹的组件自动有onChange和value两个属性，value改变时手动调用onChang方法。(https://blog.csdn.net/yang450712123/article/details/120133948)
- table锁列时TypeScript报错。
```
fixed: 'right' as 'right',
```
- treeSelect修改搜索时匹配的过滤属性：treeNodeFilterProp，默认匹配value进行过滤。
- treeSelect节点换行展示不全时设置dropdownMatchSelectWidth为false即可解决。
- antd组件通过defaultProps属性设置通用的props。
```
DatePicker.RangePicker.defaultProps = {}
```