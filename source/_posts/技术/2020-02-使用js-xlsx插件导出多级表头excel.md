---
title: 使用js-xlsx插件导出多级表头excel
date: 2020-02-27 10:00
articlePath: 2020-02-27-export-multi-level-excel-with-js-xlsx
categories: 技术
tags:
  - excel
  - 多级表头 
  - 教程 
---

最近项目里有这么一个需求，把一个多级表头的table导出为excel格式。然后在网上找到一篇文章：[js-xlsx导出自定义合并列头实现思路](https://www.jianshu.com/p/9a465d7d1448)，我按照他的教程操作之后发现比较繁琐，这篇文章的思路就是就是新建一个excel，然后用js来读取它的多级表头数据，再把json格式的表头数据复制到项目中使用。核心就是这个json格式的多级表头数据，这样一个多级表头导出来是这个样子的:

![](https://images.liyangzone.com/article_img/技术相关/导出多级表头excel/20200227_101309.png)

```json
{
    "!ref": "A1:F3", "A1": {"t": "s", "v": "日期", "r": "日期", "h": "日期", "w": "日期"},
    "B1": {"t": "s", "v": "配送信息", "r": "配送信息", "h": "配送信息", "w": "配送信息"},
    "B2": {"t": "s", "v": "姓名", "r": "姓名", "h": "姓名", "w": "姓名"},
    "C2": {"t": "s", "v": "地址", "r": "地址", "h": "地址", "w": "地址"},
    "C3": {"t": "s", "v": "省份", "r": "省份", "h": "省份", "w": "省份"},
    "D3": {"t": "s", "v": "市区", "r": "市区", "h": "市区", "w": "市区"},
    "E3": {"t": "s", "v": "地址", "r": "地址", "h": "地址", "w": "地址"},
    "F3": {"t": "s", "v": "邮编", "r": "邮编", "h": "邮编", "w": "邮编"},
    "!margins": {"left": 0.7, "right": 0.7, "top": 0.75, "bottom": 0.75, "header": 0.3, "footer": 0.3},
    "!merges": [{"s": {"c": 0, "r": 0}, "e": {"c": 0, "r": 2}}, {
      "s": {"c": 1, "r": 0}, "e": {"c": 5, "r": 0}
    }, {"s": {"c": 1, "r": 1}, "e": {"c": 1, "r": 2}}, {"s": {"c": 2, "r": 1}, "e": {"c": 5, "r": 1}}]
  }
```
我暂时没看出来这种格式的规律是什么，如果想要修改表头格式的化就感觉比较麻烦，需要修改excel再导出一次。

后来在开源项目[vue-element-admin](https://panjiachen.gitee.io/vue-element-admin/)上也找到了这个功能，使用方法比较简单。

### 使用教程


使用npm安装`xlsx`和`file-saver`插件
```shell script
npm install xlsx --save
npm install file-saver --save
```
下载Export2Excel.js文件，放到`src/vendor`目录下，下载地址：[Export2Excel.js](https://raw.githubusercontent.com/PanJiaChen/vue-element-admin/master/src/vendor/Export2Excel.js)(github地址，打不开请科学上网）

然后提取合并的表头数据，这种格式的表头数据比上面那种浅显易懂，如何合并可参考下面的图片，把蓝色部分合并单元格的坐标提取出来即可，下图的表头数据为：

![](https://images.liyangzone.com/article_img/技术相关/导出多级表头excel/20200227_111320.png)

```js

const multiHeader =
                   [
                     ['日期', '配送信息', '', '', '', ''],
                     ['', '姓名', '地址', '', '', '']
                   ] // 前两行的表头数据，二维数组，不够的用空白补全
const header = ['', '', '省份', '市区', '地址', '邮编'] // 最后一行的表头数据，合并过的也要用空白补全
const merges = ['A1:A3', 'B1:F1', 'B2:B3', 'C2:F2'] //合并单元格的数据

```

vue文件源码：

```html
<template>
  <div style="padding: 20px;">
    <div style="padding: 20px 0;">
      <el-button size="small" type="primary" @click="handleDownload">导出EXCEl</el-button>
    </div>
    <el-table
      class="center-table"
      :data="tableData"
      size="small"
    >
      <el-table-column
        prop="date"
        label="日期"
        width="150"
      />
      <el-table-column label="配送信息">
        <el-table-column
          prop="name"
          label="姓名"
          width="120"
        />
        <el-table-column label="地址">
          <el-table-column
            prop="province"
            label="省份"
            width="120"
          />
          <el-table-column
            prop="city"
            label="市区"
            width="120"
          />
          <el-table-column
            prop="address"
            label="地址"
          />
          <el-table-column
            prop="zip"
            label="邮编"
            width="120"
          />
        </el-table-column>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>

export default {
  name: 'MergeHeader',
  data() {
    return {
      tableData: [{
        date: '2016-05-03',
        name: '王小虎',
        province: '上海',
        city: '普陀区',
        address: '上海市普陀区金沙江路 1518 弄',
        zip: 200333
      }, {
        date: '2016-05-02',
        name: '王小虎',
        province: '上海',
        city: '普陀区',
        address: '上海市普陀区金沙江路 1518 弄',
        zip: 200333
      }, {
        date: '2016-05-04',
        name: '王小虎',
        province: '上海',
        city: '普陀区',
        address: '上海市普陀区金沙江路 1518 弄',
        zip: 200333
      }, {
        date: '2016-05-01',
        name: '王小虎',
        province: '上海',
        city: '普陀区',
        address: '上海市普陀区金沙江路 1518 弄',
        zip: 200333
      }, {
        date: '2016-05-08',
        name: '王小虎',
        province: '上海',
        city: '普陀区',
        address: '上海市普陀区金沙江路 1518 弄',
        zip: 200333
      }, {
        date: '2016-05-06',
        name: '王小虎',
        province: '上海',
        city: '普陀区',
        address: '上海市普陀区金沙江路 1518 弄',
        zip: 200333
      }, {
        date: '2016-05-07',
        name: '王小虎',
        province: '上海',
        city: '普陀区',
        address: '上海市普陀区金沙江路 1518 弄',
        zip: 200333
      }]
    }
  },
  methods: {
    handleDownload() {
        import('@/vendor/Export2Excel').then(excel => {
          const multiHeader =
                            [
                              ['日期', '配送信息', '', '', '', ''], //第一行
                              ['', '姓名', '地址', '', '', ''] //第二行
                            ] // 前两行的表头数据，二维数组，不够的用空白补全
          const header = ['', '', '省份', '市区', '地址', '邮编'] // 最后一行的表头数据
          const filterVal = ['date', 'name', 'province', 'city', 'address', 'zip']
          const list = this.tableData
          const data = this.formatJson(filterVal, list)
          const merges = ['A1:A3', 'B1:F1', 'B2:B3', 'C2:F2'] // 合并单元格的数据，如何合并参考上面图片的蓝色背景部分
          excel.export_json_to_excel({
            multiHeader,
            header,
            merges,
            data
          })
        })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        return v[j]
      }))
    }
  }
}
</script>
<style>
    .center-table td, .center-table th {
        text-align: center;
    }
</style>

```
界面如图：

![](https://images.liyangzone.com/article_img/技术相关/导出多级表头excel/20200227_111142.png)

导出来的excel如图：

![](https://images.liyangzone.com/article_img/技术相关/导出多级表头excel/20200227_111833.png)



