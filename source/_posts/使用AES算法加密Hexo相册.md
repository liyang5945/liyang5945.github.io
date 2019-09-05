---
title: 使用AES算法加密Hexo相册
date: 2019-07-30 11:30
cover: true
tags: 
- hexo
- 相册
- 加密
categories:
- 技术教程  
---

本教程承接上篇[Hexo博客添加一级分类相册](/2019/07/22/hexo%E5%8D%9A%E5%AE%A2%E6%B7%BB%E5%8A%A0%E4%B8%80%E7%BA%A7%E5%88%86%E7%B1%BB%E7%9B%B8%E5%86%8C/)。

在上篇教程中，我们已经实现了hexo的分类相册功能。然后我发现那个大佬的相册竟然还有加密的功能（点击进入[大佬的相册](http://www.rayblog.cn/album/)），在大佬的这篇[教程](http://www.rayblog.cn/posts/uncategorized/2017-07-05-establish-blog.html)下面，还有一个参考资料：使用AES算法加密hexo文章，可惜的是链接已经失效了，不过也没有关系，在网上查找相关资料后，我也把它实现了，本篇教程就来实现相册加密功能。

先来科普一下AES加密算法：高级加密标准（英语：Advanced Encryption Standard，缩写：AES），在密码学中又称Rijndael加密法，是美国联邦政府采用的一种区块加密标准。这个标准用来替代原先的DES，已经被多方分析且广为全世界所使用。经过五年的甄选流程，高级加密标准由美国国家标准与技术研究院（NIST）于2001年11月26日发布于FIPS PUB 197，并在2002年5月26日成为有效的标准。2006年，高级加密标准已然成为对称密钥加密中最流行的算法之一。



#### 1、主题自带的加密

首先我发现本主题自带一个加密功能：如下图：

![](https://liyangzone.com/article_img/加密相册教程/20190730_120352.png)

它的实现效果是这样的：


![](https://liyangzone.com/article_img/加密相册教程/20190730_120754.png)

在进入界面的时候就要求输入密码，不输或输入错误都会跳转到首页。

在我看了源码之后发现是这样实现的，如果文章配置了加密就在页面里加上一段js代码，源码在`post.ejs`文件里，如下图；

![](https://liyangzone.com/article_img/加密相册教程/20190730_121113.png)

页面内生成的js代码呢，是这样的：

![](https://liyangzone.com/article_img/加密相册教程/20190730_121325.png)

我们可以看到密码是直接写在页面内的，主题作者是采用`SHA256`再加密一遍密码，再用这个值当密码，防止别人识破。然而这种方式是伪加密的，查看网页的源代码就可以看到文章的内容。这种方式可以阻挡99%的人，但是对付懂行的人就不行了，有心人费点心思就能破解。


#### 2、Hexo插件加密

然后我以`hexo 加密`为关键字搜索相关教程，得到的结果如下：

![](https://liyangzone.com/article_img/加密相册教程/20190730_115324.png)

里面的内容大同小异，不外乎两个hexo的插件：一个是`hexo-blog-encrypt`，另一个是`hexo-encrypt`。在我把两个插件都尝试过了之后，发现这两个插件只能加密`文章`，也就是hexo从md文件里读取到的文章内容。而我们的相册呢，是根据配置文件自动生成的，并没有在md文件里写着，实现不了加密。

好吧，那我就研究一下这两个插件的原理，看它们是如何实现文章加密的。

先使用`hexo-blog-encrypt`插件，给[hello world]()这篇文章加密试试：
首先启用该插件，在根目录的_config.yml中启用该插件，添加以下代码:
```yaml
# Security  
  encrypt: 
  enable: true

```

然后设置文章的密码，在文章头部加上`password`字段,密码为2233:

```markdown

---
title: Hello，world！
date: 2019-07-15 17:25:30
password: 2233
tags: 
- hello world
categories:
- 日志  
---

```

然后`hexo-blog-encrypt`插件就会把文章加密了，如下图：

![](https://liyangzone.com/article_img/加密相册教程/20190730_131238.png)

页面结构如下：

![](https://liyangzone.com/article_img/加密相册教程/20190730_131459.png)

文章的内容被加密成了这么一坨字符串，解密后变成了这样：

![](https://liyangzone.com/article_img/加密相册教程/20190730_131813.png)

文章的内容，就是两个P标签。

#### 3、插件的加密过程

那一坨字符串是怎么变成两个P标签的呢，我仔细研究后发现解密的功能在`blog-encrypt.js`这个文件里，在知道正确密码的情况下，执行了四步转换才将那个字符串解密，源码如下：

![](https://liyangzone.com/article_img/加密相册教程/20190730_133345.png)

那么这四步都干了什么呢，我把上面加密后的一坨字符串和相关js都放到一个html里在浏览器控制台调试一下，看看究竟是怎么解密的：

![](https://liyangzone.com/article_img/加密相册教程/20190730_133720.png)

控制台输出如下：

![](https://liyangzone.com/article_img/加密相册教程/20190730_133817.png)

我们可以看到，在第四步输出了解密后的HTML标签。

解密步骤如下：


1、根据密码使用AES算法将密文解密，解密的代码为：
```js
  let content = CryptoJS.AES.decrypt(encriptHtmlStr, password);

```
解密出来的内容是一个JS对象，里面有一个words数组，展开后如下图：

![](https://liyangzone.com/article_img/加密相册教程/20190730_135141.png)

2、将上面那个JS对象转换为utf-8码，转换后为成为一个base64字符串。

3、解码base64字符串，解码后是一个经过js转码(escape)的字符串。

4、解码(unescape)上面的字符串，最终结果为HTML标签。

既然知道了解密的过程，那么可以推断加密过程就是上述步骤的逆操作，在查看`hexo-blog-encrypt`的源码之后（在`node_modules`目录下），果不其然，找到如下代码：

```js
data.content = escape(data.content);
data.content = CryptoJS.enc.Utf8.parse(data.content);
data.content = CryptoJS.enc.Base64.stringify(data.content);
data.content = CryptoJS.AES.encrypt(data.content, String(data.password)).toString();

```

CryptoJS是引入的`npm`插件`crypto-js`
```js

const CryptoJS = require('crypto-js');

```

那么我们也能写一个加密函数，在生成HTML字符串的时候加密它，然后把加密后的字符串渲染出来。

#### 4、加密辅助函数

然而在实际操作的时候我发现在ejs文件里面用常规的方法引入`npm`插件是不行的，无论是`import 'crypto-js'`还是 `require('crypto-js')`都是不行的。那么如何在ejs里面调用外部函数呢？ 

在查看[官方文档](https://hexo.io/zh-cn/api/helper.html)之后发现需要自己写一个辅助函数（helper），才能在ejs里调用它：

![](https://liyangzone.com/article_img/加密相册教程/20190730_192430.png)

然后我们在主题根目录下新建以下目录和文件`scripts/helpers/encrypt.js`，`encrypt.js`内代码如下：

```js

/* global hexo */


'use strict';

const CryptoJS = require('crypto-js');

hexo.extend.helper.register('aes', function(content,password){

  content = escape(content);
  content = CryptoJS.enc.Utf8.parse(content);
  content = CryptoJS.enc.Base64.stringify(content);
  content = CryptoJS.AES.encrypt(content, String(password)).toString();

  return content;
});


```

注册一个名为`aes`的辅助函数，这样才能在ejs文件里使用它。

然后将`gallery.ejs`文件内中间的HTML部分改成如下代码：
```html
<div class="container">
    <div class="photo-wrapper">
        <% if (page.password ) { %>

            <script src="/lib/crypto-js.js"></script>
            <script src="/js/gallery-encrypt.js"></script>
            <div id="hbe-security">
                <div class="hbe-input-container">
                    <input type="password" class="hbe-form-control" id="pass"  placeholder="请输入密码查看内容"/>
                    <a href="javascript:;" class="btn-decrypt" id="btn_decrypt">解密</a>
                </div>
            </div>
            <div  id="mygallery">
                <div class="waterfall" id="encrypt-blog" style="display:none">
                    <%- aes(imageStr, page.password) %>
                </div>
            </div>
        <% } else { %>
            <div class="waterfall" id="encrypt-blog">
                <%- imageStr %>
            </div>
        <% } %>
    </div>
</div>
```
初始化`justifiedGallery`插件的那句代码修改成下面的，就是改了一个id

```js
  $("#encrypt-blog").justifiedGallery({margins: 5, rowHeight: 150});
```




这段代码的作用就是判断相册是否有密码，有则加密，没有则正常渲染，密码也是写在md文件的头部，加密后页面样式和HTML结构如下：

![](https://liyangzone.com/article_img/加密相册教程/20190730_220409.png)

![](https://liyangzone.com/article_img/加密相册教程/20190730_211445.png)

可以看到内容已经被加密成了一坨乱码，在这里，我手动加了一个`解密`按钮，原来插件是没有的，然后写点css美化一下，我是加到了`my.css`里面

```css
.hbe-input-container  .btn-decrypt{
  display: inline-block;
  vertical-align: top;
  width: 120px;
  height: 32px;
  line-height: 32px;
  font-size: 16px;
  color: #ffffff;
  background-color: #3f90ff;
  text-align: center;
  -webkit-border-radius: 3px;
  -moz-border-radius: 3px;
  border-radius: 3px;
}
```

#### 5、修改解密js文件 

因为和文章的加密有点区别，而且插件的解密操作会在id为`encrypt-blog`的div上加上一些样式，会导致`justifiedGallery`样式错乱，所以是不能直接用文章的解密js文件（`/lib/blog-encrypt.js`）的。此文件在发布后才会生成，在`hexo-blog-encrypt`插件的目录（`node_modules/hexo-blog-encrypt`）下也能找到，需要做些修改才能解密相册，找到该文件后复制一份，重命名为`gallery-encrypt.js`,放到主题目录`source/js`下，替换文件尾部`$(document).ready()`里面的代码如下：

```js

$(document).ready(
  function () {
    let password = String(getCookie(GenerateCookieName()));
    console.log(`Get password from Cookie:${password}`);

    if (password != '') {

      if (!decryptAES(password)) {
        // Delete cookie
        setCookie(COOKIE_NAME, password, -5);
      } else {

        document.getElementById('encrypt-blog').removeAttribute('style');

        $("#encrypt-blog").justifiedGallery({margins: 5, rowHeight: 150});
      }
    }
    document.getElementById('pass').onkeypress = function (keyPressEvent) {

      password = String(document.getElementById('pass').value);
      if (keyPressEvent.keyCode === 13) {

        const result = decryptAES(password);

        if (result) {
          document.getElementById('encrypt-blog').removeAttribute('style');

          $("#encrypt-blog").justifiedGallery({margins: 5, rowHeight: 150});

          setCookie(GenerateCookieName(), password, 30);
        }
      }
    };
    $('#btn_decrypt').on('click', function () {

      password = String(document.getElementById('pass').value);

      const result = decryptAES(password);

      if (result) {

        document.getElementById('encrypt-blog').removeAttribute('style');

        $("#encrypt-blog").justifiedGallery({margins: 5, rowHeight: 150});

        setCookie(GenerateCookieName(), password, 30);
      }
    });
  }
);
```

这段代码的作用就是在解密后清除id为`encrypt-blog`这个div的样式，然后再初始化 `justifiedGallery`插件，解决图片错乱的问题，还有给按钮绑定解密的操作。

至此，相册的加密功能也已经实现了。你可以前往[体验一下](/galleries/private/)，看你能不能破解。

#### 6、注意事项

需要注意的是上面HTML里引入的`crypto-js.js`这个文件，只有安装了`hexo-blog-encrypt`插件发布后才会生成，如果你不想安装这个插件，则需要手动安装`crypto-js`: `npm i crypto-js`, 然后在插件目录下找到`crypto-js.js`文件，复制出来放到`source/js`下，引用路径也要改一下。

博客源码已上传至github: [点击前往](https://github.com/liyang5945/liyang5945.github.io),觉得不错的可以给个STAR支持一下。



















































        











