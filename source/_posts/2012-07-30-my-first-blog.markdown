---
layout: post
title: "开始使用Octopress写博客"
date: 2012-07-30 13:10
comments: true
categories: octopress github 环境搭建
---
{% img http://feeloc.cn/downloads/images/1.jpg %}
>多么渴求知识的喵星人啊，最近看了Octopress配合GitHub搭建个人博客的文章，觉得正是我想要的那种非常简约的博客风格，不仅是样式简约大气，
>写作方式也非常舒服，markdown方式让人写技术文章也能像码字写小说一样舒服。
<!-- more -->
下面记录下我配置博客的全部过程

##一、环境搭建##
*	python环境
	*	Octopress 使用 Python 编写的代码加亮系统`pygments`，需要安装 [python](http://www.python.org/getit/ "下载python相应版本")
*	ruby环境
	*	Octopress 是 ruby 应用程序，需要安装 [ruby 1.9.2](http://rubyforge.org/frs/download.php/75127/rubyinstaller-1.9.2-p290.exe "下载ruby相应版本")
	*	安装后设置ruby的bin目录在环境变量path中
	*	设置gem更新源
		*	`gem sources --remove http://rubygems.org/`
		*	`gem sources -a http://ruby.taobao.org/`
		*	`gem sources -l # 请确保只有 http://ruby.taobao.org 一行输出`
	*	安装rdoc和bundler
		*	`gem install rdoc bundler`
*	ruby 的模块工具 gem 在生成本地模块时需要用到编译环境
	*	下载 [DevKit](https://github.com/downloads/oneclick/rubyinstaller/DevKit-tdm-32-4.5.2-20111229-1559-sfx.exe "下载编译环境")
	*	安装DevKit
		*	将 DevKit 自解压包释放到 `D:\DevKit`
		*	在 cmd 窗口中执行 `ruby dk.rb init`
		*	在 cmd 窗口中执行 `ruby dk.rb install`

##二、设置环境变量##
*	在 Windows 的 “高级系统设置” 中设置两个环境变量
	*	设置 `LANG` 和 `LC_ALL` 两个环境变量，其值均设置为 `zh_CN.UTF-8`
	*	在 CMD 窗口中测试： `echo %LANG% %LC_ALL%`

##三、安装 Octopress##
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

##四、安装Git，并用git管理github
*	创建 github 账号和仓库
	*	下面的操作假定您注册了 `<USERNAME>` 的账号
	*	下面的操作假定您创建了 `<USERNAME>.github.com` 的仓库   _注意：一定是`<USERNAME>.github.com`_的仓库，这样才能在master分支
*	安装git
	*	安装git的过程很简单，下面三个图显示了需要注意的地方
	{% img http://feeloc.cn/downloads/images/2012-07-30/1.png 500 '选Simple context menu (Registry based)' %}
	{% img http://feeloc.cn/downloads/images/2012-07-30/2.png 500 '选择第二项' %}
	{% img http://feeloc.cn/downloads/images/2012-07-30/3.png 500 '选择第三项' %}
*	导入SSH KEY进github
	*	输入github的用户名，邮箱，生成key
	{% img http://feeloc.cn/downloads/images/2012-07-30/4.png 500 '生成KEY' %}
	*	将生成的key导入到github的SSH KEYS
	{% img http://feeloc.cn/downloads/images/2012-07-30/5.png 500 '导入KEY' %}

##五、配置和使用 Octopress##
*	编辑`_config.yml`文件，保存为UTF-8格式
{% codeblock %}
url:                # For rewriting urls for RSS, etc
title:              # Used in the header and title tags
subtitle:           # A description used in the header
author:             # Your name, for RSS, Copyright, Metadata
simple_search:      # Search engine for simple site search
description:        # A default meta description for your site
subscribe_rss:      # Url for your blog's feed, defauts to /atom.xml
subscribe_email:    # Url to subscribe by email (service required)
email:              # Email address for the RSS feed if you want it.
{% endcodeblock %}
*	生成新的markdown页面
	*	`rake new_post["article name"]`  #生成指定的 Blog页面
	*	`rake new_page["page name"]`	#生成指定的静态页面
*	编辑博客内容
	*	根据markdown语法，自由编辑页面吧

##六、首次提交到Github##
*	`rake setup_github_pages`	#输入仓库的SSH地址，即git@github.com:`<USERNAME>`/`<USERNAME>`.github.com.git
*	`rake generate`	#生成静态文件
*	`rake preview`	#本地4000商品预览
*	`rake deploy`	#发布到github

>如果没出错，现在访问`<USERNAME>`.github.com，应该可以看到你的博客了，尽情积累自己的一切吧！！
	
	