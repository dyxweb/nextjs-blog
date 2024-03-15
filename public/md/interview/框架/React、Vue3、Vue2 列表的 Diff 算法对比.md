## [React、Vue3、Vue2 列表的 Diff 算法对比](https://juejin.cn/post/6919376064833667080)
### React
> React的思路是递增法。通过对比新的列表中的节点，在原本的列表中的位置是否是递增，来判断当前节点是否需要移动。

- nextList为新的列表，prevList为旧列表。遍历nextList，找到每一个节点在prevList中的位置。找到位置后与上一个节点的位置进行对比，如果当前的位置大于上一个位置，说明当前节点不需要移动。因此我们要定义一个lastIndex来记录上一个节点的位置。
- 找到位置后与上一个节点的位置进行对比，如果当前的位置小于上一个位置，需要将DOM节点移动到前一个vnode节点之后。
- 如果新列表中有全新的节点，在旧列表中找不到。我们需要根据新的VNode节点生成DOM节点，并插入DOM树中。如果新的节点位于新列表的第一个，这时候我们需要找到旧列表第一个节点，将新节点插入到原来第一个节点之前。
- 当旧的节点不在新列表中时，将其对应的DOM节点移除。
```
function reactDiff(prevChildren, nextChildren, parent) {
  let lastIndex = 0;
  for (let i = 0; i < nextChildren.length; i++) {
    let nextChild = nextChildren[i];
    let find = false;
    for (let j = 0; j < prevChildren.length; j++) {
      let prevChild = prevChildren[j];
      if (nextChild.key === prevChild.key) {
        find = true;
        patch(prevChild, nextChild, parent);
        if (j < lastIndex) {
          // 移动到前一个节点的后面
          let refNode = nextChildren[i - 1].el.nextSibling;
          parent.insertBefore(nextChild.el, refNode);
        } else {
          // 不需要移动节点，记录当前位置，与之后的节点进行对比
          lastIndex = j;
        }
        break;
      }
    }
    if (!find) {
      // 插入新节点
      let refNode = i <= 0 ? prevChildren[0].el : nextChildren[i - 1].el.nextSibling;
      mount(nextChild, parent, refNode);
    }
  }

  // 当旧的节点不在新列表中时，将其对应的DOM节点移除。
  for (let i = 0; i < prevChildren.length; i++) {
    const prevChild = prevChildren[i];
    const key = prevChild.key;
    const has = nextChildren.find(item => item.key === key);
    if (!has) parent.removeChild(prevChild.el);
  }
}
``` 
### Vue2
> 新列表和旧列表两个列表的头与尾互相对比，在对比的过程中指针会逐渐向内靠拢，当其中一个列表的节点全部遍历完成时循环结束。

- 新列表和旧列表两个列表的头与尾互相对比，寻找key相同的可复用的节点，当在某一步中找到了则停止后面的寻找。
  1. 使用旧列表的头一个节点oldStartNode与新列表的头一个节点newStartNode对比
  2. 使用旧列表的最后一个节点oldEndNode与新列表的最后一个节点newEndNode对比
  3. 使用旧列表的头一个节点oldStartNode与新列表的最后一个节点newEndNode对比
  4. 使用旧列表的最后一个节点oldEndNode与新列表的头一个节点newStartNode对比
- 新列表和旧列表两个列表的头与尾互相对比，如果找到了可复用的节点，移动指针。
  1. 当旧列表的头一个节点oldStartNode与新列表的头一个节点newStartNode对比时key相同。那么旧列表的头指针oldStartIndex与新列表的头指针newStartIndex同时向后移动一位。
  2. 当旧列表的最后一个节点oldEndNode与新列表的最后一个节点newEndNode对比时key相同。那么旧列表的尾指针oldEndIndex与新列表的尾指针newEndIndex同时向前移动一位。
  3. 当旧列表的头一个节点oldStartNode与新列表的最后一个节点newEndNode对比时key相同。那么旧列表的头指针oldStartIndex向后移动一位；新列表的尾指针newEndIndex向前移动一位。
  4. 当旧列表的最后一个节点oldEndNode与新列表的头一个节点newStartNode对比时key相同。那么旧列表的尾指针oldEndIndex向前移动一位；新列表的头指针newStartIndex向后移动一位。
