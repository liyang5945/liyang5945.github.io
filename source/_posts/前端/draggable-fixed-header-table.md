---
title: 使用粘性定位(position:sticky)实现固定表头、固定列的表格组件(Vue、React)
date: 2020-8-15 11:00:00
toc: false
tags: 
- vue
- react
- CSS
- 表格
categories:
- 技术分享
---



最近重构的项目中有这样一个页面，一个固定表头和列的表格，表格列数较多，大概有60多列，200多条数据，而且表格需要实现拖拽滚动功能。
原页面的表格是用的一个比较老旧的表格插件实现，拖拽滚动是用iScroll.js实现的，性能很差，即使每页只有二、三十条数据，拖拽起来也严重卡顿。我首先使用了element-ui自带的的table组件实现了拖拽滚动的功能，性能稍微比老页面强了一点，每页50条数据时卡顿不明显，超过100条数据时有才有卡顿感。然而我对这样的性能也不是很满意，就研究了下el-table固定表头和列的实现方式，发现el-table实现固定列的方式比较坑，它是渲染了两个完整的table，然后把固定列的表格宽度写死绝对定位到左侧部分，把另一个表格盖住来实现的。当数据量较多的时候会非常卡顿。 
后来我又研究了下ant-design里面的table组件固定列的实现方式，发现ant-design的实现方式跟element-ui不一样，它不是渲染两个table，而是基于一个CSS3属性来实现的，那就是 `position: sticky`。
sticky直译是粘性定位，MDN上是这样介绍的：

元素根据正常文档流进行定位，然后相对它的最近滚动祖先（nearest scrolling ancestor）和 containing block (最近块级祖先 nearest block-level ancestor)，包括table-related元素，基于top, right, bottom, 和 left的值进行偏移。偏移值不会影响任何其他元素的位置。

