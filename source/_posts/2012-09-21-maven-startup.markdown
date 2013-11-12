---
layout: post
title: "maven入门"
date: 2012-09-21 00:51
comments: true
categories: maven project java
---
{% img http://feeloc.cn/downloads/images/2012-09-21/1.png%}
>在大学一开始接触javaweb的时候，会用myeclipse去搭建SSH项目，觉得那样很方便。后来渐渐熟悉了SSH，加之放弃了myeclipse（实在有些臃肿，还慢），开始自己
>自己手动去添加那一堆包，这样也挺方便，因为就是SSH项目，就那么多包。后来做的项目越来越大了，有时这个项目还依赖另一个项目，包的管理便成了一个让人头疼
>的事。maven将这一切变得容易，解决了很多project方面的问题。
<!-- more -->
下面简单介绍下maven的配置和使用，PS：下面文章假设您已经安装了jdk,tomcat,eclipse，并且已经配置了环境变量。如果还没有请稳步[google](http://google.com "google java环境搭建")

##一、maven安装配置##
*	下载Maven[下载页](http://maven.apache.org/download.html "下载maven")
{% img http://feeloc.cn/downloads/images/2012-09-21/2.png 700 '下载maven' %}
*	解压到自己想放的文件夹，在这儿推荐新建一个maven文件夹，然后解压在里面，因为maven会下载各种依赖包，可以将repository再放入maven文件夹中方便管理。
{% img http://feeloc.cn/downloads/images/2012-09-21/3.png 700 '目录结构' %}
*	配置maven，添加环境变量`M2_HOME`，值为`D:\maven\maven-3.0.4`，将`M2_HOME`加入`Path`中
{% img http://feeloc.cn/downloads/images/2012-09-21/4.png 700 '配置环境变量' %}
*	验证是否安装成功
{% img http://feeloc.cn/downloads/images/2012-09-21/5.png 700 '验证安装成功' %}

##安装eclipse maven插件m2eclipse##
*	方式一：自动安装
	*	在菜单栏中选择`Help`，然后选择`Install New Software…`，接着你会看到一个`Install`对话框，点击`Work with:`字段边上的`Add`按钮，你会得到一个新的Add Repository对话框，在`Name`字段中输入`m2e`，Location字段中输入http://m2eclipse.sonatype.org/sites/m2e，然后点击`OK`
	*	选择后点击`Next >`，Eclipse会自动计算模块间依赖，然后给出一个将被安装的模块列表，确认无误后，继续点击`Next >`，这时我们会看到许可证信息，m2eclipse使用的开源许可证是Eclipse Public License v1.0，选择`I accept the terms of the license agreements`，然后点击`Finish`，接着就耐心等待Eclipse下载安装这些模块
*	方式二：link方式安装（推荐）
	*	进入 m2eclipse离线版本[m2eclipse离线包](http://m2eclipse.sonatype.org/sites/m2e/ '离线包')，然后那好相应的`features`，`plugins`目录，然后link，如果不会安装可以google。
{% img http://feeloc.cn/downloads/images/2012-09-21/6.png 700 '下载最新离线包' %}
*	重启eclipse，看m2eclipse是否安装成功，出现下图说明安装成功
{% img http://feeloc.cn/downloads/images/2012-09-21/7.png 700 '安装成功' %}

##配置m2eclipse实现自动部署到tomcat##
*	定义tomcat用户，打开`tomcat-users.xml`，在`<tomcat-users>`节点加入如下代码，添加两个role，一个user
{% codeblock tomcat-user.xml %}
<role rolename="manager-gui"/>
<role rolename="manager-script"/>
<user username="***" password="***" roles="manager-gui,manager-script"/>
{% endcodeblock %}
*	打开tomcat的web管理页面，输入刚才设置的用户名密码，如果出现如下界面就代表刚才的设置生效了
{% img http://feeloc.cn/downloads/images/2012-09-21/8.png 700 'web管理权限' %}
*	在maven的settings.xml的servers节点上添加一台服务器，代码如下：
{% codeblock settings.xml %}
<server>
  <id>tomcat</id>
  <username>admin</username>
  <password>admin</password>
</server>
{% endcodeblock %}
*	打开eclipse，配置maven
{% img http://feeloc.cn/downloads/images/2012-09-21/9.png 700 'maven目录' %}
{% img http://feeloc.cn/downloads/images/2012-09-21/10.png 700 'maven配置' %}

##依旧是hello world##
*	在eclipse中新建一个maven project，我们需要一个web项目
{% img http://feeloc.cn/downloads/images/2012-09-21/11.png 700 'maven project' %}
{% img http://feeloc.cn/downloads/images/2012-09-21/12.png 700 'maven project 配置' %}
{% img http://feeloc.cn/downloads/images/2012-09-21/13.png 700 'maven project 配置注意红色部分' %}
{% img http://feeloc.cn/downloads/images/2012-09-21/14.png 700 'maven project' %}
*	项目配置，加入Dynamic Web Module支持
{% img http://feeloc.cn/downloads/images/2012-09-21/15.png 700 'maven project' %}
*	配置pom，实现自动打包发布到tomcat
{% codeblock pom.xml %}
<plugins>
	<plugin>
		<groupId>org.codehaus.mojo</groupId>
		<artifactId>tomcat-maven-plugin</artifactId>
		<version>1.0-beta-1</version>
		<configuration>
			<url>http://localhost:8080/manager/html</url>  <!-- tomcat 7自动部署 -->
			<!-- tomcat 6自动部署 <url>http://localhost:8080/manager/html</url> -->
			<server>tomcat</server>
		</configuration>
	</plugin>
</plugins>
{% endcodeblock %}
*	buide该项目，带参数`package tomcat:redeploy`，表示自动打包部署到tomcat
{% img http://feeloc.cn/downloads/images/2012-09-21/16.png 700 'maven project' %}

##maven,eclipse实现热部署，加速度开发##
*	在上一步中，虽然实现了自动部署到tomcat上，但每次都需要执行命令加等待还是很麻烦的，必须要实现热部署
*	参照以往的经验，设置热部署就是在tomcat的host节点里添加项目配置，现在就是需要找到docBase，和workDir的路径
*	重新设置maven的实时编译目录，在`src\main\webapp\WEB-INF\`下新建`classes`和`lib`目录
{% img http://feeloc.cn/downloads/images/2012-09-21/17.png 700 '重设目录' %}
*	重设classes目录
{% img http://feeloc.cn/downloads/images/2012-09-21/18.png 700 '重设编译目录' %}
*	maven依赖包，切换到项目目录 执行命令`mvn dependency:copy-dependencies`，这样，test的项目依赖包都会被导入到target/dependency下。将jar包全部放入到`src\main\webapp\WEB-INF\`
*	配置tomcat的server.xml文件，修改host节点根据自己的项目目录加入Context节点
{% codeblock server.xml %}
<Host name="localhost"  appBase="webapps" unpackWARs="true" autoDeploy="true">
	<!-- <Context path="/www" docBase="d:\www" debug="0" reloadable="true" /> -->
	<!-- SingleSignOn valve, share authentication between web applications
	     Documentation at: /docs/config/valve.html -->
	<!--
	<Valve className="org.apache.catalina.authenticator.SingleSignOn" />
	-->
	
	<!-- Access log processes all example.
	     Documentation at: /docs/config/valve.html
	     Note: The pattern used is equivalent to using pattern="common" -->
	
	<Context path="/yiren" reloadable="false" defaultSessionTimeOut="3600" 
		docBase="D:\java\workspaces\yiren\src\main\webapp" 
		workDir="D:\java\workspaces\yiren\src\main\webapp\WEB-INF\classes" />
	<Valve className="org.apache.catalina.valves.AccessLogValve" directory="logs"
		prefix="localhost_access_log." suffix=".txt"
		pattern="%h %l %u %t &quot;%r&quot; %s %b" />
</Host>
{% endcodeblock %}
*	至此，大功造成啦，修改下代码，是不是不需要执行mvn命令了，速度是不是快了，是不是爽了。哈哈！！
