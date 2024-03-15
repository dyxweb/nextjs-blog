## 操作类目结构数据添加当前项是哪一层级以及是哪一层级的第几项
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
const mapCategoryDataWithLevelInfo = data => {
  if (Array.isArray(data) && data.length > 0) {
    const levelData = {};
    const deep = (innerData, level = 1) => {
      const newData = [];
      innerData.forEach(item => {
        typeof(levelData[level]) === 'undefined' ? levelData[level] = 1 : levelData[level] += 1;
        let obj = {
          ...item,
          sameLevelSort: levelData[level], // 当前项是该层级中的第几个
          currentLevel: level, // 当前项属于的层级
        };
        if (Array.isArray(item.children) && item.children.length > 0) {
          const tempData = deep(item.children, level + 1);
          obj.children = tempData;
        }
        newData.push(obj);
      });
      return newData;
    };
    return deep(data);
  } else {
    return [];
  }
}

console.log(JSON.stringify(mapCategoryDataWithLevelInfo(categoryData), null, 2))
```