更多介绍请看：[https://developer.mozilla.org/zh-CN/docs/Web/CSS/position](https://developer.mozilla.org/zh-CN/docs/Web/CSS/position)

然后我就尝试着使用原生html的table的结构和这个css属性实现了固定表头和列的表格组件，并添加了拖拽滚动的效果，首先看下效果：

![](https://images.liyangzone.com/article_img/技术相关/fixed-table/drag-table2.gif)


性能方面，经测试，每页1000条数据+100列的情况下，也比原来页面的50条流畅的多：

![](https://images.liyangzone.com/article_img/技术相关/fixed-table/drag-table3.gif)


遇到的坑：
滚动时固定行和列的左右边框会消失，我采用伪元素模拟右边框和下边框，并且给最外层容器添加左边框和上边框，
而且滚动时还有个莫名奇妙的问题，左边的文字竟然在那边框区域1px像素的区域显示出来一点，如图：

![](https://images.liyangzone.com/article_img/技术相关/fixed-table/20200810_225413.png)


采用模拟边框后这个问题也一并解决了。
z-index问题，z-index要从左上角至两边递减，左上角的th要把z-index设的最大，否则滚动时右边的的th和下面的td会把第一个th盖住。

![](https://images.liyangzone.com/article_img/技术相关/fixed-table/20200810_224153.png)


td和th宽度问题：当列数较多的时候，我发现即使使用行内样式写死th和td的宽度，它们的宽度也不会生效，这个问题非常蛋疼，我后来使用了一个固定宽度的span元素写在td里面才解决这个问题。

![](https://images.liyangzone.com/article_img/技术相关/fixed-table/20200815_103321.png)


性能优化：mousemove事件是高频事件，频繁触发也会造成性能问题，这里我使用lodash的throttle方法进行节流，每60毫秒触发一次，实际使用时请先安装`loadsh`, npm i lodash 

兼容性，只支持较新浏览器，不支持IE:

![](https://images.liyangzone.com/article_img/技术相关/fixed-table/20200815_113828.png)


附上vue组件源码,FixedTable.vue，里面有原生html结构和el-table(注释部分)两种写法，使用el-table的话，页面数据超过50条已经有明显的卡顿
```html
<template>
  <div class="list-page-container">
    <div class="query-box">
      <el-button size="mini" type="primary">按钮</el-button>
      <el-button size="mini" type="primary">按钮</el-button>
    </div>
    <div
      ref="table_wrapper"
      class="table-wrapper"
      style="border-top: 1px solid #cccccc; border-left: 1px solid #cccccc;"
    >
      <table ref="tbody" class="fixed-table">
        <thead>
          <tr>
            <th class="fixed-column" style="z-index: 300">
              <span style="display: inline-block; width: 50px;">序号</span>
            </th>
            <th
              v-for="(columnItem,index) in lebelData"
              :key="index"
              :class="fixedPropList.includes(columnItem.prop)?'fixed-column':''"
              :style="fixedPropList.includes(columnItem.prop)?{
                left:index * 100 + 50 + 'px',
                width: '100px',
                zIndex: 2 + (200-index)
              }:{}"
            >
              <span style="display: inline-block;width: 100px">
                {{ columnItem.label }}
              </span>

            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(rowItem,index) in tableData" :key="index">
            <td class="fixed-column" style="width: 50px;z-index: 200">
              {{ index+1 }}
            </td>
            <td
              v-for="(columnItem,cindex) in lebelData"
              :key="cindex"
              :class="fixedPropList.includes(columnItem.prop)?'fixed-column':''"
              :style="fixedPropList.includes(columnItem.prop)?{
                left: cindex * 100 + 50 + 'px',
                width: '100px',
                zIndex: 1 + (100-cindex)
              }:{}"
            >
              <span style="display: inline-block;width: 100px">
                {{ rowItem[columnItem.prop] }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
      <!--<el-table
        ref="drag_table"
        class="drag-table"
        :data="tableData"
        size="mini"
        border
        :height="tableHeight"
      >
        <el-table-column
          type="index"
          fixed
          align="center"
          label="序号"
          width="50"
        />
        <el-table-column
          v-for="(columnItem,index) in lebelData"
          :key="index"
          align="center"
          :fixed="fixedPropList.includes(columnItem.prop)"
          :prop="columnItem.prop"
          :label="columnItem.label"
          width="90"
        />
      </el-table>-->

    </div>
    <div class="list-page-footer">
      共{{ tableData.length }}条数据
    </div>
  </div>
</template>

<script>

import { throttle } from 'lodash'

/* 生成表格数据*/
function generateTableData(listLength, columnLength) {
  const arr = [];
  for (let i = 1; i <= listLength; i++) {
    const obj = {}
    for (let j = 1; j <= columnLength; j++) {
      obj['label' + j] = i + '*' + j + '=' + i * j;
    }
    arr.push(obj)
  }
  return arr
}
/* 生成表格列数据*/
function generateLabelData(labelLength) {
  const arr = []
  for (let i = 1; i <= labelLength; i++) {
    const obj = {
      label: '列' + i,
      prop: 'label' + i
    }
    arr.push(obj)
  }
  return arr
}
export default {
  name: 'FixedTable',
  data() {
    return {

      tableData: generateTableData(50, 30),
      lebelData: generateLabelData(30),
      tableHeight: 700,
      fixedPropList: [
        'label1',
        'label2'
      ], // 固定列数据
      clickPointX: 0, // 鼠标按下时的坐标
      clickPointY: 0, // 鼠标按下时的坐标
      scrollLeft: 0, // 鼠标按下时容器的滚动距离
      scrollTop: 0, // 鼠标按下时容器的滚动距离
      table_wrapper: null // 滚动容器(表格父元素)
    }
  },
  mounted() {
    this.setDraggable()
  },
  methods: {

    setDraggable() {
      // el-table组件写法
      // const table = this.$refs.drag_table
      // const table_wrapper = table.$el.querySelector('.el-table__body-wrapper')
      // const tbody = table.$el.querySelector('.el-table__body-wrapper tbody')
      //
      // 原生table写法
      const tbody = this.$refs.tbody
      const table_wrapper = this.$refs.table_wrapper

      this.table_wrapper = table_wrapper

      tbody.addEventListener('mousedown', evt => {
        console.log('鼠标按下')
        this.scrollLeft = table_wrapper.scrollLeft
        this.scrollTop = table_wrapper.scrollTop
        this.clickPointX = evt.x
        this.clickPointY = evt.y
        tbody.addEventListener('mousemove', moveHandler)
      })
      tbody.addEventListener('mouseup', evt => {
        tbody.removeEventListener('mousemove', moveHandler)
      })
      tbody.addEventListener('mouseleave', evt => {
        tbody.removeEventListener('mousemove', moveHandler)
      })
      const moveHandler = throttle(event => {
        console.log('鼠标移动');
        // 我将表格滚动距离设置为鼠标移动距离的3倍，可根据实际情况设置成别的数值
        const newX = this.scrollLeft - (event.x - this.clickPointX) * 3
        const newY = this.scrollTop - (event.y - this.clickPointY) * 3
        this.table_wrapper.scroll(newX, newY)
      }, 60)
    }
  }
}
</script>


```

之前看过不少文章说react在性能方面会比vue强不少，我简单学习了下react，用react也顺利实现了这个功能，react源码也一并附上，FixedTable.js:

```jsx
import React from "react";
import { throttle } from 'lodash'

class FixedTable extends React.Component {
  constructor(props) {
    super(props);
    this.fixedColumns = [
      'label1',
      'label2',
    ];
    this.state = {
      tableData: this.generateTableData(100, 50),
      labelData: this.generateLabelData(50)
    };
    this.table_wrapper = React.createRef();
  }

  componentDidMount() {
    this.setDraggable();
  }

  setDraggable() {
    const wrapper_node = this.table_wrapper.current;
    let scrollLeft = 0;
    let scrollTop = 0;
    let clickPointX = 0;
    let clickPointY = 0;
    wrapper_node.addEventListener("mousedown", (evt) => {
      console.log("鼠标按下");
      scrollLeft = wrapper_node.scrollLeft;
      scrollTop = wrapper_node.scrollTop;
      clickPointX = evt.x;
      clickPointY = evt.y;
      wrapper_node.addEventListener("mousemove", moveHandler);
    });
    wrapper_node.addEventListener("mouseup", (evt) => {
      wrapper_node.removeEventListener("mousemove", moveHandler);
    });
    wrapper_node.addEventListener("mouseleave", (evt) => {
      wrapper_node.removeEventListener("mousemove", moveHandler);
    });

    wrapper_node.addEventListener("dragend", (evt) => {
      wrapper_node.removeEventListener("mousemove", moveHandler);
    });

    const moveHandler = throttle(event => {
      console.log("moveHandler 触发");
      // 我将表格滚动距离设置为鼠标移动距离的3倍，可根据实际情况设置成别的数值
      const newX = scrollLeft - (event.x - clickPointX) * 3;
      const newY = scrollTop - (event.y - clickPointY) * 3;
      wrapper_node.scroll(newX, newY);
    }, 60)
  }

  generateTableData(listLength, columnLength) {
    const arr = [];
    for (let i = 1; i <= listLength; i++) {
      const obj = {};
      for (let j = 1; j <= columnLength; j++) {
        obj["label" + j] = i + "*" + j + "=" + i * j;
      }
      arr.push(obj);
    }
    return arr;
  }

  /* 生成表格列数据*/
  generateLabelData(labelLength) {
    const arr = [];
    for (let i = 1; i <= labelLength; i++) {
      const obj = {
        label: "列" + i,
        prop: "label" + i
      };
      arr.push(obj);
    }
    return arr;
  }

  render() {
    return (
      <div className={"table-wrapper"} style={{
        maxHeight: '800px'
      }} ref={this.table_wrapper}>
        <table className={"fixed-table"}>
          <thead>
          <tr>
            <th className={'fixed-column'} style={{
              zIndex: 300
            }}>
                <span style={{
                  display: 'inline-block',
                  width: '50px'
                }}>序号</span>
            </th>
            {this.state.labelData.map((columnItem, columnItemIndex) =>
              <th key={columnItemIndex}
                  className={this.fixedColumns.includes(columnItem.prop) ? 'fixed-column' : ''}
                  style={this.fixedColumns.includes(columnItem.prop) ? {
                    left: columnItemIndex * 100 + 50 + 'px',
                    width: '100px',
                    zIndex: 2 + (100 - columnItemIndex)
                  } : {}}>

                <span style={{
                  display: 'inline-block',
                  width: '100px'
                }}>
                  {columnItem.label}
                </span>
              </th>
            )}
          </tr>
          </thead>
          <tbody>
          {this.state.tableData.map((item, itemIndex) =>
            <tr key={itemIndex}>
              <td className={'fixed-column'} style={{
                zIndex: 200
              }}>
                <span style={{
                  display: 'inline-block',
                  width: '50px'
                }}>序号</span>
              </td>
              {this.state.labelData.map((columnItem, columnItemIndex) =>
                <td key={columnItemIndex}
                    className={this.fixedColumns.includes(columnItem.prop) ? 'fixed-column' : ''}
                    style={this.fixedColumns.includes(columnItem.prop) ? {
                      left: columnItemIndex * 100 + 50 + 'px',
                      width: '100px',
                      zIndex: 1 + (100 - columnItemIndex)
                    } : {}}
                >
                  <span style={{
                    display: 'inline-block',
                    width: '100px'
                  }}>
                    {item[columnItem.prop]}
                  </span>
                </td>
              )}
            </tr>
          )}
          </tbody>
        </table>
      </div>
    );
  }
}

export default FixedTable;

```

下面是样式文件,fixed-table.sass:
```sass
.table-wrapper
	-webkit-touch-callout: none
	-webkit-user-select: none
	-khtml-user-select: none
	-moz-user-select: none
	-ms-user-select: none
	user-select: none
	max-height: 800px
	overflow: auto
	.fixed-table
		border-collapse: collapse
		table-layout: fixed
		th, td
			text-align: center
			font-size: 12px
			color: #666
			padding: 10px 0
			position: relative
			&:after
				content: ''
				display: block
				width: 1px
				height: 100%
				background-color: #cccccc
				position: absolute
				right: 0
				top: 0
			&:before
				content: ''
				display: block
				width: 100%
				height: 1px
				background-color: #cccccc
				position: absolute
				left: 0
				bottom: 0
			&.fixed-column
				position: sticky
				background-color: #eeeeee
		th
			position: sticky
			top: 0
			z-index: 3
			background-color: #eeeeee
			font-weight: bold
		th:first-child
			position: sticky
			left: 0
			top: 0
			z-index: 4
		td:first-child
			position: sticky
			left: 0
			z-index: 3


```

顺便附上一个el-table高度自适应的mixin组件，可以实现窗口变化时也能自适应高度，如下效果：

![](https://images.liyangzone.com/article_img/技术相关/fixed-table/resize-table1.gif)



ListPageResizeHandler.js


```js
import { throttle } from 'lodash'

export default {
  data() {
    return {
      tableHeight: 700
    }
  },
  mounted() {
    const observeContainer = throttle(entries => {
      entries.forEach(entry => {
        const cr = entry.contentRect
        this.tableHeight = cr.height
      })
    }, 200, { leading: false })
    const observer = new ResizeObserver(observeContainer)
    observer.observe(this.$refs.table_wrapper)
    this.$once('hook:beforeDestroy', () => {
      observer.disconnect()
    })
  }
}


```


使用方法:引入文件并在vue组件里声明 
```html
<template>
<div>
<!--....-->
</div>
</template>

<script >

import ListPageResizeHandler from '@/mixin/ListPageResizeHandler';

export default {
//....

mixins: [ListPageResizeHandler],

//....

}

</script>

```

<p style="visibility: hidden;">
<span>可拖拽表格</span>
<span>可拖拽的表格</span>
<span>拖拽的表格</span>
<span>拖拽滚动表格</span>
<span>拖拽滚动</span>
<span>表格固定表头</span>
<span>表格固定列</span>
</p>

