---
layout: post
title: "android开源音乐播放器Jamendo学习及二次开发"
date: 2012-08-02 19:13
comments: true
categories: jamendo android music
---
{% img http://www.feeloc.cn/downloads/images/2012-08-02/14.png %}
>音乐播放器是我天天都会用到的，不管是电脑的，还是手机的，还是播放器的，既然这么需要，正好在研究android程序，那就以播放器做研究吧
>上网看了一下，开源的音乐播放器有很多，jamendo是其中一个做得比较全的，先看看，学习一下别人的编码风格吧！！
<!-- more -->

##一、建立项目##
*	jamendo的源码托管在github上，执行`git clone https://github.com/telecapoland/jamendo-android.git musicplayer`
*	将clone下的项目导入到eclipse里
*	导入相应的android SDK，在项目上右键，选择属性，在属性页选择Android，选择SDK
{% img http://www.feeloc.cn/downloads/images/2012-08-02/15.png 500 %}
*	试着运行该项目，配置run configuration，run，不出意外会执行成功
{% img http://www.feeloc.cn/downloads/images/2012-08-02/16.png 500 %}


