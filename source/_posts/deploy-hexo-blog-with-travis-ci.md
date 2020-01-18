---
title: 使用Travis-CI部署hexo博客到腾讯cos&github-pages
date: 2020-01-16 20:25:30
tags: 
- hexo
- Travis-CI

categories:
- 技术分享  
---

### 前言

以前我的博客静态文件是放在一个带宽1Mbps的腾讯云主机上，文章里的图片也是放在云主机上的，当有些文章图片较多的时候，加载就会变得很慢。后来我将静态文件和图片全部迁移到腾讯对象存储(cos)里，并配置了CDN加速，从此加载速度不再是瓶颈，可以做到基本秒开。

具体方案是将静态文件和图片文件分别放到两个存储桶里，放静态文件的存储桶CDN设置博客主域名，放图片的存储桶CDN设置二级域名，比如我设置了图片CDN二级域名为`images.liyangzone.com`，写文章的时候先上传图片到存储桶，然后在文章里就可以直接引用图片了。比如我在存储桶根目录上传了一张名为`test.jpg`的图片，它的地址就是`images.liyangzone.com/test.jpg`，而且支持多级目录，比一些图床什么的要方便很多，有些图床虽然免费，但是它的文件名一般是一个无规律的字符串，类似这种`https://i.loli.net/2020/01/17/Mb1fywFLrJ8khUS.png`，当你传了很多图片时可能会一脸懵逼，分不清哪张是什么内容了，不利于维护。

