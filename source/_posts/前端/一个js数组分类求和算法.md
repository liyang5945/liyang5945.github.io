---
title: 一个js数组分类求和算法
date: 2020-02-28 14:30
author: liyang
categories: 技术分享
toc: false
tags:
  - JavaScript 
  - 算法
---

需求详情：一个数组内有N个元素，元素有类型、名称、数量1、数量2等属性，计算出各类型元素的数量、数量1、数量2的和。

实际需求就是做出下图这样一个表格，各类型的合计信息用红色字体显示：

![](https://images.liyangzone.com/article_img/技术相关/共用/20200228_152031js分类求和算法.png)

原始数据格式如下：

```js
const rawData = [
      { type: '类型A', name: '名称1', count1: 13, count2: 24, count3: 34 },
      { type: '类型A', name: '名称2', count1: 13, count2: 24, count3: 34 },
      { type: '类型A', name: '名称3', count1: 13, count2: 24, count3: 34 },
      { type: '类型B', name: '名称4', count1: 12, count2: 23, count3: 33 },
      { type: '类型B', name: '名称5', count1: 12, count2: 23, count3: 33 },
      { type: '类型B', name: '名称6', count1: 12, count2: 23, count3: 33 },
      { type: '类型C', name: '名称7', count1: 11, count2: 25, count3: 35 },
      { type: '类型C', name: '名称8', count1: 11, count2: 25, count3: 35 }
    ]
```
算法思路：遍历该数组，按类型生成一个二维数组，再遍历该二级数组及其子元素，每遍历完一个类型的子元素后求和，并创建一个新的元素存储该类型元素的和，最后生成一个包含各类型元素数量的新数组，实现代码如下:

```js
calcSum(arr) {
      const newArr = [];
      arr.forEach((item, index) => {
        let flag = 0;
        let k = 0;
        newArr.forEach((newItem, j) => {
          if (newArr[j][0].type === arr[index].type) {
            flag = 1;
            k = j;
          }
        });
        if (flag) {
          newArr[k].push(arr[index])
        } else {
          const tempArr = [];
          tempArr.push(arr[index]);
          newArr.push(tempArr);
        }
      });

      const result = []
      newArr.forEach(subArr => {
        let sum_name = 0;
        let sum_count1 = 0;
        let sum_count2 = 0;
        let sum_count3 = 0;

        subArr.forEach(subItem => {
          sum_name += 1;
          sum_count1 += subItem.count1;
          sum_count2 += subItem.count2;
          sum_count3 += subItem.count3;
          result.push(subItem);
        });
        result.push({
          type: subArr[0].type,
           name: sum_name,
           count1: sum_count1,
           count2: sum_count2,
           count3: sum_count3,
           isSumRow: true //该属性标记为求和行
        })
      })
      return result;
    }

```
生产的二维数组格式如下：
```js
 newArr = [
        [
          { 'type': '类型A', 'name': '名称1', 'count1': 13, 'count2': 24, 'count3': 34 },
          { 'type': '类型A', 'name': '名称2', 'count1': 13, 'count2': 24, 'count3': 34 },
          { 'type': '类型A', 'name': '名称3', 'count1': 13, 'count2': 24, 'count3': 34 }
        ],
        [
          { 'type': '类型B', 'name': '名称4', 'count1': 12, 'count2': 23, 'count3': 33 },
          { 'type': '类型B', 'name': '名称5', 'count1': 12, 'count2': 23, 'count3': 33 },
          { 'type': '类型B', 'name': '名称6', 'count1': 12, 'count2': 23, 'count3': 33 }
        ],
        [
          { 'type': '类型C', 'name': '名称7', 'count1': 11, 'count2': 25, 'count3': 35 },
          { 'type': '类型C', 'name': '名称8', 'count1': 11, 'count2': 25, 'count3': 35 }
        ]
      ]
```
最终数据格式如下,为了与普通的数据区分开，给求和的数据加上了一个isSumRow属性，用来生成一个className来标红：
```js
 result = [
            { 'type': '类型A', 'name': '名称1', 'count1': 13, 'count2': 24, 'count3': 34 },
            { 'type': '类型A', 'name': '名称2', 'count1': 13, 'count2': 24, 'count3': 34 },
            { 'type': '类型A', 'name': '名称3', 'count1': 13, 'count2': 24, 'count3': 34 },
            { 'type': '类型A', 'name': 3, 'count1': 39, 'count2': 72, 'count3': 102, 'isSumRow': true },
            { 'type': '类型B', 'name': '名称4', 'count1': 12, 'count2': 23, 'count3': 33 },
            { 'type': '类型B', 'name': '名称5', 'count1': 12, 'count2': 23, 'count3': 33 },
            { 'type': '类型B', 'name': '名称6', 'count1': 12, 'count2': 23, 'count3': 33 },
            { 'type': '类型B', 'name': 3, 'count1': 36, 'count2': 69, 'count3': 99, 'isSumRow': true },
            { 'type': '类型C', 'name': '名称7', 'count1': 11, 'count2': 25, 'count3': 35 },
            { 'type': '类型C', 'name': '名称8', 'count1': 11, 'count2': 25, 'count3': 35 },
            { 'type': '类型C', 'name': 2, 'count1': 22, 'count2': 50, 'count3': 70, 'isSumRow': true }
          ]
```
