---
layout: post
title: "超简单windows下octopress环境搭建"
date: 2013-01-11 23:29
comments: true
categories: octopress ruby
---
{% img http://feeloc.cn/downloads/images/2012-09-21/1.png %}
>octopress博客无论是markdown的写作方式，还是简洁的界面我都非常喜欢，但windows下搭建ruby环境真的是一个很蛋疼的问题，
>特别是在64位环境下，一度想改成[hexo](https://github.com/tommy351/hexo "hexo github")去写博客，最近发现windows
>下有更简单的ruby环境搭建方法，在此分享给大家，简化windows下的octopress环境搭建。
<!-- more -->
##一、准备工作##
*   下载及安装[railsinstaller](http://railsinstaller.org/ "下载railinstaller")，基本一路next。`最好安装railsinstaller全部模块，以免发生不可预料错误`
*   配置git环境，连接上github，在些就不重复说明了，详见[开始使用Octopress写博客](http://www.feeloc.cn/blog/2012/07/30/my-first-blog/ "开始使用Octopress写博客")
*   配置环境变量，`LANG`和`LC_ALL`，值均为`zh_CN.UTF-8`
##二、安装octopress##
*   安装octopress
{% codeblock %}
#1. 克隆 Octopress
$ cd d:
$ git clone git://github.com/imathis/octopress.git sinosmond.github.com myblog
$ cd myblog
#2. 修改 Octopress 的 GEM 源
$ vi Gemfile 或 notepad Gemfile
将行 ： source "http://rubygems.org/"
改为 ： source "http://ruby.taobao.org/"
#3. 安装 Octopress 所需的GEM组件
$ bundle install
#4. 生成Octopress 的模版文件
bundle update    #防止出现rake aborted!最好每次修改完Gemfile都更新下
rake install
{% endcodeblock %}
*   下面就可以快乐得进行octopress写博客了