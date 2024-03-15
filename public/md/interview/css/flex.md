## flex
### flex属性
> flex属性是flex-grow, flex-shrink和flex-basis的简写，默认值为0 1 auto。

- flex-grow定义项目的放大比例，默认为0，即如果存在剩余空间也不放大。
- flex-shrink定义项目的缩小比例，默认为1，即如果空间不足，该项目将缩小。
- flex-basis定义在分配多余空间之前，项目占据的主轴空间(main size)，浏览器根据此属性计算主轴是否有多余空间，默认值为auto即项目本身的大小。
### 简写
- flex: none，相当于flex: 0 0 auto，表示项目不会伸缩，保持原始大小。
- flex: auto，相当于flex: 1 1 auto，表示项目会根据自身大小和剩余空间进行伸缩。
- flex: n(n为正整数)，相当于flex: n 1 0%，表示项目的放大比例为n，其他值默认。
### flex: 1
- 使用flex: 1的作用是让项目能够自动填充剩余空间，实现自适应布局。
- 无论容器的宽高如何变化，项目都会自动调整，保持平均分配。
- 不考虑元素自身的大小，平分剩余的空间。
### felx：1和flex：auto的区别
- flex: 1相当于flex: 1 1 0%，表示项目的基准大小为0%，不考虑项目本身的大小，只根据剩余空间进行伸缩。
- flex: auto相当于flex: 1 1 auto，表示项目的基准大小为auto即项目本身的大小，同时也会根据剩余空间进行伸缩。
- 如果容器有足够的空间，flex: 1和flex: auto都会平分剩余空间，但是flex: auto会保持项目本身的最小宽度，而flex: 1不会。
- 如果容器没有足够的空间，flex: 1会优先压缩内容，使得所有项目都能等分空间，而flex: auto会优先保持内容的完整性，挤压其它项目的空间。
### 有剩余空间的示例
```
<style>
.container {
  display: flex;
  width: 1000px;
}
.one {
  width: 30%;
  flex: none;
  background-color: red;
}
.two {
  width: 20%;
  flex: auto;
  background-color: green;
}
.three {
  width: 40%;
  flex: auto;
  background-color: yellow;
}
</style>

<div class="container">
  <div class="one">1</div>
  <div class="two">2</div>
  <div class="three">3</div>
</div>
```
- .one设置none时会保持自身本来的空间。
- .two、.three设置auto时有剩余空间会在自身本来的空间基础上平分剩余空间。由代码可知剩余的空间为100px，.two在自身基础上增加平分的剩余空间50px为250px(200px + 50px)，.three在自身基础上增加平分的剩余空间50px为450px(400px + 50px)。
- .two、.three设置1时不考虑自身本来的空间，只考虑分配剩余空间之后要保持两个元素的空间大小一致即可，.two、.three会平分除去.one占用空间后的剩余空间(700px)，所以.two、.three为350px。
### 需要压缩空间的示例
```
<style>
.container {
  display: flex;
  width: 1000px;
}
.one {
  width: 30%;
  flex: none;
  background-color: red;
}
.two {
  width: 40%;
  flex: auto;
  background-color: green;
}
.three {
  width: 60%;
  flex: auto;
  background-color: yellow;
}
</style>

<div class="container">
  <div class="one">1</div>
  <div class="two">2</div>
  <div class="three">3</div>
</div>
```
- .one设置none时会保持自身本来的空间。
- .two、.three设置auto时会根据自身本来空间所占据的比例去压缩空间。由代码可知需要压缩的空间为300px，.two占据的比例为40%(.two和.three一共为100%，所以.two占据的比例为40%)，需要压缩的空间为120px(300px * 40%)，剩余空间为280px(400px - 120px)。.three占据的比例为60%(.two和.three一共为100%，所以.three占据的比例为60%)，需要压缩的空间为180px(300px * 60%)，剩余空间为420px(600px - 180px)。
- .two、.three设置1时不考虑自身本来的空间，只考虑压缩之后要保持两个元素的空间大小一致即可，.two、.three会平分除去.one占用空间后的剩余空间(700px)，所以.two、.three为350px。