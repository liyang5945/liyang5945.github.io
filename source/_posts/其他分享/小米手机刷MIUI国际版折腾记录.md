---
title: 小米手机刷MIUI国际版折腾记录
date: 2020-04-07 10:00:00
tags: 
- MIUI国际版
categories:
- 其他分享
---



本人现在使用的是一部红米NOTE5，配置是高通骁龙636+6G+64G，之前用的系统都是MIUI9，一直都没更新过，最近更新了MIUI11，就准备升级一下，更新了国行的系统之后发现广告太多实在受不了。就刷了个MIUI国际版，记录一下折腾的过程。

MIUI国际版优点：广告较少，带有谷歌服务框架。


#### 解锁bootloader

具体教程可参官网文章:[小米手机解锁 Bootloader 教程和常见问题](https://www.xiaomi.cn/post/17982230)，新手机的话需要登上小米账号等半个月左右。

#### 刷入TWRP recovery
官网地址[https://twrp.me/](https://twrp.me/)。
按手机电源+音量下键进入fastboot模式，使用fastboot刷入recovery。下面是一些fastboot命令：
```cmd
fastboot devices			:列出fastboot设备
fastboot reboot				:重启设备
fastboot reboot-bootloader		:重启到fastboot模式
fastboot flash ^<分区名称^> ^<镜像文件名^>	:刷写分区
fastboot oem reboot-^<模式名称^> 		:重启到相应模式
fastboot oem device-info 		:查看解锁状态
```
刷入recovery命令为 `fastboot flash recovery  XXXX.img` ，刷写完成后执行`fastboot reboot`进行重启，手机黑屏时要快速按住电源键+音量上键，大概3~5秒就进入recovery模式。

#### 刷机

刷机包从官网下载稳定版即可,[国际版MIUI下载地址](http://c.mi.com/miuidownload/index)，这里有个坑就是MIUI11的安卓版本是9，安卓9的data分区是启用强制加密的，再次进入recovery时就会提示解锁data分区，让输入密码，并且密码也不是锁屏密码，这个坑后来导致我手机资料全清，如何取消强制加密后面会说。

刷完机还有个坑就是官方系统会在重启时将第三方recovery替换掉，等下系统初始化完成后，再刷一遍TWRP recovery，重启时会有禁止恢复官方recovery的选项。


#### ROOT系统
最新的安卓ROOT工具是Magisk: [Magisk gitHub发布地址](https://github.com/topjohnwu/Magisk/releases)，下载zip安装包，跟刷机一样，用recovery刷入，刷完后手机里会出现Magisk Manager APP(ROOT权限管理工具)。

#### 安装edxposed框架

这里要安装两个插件：Riru-core和Riru-EdXposed。可以在Magisk Manager里面搜索下载安装，也可以手动下载zip包用Magisk Managery安装。Riru-EdXposed一般选择YAHFA版本(稳定版)。

[Riru-Core github发布地址](https://github.com/RikkaApps/Riru/releases)
[Riru-EdXposed github发布地址](https://github.com/ElderDrivers/EdXposed/releases)

![](https://images.liyangzone.com/article_img/其他分享/MIUI国际版折腾/1.jpg)

然后安装EdXposed Manager APP：[github发布地址](https://github.com/ElderDrivers/EdXposedManager/releases)。

![](https://images.liyangzone.com/article_img/其他分享/MIUI国际版折腾/2.jpg)

安装好之后就能可以在里面下载你想要的xposed模块了,这里要注意要装完edxposed框架再安装EdXposed Manager。


#### 卸载内置软件

卸载内置软件方法有多种，这里我在PC端使用adb命令进行卸载：

首先启用手机开发者模式并连接电脑，启用USB调试，执行`adb shell`进入shell模式，执行`pm list packages`命令查看所有软件包名，可使用grep过滤包名，比如`pm list packages | grep miui `，过滤包名中含有`miui`的。如果分不清包名与软件对应关系，就到系统的应用管理里面查看详情（应用详情右上角的叹号图标）。得到软件包名后然后执行 `pm unistall --user 0 ` +包名进行卸载，可批量复制多条一起卸载，注意不要卸载系统更新，会导致开不了机。

下面是我卸载的软件包名，用不到的都删了。
```cmd
pm uninstall --user 0 com.xiaomi.midrop
pm uninstall --user 0 com.google.android.apps.docs
pm uninstall --user 0 com.xiaomi.joyose
pm uninstall --user 0 com.google.android.inputmethod.latin
pm uninstall --user 0 com.miui.msa.global
pm uninstall --user 0 com.google.android.apps.maps
pm uninstall --user 0 com.google.android.apps.youtube
pm uninstall --user 0 com.google.android.gm
pm uninstall --user 0 com.android.email
pm uninstall --user 0 com.miui.yellowpage
pm uninstall --user 0 com.miui.android.fashiongallery
pm uninstall --user 0 com.miui.videoplayer
pm uninstall --user 0 com.google.android.apps.photos
pm uninstall --user 0 com.facebook.services
pm uninstall --user 0 com.facebook.system
pm uninstall --user 0 com.xiaomi.glgm
pm uninstall --user 0 com.google.android.marvin.talkback
pm uninstall --user 0 com.google.android.apps.tachyon
pm uninstall --user 0 com.miui.screenrecorder
```
#### 其他选项：主题、字体、显示农历等



主题&字体相关：国际版的主题里面不能换字体，而且里面是主题还老是下载失败。修改字体的话需要一个第三方软件`MUI custom font installer`，在play商店里面可以搜到。下载失败这个问题暂时没找到解决办法，只能在国行的系统里面下载，然后在国际版里导入主题。

![](https://images.liyangzone.com/article_img/其他分享/MIUI国际版折腾/4.jpg)


这里推荐一个我一直用的字体：方正中等线，这个字体是Windows Phone系统的默认中文字体，感觉很舒服。国行主题商店里有这个字体下载，是要收费的，不过在方正字库的官网可以免费下载到。

![](https://images.liyangzone.com/article_img/其他分享/MIUI国际版折腾/3.jpg)


国际版日历显示农历 
system/build.prop 文件里加上一行代码即可，我在网上找的其他教程写的是把language和region等选项改为CN，不过实测之后发现会卡米,只加上这一条则不会。
```cmd  

ro.miui.mcc=9454

```

禁用加密：刷完系统后不要重启，使用recovery挂载vendor分区，然后把vendor/etc目录下的`fstab.qcom`文件复制出来修改，这里我是复制到一张sd卡上然后在电脑上修改。把里面的`forceencrypt`(强制加密)替换为`encryptable`(可选加密)，修改完成后替换原文件即可，这里建议与上面的build.prop文件一起修改并替换，替换完成后重启等待进入系统。

#### 注意事项

国际版rom第一次进入系统后需要连接谷歌服务器进行更新，没有梯子的话是连接不上的。你需要带梯子的路由器或用电脑共享，电脑端梯子软件选择允许来自局域网的连接，手机和电脑连接同一个wifi（确保在一个局域网内），手机端在wifi热点的代理选项处配置pc端的局域网ip和端口即可，比如192.168.1.103，端口一般为1080。
















