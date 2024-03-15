## 深层次遍历数据
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
 * changeLabelList:array[array] 所需要将原数据中的属性变成期望属性的对应关系，内部数组第一项为源数据中的属性，第二项是新数据的属性
 * copyPrev:boolean 是否要保留原数据中的所有属性
 */
const mapCategoryData = (data, changeLabelList, copyPrev = true) => {
  if (Array.isArray(data) && data.length > 0) {
    const newData = [];
    data.forEach(item => {
      let obj = copyPrev ? { ...item } : {};
      changeLabelList.forEach(item1 => {
        obj[item1[1]] = item[item1[0]];
      });
      if (Array.isArray(item.children) && item.children.length > 0) {
        const tempData = mapCategoryData(item.children, changeLabelList, copyPrev);
        obj.children = tempData;
      }
      newData.push(obj);
    });
    return newData;
  } else {
    return [];
  }
}

console.log(JSON.stringify(
  mapCategoryData(
    categoryData,
    [
      ['label', 'name'],
      ['value', 'id'],
    ],
    true
  ),
  null,
  2
));
```