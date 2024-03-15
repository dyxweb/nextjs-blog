## 指定一个唯一值找到对应节点的祖先节点id
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
 * value: 简单数据类型 所要查找属性的值
 * uniqueKey:string 所要查找的属性
 */
const findParentId = (data, value, uniqueKey) => {
  const path = []; // 从祖先到指定节点的数组
  let findFlag = false;
  const deep = (array, innerValue) => {
    array.forEach(item => {
      if (findFlag) return;
      path.push(item.value); // 每一次循环都将value push到数组中
      if (item[uniqueKey] === innerValue) {
        findFlag = true;
      } else if (Array.isArray(item.children) && item.children.length) {
        deep(item.children, innerValue);
      } else {
        path.pop(); // 如果是最后一层且不相同则将刚push进去的值去除
      }
    });
    if (!findFlag) {
      path.pop(); // 当有children时调用deep函数结束时且还是没有找到相同的id则将有children的item的value从path中去除
    }
  };
  deep(data, value);
  return path;
}

console.log(findParentId(categoryData, '3-1-1-1', 'value'));
```