- 旧列表的尾节点oldEndNode与新列表的头节点newStartNode的key相同，是可复用的DOM节点。只需要把当前的节点移动到原本旧列表中的第一个节点之前，让它成为第一个节点即可。
- 旧列表的头节点oldStartNode和新列表的尾节点newEndNode为复用节点。只要在旧列表中把当前的节点移动到原本尾节点的后面，就可以了。
- 当头和尾对比没有找到可以复用的节点时，拿新列表的第一个节点去旧列表中找与其key相同的节点。
  1. 如果在旧列表中找到对应的节点，我们只需要将找到的节点的DOM元素，移动到开头就可以了。DOM移动后，由我们将旧列表中的节点改为undefined，因为我们已经做了节点的移动了所以我们不需要进行再次的对比了。最后我们将头指针newStartIndex向后移一位。
  2. 如果在旧列表中没有找到复用节点，直接创建一个新的节点放到最前面就可以了，然后后移头指针newStartIndex。
- 如果老数组的游标先相交了，则判断新数组中是否还有剩下的节点，没有进行比对的，创建它们。
- 如果新数组的游标先相交了，则判断老数组中是否还有剩下的节点，没有进行比对的，把它们都删除掉。
```
function vue2diff(prevChildren, nextChildren, parent) {
  let oldStartIndex = 0;
  let newStartIndex = 0;
  let oldStartIndex = prevChildren.length - 1;
  let newStartIndex = nextChildren.length - 1;
  let oldStartNode = prevChildren[oldStartIndex];
  let oldEndNode = prevChildren[oldStartIndex];
  let newStartNode = nextChildren[newStartIndex];
  let newEndNode = nextChildren[newStartIndex];

  当新旧列表的起始指针小于终止指针时才继续循环
  while (oldStartIndex <= oldStartIndex && newStartIndex <= newStartIndex) {
    if (oldStartNode === undefined) {
      oldStartNode = prevChildren[++oldStartIndex];
    } else if (oldEndNode === undefined) {
      oldEndNode = prevChildren[--oldStartIndex];
    } else if (oldStartNode.key === newStartNode.key) {
      patch(oldStartNode, newStartNode, parent);

      oldStartIndex++;
      newStartIndex++;
      oldStartNode = prevChildren[oldStartIndex];
      newStartNode = nextChildren[newStartIndex];
    } else if (oldEndNode.key === newEndNode.key) {
      patch(oldEndNode, newEndNode, parent);

      oldStartIndex--;
      newStartIndex--;
      oldEndNode = prevChildren[oldStartIndex];
      newEndNode = nextChildren[newStartIndex];
    } else if (oldStartNode.key === newEndNode.key) {
      patch(oldStartNode, newEndNode, parent);
      parent.insertBefore(oldStartNode.el, oldEndNode.el.nextSibling);
      oldStartIndex++;
      newStartIndex--;
      oldStartNode = prevChildren[oldStartIndex];
      newEndNode = nextChildren[newStartIndex];
    } else if (oldEndNode.key === newStartNode.key) {
      patch(oldEndNode, newStartNode, parent);
      parent.insertBefore(oldEndNode.el, oldStartNode.el);
      oldStartIndex--;
      newStartIndex++;
      oldEndNode = prevChildren[oldStartIndex];
      newStartNode = nextChildren[newStartIndex];
    } else {
      let newKey = newStartNode.key;
      let oldIndex = prevChildren.findIndex(child => child && (child.key === newKey));
      if (oldIndex === -1) {
        mount(newStartNode, parent, oldStartNode.el);
      } else {
        let prevNode = prevChildren[oldIndex];
        patch(prevNode, newStartNode, parent);
        parent.insertBefore(prevNode.el, oldStartNode.el);
        prevChildren[oldIndex] = undefined;
      }
      newStartIndex++;
      newStartNode = nextChildren[newStartIndex];
    }
  }

  if (newStartIndex > newStartIndex) {
    while (oldStartIndex <= oldStartIndex) {
      if (!prevChildren[oldStartIndex]) {
        oldStartIndex++;
        continue;
      }
      parent.removeChild(prevChildren[oldStartIndex++].el);
    }
  } else if (oldStartIndex > oldStartIndex) {
    while (newStartIndex <= newStartIndex) {
      mount(nextChildren[newStartIndex++], parent, oldStartNode.el);
    }
  }
}
```

