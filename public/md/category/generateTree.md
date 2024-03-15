## 平铺数据转为tree数据
```
// value属性为唯一标识的属性， parentId为关联父节点的属性
const data = [
  { label: '1', value: '1' },
  { label: '2-1', value: '2-1', parentId: '2' },
  { label: '1-1', value: '1-1', parentId: '1' },
  { label: '3', value: '3' },
  { label: '3-1-2-1', value: '3-1-2-1', parentId: '3-1-2' },
  { label: '3-1', value: '3-1', parentId: '3' },
  { label: '3-2', value: '3-2', parentId: '3' },
  { label: '2', value: '2' },
  { label: '3-1-1', value: '3-1-1', parentId: '3-1' },
  { label: '3-1-2', value: '3-1-2', parentId: '3-1' },
  { label: '3-1-1-1', value: '3-1-1-1', parentId: '3-1-1' },
  { label: '1-1-1', value: '1-1-1', parentId: '1-1'},
];

/*
* data:array 数组内部元素为对象，需要有后续两个参数对应的属性，relativeKey属性的值可以为空
* parentId 数据所关联的父节点的值
* uniqueKey: string 数组中每一项对象中唯一的标识所对应的属性
* relativeKey: string 数组中每一项对象中关联父节点所对应的属性
*/
const generateTree = (data, parentId, uniqueKey, relativeKey) => {
  return data.filter(item => {
    if (item[relativeKey] === parentId) {
      item.children = generateTree(data, item[uniqueKey], uniqueKey, relativeKey)
      return true
    }
    return false
  })
}

console.log(generateTree(data, undefined, 'value', 'parentId'));

/*
* data:array 数组内部元素为对象，需要有后续两个参数对应的属性，relativeKey属性的值可以为空
* parentId 数据所关联的父节点的值
* uniqueKey: string 数组中每一项对象中唯一的标识所对应的属性
* relativeKey: string 数组中每一项对象中关联父节点所对应的属性
*/
 const generateTree = (data, parentId, uniqueKey, relativeKey) => {
   return data.filter(item => {
     if (item[relativeKey] !== parentId) {
       let parent = data.find(parent => parent[uniqueKey] === item[relativeKey])
       if (!parent.children) parent.children = []
       parent.children.push(item)
       return false
     }
     return true
   })
 }

console.log(generateTree(data, undefined, 'value', 'parentId'));

/*
* data:array 数组内部元素为对象，需要有后续两个参数对应的属性，relativeKey属性的值可以为空
* parentId 数据所关联的父节点的值
* uniqueKey: string 数组中每一项对象中唯一的标识所对应的属性
* relativeKey: string 数组中每一项对象中关联父节点所对应的属性
*/
 const generateTree = (data, parentId, uniqueKey, relativeKey) => {
   let parentObj = {}
   return data.filter(item => {
     if (item[relativeKey] !== parentId) {
       if (!parentObj[item.parentId]) {
         parentObj[item[relativeKey]] = data.find(parent => parent[uniqueKey] === item[relativeKey])
         parentObj[item[relativeKey]].children = []
       }
       parentObj[item[relativeKey]].children.push(item)
       return false
     }
     return true
   })
 }

console.log(generateTree(data, undefined, 'value', 'parentId'));


/
* data:array 数组内部元素为对象，需要有后续两个参数对应的属性，relativeKey属性的值可以为空
* parentId 数据所关联的父节点的值
* uniqueKey: string 数组中每一项对象中唯一的标识所对应的属性
* relativeKey: string 数组中每一项对象中关联父节点所对应的属性
*/
 const generateTree = (data, parentId, uniqueKey, relativeKey) => {
   let menuObj = {}
   data.forEach(item => {
     item.children = []
     menuObj[item[uniqueKey]] = item
   })
   return data.filter(item => {
     if (item[relativeKey] !== parentId) {
       menuObj[item[relativeKey]].children.push(item)
       return false
     }
     return true
   })
 }

console.log(generateTree(data, undefined, 'value', 'parentId'));

/*
* data:array 数组内部元素为对象，需要有后续两个参数对应的属性，relativeKey属性的值可以为空
* uniqueKey: string 数组中每一项对象中唯一的标识所对应的属性
* relativeKey: string 数组中每一项对象中关联父节点所对应的属性
*/
const generateTree = (data, uniqueKey, relativeKey) => {
  if (Array.isArray(data) && data.length > 0) {
    const treeData = []; // 最后返回的tree结构数据
    const temptree = {}; // 中间状态的数据
    const hasChildData = []; // data中添加children属性后的数据
    data.forEach(item => {
      if (!temptree[item[uniqueKey]]) {
        let temp = item;
        temp.children = [];
        temptree[item[uniqueKey]] = temp;
        hasChildData.push(temp);
      }
    });
    hasChildData.forEach(item => {
      // 如果有父节点则插入对应的children中
      if (temptree[item[relativeKey]]) {
        temptree[item[relativeKey]].children.push(temptree[item[uniqueKey]])
      } else {
        // 无父节点则直接插入最终的数据中
        treeData.push(temptree[item[uniqueKey]]);
      }
    });
    return treeData;
  } else {
    return [];
  }
}
console.log(JSON.stringify(
  generateTree(data, 'value', 'parentId'),
  null,
  2
));
```
### 运行速度最快
```
/*
* 运行速度最快，一次循环  时间复杂度为 O(n)
* data:array 数组内部元素为对象，需要有后续两个参数对应的属性，relativeKey属性的值可以为空
* uniqueKey: string 数组中每一项对象中唯一的标识所对应的属性
* relativeKey: string 数组中每一项对象中关联父节点所对应的属性
*/
const generateTree = (data, uniqueKey, relativeKey) => {
  const objMap = {}
  const result = []
  for(const item of data) {
    const id = item[uniqueKey];
    const parentId = item[relativeKey];
    objMap[id] = {...objMap[id], ...item}
    const treeItem = objMap[id]
    if (parentId === undefined) {
      result.push(treeItem)
    } else {
      if(!objMap[parentId]) {
        objMap[parentId] = {};
      }
      if(!objMap[parentId].children) {
        objMap[parentId].children = [];
      }
      objMap[parentId].children.push(treeItem)
    }
  }
  return result;
}

console.log(generateTree(data, 'value', 'parentId'));
```