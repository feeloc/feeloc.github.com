---
layout: post
title: "android开发环境搭建"
date: 2012-08-02 19:12
comments: true
categories: android helloworld 环境搭建
---
{% img http://feeloc.cn/downloads/images/2012-08-02/1.png %}
>换了安卓手机也很长一段时间了，作为一个程序员竟然不想在自己的手机上做一些开发，真是不应该啊，正好也可以学习一些android开发，说干就干，
>先把环境搭建好。
<!-- more -->
##一、JAVA环境##
*	java环境简单说明
	*	下载[JDK](http://www.oracle.com/technetwork/java/javase/downloads/index.html '下载JDK')
	*	配置环境变量
	*	下载[eclipse](http://www.eclipse.org/downloads/ '下载eclipse')
{% codeblock %}
CLASSPATH .;%JAVA_HOME%\lib;
JAVA_HOME D:\java\jdk6
JRE_HOME D:\java\jdk6\jre
Path %JAVA_HOME%\bin;%JRE_HOME%\bin;
{% endcodeblock %}
	
>小技巧：可以创建一个文件夹，名字叫android，在下面创建三个文件夹sdk，workspace，ide，这样以后换机器，
>只要将android文件夹拷贝，简单配置环境变量就行，比较方便。

##二、android环境##
*	android sdk安装
	*	下载 [android SDK](http://developer.android.com/sdk/index.html '下载安卓SDK')
	*	安装sdk，基本上一路next
*	安装eclipse android 开发插件
	*	打开Eclipse, 在菜单栏上选择 help->Install New SoftWare， add后添加上name:`android`，location:`https://dl-ssl.google.com/android/eclipse/`
	{% img http://feeloc.cn/downloads/images/2012-08-02/2.png 500 %}
	*	next后AndroidDDMS和AndroidDevelopment Tools是必选
	{% img http://feeloc.cn/downloads/images/2012-08-02/3.png 500 %}
	*	安装成功后会要求重新启动eclipse
	{% img http://feeloc.cn/downloads/images/2012-08-02/4.png 500 %}
*	点击SDKManager，在SDK的安装目录或者eclispe里面，下载所需要的android SDK版本，`tools`和`extras`要选上。下载速度可能会比较慢
	{% img http://feeloc.cn/downloads/images/2012-08-02/5.png 500 %}
*	配置android sdk，点击菜单window->preferences，填写sdk的位置
	{% img http://feeloc.cn/downloads/images/2012-08-02/6.png 500 %}
*	创建AVD,在eclipse的工具栏或者是window目录下
	{% img http://feeloc.cn/downloads/images/2012-08-02/7.png 500 %}
*	新建一个模拟器,相当参数见图，包括模拟器名字，SDK版本，SD卡大小
	{% img http://feeloc.cn/downloads/images/2012-08-02/8.png 500 %}

##三、依旧是helloworld测试开发环境
*	创建工程，new->other，选择andorid application project
	{% img http://feeloc.cn/downloads/images/2012-08-02/9.png 500 %}
*	填写相关参数，包括项目名称之类的，选择相应版本的SDK
	{% img http://feeloc.cn/downloads/images/2012-08-02/10.png 500 %}
*	一路NEXT，最后会有一个让填写程序标题的，可以修改下。
*	运行第一个android程序,右键项目->Runas -> Run Configuration 进入如下界面，点击Browse按钮，选择你要运行的项目
	{% img http://feeloc.cn/downloads/images/2012-08-02/11.png 500 %}
*	选择Target切换到以下界面，选择运行的AVD，将AVD前面的方框设置为选择状态
	{% img http://feeloc.cn/downloads/images/2012-08-02/12.png 500 %}
*	右键项目名称->runas ->Android Application，看到模拟器上的程序运行成功
	{% img http://feeloc.cn/downloads/images/2012-08-02/13.png 500 %}
	
##四、使用真机开发调试##
*	手机通过USB线连接电脑，在手机上开启USB高度模式
	{% img http://feeloc.cn/downloads/images/2012-07-30/6.png 500 %}
	{% img http://feeloc.cn/downloads/images/2012-07-30/7.png 500 %}
*	在电脑上cmd中进入platform-tools，执行adb devices，查看手机是否正确连接
	{% img http://feeloc.cn/downloads/images/2012-07-30/8.png 500 %}
*	注意：测试前退出豌豆荚或91助手等程序，否则会出错，因为这些程序会占用连接
	{% img http://feeloc.cn/downloads/images/2012-07-30/9.png 500 %}
*	在测试项目的run configuration的target中，将虚拟设备的勾去掉，会自动选择真机运行。
	{% img http://feeloc.cn/downloads/images/2012-07-30/10.png 500 %}
	{% img http://feeloc.cn/downloads/images/2012-07-30/11.png 500 %}
*	在自己的手机中将会看到程序执行的界面，并自动安装到了手机中
	{% img http://feeloc.cn/downloads/images/2012-07-30/12.png 500 %}
	{% img http://feeloc.cn/downloads/images/2012-07-30/13.png 500 %}
