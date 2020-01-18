## 个人博客

基于 Hexo [hexo-theme-matery](https://github.com/blinkfox/hexo-theme-matery) 主题改造，进行了如下修改：

- 修改主题颜色，修改首页轮播图高度为60%。
- 修改首页轮播动态切换背景颜色，具体值为红橙黄绿青蓝紫，依次变化。
- 修复一些bug：
首页卡片和文章列表宽度不一致，首页文章列表上部分border-radius失效
修改文章摘要为两行文字固定高度，因为高度不一致时会排列错乱，友情链接页也有这个问题
- 添加分类相册&相册加密功能。
- 去除标签页，将标签合并到到分类页。
- 修改归档页时间轴样式为普通列表样式。
- 修改Valine评论输入框placeholder的样式。
- 将一些CSS和JS文件引用地址改为Staticfile CDN(主题/libs目录下的文件，本地已删除)。
- 替换Banner图片及文章特色图片。
- 添加CNZZ站长统计。
- 2018-01-18 添加Travis-CI持续集成。




## 预览

在线预览：[星空无限](https://liyangzone.com)

![blog-home.jpg](https://i.loli.net/2019/08/31/jlQBpx8nJfGuzqZ.jpg)

![blog-archives.jpg](https://i.loli.net/2019/08/31/Juf6ZyeSiUXxbTk.jpg)

## 相册功能

相册目录：

![blog-gallery-1.jpg](https://i.loli.net/2019/08/31/9mlyKIgTO4Ajcs6.jpg)

相册列表：

![blog-gallery-2.jpg](https://i.loli.net/2019/08/31/DIpRMfwX6GF4WqO.jpg)


相册大图：

![blog-gallery-3.jpg](https://i.loli.net/2019/08/31/iyJrANKxa9BMwE8.jpg)


## 安装使用（Installation）

```shell
git clone https://github.com/liyang5945/liyang5945.github.io.git
npm install
hexo s
```

## 注意事项
下载后请修改valine的appId以及cnzz_siteid，在themes\hexo-theme-matery\_config.yml下可以找到配置信息。



## 最后

如果觉得我的项目还不错的话👏 ，就给个 star ⭐ 鼓励一下吧~
