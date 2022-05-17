---
title: vue项目watch内的函数重复触发问题
date: 2020-02-20 14:30
articlePath: 2020-02-20-solve-vue-watch-repeat-issues
categories: 技术
tags:
  - vue 
  - bug
---

#### 问题描述：
有两个页面A和B，每个页面里都有一个`getList()`方法。这个两个方法都需要传一个相同的参数C，参数C的选择过程又比较麻烦。为了避免在切换A、B两个界面重复选择参数C的问题，我将参数C存入vuex中，然后在两个页面里都使用watch监听参数C来执行`getList()`方法。然后发现一个问题，从A页面进入B页面后，在B页面重新选择参数C，A页面的`getList()`方法竟然也会被执行，反之亦然，从B页面到A页面后，在A页面改变参数C也会执行B页面的`getList()`方法。

后来发现是使用了因为使用了keep-alive所致，keep-alive会将Vue实例始终保持在内存中，因此该Vue实例始终存续，相应的watchers始终生效，查找相关资料后，发现许多人也遇到了这个问题，最后找到以下两种解决方案：

#### 解决方法1

通过router路径来判断是否执行`getList()`
```js
watch: {
        someValue(newValue, oldValue) {
            if (this.$route.fullPath === 'A页面路由路径') {
                // do something
            }
        }
    }
```
#### 解决方法2

添加一个flag参数来判断页面是否是active状态，使用keep-alive缓存的组件只会触发`activated`和`deactivated`事件，所以就在这两个事件触发时把flag置为true和false，只有在flag为true的时候才执行`getList()`
```js
{
  data () {
    return {
      activatedFlag: false
    };
  },
  watch: {
    'someValue'(val) {
      if(val && this.activatedFlag) {
        this.getlist();
      }
    }
  },
  activated () {
    this.activatedFlag = true;
  },
  deactivated () {
    this.activatedFlag = false;
  }
}
```
如果页面比较多，而且各页面里的函数名称不一致的话，可以把上面代码的watch部分去掉写成一个mixin，在需要的页面引入即可
```js
  import activeFlag from "@/mixin/activeFlag";

  export default {
    mixins: [activeFlag],
    watch: {
        'someValue'(val) {
          if(val && this.activatedFlag) {
            this.getlistA();
            this.getlistB();
          }
        }
      },
  }

```


