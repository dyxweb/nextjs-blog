## 统计类目结构数据相同层级的数量
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
 */
const getLevelCount = data => {
  if (Array.isArray(data) && data.length > 0) {
    const levelData = {};
    const deep = (innerData, level) => {
      return innerData.forEach(item => {
        typeof(levelData[level]) === 'undefined' ? levelData[level] = 1 : levelData[level] += 1;
        if (item.children && item.children.length > 0) {
          deep(item.children, level + 1);
        }
      });
    };
    deep(data, 1);
    return levelData;
  } else {
    return {};
  }
}

console.log(getLevelCount(categoryData));
```