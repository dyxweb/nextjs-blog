## 为tree数据添加唯一key属性(key和当前顺序以及层次相关,适用于tree节点可以动态添加或拖拽且key不能重复的情况)
```
const categoryData = [
  {"label":'1',"value":"1","children":[
    {"label":"1-1","value":"1-1","parentId":"1","children":[
      {"label":"1-1-1","value":"1-1-1","parentId":"1-1","children":[]}
    ]}
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
  {"label":'2',"value":"2","children":[
    {"label":"2-1","value":"2-1","parentId":"2","children":[]}
  ]}
];

/*
 * data:array 类目结构的数据，数组内部元素为对象
 * parentKey: 当前数据节点的父节点的key
 */
const addUniqueTreeKey = (data, parentKey) => {
  const newData = []
  data.forEach((item, index) => {
    const newKey = parentKey ? `${parentKey}-${index + 1}` : `${index + 1}`
    const obj = { ...item, key: newKey, parentKey: parentKey || null }
    if (Array.isArray(item.children) && item.children.length > 0) {
      const tempData = addUniqueTreeKey(item.children, newKey)
      obj.children = tempData
    }
    newData.push(obj)
  })
  return newData
}

console.log(JSON.stringify(addUniqueTreeKey(categoryData), null, 2))
```