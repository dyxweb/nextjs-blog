## key
- key只是针对同一层级的节点进行了diff比较优化，而跨层级的节点互相之间的key值没有影响。
- 建议不要用遍历的index作为节点的key属性值。
- key值在比较之前都会被执行toString()操作，所以尽量不要使用object类型的值作为key。
### key的作用
> 当同一层级的某个节点添加了对于其它同级节点唯一的key属性，当它在当前层级的位置发生了变化后，react Diff算法通过新旧节点比较后，如果发现了key值相同的新旧节点，就会执行移动操作复用之前的真实节点(若虚拟DOM中的内容没变，则直接使用之前的真实DOM，若虚拟DOM中的内容变了，则生成新的真实DOM，随后替换掉页面中之前的真实DOM)，而不会执行原策略的删除旧节点，创建新节点的操作。这无疑大大提高了React性能和渲染效率。

### key的具体执行过程
> 对新集合中的节点进行循环遍历，通过唯一的key判断新旧集合中是否存在相同的节点，如果存在相同节点，判断当前节点在旧集合中的位置与lastIndex(类似浮标)进行判断如果当前节点在旧集合中的位置(index)小于lastIndex则进行移动操作，否则不执行移动操作操作。

#### 同一层级的所有节点只发生了位置变化： A、B、C、D 更新为 B、A、D、C
1. B在新集合中 lastIndex(类似浮标) = 0, 在旧集合中 index = 1，index > lastIndex 就认为 B 对于集合中其他元素位置无影响，不进行移动，之后lastIndex = max(index, lastIndex) = 1
2. A在旧集合中 index = 0， 此时 lastIndex = 1, 满足 index < lastIndex, 则对A进行移动操作，此时 lastIndex = max(index, lastIndex) = 1
3. D和B操作相同，同第一步，不进行移动，此时lastIndex = max(index, lastIndex) = 3
4. C和A操作相同，同第二步，进行移动，此时lastIndex = max(index, lastIndex) = 3
#### 同一层级的所有节点发生了节点增删和节点位置变化： A、B、C、D 更新为 B、E、C、A
1. B在新集合中 lastIndex(类似浮标) = 0, 在旧集合中 index = 1，index > lastIndex 就认为 B 对于集合中其他元素位置无影响，不进行移动，之后lastIndex = max(index, lastIndex) = 1
2. 新集合中有E，发现旧集合中不存在E，在 lastIndex处创建E，lastIndex++
3. 在旧集合中取到C，C不移动，lastIndex=2
4. 在旧集合中取到A，A移动到新集合中的位置，lastIndex=2
5. 完成新集合中所有节点diff后，对旧集合进行循环遍历，寻找新集合中不存在但旧集合中有的节点(此例中为D)，删除D节点。
### 使用index作为key的问题
> 遍历数组的时候使用index作为key，在只涉及到数据展示的时候并不会出现什么问题，但是当我们在操作数据时候，很容易出现问题。

- 删除某一项
> 3个input输入框依次输入随机内容，使用 index 作为 key 的时候，点击删除第一项按钮，左侧文字正确改变，但是input的内容显示不对，input输入框最后一项没了。当我们使用 index 作为 key 时，此时 key 为 0、1、2，删掉第一项后 key 变为 0、1，此时 react 在执行 diff 算法过程中，key = 0 存在，只需要更新子节点的值，所以左侧的 name 成功改变，而 input 的值非受控不会更新。同时在对比计算中少了 key = 2 这项，删除了最后一项。当我们使每一项的值作为 key 时，此时 key 为 name1、name2、name3，删掉第一项后 key 变为 name2、name3，根据 react 的 diff 算法，react 计算出删除一个节点即可。

```
const Test = () => {
  const [data, setData] = useState(['name1', 'name2', 'name3']);

  const deleteFirstItem = () => {
    const newData = [...data];
    newData.shift();
    setData(newData);
  }

  return (
    <div>
      {data.map((item, index) => {
        return (
          <div key={index}>
            {item}
            <input type="value" />
          </div>
        );
      })}
      <button onClick={deleteFirstItem}>删除第一项</button>
    </div>
  )
}
```
- 修改顺序
> 效果类似于上述的删除第一项，左侧文字正常改变，input的值不会发生变化。

```
const Test = () => {
  const [data, setData] = useState(['name1', 'name2', 'name3']);

  const reverse = () => {
    setData(['name3', 'name2', 'name1']);
  }

  return (
    <div>
      {data.map((item, index) => {
        return (
          <div key={index}>
            {item}
            <input type="value" />
          </div>
        );
      })}
      <button onClick={reverse}>修改顺序</button>
    </div>
  )
}
```
### key机制的缺点
> A、B、C、D 更新为 D、A、B、C，与旧集合相比只有 D 节点移动，而 A、B、C 仍然保持原有的顺序，理论上 diff 应该只需对 D 执行移动操作，然而由于 D 在旧集合中的位置是最大的，导致其他节点的 index < lastIndex，造成 D 没有执行移动操作，而是 A、B、C 全部移动到 D 节点后面的现象。尽量减少类似将最后一个节点移动到列表首部的操作。当节点数量过大或更新操作过于频繁时，这在一定程度上会影响 React 的渲染性能。