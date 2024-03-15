## 为指定的节点添加子节点，添加到子节点的最后(适用于tree节点可以动态添加的情况)
```
const categoryData = [
  {"label":'1',"value":"1","children":[
    {"label":"1-1","value":"1-1","parentId":"1","children":[
      {"label":"1-1-1","value":"1-1-1","parentId":"1-1","children":[]}
    ]}
  ]},
  {"label":'2',"value":"2","children":[
    {"label":"2-1","value":"2-1","parentId":"2","children":[]}
  ]},
  {"label":'3',"value":"3","children":[
    {"label":"3-1","value":"3-1","parentId":"3","children":[
      {"label":"3-1-1","value":"3-1-1","parentId":"3-1","children":[
        {"label":"3-1-1-1","value":"3-1-1-1","parentId":"3-1-1","children":[]}
      ]},
      {"label":"3-1-2","value":"3-1-2","parentId":"3-1","children":[
        {"label":"3-1-2-1","value":"3-1-2-1","parentId":"3-1-2","children":[]}
      ]}
    ]},
    {"label":"3-2","value":"3-2","parentId":"3","children":[]}
  ]},
];

/*
 * data:array 类目结构的数据，数组内部元素为对象
 * parentId 数据所关联的父节点的值
 */
const addTreeNode = (data, parentId) => {
  const newData = []
  data.forEach(item => {
    const obj = { ...item }
    if (item.value === parentId) {
      const newValue = `${parentId}-${obj.children.length + 1}`
      item.children.push({
        label: '新的节点',
        value: newValue,
        children: [],
        parentId,
      })
    }
    if (Array.isArray(item.children) && item.children.length > 0) {
      const tempData = addTreeNode(item.children, parentId)
      obj.children = tempData
    }
    newData.push(obj)
  })
  return newData
}

console.log(JSON.stringify(addTreeNode(categoryData, '3-2'), null, 2))
```