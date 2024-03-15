## 过滤掉类目数据中指定删除的值
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
 * values:array 所要删除的values
 * uniqueKey:string 数组中每一项对象中唯一的标识所对应的属性
 */
const deleteAppointData = (data, values, uniqueKey) => {
  const newValues = values ? Array.isArray(values) ? values : [values] : [];
  if (values.length > 0) {
    const newData = [];
    data.forEach(item => {
      let obj = { ...item };
      if (!newValues.includes(item[uniqueKey])) {
        if (Array.isArray(item.children) && item.children.length > 0) {
          const tempData = deleteAppointData(item.children, newValues, uniqueKey);
          obj.children = tempData;
        }
        newData.push(obj);
      }
    });
    return newData;
  } else {
    return data;
  }
}

console.log(JSON.stringify(
  deleteAppointData(
    categoryData,
    ['2', '3-1-1'],
    'value'
  ),
  null,
  2
));
```