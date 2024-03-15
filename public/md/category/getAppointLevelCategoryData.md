## 获取截止到指定层级的数据
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
const getAppointLevelCategoryData = (data, appointLevel, currentLevel = 1) => {
  const newData = [];
  data.forEach(item => {
    let obj = {};
    if (Array.isArray(item.children) && item.children.length > 0) {
      if (currentLevel < appointLevel) {
        const tempData = getAppointLevelCategoryData(item.children, appointLevel, currentLevel + 1);
        obj = {
          ...item,
          children: tempData,
        };
      } else {
        obj = {
          ...item,
          children: [],
        };
      }
    } else {
      obj = {
        ...item,
      };
    }
    newData.push(obj);
  });
  return newData;
}

console.log(JSON.stringify(
  getAppointLevelCategoryData(categoryData, 2),
  null,
  2
))
```