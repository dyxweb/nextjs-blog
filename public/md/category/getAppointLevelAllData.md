## 获取指定层级的所有内容
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
 * appointLevel:number 所要获取到数据的截止层级
 */
const getAppointLevelAllData = (data, appointLevel) => {
  const newData = [];
  const deep = (innerData, level) => {
    innerData.forEach(item => {
      if (level === appointLevel) {
        newData.push(item);
      }
      if (Array.isArray(item.children) && item.children.length > 0 && level < appointLevel) {
        deep(item.children, level + 1);
      }
    });
  };
  deep(data, 1);
  return newData;
}

console.log(getAppointLevelAllData(categoryData, 3));
```