而博客静态文件呢，我们可以用`hexo-deployer-cos`这个插件来替我们完成，具体配置教程可参考此文章：[如何在腾讯云COS部署HEXO博客](https://cloud.tencent.com/developer/article/1185253)。
配置完了cos各种参数后，执行`hexo d`命令就会将本地文件上传至cos了，可是这种方式需要本地安装nodejs和hexo，如果想在别的电脑上写文章就不方便了，有没有一种更加便捷的部署方式呢？答案是有的，那就是——**持续集成**。

### 什么是持续集成
持续集成（Continuous Integration）是一种软件开发实践。 在持续集成中，团队成员频繁集成他们的工作成果，一般每人每天至少集成一次，也可以多次。 每次集成会经过自动构建（包括自动测试）的检验，以尽快发现集成错误。
### 什么是Travis CI
Travis CI 是目前新兴的开源持续集成构建项目，它与 jenkins，GO 的很明显的特别在于采用 yaml 格式，同时它是在线的服务，不像 jenkins 需要你本地搭建服务器，简洁清新独树一帜。目前大多数的 Github 项目都已经移入到 Travis CI 的构建队列中，据说Travis CI 每天运行超过 4000 次完整构建。对于做开源项目或者 Github 的使用者，如果你的项目还没有加入 Travis CI 构建队列，那么我真的想对你说 OUT 了。

### 为什么选择Travis CI 
为什么我们要选择 Travis 呢，因为它和 Github 集成的程度非常高，对于 Github 上的开源项目，可以免费在 Travis 上构建（为免费的互联网精神干杯🍻），而非开源的私有项目想在 Travis 上构建价格还是非常感人的。

### 折腾Travis CI后有能达到什么效果？

 1. 直接在线编辑文件，立即生效：
假设你已经发表了一篇文章，过了几天你在朋友机器上浏览发现有几个明显的错别字，对于有强迫症的，这是不能容忍的。 但你手头又没有完整的hexo+nodejs+git的开发环境，重新下载git，node，hexo配置会花费不少时间，特别不划算。

  如果按照这篇完整折腾完，你可以直接用浏览器访问github个人项目仓库，直接编辑那篇post的原md文件，前后2分钟改完。 稍等片刻，你的博客就自动更新了。
 2. 自动部署，同时部署到多个地方：
hexo在部署的时候可以设置部署到多端，只需在博客配置文件里设置多个deploy即可，本篇文章暂时只写两种，gh-pages和cos。部署到更多地方也是支持的，比如gitlab，国内的coding等。
 3. 部署快捷方便：
手动deploy需要推送public整个folder到github上，当后期网站文章、图片较多时候，对于天朝的网络，有时候连接github 就是不顺畅，经常要傻等不少上传时间。
有了CI，你可以只提交post文件里单独的md文件即可，很快很爽，谁用谁知道。


    
### Travis自动构建原理

 1. 每当我们在本地写好了博文之后，push到博客仓库的`blog-source`分支。
 2. Travis上可以对这个项目的`blog-source`分支设置钩子，每当检测到 push 的时候就去仓库 clone 源代码到Travis的云服务器上。
 3. Travis云服务器按顺序执行一系列构建脚本，比如 `npm install`、`hexo g` 、`hexo d`等。
 
 
### 如何操作 


#### 1. 配置hexo多端部署
 
修改博客根目录配置文件`_config.yml`，参考[hexo官方文档-部署](https://hexo.io/zh-cn/docs/one-command-deployment)，我这里只设置了两个，github-pages和cos，下面的写法是travis-ci部署到github-pages和腾讯cos
```yaml
#deploy:
- type: git
  branch: master
  repo: https://gh_token@github.com/liyang5945/liyang5945.github.io.git
- type: cos
  appId: cos_appId
  secretId: cos_secretId
  secretKey: cos_secretKey
  bucket: cos_bucket
  region: ap-shanghai
```

如果你感觉travis太麻烦，下面的写法是本地部署到github-pages和腾讯cos，注意不要把真实的secretId等值提交到github上面，腾讯云会检测到并打电话提示你有安全风险（不要问我我咋知道的），建议本地部署的时候复制进去，部署完删除即可。
```yaml
deploy:
  - type: git
    repo: https://github.com/liyang5945/liyang5945.github.io
  - type: cos
    appId: #你的appId
    secretId: #你的secretId
    secretKey: #你的secretKey
    bucket: #此项格式为存储桶名称+appId
    region: ap-shanghai

```
#### 2. 注册travis账号，配置环境变量
注册travis-ci账号，新建项目等操作参考此贴：[手把手教你使用Travis CI自动部署你的Hexo博客到Github上](https://www.jianshu.com/p/e22c13d85659)，这里不再细说。

接下来要做的就是要把github的token和cos的appId等添加到travis的环境变量里，这样travis云服务器才能帮你部署到github和cos，设置好后如下图所示：

![](https://images.liyangzone.com/article_img/travis-ci/20200118_103156.png)


#### 3. 配置travis执行脚本
  
最后还需要新建一个travis配置文件`.travis.yml`，放到博客根目录下，我的配置文件如下：
```yaml
language: node_js

node_js: stable  # 要安装的node版本为当前的稳定版

before_install:
  - export TZ='Asia/Shanghai' # 更改时区
install:
  - npm install

script:
  - hexo g

after_script:   # 最后执行的命令

  - sed -i "s/cos_appId/${cos_appId}/g" _config.yml
  - sed -i "s/cos_secretId/${cos_secretId}/g" _config.yml
  - sed -i "s/cos_secretKey/${cos_secretKey}/g" _config.yml
  - sed -i "s/cos_bucket/${cos_bucket}/g" _config.yml
  - sed -i "s/gh_token/${Travis_Token}/g" _config.yml
  - hexo deploy

branches:
  only:
    - blog-source # 触发持续集成的分支

env:
  global:
    - GH_REF: github.com/liyang5945/liyang5945.github.io.git # 就是你github上存放静态博客最终文件的仓库地址末尾加上.git

```
后面的那几条`sed`语句的作用就是从我们配置的环境变量里读取真实的cos_appId等参数替换本地（travis云服务器本地）的`_config.yml`里的形参。
替换成真实值之后，再执行`hexo -d`命令，部署到gh-pages和cos。


如果你只需要部署到gh-pages，下面的部署命令还可以写出下面这样，你可以手动设置commit信息。
```yaml
after_script:
  - cd ./public
  - git init
  - git config user.name "your name"
  - git config user.email "your email"
  - git add .
  - git commit -m "Update docs"
  - git push --force --quiet "https://${GH_TOKEN}@${GH_REF}" master:master

branches:
  only:
    - blog-source # 触发持续集成的分支

env:
  global:
    - GH_REF: github.com/liyang5945/liyang5945.github.io.git
```
但是这样会有一个问题，那就是commit记录只有一条，如果你在意这个问题，那就使用下面的写法，先拉取到本地再push：
```yaml
after_script:
  - git clone https://${GH_REF} .deploy_git  # GH_REF是最下面配置的仓库地址
  - cd .deploy_git
  - git checkout master
  - cd ../
  - mv .deploy_git/.git/ ./public/   # 这一步之前的操作是为了保留master分支的提交记录，不然每次git init的话只有1条commit
  - cd ./public
  - git config user.name "your name"  
  - git config user.email "your email"  
  - git add .
  - git commit -m "Travis CI Auto Builder at `date +"%Y-%m-%d %H:%M"`"  # 提交记录包含时间 跟上面更改时区配合
  - git push --force --quiet "https://${Travis_Token}@${GH_REF}" master:master  #
```

#### 4. 测试是否成功

改动本地文件然后commit，并push到github，不出意外的话可以看到travis云服务器执行命令的过程：


![](https://images.liyangzone.com/article_img/travis-ci/20200118_115731.png)

![](https://images.liyangzone.com/article_img/travis-ci/20200118_115632.png)

我们再去github和腾讯cos里看一下，可以看到commit记录和文件上传日期都是最新的。

![](https://images.liyangzone.com/article_img/travis-ci/20200118_115141.png)

![](https://images.liyangzone.com/article_img/travis-ci/20200118_115525.png)

