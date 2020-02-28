---
title: 使用nginx和LiveReload搭建简单的热更新web开发环境
date: 2019-11-21 20:39
author: liyang
categories: 技术分享
toc: false
tags:
  - nginx
  - LiveReload
  - 热更新
  - 教程
---

如今web前端开发已经进入工程化、模块化的时代，各种框架、工具层出不穷。在工程化开发中，热更新已经由webpack、gulp等工具替我们实现了，不过有时候我们要调试一些比较简单的东西，比如测试一个css效果或js插件，使用这些工具的话却又显得有些笨重（要安装一堆npm插件），有没有更简单的实现热更新的方法呢，我们可以借助liveReload插件来实现。

LiveReload插件原理，LiveReload是基于WebSocket协议实现（WebSocket协议可以向主动向客户端发送消息，HTTP协议不能），在本地开启一个WebSocket服务，并且检测文件变化，浏览器打开一个页面时候，引入固定的LiveReload.js（chrome插件会帮忙加上）会建立WebSocket连接，当检测到文件变化，则自动推送消息给浏览器，实现刷新。

LiveReload安装：LiveReload需要客户端与浏览器插件配合才能实现，进入[livereload.com](http://livereload.com/)下载客户端并安装（MAC，windows，linux全平台都有）。下图为windows客户端界面，打开后本地WebSocket服务就会立即启动，然后把相关文件夹添加进去即可。

![](https://images.liyangzone.com/article_img/技术相关/前端热更新环境搭建/20191111_174217.png)

然后安装浏览器插件，这里我已FireFox浏览器为例（Chrome浏览器访问插件商店需要梯子，也可以在第三方网站下载然后手动安装），搜索liveReload即可，注意是这个图标，别装错了：

![](https://images.liyangzone.com/article_img/技术相关/前端热更新环境搭建/20191111_174100.png)

nginx相关：nginx是一个高性能的HTTP和反向代理web服务器，在这里我们仅仅用它来搭建一个本地服务器来预览效果，有点大材小用的感觉。在windows下的安装也比较简单，从官网下载对应系统的zip包解压后，运行nginx.exe程序即可。运行之前最好改一下配置文件，配置文件为`conf/nginx.conf`,我们主要修改根目录和端口，我作了如下修改，端口号改为8088、根目录改为`D:/develop/nginx_root`。

![](https://images.liyangzone.com/article_img/技术相关/前端热更新环境搭建/nginx-config.png)

访问地址有三种，localhost:8088、127.0.0.1:8088、和局域网ip地址，类似这种：192.168.XX.XX:8088，局域网地址也可以在同一个内网的其他设备上访问（需关闭本机防火墙），比如手机或其他PC设备。
启动liveReload客户端，再打开浏览器，点击插件图标，即可启用liveReload，效果如图：

![](https://images.liyangzone.com/article_img/技术相关/前端热更新环境搭建/livedemo1.gif)

插件会在页面上插入一个script标签，这个js文件的作用就是与客户端的WebSocket服务建立连接，当文件发生改动的时候，WebSocket服务器就会向浏览器发送通知，从而实现热更新，效果如图：

![](https://images.liyangzone.com/article_img/技术相关/前端热更新环境搭建/livedemo.gif)

以上功能也能用其他工具实现，nginx也可以用其他http服务替代，比如：比如.net系的IIS，JAVA系的tomcat，npm插件http-server，使用nodejs/python也能开启一个简单的http服务。liveReload客户端可以用npm插件livereload来实现（他们的作用都是开启本地WebSocket服务并监听文件）。
npm安装http-server：npm install http-server -g  启动本地http服务：在所在文件夹打开命令行，输入：http-serve即可，可在后面加参数 -p + 端口号，例如： http-serve -p 8888。
npm安装livereload: npm install livereload -g 启动本地WebSocket服务：在所在文件夹打开命令行，输入：livereload即可。
缺点就是需要打开两个命令行，不如直接打开客户端来得方便。
![](https://images.liyangzone.com/article_img/技术相关/前端热更新环境搭建/20191121_203144.png)







