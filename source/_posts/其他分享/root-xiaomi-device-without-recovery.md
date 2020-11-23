---
title: 小米手机不使用第三方recovery ROOT教程
date: 2020-11-23 21:00:00
tags: 
- MIUI  小米手机ROOT
categories:
- 其他分享
toc: false
img: https://images.liyangzone.com/article_img/root-xiaomi-device/Image039.png

---


上个月我买了一部小米10至尊纪念版，由于小米自带的换机软件不支持一些应用数据的还原，所以我需要使用钛备份来还原应用和数据。但是钛备份需要root才能用，因为机器刚出没多久，第三方的recovery也没有，所以需要找到一种不使用recovery来获取root权限的方法。经过仔细寻找之后，我在一个国外网站找到了不使用recovery获取root权限的方法（[原始教程地址](https://www.getdroidtips.com/root-xiaomi-mi-10-ultra/)），下面是中文详细教程：

1、先去官网申请解锁bootloader，等待168小时后解锁手机，解锁时会清空数据，注意备份应用和文件。
2、在电脑上下载和你手机版本号相同的卡刷包rom，版本一定要一致！使用解压软件打开提取里面的boot.img文件，并用数据线传到手机里。官网rom下载地址: http://www.miui.com/download.html

![](https://images.liyangzone.com/article_img/root-xiaomi-device/Image036.png)

3、手机上安装`Magisk Manager`APP ,然后打开`安装`按钮，之后选择最后一项`选择并修补一个文件`，然后会弹出文件选择框，选择之前复制到手机上的`boot.img`文件，选中文件之后点`开始`，按钮，接下来`Magisk Manager`APP会下载一个压缩包文件并制作一个打上root补丁的img文件，稍等片刻就会制作好，制作好的文件在如下位置，之后将该文件复制到电脑。

![](https://images.liyangzone.com/article_img/root-xiaomi-device/Screenshot1.jpg)

![](https://images.liyangzone.com/article_img/root-xiaomi-device/Screenshot2.jpg)

![](https://images.liyangzone.com/article_img/root-xiaomi-device/Screenshot3.jpg)

4、按音量减+开机键进入fastboot模式，连接电脑，使用fastboot刷入打好补丁的img文件，命令为 `fastboot flash boot magisk_patched.img`

完成之后使用`fastboot reboot`命令重启手机，开机之后手机root成功。

![](https://images.liyangzone.com/article_img/root-xiaomi-device/Image039.png)

![](https://images.liyangzone.com/article_img/root-xiaomi-device/Screenshot4.jpg)

PS:
- Magisk Manager官网下载地址：https://magiskmanager.com，注意不要使用小米自带浏览器下载，会被替换成其他垃圾软件。
- 因为Magisk服务器被墙，步骤三使用`Magisk Manager`APP制作补丁img文件的过程需要科学上网，不然制作不成功。
- fastboot工具在小米解锁软件的目录里可以找到，记得安装驱动。
- 如果root之后系统有更新的话先不要更新，先刷入原版boot.img文件后才能更新成功，更新成功之后再按本教教程操作一遍即可（下载最新版本ROM>提取boot.img>打补丁>刷入手机）。
- 理论上此方法适用于所有小米手机，稳定版rom也能root。

