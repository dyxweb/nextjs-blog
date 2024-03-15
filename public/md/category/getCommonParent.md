## 获取选中节点最近的公共父节点
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
 * selectKeys: 选中节点的keys
 */
const getCommonParent = (data, selectKeys) => {
  const selectKeysArr = Array.isArray(selectKeys) ? selectKeys : [selectKeys];
  const allPaths = []; // 所有选中节点的path路径
  let minLength = 0;
  // 获取所有选中节点的path路径
  const addTreePath = (data, parentKey) => {
    data.forEach((item) => {
      const paths = parentKey ? [...parentKey, item.value] : [item.value];
      if (selectKeysArr.includes(item.value)) {
        allPaths.push(paths);
        minLength = minLength ? Math.min(minLength, paths.length) : paths.length;
      }
      if (Array.isArray(item.children) && item.children.length > 0) {
        addTreePath(item.children, paths);
      }
    })
  }
  addTreePath(data);
  // 根据获取的所有选中节点的path路径计算出公共部分
  const commonArr = allPaths.reduce((prev, current) => {
    let matchLength = 0;
    prev.forEach((item, index) => {
      if (item === current[index]) {
        matchLength += 1;
      }
    });
    const returnArr = [...prev];
    returnArr.length = matchLength;
    return returnArr;
  })
  // 返回最近的公共父节点
  return commonArr[commonArr.length - 1];
}

console.log(getCommonParent(categoryData, ['3-1-1', '3-1-2-1']))
```