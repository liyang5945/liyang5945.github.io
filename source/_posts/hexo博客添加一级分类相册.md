---
title: hexo博客添加一级分类相册功能
date: 2019-07-22 10:43:47
categories: 技术教程
cover: true
tags: 
 - hexo 
 - 添加相册 
 - 分类相册 
 - 教程 
---

最近在折腾自己的博客，在折腾的过程中也参观了许多大牛的博客，发现不少博主都有个相册页面，我也想在自己的博客上面加个相册功能。但是我现在用的这个主题呢，虽然有个相册的功能，但是我感觉有点简陋，点击照片是个弹出的轮播图，照片多了的话还要一张一张的翻。如下图：

![](https://liyangzone.com/article_img/添加相册教程/2019-07-22-01.jpg)
<!-- more -->

后来在网上找了不少教程，可是实现的结果大部分都是这种：

![](https://liyangzone.com/article_img/添加相册教程/不带分类的相册.jpg)

虽然有了分类的功能，但是所有照片都是在一个页面上，图片多了会影响页面加载速度，页面也会变得很长，移动端会浪费大量流量，用户体验不是很好。

该博客地址：[http://lawlite.me/photos](http://lawlite.me/photos/)

而我想要的呢，是个类似`QQ空间`的相册，要有个相册目录界面，然后可以从目录页跳转至相册列表界面。 然后我翻遍了整个互联网终于找到了一个有相册分类功能的博客，该博客的相册界面是这样的：

![](https://liyangzone.com/article_img/添加相册教程/分类相册1.jpg)
![](https://liyangzone.com/article_img/添加相册教程/20190722-153547.jpg)


该博客地址：[http://www.rayblog.cn/album](http://www.rayblog.cn/album/)


好吧，这就是我想要的效果，而且博客下面还有教程，我研究了半天，把代码都拷到本机运行了之后，发现他这个教程也只是实现了相册的列表界面，至于目录界面是怎么弄出来的只是一笔带过。并没有实现的细节。我个人猜测他的目录界面是一个`album/index.md`文件，然后md文件里手动写的HTML代码。 

虽然这种方式我也能实现，但我并不想这么做，因为我感觉在markdown文件里面写HTML和js不是很优雅，也有些繁琐，假如要添加一个相册的话还要手动修改里面的HTML代码，添加对应的链接。

后来我仔细研究了这个主题的源码，发现这个主题的`友情链接`界面实现的方式是这样的，读取`sources/_data/friends.json`文件,该文件内容如下：

```json
[{
  "avatar": "http://image.luokangyuan.com/1_qq_27922023.jpg",
  "name": "码酱",
  "introduction": "我不是大佬，只是在追寻大佬的脚步",
  "url": "http://luokangyuan.com/",
  "title": "前去学习"
}, {
  "avatar": "http://image.luokangyuan.com/4027734.jpeg",
  "name": "闪烁之狐",
  "introduction": "编程界大佬，技术牛，人还特别好，不懂的都可以请教大佬",
  "url": "https://blinkfox.github.io/",
  "title": "前去学习"
}, {
  "avatar": "http://image.luokangyuan.com/avatar.jpg",
  "name": "ja_rome",
  "introduction": "平凡的脚步也可以走出伟大的行程",
  "url": "ttps://me.csdn.net/jlh912008548",
  "title": "前去学习"
}]
```
该文件包含每个友链的头像、名字、介绍、地址、标题信息，然后hexo会按照friends.ejs模板文件里的结构渲染出来列表，实现的效果就是这样的:
![](https://liyangzone.com/article_img/添加相册教程/2019-07-22-02.jpg)

就是三个a标签，里面包含头像、地址等信息，点击后跳到对应的地址。

那么我们也能自定义一个相册的配置文件和模板文件，然后hexo读取这个配置文件，自动生成目录界面和列表界面，这样的话，只需要修改这个配置文件就能完成对相册的各种操作（增删改）。

好吧，有了思路，就已经成功一半了，至于代码实现呢，就只是时间问题了。花了一个周末的时间我终于把它实现了。下面是具体实现过程:

#### 1、添加【相册】菜单

这里要修改几个文件：

该主题的配置文件`_config.yml` ，不要跟站点根目录下的同名文件搞混了，在`menu`下添加以下代码:

```yaml
Galleries:
    url: /galleries
    icon: fa-photo
```
该主题的语言配置文件目录 `languages`下的 `default.yml`和`zh-CN.yml`，分别是英文和中文的配置文件，分别添加以下内容，

```yaml
galleries: galleries

galleries: 相册
```

该主题目录下`layout/_partial/navigation.ejs`和`layout/_partial/mobile-nav.ejs`文件里添加

```js
    menuMap.set("Galleries", "相册");
```

至于添加到什么位置，你打开文件就知道了，里面会有类似格式的代码，很容易找到的。

做完以上操作后，你就会发现`相册`的菜单已经出现了：

![](https://liyangzone.com/article_img/添加相册教程/2019-07-22-03.jpg)

点击就能跳转到`galleries`下，然而浏览器会提示你：

![](https://liyangzone.com/article_img/添加相册教程/2019-07-22-04.jpg)



因为站点下并没有`galleries/index.html`这个文件，如何生成这个文件呢?
在站点根目录`source`下新建`galleries`目录，然后在该目录下新建`index.md`，就会生成`index.html`文件了，然而却是这个效果：

![](https://liyangzone.com/article_img/添加相册教程/2019-07-22-05.jpg)


#### 2、生成相册目录和相册列表

这是为什么呢？因为hexo把这个文件当成一个普通的文章来渲染了，而我们需要自定义样式，不能让它渲染成普通的文章。要让它渲染成一个`layout`,也就是我们自定义的模板。需要以下操作：
在`index.md`文件里添加以下内容，注意，那几个中划线也不要少了。

<pre>
---
title: 相册
layout: "galleries"
---
</pre>

首先添加自定义CSS样式文件，该`主题`目录下的`source/css`里新建`gallery.css`文件，复制以下css样式进去：

```css
.gallery-wrapper{
  padding-top: 30px;
}
.gallery-wrapper .gallery-box{
  padding: 5px !important;
}

.gallery-wrapper .gallery-item {
  display: block;
  overflow: hidden;
  background-color: #fff;
  padding: 5px;
  padding-bottom: 0;
  position: relative;
  -moz-box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.22);
  -webkit-box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.22);
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.22);
}

.gallery-cover-box{
  width: 100%;
  padding-top: 60%;
  text-align: center;
  overflow: hidden;
  position: relative;
  background: center center no-repeat;
  -webkit-background-size: cover;
  background-size: cover;
}

.gallery-cover-box .gallery-cover-img {
  display: inline-block;
  width: 100%;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);
}
.gallery-item .gallery-name{
  font-size: 14px;
  line-height: 24px;
  text-align: center;
  color: #666;
  margin: 0;
}

.waterfall {
  column-count: 3;
  column-gap: 1em;
}
.photo-wrapper{
  padding-top: 20px;
}
.photo-item {
  display: block;
  padding: 10px;
  padding-bottom: 0;
  margin-bottom: 14px;
  font-size: 0;
  -moz-page-break-inside: avoid;
  -webkit-column-break-inside: avoid;
  break-inside: avoid;
  background: white;
  -moz-box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.22);
  -webkit-box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.22);
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.22);
}
.photo-item img {
  width: 100%;
}
.photo-item .photo-name{
  font-size: 14px;
  line-height: 30px;
  text-align: center;
  margin-top: 10px;
  margin-bottom: 10px;
  border-top: 1px solid #dddddd;
}

/*适配移动端布局*/
@media only screen and (max-width: 601px) {
  .waterfall {
    column-count: 2;
    column-gap: 1em;
  }
}


```

在该主题`layout`目录下新建`galleries.ejs`文件，添加以下代码：
```html
<link rel="stylesheet" href="/css/gallery.css">

<%- partial('_partial/bg-cover') %>

<main class="content">
    <div class="container">
        <% if (site.data && site.data.galleries) { %>
        <% var galleries = site.data.galleries; %>
        <div class="gallery-wrapper row">
            <% for (var i = 0, len = galleries.length; i < len; i++) { %>
            <% var gallery = galleries[i]; %>
            <div class="col s6 m4 l4 xl3 gallery-box">
                <a href="./<%- gallery.name %>" class="gallery-item" data-aos="zoom-in-up">
                    <div class="gallery-cover-box" style="background-image: url(http://图片地址.com/<%- gallery.cover%>);">
                    </div>
                    <p class="gallery-name">
                        <%- gallery.name %>
                    </p>
                </a>
            </div>
            <% } %>
        </div>
        <% } %>
    </div>
</main>



```
同目录下新建`gallery.ejs`，添加以下代码：

```html
<link rel="stylesheet" href="/css/gallery.css">
<link type="text/css" href="/libs/fancybox/jquery.fancybox.css" rel="stylesheet">
<link type="text/css" href="/libs/justifiedGallery/justifiedGallery.min.css" rel="stylesheet">

<%- partial('_partial/post-cover') %>
<%
let galleries = [];
if (site.data && site.data.galleries) {
    galleries = site.data.galleries;
}
var pageTitle = page.title;
function getCurrentGallery(galleries, pageTitle) {
    for (let i = 0; i < galleries.length; i++) {
        if (galleries[i]['name'] == pageTitle) {
            return galleries[i];
        }
    }
}
var currentGallery = getCurrentGallery(galleries, pageTitle)

var photos = currentGallery.photos;

let imageStr = ''

for (var i = 0, len = photos.length; i < len; i++) {
    var photo = photos[i];

    imageStr += "<a href=\"http://图片地址.com/" + photo + "\"" +
            "     class=\"photo-item\" rel=\"example_group\"" +
            "     data-fancybox=\"images\">" +
            "      <img src=\"http://图片地址.com/" + photo + "\"" +
            "       alt=" + photo + ">\n" +
            "    </a>"

}
%>

<div class="container">
    <div class="photo-wrapper">
        <div class="waterfall" id="mygallery">
            <%- imageStr %>

        </div>
    </div>
</div>


<script src="/libs/fancybox/fancybox.js"></script>
<script src="/libs/justifiedGallery/justifiedGallery.min.js"></script>
<script>

  $("a[rel=example_group]").fancybox();
  $("#mygallery").justifiedGallery({margins: 5, rowHeight: 150});

</script>

```

以上代码实现的功能呢，就是读取相册配置文件并把相册目录和相册列表都渲染成HTML，用`<% %>`包起来的代码是`ejs`语法，调试的话是在本地控制台输出的而不是浏览器，就是你输入`hexo s`的地方，我这里用的是WebStorm自带的终端，看下图：

![](https://liyangzone.com/article_img/添加相册教程/2019-07-22-06.jpg)


另外上面代码里引用了两个`jquery插件`，分别是`fancybox`和`justifiedGallery`, 一个是点击弹出的轮播插件，一个是自动调整图片布局的插件，需要自行下载并放到相应目录，当然，你也可以用浏览器调试工具直接在我的博客上下载，在sources里找到对应的文件，另存为就行。

#### 3、制作相册配置文件

在`站点`目录`sources/_data/`下新建一个`galleries.json`的文件，模板如下：
```json
[
  {
    "name": "2017",
    "cover": "2017/IMG_20171109_124516.jpg",
    "description": "2017年记录",
    "photos": [
      "2017/IMG_20170924_110224.jpg",
      "2017/IMG_20170924_113412.jpg",
      "2017/IMG_20171109_124516.jpg",
      "2017/IMG_20171125_125304.jpg",
      "2017/IMG_20171126_181605.jpg"
    ]
  },
  {
    "name": "2018",
    "cover": "2018/IMG_20181124_125818.jpg",
    "description": "2018年记录",
    "photos": [
      "2018/IMG_20180204_113055.jpg",
      "2018/IMG_20180204_113302.jpg",
      "2018/IMG_20180204_113442.jpg",
      "2018/IMG_20180208_083336.jpg"
    ]
  },
  {
    "name": "2019",
    "cover": "2019/IMG_20190331_165713_1.jpg",
    "description": "2019年记录",
    "photos": [
      "2019/IMG_20190118_200104.jpg",
      "2019/IMG_20190118_200120.jpg",
      "2019/IMG_20190118_200456.jpg"
    ]
  }
]

```

就是一个包含多个相册的列表JSON，每个相册有以下字段，`name`是相册标题，`cover`是封面图片，从相册里随便选一个就行，`description`是相册介绍，`photos`是图片列表。图片较少的话手动复制进去就行，如果你图片较多的话推荐使用脚本之类的东西自动生成，我是使用了上面博客里的js文件生成的。我这里使用了七牛对象存储做为图床，需要在代码里加上七牛的地址才能正常显示。


配置文件建好了之后还没完，只剩最后一个步骤了，在`galleries`下建立对应的相册名称目录和文件，比如我这三个相册需要建 2017 2018 2019三个目录，然后下面再分别新建`index.md`文件，文件内容为:
<pre>
---
title: 2017
layout: "gallery"
---
</pre>

建好相应目录和文件之后，如果你的图片路径也没有错的话，相册目录和列表就都会渲染出来了，如下所示：

![](https://liyangzone.com/article_img/添加相册教程/2019-07-22-07.jpg)

![](https://liyangzone.com/article_img/添加相册教程/20190722_161044.jpg)

![](https://liyangzone.com/article_img/添加相册教程/20190722_160930.jpg)

#### 4、照片列表的布局选择


上面的博客用的布局都比较简单粗暴，都是固定的大小和宽高比。但是不同的图片有不同的宽高比，用这种模式的话图片有两种显示方式，一是强制缩放到固定的宽高，二是裁切只显示一部分，但是都有缺点，第一个会图片会变形，第二个图片显示不全。那么有没有两全齐美的办法呢？答案是肯定的。首先我选用的是瀑布流布局，用CCS3的新特性实现的，这种模式的特点是等宽布局，固定列数，图片高度自适应，如下图：

![](https://liyangzone.com/article_img/添加相册教程/20190115114259.jpg)

看起来似乎没什么问题，高端大气上档次，然而做好了我发现图片的排列顺序是这个样子的，是按列竖向排列的，不太符合阅读习惯，PASS。

另外一种布局呢是等高布局，如图；
![](https://liyangzone.com/article_img/添加相册教程/20190723_110706.jpg)

这种布局是等高布局，图片高度一致，宽度自适应，图片托管网站flickr就是用的这种模式，但是用CSS方法是实现不了的，因为每一行最后张图片不一定能正好撑满这一行，需要用js动态设置图片的宽高来实现，上面引用的`justifiedGallery`插件就是来完成这个的。
下面代码的功能就是初始化这个插件，间距是5px，每一行的高度是150px。

```js
  $("#mygallery").justifiedGallery({margins: 5, rowHeight: 150});

```

这两种布局呢，上面的代码里都是包含了的。是可以手动切换的。只需要把上面那句代码注释掉就会切换到瀑布流布局，效果如下图：
![](https://liyangzone.com/article_img/添加相册教程/20190723_134939.jpg)

当然，你要是对我写的样式不满意的话也可以自己修改代码，边框和文件名都是可以去掉的。


#### 5、图床相关事项


2019-08-28更新:

最初我是采用的七牛对象存储当为图床，但是我发现一个问题，在相册列表界面下，相册图片较多或图片体积很大的情况下加载速度会很慢，也会浪费大量的流量。七牛CDN免费流量只有10G，然而我还作死的把几个图片的链接地址放到了某论坛上，图片也没有做任何处理，一个图片为几MB大小，在我放出外链几个小时之后，CDN流量就爆了，超出了约60G：

![](https://liyangzone.com/article_img/添加相册教程/20190828_223502.jpg)

为了防止以后再发生这样的事，减少CDN流量消耗，我想到了如下两种方案：

一是手动生成图片的缩略图到另外一个新目录，保持与原相册目录结构一致。比如我一个图片路径为 /gallery/2017/XXX.jpg,缩略图结构应为/gallery-tiny/2017/XXX.jpg。

在相册列表界面应使用缩略图而不是使用原图。上面代码中 `a标签`里的地址是大图地址，点击才会加载，`img`标签里的地址是缩略图地址。

缩略图大小我调整为600px宽度，这样每个图片体积可减少到100KB以下。这样一个100张图片的相册，缩略图也不超过10MB。缩略图我使用 `Light Image Resizer` 软件批量生成。

上面对应的代码需要改为:
```js

 imageStr += "<a href=\"http://imgs.liyangzone.com/" + photo + "\"" +
            "     class=\"photo-item\" rel=\"example_group\"" +
            "     data-fancybox=\"images\">" +
            "      <img src=\"http://imgs.liyangzone.com/gallery-tiny/" + photo + "\"" +
            "       alt=" + photo + ">" +
            "    </a>"

```

二是使用七牛自带的`图片样式`功能，该功能提供简单快捷的图片格式转换、缩略、剪裁功能。只需要填写几个参数，即可对图片进行缩略操作，生成各种缩略图。比如我建立了一个名为 `w33` 的图片样式，该样式的功能就是生成原图33%大小的缩略图。假如一个100×100的图片，在图片地址后面加上这个样式后就变成33×33大小的了。对应代码需改为：

```js

 imageStr += "<a href=\"http://imgs.liyangzone.com/" + photo + "!w95\"" +
            "     class=\"photo-item\" rel=\"example_group\"" +
            "     data-fancybox=\"images\">" +
            "      <img src=\"http://imgs.liyangzone.com/" + photo + "!w33\"" +
            "       alt=" + photo + ">" +
            "    </a>"

```
列表页使用33%大小的样式，查看大图使用95%大小的。上面的叹号是样式分隔符，七牛默认的分隔符有四个:

```html
- _ ! /
```
也可以改成下面的：
```html
~ ` @ $ ^ & * ( ) + = { } [ ] | : ; " ' < >

```

生成的图片地址是这样的,你可以复制到地址栏查看效果：
```html
http://imgs.liyangzone.com/2017/IMG_20170508_163002.jpg!w33
http://imgs.liyangzone.com/2017/IMG_20170508_163002.jpg!w75
```
另外建议开启七牛的原图保护功能并配置Referer防盗链，防止被恶意刷流量。

我目前使用的是第一种方案，只是把缩略图放到腾讯CDN了，不想麻烦的可以使用第二种。























































